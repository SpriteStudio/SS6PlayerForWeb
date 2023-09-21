// import Phaser from 'phaser';
import {SS6PlayerPlugin} from './SS6PlayerPlugin';
import {SS6PLAYER_GAME_OBJECT_TYPE} from './keys';
import {
	ComputedSizeMixin,
	DepthMixin,
	FlipMixin,
	ScrollFactorMixin,
	TransformMixin,
	VisibleMixin,
	AlphaMixin,
	OriginMixin,
} from "./mixins";
import {Player, AnimePackData, PART_FLAG, PartData, SsPartType, ProjectData} from 'ss6player-lib';
import {SS6Project} from './SS6Project';

class BaseSS6PlayerGameObject extends Phaser.GameObjects.GameObject {
	constructor (scene: Phaser.Scene, type: string) {
		super(scene, type);
	}
}

export class SS6PlayerGameObject extends DepthMixin(
	OriginMixin(
		ComputedSizeMixin(
			FlipMixin(
				ScrollFactorMixin(
					TransformMixin(VisibleMixin(AlphaMixin(BaseSS6PlayerGameObject)))
				)
			)
		)
	)
) {
  blendMode = -1;

  protected playerLib: Player;

  // Properties
  private ss6project: SS6Project;
  private readonly fbObj: ProjectData;
  private liveFrame: any[] = [];
  private colorMatrixFilterCache: any[] = [];

  private parentAlpha: number = 1.0;

  //
  // cell再利用
  private prevCellID: number[] = []; // 各パーツ（レイヤー）で前回使用したセルID
  private prevMesh: (SS6PlayerGameObject | Phaser.GameObjects.Mesh)[] = [];

  // for change instance
  private substituteOverWrite: boolean[] = [];
  // private substituteKeyParam: SS6PlayerInstanceKeyParam[] = [];

  // private alphaBlendType: BLEND_MODES[] = [];
  private _isPlaying: boolean;
  private _isPausing: boolean;
  private _startFrame: number;
  private _endFrame: number;
  private _currentFrame: number;
  private nextFrameTime: number;
  private _loops: number;
  protected skipEnabled: boolean;
  private updateInterval: number;
  private playDirection: number;
  protected onUserDataCallback: (data: any) => void;
  protected playEndCallback: (player: SS6PlayerGameObject) => void;


  constructor (scene: Phaser.Scene, private plugin: SS6PlayerPlugin, x: number, y: number, ssfbKey: string, animePackName: string, animeName: string) {
    super(scene, SS6PLAYER_GAME_OBJECT_TYPE);
    this.x = x;
    this.y = y;

    this.ss6project = this.plugin.getSS6Project(ssfbKey);

    this.playerLib = new Player(this.ss6project.projectData, animePackName, animeName);
    this.parentAlpha = 1.0;

    if (animePackName !== null && animeName !== null) {
      this.Setup(animePackName, animeName);
    }
  }

  public Setup(animePackName: string, animeName: string): void {
    this.playerLib.Setup(animePackName, animeName);

    this.clearCaches();

    const animePackData: AnimePackData = this.playerLib.animePackData;
    const partsLength = animePackData.partsLength();

    // cell再利用
    this.prevCellID = new Array(partsLength);
    this.prevMesh = new Array(partsLength);
    this.substituteOverWrite = new Array(partsLength);
    // this.substituteKeyParam = new Array(partsLength);

    for (let j = 0; j < partsLength; j++) {
      const index = animePackData.parts(j).index();

      // cell再利用
      this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
      this.prevMesh[index] = null;
      this.substituteOverWrite[index] = null;
      // this.substituteKeyParam[index] = null;
    }

    // 各アニメーションステータスを初期化
    // this.alphaBlendType = this.GetPartsBlendMode();

    this._isPlaying = true;
    this._isPausing = false;
    this._startFrame = this.playerLib.animationData.startFrames();
    this._endFrame = this.playerLib.animationData.endFrames();
    this._currentFrame = this.playerLib.animationData.startFrames();
    this.nextFrameTime = 0;
    this._loops = -1;
    this.skipEnabled = true;
    this.updateInterval = 1000 / this.playerLib.animationData.fps();
    this.playDirection = 1; // forward
    this.onUserDataCallback = null;
    this.playEndCallback = null;
    this.parentAlpha = 1.0;
  }

  private clearCaches() {
    this.liveFrame = [];
    this.colorMatrixFilterCache = [];
  }

  updateSize() {
    console.log("updateSize");
  }

  preUpdate(time: number, delta: number) {
    this.UpdateInternal(delta);
  }

	preDestroy() {
    console.log("preDestroy");
	}

  willRender(camera: Phaser.Cameras.Scene2D.Camera): boolean {
		let GameObjectRenderMask = 0xf;
		let result = !this.ss6project || !(GameObjectRenderMask !== this.renderFlags || (this.cameraFilter !== 0 && this.cameraFilter & camera.id));
		if (!this.visible) result = false;

		return result;
  }

	renderWebGL(
		renderer: Phaser.Renderer.WebGL.WebGLRenderer,
		src: SS6PlayerGameObject,
		camera: Phaser.Cameras.Scene2D.Camera,
		parentMatrix: Phaser.GameObjects.Components.TransformMatrix
	) {
    console.log("renderWebGL")
  }

	renderCanvas(
		renderer: Phaser.Renderer.Canvas.CanvasRenderer,
		src: SS6PlayerGameObject,
		camera: Phaser.Cameras.Scene2D.Camera,
		parentMatrix: Phaser.GameObjects.Components.TransformMatrix
	) {
    console.log("renderCanvas")
  }

  protected UpdateInternal(delta: number, rewindAfterReachingEndFrame: boolean = true): void {
    const toNextFrame = this._isPlaying && !this._isPausing;
    if (toNextFrame && this.updateInterval !== 0) {
      this.nextFrameTime += delta;
      // console.log("this.nextFrameTime: " + this.nextFrameTime + " this.updateInterval: " + this.updateInterval);
      if (this.nextFrameTime >= this.updateInterval) {
        let playEndFlag = false;

        // 処理落ち対応
        const step = this.nextFrameTime / this.updateInterval;
        this.nextFrameTime -= this.updateInterval * step;
        let s = (this.skipEnabled ? step * this.playDirection : this.playDirection);
        let next = this._currentFrame + s;
        let nextFrameNo = Math.floor(next);
        let nextFrameDecimal = next - nextFrameNo;
        let currentFrameNo = Math.floor(this._currentFrame);

        if (this.playDirection >= 1) {
          // speed +
          for (let c = nextFrameNo - currentFrameNo; c; c--) {
            let incFrameNo = currentFrameNo + 1;
            if (incFrameNo > this._endFrame) {
              if (this._loops === -1) {
                // infinite loop
                incFrameNo = this._startFrame;
              } else {
                this._loops--;
                playEndFlag = true;
                if (this._loops === 0) {
                  this._isPlaying = false;
                  // stop playing the animation
                  incFrameNo = (rewindAfterReachingEndFrame) ? this._startFrame : this._endFrame;
                  break;
                } else {
                  // continue to play the animation
                  incFrameNo = this._startFrame;
                }
              }
            }
            currentFrameNo = incFrameNo;
            // Check User Data
            if (this._isPlaying) {
              if (this.playerLib.HaveUserData(currentFrameNo)) {
                if (this.onUserDataCallback !== null) {
                  this.onUserDataCallback(this.playerLib.GetUserData(currentFrameNo));
                }
              }
            }
          }
        }
        if (this.playDirection <= -1) {
          // speed -
          for (let c = currentFrameNo - nextFrameNo; c; c--) {
            let decFrameNo = currentFrameNo - 1;
            if (decFrameNo < this._startFrame) {
              if (this._loops === -1) {
                // infinite loop
                decFrameNo = this._endFrame;
              } else {
                this._loops--;
                playEndFlag = true;
                if (this._loops === 0) {
                  this._isPlaying = false;
                  decFrameNo = (rewindAfterReachingEndFrame) ? this._endFrame : this._startFrame;
                  break;
                } else {
                  decFrameNo = this._endFrame;
                }
              }
            }
            currentFrameNo = decFrameNo;
            // Check User Data
            if (this._isPlaying) {
              if (this.playerLib.HaveUserData(currentFrameNo)) {
                if (this.onUserDataCallback !== null) {
                  this.onUserDataCallback(this.playerLib.GetUserData(currentFrameNo));
                }
              }
            }
          }
        }
        this._currentFrame = currentFrameNo + nextFrameDecimal;

        if (playEndFlag) {
          if (this.playEndCallback !== null) {
            this.playEndCallback(this);
          }
        }
        this.SetFrameAnimation(Math.floor(this._currentFrame), step);
      }
    } else {
      this.SetFrameAnimation(Math.floor(this._currentFrame));
    }
  }

  protected SetFrameAnimation(frameNumber: number, ds: number = 0.0): void {
    // console.log("frameNumber: " + frameNumber)
  }

}
