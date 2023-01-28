import {AppBase, BoundingBox, GraphNode, MeshInstance, Vec2, Vec3} from 'playcanvas';
import {Player, AnimePackData, PART_FLAG, PartData, SsPartType} from 'ss6player-lib';

export enum PlayDirection {
  Foward = 1,
  Backward = -1
}

export class SS6Player {

  private _isPlaying: boolean = false;
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private _isPausing: boolean = true;
  get isPausing(): boolean {
    return this._isPausing;
  }

  private _loops: number = -1;
  get loops(): number {
    return this._loops;
  }
  set loops(value) {
    this._loops = value;
  }

  private _pLayDirection: PlayDirection = PlayDirection.Foward;
  get playDirection(): PlayDirection {
    return this._pLayDirection;
  }
  set playDirection(value) {
    this._pLayDirection = value;
  }

  private _skipEnabled: boolean = true;
  get skipEnabled(): boolean {
    return this._skipEnabled;
  }
  set skipEnabled(value) {
    this._skipEnabled = value;
  }

  protected playerLib: Player;

  private _startFrame: number;
  get startFrame(): number {
    return this._startFrame;
  }

  private _endFrame: number;
  get endFrame(): number {
    return this._endFrame;
  }

  private _currentFrame: number;
  get currentFrame(): number {
    return this._currentFrame;
  }

  private nextFrameTime: number;
  private updateInterval: number;

  private _app: AppBase;

  private _position: Vec3;

  private _node: GraphNode;
  private _meshes: any[];
  private _meshInstances: MeshInstance[];
  private _materials;
  private _tint;

  private _aabb: BoundingBox;
  private _aabbTempArray;
  private _aabbTempOffset: Vec2;
  private _aabbTempSize: Vec2;

  /*
  this._renderCounts = { vertexCount: 0, indexCount: 0 };
  this._vertexFormat = null;
  this._vertexBuffer = null;
  this._indexBuffer = null;
   */

  private _priority: number;
  private _timeScale: number;

  private _layers: number[];
  get layers(): number[] {
    return this._layers;
  }
  set layers(value) {
    this.removeFromLayers();
    this._layers = value || [];
    this.addToLayers();
  }

  autoUpdate: boolean;
  private _hidden: boolean;

  constructor(app: AppBase, ssfbData: Uint8Array, textures: { [key: string]: any; }, animePackName: string = null, animeName: string = null) {
    this._app = app;

    this._position = new Vec3();

    this._node = new GraphNode();
    this._meshes = [];
    this._meshInstances = [];
    this._materials = {};
    this._tint = {};

    this._aabb = new BoundingBox();
    this._aabbTempArray = [];
    this._aabbTempOffset = new Vec2();
    this._aabbTempSize = new Vec2();

    this.playerLib = new Player(ssfbData, animePackName, animeName);

    if (animePackName !== null && animeName !== null) {
      this.setup(animePackName, animeName);
    }
  }

  destroy() {
    for (let i = 0; i < this._meshInstances.length; i++) {
      this._meshInstances[i].mesh.vertexBuffer = null;
      this._meshInstances[i].mesh.indexBuffer.length = 0;
      this._meshInstances[i].material = null;
    }

    /*
    if (this._vertexBuffer) {
      this._vertexBuffer.destroy();
      this._vertexBuffer = null;
    }

    if (this._indexBuffer) {
      this._indexBuffer.destroy();
      this._indexBuffer = null;
    }
     */

    this._meshInstances = [];
    // this.skeleton = null;
    // this.stateData = null;
    this._materials = {};
    this._node = null;
  }

  hide() {
    if (this._hidden) {
      return;
    }

    const n = this._meshInstances.length;
    for (let i = 0; i < n; i++) {
      this._meshInstances[i].visible = false;
    }

    this._hidden = true;
  }

  show() {
    if (!this._hidden) {
      return;
    }

    const n = this._meshInstances.length;
    for (let i = 0; i < n; i++) {
      this._meshInstances[i].visible = true;
    }

    this._hidden = false;
  }

  update(dt: number) {
    console.log('update: ' + dt);
    if (this._hidden) {
      return;
    }
    const toNextFrame = this._isPlaying && !this._isPausing;
    if (/*toNextFrame &&*/ this.updateInterval !== 0) {
      this.nextFrameTime += dt;
      if (this.nextFrameTime >= this.updateInterval) {
        let playEndFlag = false;

        // skip
        const step = this.nextFrameTime / this.updateInterval;
        this.nextFrameTime -= this.updateInterval * step;
        let s = (this.skipEnabled ? step * this.playDirection : this.playDirection);
        let next = this._currentFrame + s;
        let nextFrameNo = Math.floor(next);
        let nextFrameDecimal = next - nextFrameNo;
        let currentFrameNo = Math.floor(this._currentFrame);

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
                // incFrameNo = (rewindAfterReachingEndFrame) ? this._startFrame : this._endFrame; // TODO:
                break;
              } else {
                // continue to play the animation
                incFrameNo = this._startFrame;
              }
            }
          }
          currentFrameNo = incFrameNo;

          /*
          // Check User Data
          if (this._isPlaying) {
            if (this.playerLib.HaveUserData(currentFrameNo)) {
              if (this.onUserDataCallback !== null) {
                this.onUserDataCallback(this.playerLib.GetUserData(currentFrameNo));
              }
            }
          }
         */
        }
      }
    } else {
      this.setFrameAnimation(Math.floor(this._currentFrame));
    }
  }

  protected setFrameAnimation(frameNumber: number, ds: number = 0.0): void {

  }

  setPosition(p: Vec3) {
    this._position.copy(p);
  }

  removeFromLayers() {
    if (this._meshInstances.length) {
      for (let i = 0; i < this._layers.length; i++) {
        const layer = this._app.scene.layers.getLayerById(this._layers[i]);
        if (layer) {
          layer.removeMeshInstances(this._meshInstances);
        }
      }
    }
  }

  addToLayers() {
    if (this._meshInstances.length) {
      for (let i = 0; i < this._layers.length; i++) {
        const layer = this._app.scene.layers.getLayerById(this._layers[i]);
        if (layer) {
          layer.addMeshInstances(this._meshInstances);
        }
      }
    }
  }

  setup(animePackName: string, animeName: string): void {
    this.playerLib.Setup(animePackName, animeName);

    this._isPlaying = false;
    this._isPausing = true;
    this._startFrame = this.playerLib.animationData.startFrames();
    this._endFrame = this.playerLib.animationData.endFrames();
    this._currentFrame = this.playerLib.animationData.startFrames();
    this.nextFrameTime = 0;
    this._loops = -1;
    this.skipEnabled = true;
    this.updateInterval = 1000 / this.playerLib.animationData.fps();
    this.playDirection = PlayDirection.Foward;
  }
}
