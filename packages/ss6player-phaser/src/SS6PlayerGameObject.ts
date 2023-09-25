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
  OriginMixin
} from './mixins';
import {Player, AnimePackData, PART_FLAG, PartData, SsPartType, ProjectData} from 'ss6player-lib';
import {SS6Project} from './SS6Project';
import Mesh = Phaser.GameObjects.Mesh;
import Container = Phaser.GameObjects.Container;
import GameObject = Phaser.GameObjects.GameObject;
import {SS6PlayerPhaserUtils} from './SS6PlayerPhaserUtils';

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
  private ssfbKey: string;
  private ss6project: SS6Project;
  private readonly fbObj: ProjectData;
  private liveFrame: any[] = [];
  private colorMatrixFilterCache: any[] = [];

  private parentAlpha: number = 1.0;

  //
  // cell再利用
  private prevCellID: number[] = []; // 各パーツ（レイヤー）で前回使用したセルID
  private prevMesh: (Phaser.GameObjects.GameObject)[] = [];

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

    this.ssfbKey = ssfbKey;
    this.ss6project = this.plugin.getSS6Project(this.ssfbKey);

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
    console.log('updateSize');
  }

  preUpdate(time: number, delta: number) {
    // console.log('preUpdate: ' + time + ' delta: ' + delta);
    this.UpdateInternal(delta);
  }

	preDestroy() {
    console.log('preDestroy');
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
    // console.log('renderWebGL: ' + src);
    if (renderer.newType) {
      renderer.pipelines.clear();
    }
    camera.addToRenderList(src);

    if (!renderer.nextTypeMatch) {
      renderer.pipelines.rebind();
    }
  }

	renderCanvas(
		renderer: Phaser.Renderer.Canvas.CanvasRenderer,
		src: SS6PlayerGameObject,
		camera: Phaser.Cameras.Scene2D.Camera,
		parentMatrix: Phaser.GameObjects.Components.TransformMatrix
	) {
    // console.log('renderCanvas')
  }

  protected UpdateInternal(delta: number, rewindAfterReachingEndFrame: boolean = true): void {
    const toNextFrame = this._isPlaying && !this._isPausing;
    if (toNextFrame && this.updateInterval !== 0) {
      this.nextFrameTime += delta;
      // console.log('this.nextFrameTime: ' + this.nextFrameTime + ' this.updateInterval: ' + this.updateInterval);
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
    console.log('frameNumber: ' + frameNumber);
    const fd = this.playerLib.GetFrameData(frameNumber);

    // 優先度順パーツ単位ループ
    const l = fd.length;
    for (let ii = 0; ii < l; ii = (ii + 1) | 0) {
      // 優先度に変換
      const i = this.playerLib.prio2index[ii];

      const data = fd[i];
      const cellID = data.cellIndex;

      let mesh: GameObject = this.prevMesh[i];
      const part: PartData = this.playerLib.animePackData.parts(i);
      const partType = part.type();
      // let overWrite: boolean = (this.substituteOverWrite[i] !== null) ? this.substituteOverWrite[i] : false;
      // let overWritekeyParam: SS6PlayerInstanceKeyParam = this.substituteKeyParam[i];

      switch (partType) {
        case SsPartType.Instance:
          // TODO: implement
          if (mesh === null) {
            // mesh = this.MakeCellPlayer(part.refname());
            // mesh.name = part.name();
          }
          break;
        case SsPartType.Normal:
        case SsPartType.Mask:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh !== null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
            mesh.name = part.name();
          }
          break;
        case SsPartType.Mesh:
          // TODO: implement
          //if (cellID >= 0 && this.prevCellID[i] !== cellID) {
          //  if (mesh != null) mesh.destroy();
          //  mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
          //  mesh.name = part.name();
          //}
          break;
        case SsPartType.Nulltype:
        case SsPartType.Joint:
          if (this.prevCellID[i] !== cellID) {
            if (mesh !== null) mesh.destroy();
            mesh = new Container(this.scene);
            mesh.name = part.name();
          }
          break;
        default:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh !== null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID);
            mesh.name = part.name();
          }
          break;
      }

      // 初期化が行われなかった場合(あるの？)
      if (mesh == null) continue;

      this.prevCellID[i] = cellID;
      this.prevMesh[i] = mesh;

    }
  }

  private MakeCellMesh(id: number): Mesh {
    const cell = this.playerLib.fbObj.cells(id);
    const u1 = cell.u1();
    const u2 = cell.u2();
    const v1 = cell.v1();
    const v2 = cell.v2();
    const w = cell.width() / 2;
    const h = cell.height() / 2;
    const verts = [0, 0, -w, -h, w, -h, -w, h, w, h];
    const uvs = [(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2];
    const indices = [0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]; // ??? why ???

    const name = cell.cellMap().name()
    return new Mesh(this.scene, null, null, this.plugin.getSsfbImage(this.ssfbKey, name), null, verts, uvs, indices);
  }


  /**
   * メッシュセルからメッシュを作成
   * @param {number} partID - パーツID
   * @param {number} cellID - セルID
   * @return {PIXI.SimpleMesh} - メッシュ
   */
  private MakeMeshCellMesh(partID: number, cellID: number): Mesh {
    const meshsDataUV = this.playerLib.animationData.meshsDataUv(partID);
    const uvLength = meshsDataUV.uvLength();

    if (uvLength > 0) {
      // 先頭の2データはヘッダになる
      const uvs: number[] = new Array(uvLength - 2);
      const meshNum = meshsDataUV.uv(1);

      for (let idx = 2; idx < uvLength; idx++) {
        uvs[idx - 2] = meshsDataUV.uv(idx);
      }

      const meshsDataIndices = this.playerLib.animationData.meshsDataIndices(partID);
      const indicesLength = meshsDataIndices.indicesLength();

      // 先頭の1データはヘッダになる
      const indices: number[] = new Array(indicesLength - 1);
      for (let idx = 1; idx < indicesLength; idx++) {
        indices[idx - 1] = meshsDataIndices.indices(idx);
      }

      const verts: number[] = new Array(meshNum * 2); // Zは必要ない？

      const name = this.playerLib.fbObj.cells(cellID).cellMap().name()
      return new Mesh(this.scene, 0, 0, this.plugin.getSsfbImage(this.ssfbKey, name), name, verts, uvs, indices)
    }

    return null;
  }

}
