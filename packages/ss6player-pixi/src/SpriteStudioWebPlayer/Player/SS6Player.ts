import { SS6Project } from './SS6Project';
import { Project } from '../Model/Project';
import { AnimePack } from '../Model/AnimePack';
import { AnimePackAnimation } from '../Model/AnimePackAnimation';
import { PartType, PART_FLAG } from '../Model/AnimePackParts';

export class SS6Player extends PIXI.Container {
  // Properties
  private readonly ss6project: SS6Project;

  private resources: PIXI.loaders.ResourceDictionary;
  private parentIndex: number[] = [];
  private liveFrame: any[] = [];

  private parentAlpha: number = 1.0;

  //
  // cell再利用
  private prevCellID: number[] = []; // 各パーツ（レイヤー）で前回使用したセルID
  private prevMesh: (SS6Player | PIXI.mesh.Mesh)[] = [];

  private alphaBlendType: number[] = [];
  private isPlaying: boolean;
  private isPausing: boolean;
  private _startFrame: number;
  public get startFrame(): number {
    return this._startFrame;
  }

  private _endFrame: number;
  public get endFrame(): number {
    return this._endFrame;
  }

  private _currentFrame: number;
  public get frameNo(): number {
    return this._currentFrame;
  }

  private nextFrameTime: number;
  private _loops: number = -1;
  public set loop(loop: number) {
    this._loops = loop;
  }
  public get loop(): number {
    return this._loops;
  }

  private skipEnabled: boolean;
  private updateInterval: number;
  private playDirection: number = 1;
  private pastTime: number;
  private onUserDataCallback: (data: any) => void = null;
  private playEndCallback: (player: SS6Player) => void = null;
  private onUpdateCallback: (player: SS6Player) => void = null;
  private onPlayStateChangeCallback: (isPlaying: boolean, isPausing: boolean) => void = null;

  public get project() : Project {
    return this.ss6project.project;
  }
  public get currentAnimePack(): AnimePack {
    return this.project.currentAnimePack;
  }
  public get currentAnimation(): AnimePackAnimation {
    return this.currentAnimePack.currentAnimePackAnimation;
  }



  public get totalFrame(): number {
    return this.currentAnimation.totalFrame;
  }

  public get fps(): number {
    return this.currentAnimation.fps;
  }

  


  /**
   * SS6Player (extends PIXI.Container)
   * @constructor
   * @param {SS6Project} ss6project - SS6Project that contains animations.
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public constructor(ss6project: SS6Project, onComplete: () => void) {
    super();

    // extends PIXI.Container
    PIXI.Container.call(this);

    this.ss6project = ss6project;
    this.parentAlpha = 1.0;

    

    this.loadCellResources(()=> {
      // Ticker
      this.pastTime = 0;
      PIXI.ticker.shared.add(this.Update, this);

      onComplete();

    });

  }

  /**
   * Setup
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public Setup(animePackName: string, animeName: string): void {
    this.clearCaches();

    // this.ss6project.ssfbReader.Setup(animePackName, animeName);
    this.ss6project.project.setActiveAnimation(animePackName, animeName);

    // const curAnimePack = this.ss6project.ssfbReader.curAnimePack;
    const currentAnimePack = this.currentAnimePack;
    // parts
    const partsLength = Object.keys(currentAnimePack.partsModelMap).length;
    this.parentIndex = new Array(partsLength);
    // cell再利用
    this.prevCellID = new Array(partsLength);
    this.prevMesh = new Array(partsLength);
    for(let partsIndex in currentAnimePack.partsModelMap){
      const parts = currentAnimePack.partsModelMap[partsIndex];
      this.parentIndex[partsIndex] = parts.parentIndex;
      // cell再利用
      this.prevCellID[partsIndex] = -1; // 初期値（最初は必ず設定が必要）
      this.prevMesh[partsIndex] = null;

    }
    // for (let partsIndex = 0; partsIndex < partsLength; partsIndex++) {
    //   const index = curAnimePack.parts(partsIndex).index();
    //   this.parentIndex[index] = curAnimePack.parts(partsIndex).parentIndex();
    //   // cell再利用
    //   this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
    //   this.prevMesh[index] = null;
    // }

    // 各アニメーションステータスを初期化
    this.alphaBlendType = this.GetPartsBlendMode();

    this.isPlaying = false;
    this.isPausing = true;

    const currentAnimePackAnimation = this.project.currentAnimePack.currentAnimePackAnimation;
    // this._startFrame = this.ss6project.ssfbReader.curAnimation.startFrames();
    this._startFrame = currentAnimePackAnimation.startFrame;
    // this._endFrame = this.ss6project.ssfbReader.curAnimation.endFrames();
    this._endFrame = currentAnimePackAnimation.endFrame;
    // this._currentFrame = this.ss6project.ssfbReader.curAnimation.startFrames();
    this._currentFrame = this._startFrame;
    
    this.nextFrameTime = 0;
    this.skipEnabled = false;
    const fps = this.currentAnimation.fps;
    this.updateInterval = 1000 / fps;

    // this._loops = -1;
    // this.playDirection = 1; // forward
    // this.onUserDataCallback = null;
    // this.playEndCallback = null;
    // this.onUpdateCallback = null;
    this.parentAlpha = 1.0;


  }

  private clearCaches() {
    // this.ss6project.ssfbReader.clearCaches();
    this.liveFrame = [];
  }

  /**
   * Update is called PIXI.ticker
   * @param {number} delta - expected 1
   */
  private Update(delta: number): void {
    if (this._loops === 0) {
      this.Stop();
      return;
    }
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.pastTime;
    const toNextFrame = this.isPlaying && !this.isPausing;
    this.pastTime = currentTime;
    if (toNextFrame && this.updateInterval !== 0) {
      this.nextFrameTime += elapsedTime; // もっとうまいやり方がありそうなんだけど…
      if (this.nextFrameTime >= this.updateInterval) {
        // 処理落ち対応
        const step = Math.floor(this.nextFrameTime / this.updateInterval);
        this.nextFrameTime -= this.updateInterval * step;
        this._currentFrame += this.skipEnabled ? step * this.playDirection : this.playDirection;
        // speed +
        if (this._currentFrame > this._endFrame) {
          this._currentFrame = this._startFrame + ((this._currentFrame - this._endFrame - 1) % (this._endFrame - this._startFrame + 1));
          if (this._loops === -1) {
            // infinite loop
          } else {
            this._loops--;
            if (this.playEndCallback !== null) {
              this.playEndCallback(this);
            }
            if (this._loops === 0) {
              this.Stop();
            }
          }
        }
        // speed -
        if (this._currentFrame < this._startFrame) {
          this._currentFrame = this._endFrame - ((this._startFrame - this._currentFrame - 1) % (this._endFrame - this._startFrame + 1));
          if (this._loops === -1) {
            // infinite loop
          } else {
            this._loops--;
            if (this.playEndCallback !== null) {
              this.playEndCallback(this);
            }
            if (this._loops === 0) {
              this.Stop();
            }
          }
        }
        this.SetFrameAnimation(this._currentFrame);
        if (this.isPlaying) {
          // HaveUserData
          // if (this.ss6project.ssfbReader.HaveUserData(this._currentFrame)) {
          //   if (this.onUserDataCallback !== null) {
          //     this.onUserDataCallback(this.ss6project.ssfbReader.GetUserData(this._currentFrame));
          //   }
          // }
        }
      }
    } else {
      this.SetFrameAnimation(this._currentFrame);
    }

    // 毎回実行されるコールバック
    if(this.isPlaying && !this.isPausing){
      if (this.onUpdateCallback !== null) {
        this.onUpdateCallback(this);
      }
    }
  }

  /**
   * アニメーションの速度を設定する (deprecated この関数は削除される可能性があります)
   * @param {number} fps - アニメーション速度(frame per sec.)
   * @param {boolean} _skipEnabled - 描画更新が間に合わないときにフレームをスキップするかどうか
   */
  public SetAnimationFramerate(fps: number, _skipEnabled: boolean = true): void {
    if (fps <= 0) return; // illegal
    this.updateInterval = 1000 / fps;
    this.skipEnabled = _skipEnabled;
  }

  /**
   * アニメーションの速度を設定する
   * @param {number} fpsRate - アニメーション速度(設定値に対する乗率)負数設定で逆再生
   * @param {boolean} _skipEnabled - 描画更新が間に合わないときにフレームをスキップするかどうか
   */
  public SetAnimationSpeed(fpsRate: number, _skipEnabled: boolean = true): void {
    if (fpsRate === 0) return; // illegal?
    this.playDirection = fpsRate > 0 ? 1 : -1;
    this.updateInterval = 1000 / (this.fps * fpsRate * this.playDirection);
    this.skipEnabled = _skipEnabled;
  }

  /**
   * アニメーション再生設定
   * @param {number} _startframe - 開始フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _endframe - 終了フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _loops - ループ回数（ゼロもしくはマイナス設定で無限ループ）
   */
  public SetAnimationSection(_startframe: number = -1, _endframe: number = -1, _loops: number = -1): void {
    if (_startframe >= 0 && _startframe < this.totalFrame) {
      this._startFrame = _startframe;
    }
    if (_endframe >= 0 && _endframe < this.totalFrame) {
      this._endFrame = _endframe;
    }
    if (_loops > 0) {
      this._loops = _loops;
    } else {
      this._loops = -1;
    }
    // 再生方向にあわせて開始フレーム設定（順方向ならstartFrame,逆方法ならendFrame）
    this._currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
  }

  /**
   * アニメーション再生を開始する
   */
  public Play(): void {
    if (this.isPlaying){
      // 既に開始しているため、処理しない
      return;
    }
    this.isPlaying = true;
    this.isPausing = false;
    this._currentFrame = this._startFrame;
    this.pastTime = Date.now();
    this.SetFrameAnimation(this._currentFrame);
    // if (this.ss6project.ssfbReader.HaveUserData(this._currentFrame)) {
    //   if (this.onUserDataCallback !== null) {
    //     this.onUserDataCallback(this.ss6project.ssfbReader.GetUserData(this._currentFrame));
    //   }
    // }
    const defaultDataLength = Object.keys(this.currentAnimation.setupStateMap).length;
    // const defaultDataLength = this.ss6project.ssfbReader.curAnimation.defaultDataLength();
    for (let i = 0; i < defaultDataLength; i++) {
      this.liveFrame[i] = 0;
    }
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }
  /**
   * アニメーション再生を一時停止する
   */
  public Pause(): void {
    if (this.isPausing) {
      // 既に一時停止されているため、処理しない
      return;
    }
    this.isPausing = true;
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  /**
   * アニメーション再生を再開する
   */
  public Resume(): void {
    if(!this.isPausing){
      // 既に再開されているため、処理しない
      return;
    }
    this.isPausing = false;
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  /**
   * アニメーションを停止する
   * @constructor
   */
  public Stop(): void {
    if(!this.isPlaying){
      // 既に停止しているため、処理しない
      return;
    }
    this.isPlaying = false;
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  /**
   * アニメーション再生を位置（フレーム）を設定する
   */
  public SetFrame(frame: number): void {
    this._currentFrame = frame;
  }

  /**
   * アニメーションの透明度を設定する
   */
  public SetAlpha(alpha: number): void {
    this.parentAlpha = alpha;
  }

  /**
   * エラー処理
   * @param {any} _error - エラー
   */
  public ThrowError(_error: string): void {

  }

  /**
   * Load textures
   */
  private loadCellResources(onComplete:() => void) {
    const self = this;
    // Load textures for all cell at once.
    const loader = new PIXI.loaders.Loader();
    let ids: any = [];
    const cellMap = this.project.cellMap;
    for (let cellId in cellMap){
      const cell = cellMap[cellId];
      const cellInnnerCellMap = cell.cellMap;
      const cellMapIndex = cellInnnerCellMap.index;
      const cellMapName = cellInnnerCellMap.name;
      const imagePath = cellInnnerCellMap.imagePath;
      const directoryPath = this.project.directoryPath;
      if (!ids.some(function (id: number) {
        return (id === cellMapIndex);
      })) {
        ids.push(cellMapIndex);
        loader.add(cellMapName, directoryPath + imagePath);
      }

    }
    // for (let i = 0; i < self.fbObj.cellsLength(); i++) {
    //   if (!ids.some(function (id: number) {
    //     return (id === self.fbObj.cells(i).cellMap().index());
    //   })) {
    //     ids.push(self.fbObj.cells(i).cellMap().index());
    //     loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
    //   }
    // }
    loader.load(function (loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) {
      // SS6Project is ready.
      self.resources = resources;
      // self.status = 'ready';
      // if (self.onComplete !== null) {
      //   self.onComplete();
      // }
      if (onComplete !== null){
        onComplete();
      }
    });
  }


  /**
   * ユーザーデータコールバックの設定
   * @param fn
   * @constructor
   *
   * ユーザーデータのフォーマット
   * data = [[d0,d1,...,d10],[da0,da1,...,da10],...])
   * data.length : 当該フレームでユーザーデータの存在するパーツ（レイヤー）数
   * d0 : パーツ（レイヤー）番号
   * d1 : 有効データビット（&1:int, &2:rect(int*4), &4:pos(int*2), &8:string）
   * d2 : int(int)
   * d3 : rect0(int)
   * d4 : rect1(int)
   * d5 : rect2(int)
   * d6 : rect3(int)
   * d7 : pos0(int)
   * d8 : pos1(int)
   * d9 : string.length(int)
   * d10: string(string)
   *
   */
  public SetUserDataCalback(fn: (data: any) => void): void {
    this.onUserDataCallback = fn;
  }

  /**
   * 再生終了時に呼び出されるコールバックを設定します.
   * @param fn
   * @constructor
   *
   * ループ回数分再生した後に呼び出される点に注意してください。
   * 無限ループで再生している場合はコールバックが発生しません。
   *
   */
  public SetPlayEndCallback(fn: (player: SS6Player) => void): void {
    this.playEndCallback = fn;
  }




  /**
   * パーツの描画モードを取得する
   * @return {array} - 全パーツの描画モード
   */
  private GetPartsBlendMode(): any[] {
    const ret = [];
    
    for (let partsName in this.currentAnimePack.partsModelMap){
      const parts = this.currentAnimePack.partsModelMap[partsName];
      ret.push(parts.alphaBlendType);
    }

    // const partsLength = this.ss6project.ssfbReader.curAnimePack.partsLength();
    // const animePacks = this.ss6project.ssfbReader.curAnimePack;
    // for (let i = 0; i < partsLength; i++) {
    //   ret.push(animePacks.parts(i).alphaBlendType());
    // }

    return ret;
  }






  /**
   * １フレーム分のアニメーション描画
   * @param {number} frameNumber - フレーム番号
   */
  private SetFrameAnimation(frameNumber: number): void {
    // console.log("SetFrameAnimation");
    const fd = this.getFrameData(frameNumber);
    this.removeChildren();

    const prio2Index = this.currentAnimation.prio2Index;
    // 優先度順パーツ単位ループ
    const l = fd.length;
    for (let ii = 0; ii < l; ii = (ii + 1) | 0) {
      // 優先度に変換
      const i = prio2Index[ii];

      const data = fd[i];
      data.localscaleX = data.localScaleX;
      data.localscaleY = data.localScaleY;
      data.uv_move_X = data.uvMoveX;
      data.uv_move_Y = data.uvMoveY;
      data.uv_rotation = data.uvRotation;
      data.uv_scale_X = data.uvScaleX;
      data.uv_scale_Y = data.uvScaleY;
      data.size_X = data.sizeX;
      data.size_Y = data.sizeY;
      data.f_hide = data.isHide;

      
      const cellID = data.cellIndex;

      // cell再利用
      let mesh: any = this.prevMesh[i];

      const partsModelMap = this.currentAnimePack.partsModelMap;
      const part = partsModelMap[i];
      // const part = this.ss6project.ssfbReader.curAnimePack.parts(i);
      const partType = part.type;
      // const partType = part.type();

      // 処理分岐処理
      switch (partType) {
        case PartType.Instance:
          if (mesh == null) {
            mesh = this.MakeCellPlayer(part.refname());
          }
          break;
        case PartType.Normal:
        case PartType.Mask:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
          }
          break;
        case PartType.Mesh:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
          }
          break;
        case PartType.Nulltype:
        case PartType.Joint:
          if (this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = new PIXI.Container();
          }
          break;
        default:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            // 小西 - デストロイ処理
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
          }
          break;
      }

      // 初期化が行われなかった場合(あるの？)
      if (mesh == null) continue;

      this.prevCellID[i] = cellID;
      this.prevMesh[i] = mesh;

      // 描画関係処理
      switch (partType) {
        case PartType.Instance: {
          // インスタンスパーツのアップデート
          let pos = new Float32Array(5);
          pos[0] = 0; // pos x
          pos[1] = 0; // pos x
          pos[2] = 1; // scale x
          pos[3] = 1; // scale x
          pos[4] = 0; // rot
          pos = this.TransformPositionLocal(pos, data.index, frameNumber);
          const rot = (pos[4] * Math.PI) / 180;
          mesh.rotation = rot;
          mesh.position.set(pos[0], pos[1]);
          mesh.scale.set(pos[2], pos[3]);

          let opacity = data.opacity / 255.0; // fdには継承後の不透明度が反映されているのでそのまま使用する
          if (data.localopacity < 255) {
            // ローカル不透明度が使われている場合は255以下の値になるので、255以下の場合にローカル不透明度で上書き
            opacity = data.localopacity / 255.0;
          }
          mesh.SetAlpha(opacity * this.parentAlpha);
          mesh.visible = !data.f_hide;

          // 描画
          const refKeyframe = data.instanceValue_curKeyframe;
          const refStartframe = data.instanceValue_startFrame;
          const refEndframe = data.instanceValue_endFrame;
          const refSpeed = data.instanceValue_speed;
          const refloopNum = data.instanceValue_loopNum;
          let infinity = false;
          let reverse = false;
          let pingpong = false;
          let independent = false;

          const INSTANCE_LOOP_FLAG_INFINITY = 0b0000000000000001;
          const INSTANCE_LOOP_FLAG_REVERSE = 0b0000000000000010;
          const INSTANCE_LOOP_FLAG_PINGPONG = 0b0000000000000100;
          const INSTANCE_LOOP_FLAG_INDEPENDENT = 0b0000000000001000;
          const lflags = data.instanceValue_loopflag;
          if (lflags & INSTANCE_LOOP_FLAG_INFINITY) {
            // 無限ループ
            infinity = true;
          }
          if (lflags & INSTANCE_LOOP_FLAG_REVERSE) {
            // 逆再生
            reverse = true;
          }
          if (lflags & INSTANCE_LOOP_FLAG_PINGPONG) {
            // 往復
            pingpong = true;
          }
          if (lflags & INSTANCE_LOOP_FLAG_INDEPENDENT) {
            // 独立
            independent = true;
          }

          // タイムライン上の時間 （絶対時間）
          let time = frameNumber;

          // 独立動作の場合
          if (independent === true) {
            const delta = this.updateInterval * 0.1;

            this.liveFrame[ii] += delta;
            time = Math.floor(this.liveFrame[ii]);
          }

          // このインスタンスが配置されたキーフレーム（絶対時間）
          const selfTopKeyframe = refKeyframe;

          let reftime = Math.floor((time - selfTopKeyframe) * refSpeed); // 開始から現在の経過時間
          if (reftime < 0) continue; // そもそも生存時間に存在していない
          if (selfTopKeyframe > time) continue;

          const inst_scale = refEndframe - refStartframe + 1; // インスタンスの尺

          // 尺が０もしくはマイナス（あり得ない
          if (inst_scale <= 0) continue;
          let nowloop = Math.floor(reftime / inst_scale); // 現在までのループ数

          let checkloopnum = refloopNum;

          // pingpongの場合では２倍にする
          if (pingpong) checkloopnum = checkloopnum * 2;

          // 無限ループで無い時にループ数をチェック
          if (!infinity) {
            // 無限フラグが有効な場合はチェックせず
            if (nowloop >= checkloopnum) {
              reftime = inst_scale - 1;
              nowloop = checkloopnum - 1;
            }
          }

          const temp_frame = Math.floor(reftime % inst_scale); // ループを加味しないインスタンスアニメ内のフレーム

          // 参照位置を決める
          // 現在の再生フレームの計算
          let _time = 0;
          if (pingpong && nowloop % 2 === 1) {
            if (reverse) {
              reverse = false; // 反転
            } else {
              reverse = true; // 反転
            }
          }

          if (reverse) {
            // リバースの時
            _time = refEndframe - temp_frame;
          } else {
            // 通常時
            _time = temp_frame + refStartframe;
          }

          // インスタンスパラメータを設定
          // インスタンス用SSPlayerに再生フレームを設定する
          mesh.SetFrame(Math.floor(_time));
          mesh.Pause();
          this.addChild(mesh);
          continue;
        }
        //  Instance以外の通常のMeshと空のContainerで処理分岐
        case PartType.Normal:
        case PartType.Mesh:
        case PartType.Joint:
        case PartType.Mask: {
          let verts: Float32Array;
          if (partType === PartType.Mesh) {
            // ボーンとのバインドの有無によって、TRSの継承行うかが決まる。
            if (data.meshIsBind === 0) {
              // バインドがない場合は親からのTRSを継承する
              verts = this.TransformMeshVertsLocal(SS6Player.GetMeshVerts(cellID, data), data.index, frameNumber);
            } else {
              // バインドがある場合は変形後の結果が出力されているので、そのままの値を使用する
              verts = SS6Player.GetMeshVerts(cellID, data);
            }
          } else {
            verts = this.TransformVertsLocal(SS6Player.GetVerts(cellID, data), data.index, frameNumber);
          }
          // 頂点変形、パーツカラーのアトリビュートがある場合のみ行うようにしたい
          if (data.flag1 & PART_FLAG.VERTEX_TRANSFORM) {
            // 524288 verts [4]	//
            // 頂点変形の中心点を算出する
            const vertexCoordinateLUx = verts[3 * 2 + 0];
            const vertexCoordinateLUy = verts[3 * 2 + 1];
            const vertexCoordinateLDx = verts[1 * 2 + 0];
            const vertexCoordinateLDy = verts[1 * 2 + 1];
            const vertexCoordinateRUx = verts[4 * 2 + 0];
            const vertexCoordinateRUy = verts[4 * 2 + 1];
            const vertexCoordinateRDx = verts[2 * 2 + 0];
            const vertexCoordinateRDy = verts[2 * 2 + 1];

            const CoordinateLURUx = (vertexCoordinateLUx + vertexCoordinateRUx) * 0.5;
            const CoordinateLURUy = (vertexCoordinateLUy + vertexCoordinateRUy) * 0.5;
            const CoordinateLULDx = (vertexCoordinateLUx + vertexCoordinateLDx) * 0.5;
            const CoordinateLULDy = (vertexCoordinateLUy + vertexCoordinateLDy) * 0.5;
            const CoordinateLDRDx = (vertexCoordinateLDx + vertexCoordinateRDx) * 0.5;
            const CoordinateLDRDy = (vertexCoordinateLDy + vertexCoordinateRDy) * 0.5;
            const CoordinateRURDx = (vertexCoordinateRUx + vertexCoordinateRDx) * 0.5;
            const CoordinateRURDy = (vertexCoordinateRUy + vertexCoordinateRDy) * 0.5;

            const vec2 = SS6Player.CoordinateGetDiagonalIntersection(verts[0], verts[1], CoordinateLURUx, CoordinateLURUy, CoordinateRURDx, CoordinateRURDy, CoordinateLULDx, CoordinateLULDy, CoordinateLDRDx, CoordinateLDRDy);
            verts[0] = vec2[0];
            verts[1] = vec2[1];
          }
          const px = verts[0];
          const py = verts[1];
          for (let j = 0; j < verts.length / 2; j++) {
            verts[j * 2] -= px;
            verts[j * 2 + 1] -= py;
          }

          mesh.vertices = verts;
          if (data.flag1 & PART_FLAG.U_MOVE || data.flag1 & PART_FLAG.V_MOVE || data.flag1 & PART_FLAG.U_SCALE || data.flag1 & PART_FLAG.V_SCALE || data.flag1 & PART_FLAG.UV_ROTATION) {
            // uv X/Y移動
            const cell = this.project.getCell(cellID);

            const u1 = cell.u1 + data.uv_move_X;
            const u2 = cell.u2 + data.uv_move_X;
            const v1 = cell.v1 + data.uv_move_Y;
            const v2 = cell.v2 + data.uv_move_Y;

            // uv X/Yスケール
            const cx = (u2 + u1) / 2;
            const cy = (v2 + v1) / 2;
            const uvw = ((u2 - u1) / 2) * data.uv_scale_X;
            const uvh = ((v2 - v1) / 2) * data.uv_scale_Y;

            // UV回転
            mesh.uvs[0] = cx;
            mesh.uvs[1] = cy;
            mesh.uvs[2] = cx - uvw;
            mesh.uvs[3] = cy - uvh;
            mesh.uvs[4] = cx + uvw;
            mesh.uvs[5] = cy - uvh;
            mesh.uvs[6] = cx - uvw;
            mesh.uvs[7] = cy + uvh;
            mesh.uvs[8] = cx + uvw;
            mesh.uvs[9] = cy + uvh;

            if (data.flag1 & PART_FLAG.UV_ROTATION) {
              const rot = (data.uv_rotation * Math.PI) / 180;
              for (let idx = 0; idx < 5; idx++) {
                const dx = mesh.uvs[idx * 2 + 0] - cx; // 中心からの距離(X)
                const dy = mesh.uvs[idx * 2 + 1] - cy; // 中心からの距離(Y)

                const cos = Math.cos(rot);
                const sin = Math.sin(rot);

                const tmpX = cos * dx - sin * dy; // 回転
                const tmpY = sin * dx + cos * dy;

                mesh.uvs[idx * 2 + 0] = cx + tmpX; // 元の座標にオフセットする
                mesh.uvs[idx * 2 + 1] = cy + tmpY;
              }
            }
            mesh.dirty++; // 更新回数？をカウントアップすると更新されるようになる
          }

          const pivot = this.GetPivot(verts, cellID);
          //
          mesh.position.set(px + pivot.x * data.localscaleX, py + pivot.y * data.localscaleY);
          mesh.scale.set(data.localscaleX, data.localscaleY);
          //
          // 小西: 256指定と1.0指定が混在していたので統一
          let opacity = data.opacity / 255.0; // fdには継承後の不透明度が反映されているのでそのまま使用する
          // 小西: 256指定と1.0指定が混在していたので統一
          if (data.localopacity < 255) {
            // ローカル不透明度が使われている場合は255以下の値になるので、255以下の場合にローカル不透明度で上書き
            opacity = data.localopacity / 255.0;
          }
          mesh.alpha = opacity * this.parentAlpha; // 255*255
          mesh.visible = !data.f_hide;

          // if (data.h_hide) console.log('hide ! ' + data.cellIndex);
          //
          if (data.useColorMatrix) {
            mesh.filters = [data.colorMatrix];
          }

          // 小西 - tintデータがあれば適用
          if (data.tint) {
            mesh.tint = data.tint;
            // パーツカラーのAを不透明度に乗算して処理する
            const ca = ((data.partsColorARGB & 0xff000000) >>> 24) / 255;
            mesh.alpha = mesh.alpha * ca;
          }
          if (data.tintRgb) {
            mesh.tintRgb = data.tintRgb;
          }

          const blendMode = this.alphaBlendType[i];
          if (blendMode === 0) mesh.blendMode = PIXI.BLEND_MODES.NORMAL;
          if (blendMode === 1) {
            mesh.blendMode = PIXI.BLEND_MODES.MULTIPLY; // not suported 不透明度が利いてしまう。
            mesh.alpha = 1.0; // 不透明度を固定にする
          }
          if (blendMode === 2) mesh.blendMode = PIXI.BLEND_MODES.ADD;
          if (blendMode === 3) mesh.blendMode = PIXI.BLEND_MODES.NORMAL; // WebGL does not suported "SUB"
          if (blendMode === 4) mesh.blendMode = PIXI.BLEND_MODES.MULTIPLY; // WebGL does not suported "alpha multiply"
          if (blendMode === 5) {
            mesh.blendMode = PIXI.BLEND_MODES.SCREEN; // not suported 不透明度が利いてしまう。
            mesh.alpha = 1.0; // 不透明度を固定にする
          }
          if (blendMode === 6) mesh.blendMode = PIXI.BLEND_MODES.EXCLUSION; // WebGL does not suported "Exclusion"
          if (blendMode === 7) mesh.blendMode = PIXI.BLEND_MODES.NORMAL; // WebGL does not suported "reverse"

          if (partType !== PartType.Mask) this.addChild(mesh);
          break;
        }
        case PartType.Nulltype: {
          // NULLパーツのOpacity/Transform設定
          const opacity = this.InheritOpacity(1.0, data.index, frameNumber);
          mesh.alpha = (opacity * data.localopacity) / 255.0;
          const verts = this.TransformVerts(SS6Player.GetDummyVerts(), data.index, frameNumber);
          const px = verts[0];
          const py = verts[1];
          mesh.position.set(px, py);
          const ax = Math.atan2(verts[5] - verts[3], verts[4] - verts[2]);
          const ay = Math.atan2(verts[7] - verts[3], verts[6] - verts[2]);
          mesh.rotation = ax;
          mesh.skew.x = ay - ax - Math.PI / 2;
          break;
        }
      }
    }
    // console.log("SetFrameAnimation end");

  }

  /**
   * 矩形セルの中心(0,1)から、X軸方向：右下(4,5)-左下(2,3)、Y軸方向：左上（6,7）-左下(2,3)の座標系でpivot分ずらした座標
   * @param {array} verts - 頂点情報配列
   * @param {number} cellID - セルID
   * @return {PIXI.Point} - 座標
   */
  private GetPivot(verts: Float32Array, cellID: number): PIXI.Point {
    const cell = this.project.getCell(cellID);
    const px = cell.pivotX;
    const py = cell.pivotY;

    // const dx = new PIXI.Point(verts[4] - verts[2], verts[5] - verts[3]);
    const dxX = verts[4] - verts[2];
    const dxY = verts[5] - verts[3];
    // const dy = new PIXI.Point(verts[6] - verts[2], verts[7] - verts[3]);
    const dyX = verts[6] - verts[2];
    const dyY = verts[7] - verts[3];
    const p = new PIXI.Point(verts[0] - dxX * px + dyX * py, verts[1] - dxY * px + dyY * py);
    return p;
  }

  /**
   * 親を遡って不透明度を継承する
   * @param {number} opacity - 透明度
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {number} - 透明度
   */
  private InheritOpacity(opacity: number, id: number, frameNumber: number): number {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    opacity = data.opacity / 255.0;

    if (this.parentIndex[id] >= 0) {
      opacity = this.InheritOpacity(opacity, this.parentIndex[id], frameNumber);
    }
    return opacity;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} verts - 頂点情報配列
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  private TransformVertsLocal(verts: Float32Array, id: number, frameNumber: number): Float32Array {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    for (let i = 0; i < verts.length / 2; i++) {
      let x = verts[i * 2]; // * (data.size_X | 1);
      let y = verts[i * 2 + 1]; // * (data.size_Y | 1);
      if (data.i_transformVerts & 1 && i === 1) {
        x += data.u00;
        y -= data.v00; // 上下修正
      }
      if (data.i_transformVerts & 2 && i === 2) {
        x += data.u01;
        y -= data.v01; // 上下修正
      }
      if (data.i_transformVerts & 4 && i === 3) {
        x += data.u10;
        y -= data.v10; // 上下修正
      }
      if (data.i_transformVerts & 8 && i === 4) {
        x += data.u11;
        y -= data.v11; // 上下修正
      }
      x *= data.scaleX;
      y *= data.scaleY;
      verts[i * 2] = cos * x - sin * y + data.positionX;
      verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
      //
      if (data.f_flipH) {
        verts[i * 2] = verts[0] * 2 - verts[i * 2];
      }
      if (data.f_flipV) {
        verts[i * 2 + 1] = verts[1] * 2 - verts[i * 2 + 1];
      }
    }
    if (this.parentIndex[id] >= 0) {
      verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
    }
    return verts;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} verts - 頂点情報配列
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  private TransformMeshVertsLocal(verts: Float32Array, id: number, frameNumber: number): Float32Array {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    for (let i = 0; i < verts.length / 2; i++) {
      let x = verts[i * 2]; // * (data.size_X | 1);
      let y = verts[i * 2 + 1]; // * (data.size_Y | 1);
      x *= data.scaleX;
      y *= data.scaleY;
      verts[i * 2] = cos * x - sin * y + data.positionX;
      verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
    }
    if (this.parentIndex[id] >= 0) {
      verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
    }
    return verts;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} pos - 頂点情報配列
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  private TransformPositionLocal(pos: Float32Array, id: number, frameNumber: number): Float32Array {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    pos[4] += -data.rotationZ;

    pos[2] *= data.scaleX;
    pos[3] *= data.scaleY;
    pos[0] += data.positionX;
    pos[1] -= data.positionY;

    if (this.parentIndex[id] >= 0) {
      pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
    }
    return pos;
  }

  /**
   * 5頂点の中間点を求める
   * @param {number} cx - 元の中心点
   * @param {number} cy - 元の中心点
   * @param {number} LUx - 左上座標
   * @param {number} LUy - 左上座標
   * @param {number} RUx - 右上座標
   * @param {number} RUy - 右上座標
   * @param {number} LDx - 左下座標
   * @param {number} LDy - 左下座標
   * @param {number} RDx - 右下座標
   * @param {number} RDy - 右下座標
   * @return {array} vec2 - 4頂点から算出した中心点の座標
   */
  private static CoordinateGetDiagonalIntersection(cx: number, cy: number, LUx: number, LUy: number, RUx: number, RUy: number, LDx: number, LDy: number, RDx: number, RDy: number): Float32Array {
    // 中間点を求める

    let vec2 = new Float32Array([cx, cy]);
    // <<< 係数を求める >>>
    const c1 = (LDy - RUy) * (LDx - LUx) - (LDx - RUx) * (LDy - LUy);
    const c2 = (RDx - LUx) * (LDy - LUy) - (RDy - LUy) * (LDx - LUx);
    const c3 = (RDx - LUx) * (LDy - RUy) - (RDy - LUy) * (LDx - RUx);

    if (c3 <= 0 && c3 >= 0) return vec2;

    const ca = c1 / c3;
    const cb = c2 / c3;

    // <<< 交差判定 >>>
    if (0.0 <= ca && 1.0 >= ca && (0.0 <= cb && 1.0 >= cb)) {
      // 交差している
      cx = LUx + ca * (RDx - LUx);
      cy = LUy + ca * (RDy - LUy);
    }
    vec2[0] = cx;
    vec2[1] = cy;
    return vec2;
  }

  /**
   * 親を遡って座標変換する
   * @param {array} verts - 頂点情報配列
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  private TransformVerts(verts: Float32Array, id: number, frameNumber: number): Float32Array {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    for (let i = 0; i < verts.length / 2; i++) {
      let x = verts[i * 2];
      let y = verts[i * 2 + 1];
      x *= data.scaleX;
      y *= data.scaleY;
      verts[i * 2] = cos * x - sin * y + data.positionX;
      verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
      //
      if (data.f_flipH) {
        verts[i * 2] = verts[0] * 2 - verts[i * 2];
      }
      if (data.f_flipV) {
        verts[i * 2 + 1] = verts[1] * 2 - verts[i * 2 + 1];
      }
    }

    if (this.parentIndex[id] >= 0) {
      verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
    }
    return verts;
  }

  /**
   * 親を遡って座標変換する
   * @param {array} pos - 頂点情報配列
   * @param {number} id - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  private TransformPosition(pos: Float32Array, id: number, frameNumber: number): Float32Array {
    // const data = this.ss6project.ssfbReader.GetFrameData(frameNumber)[id];
    const fd = this.getFrameData(frameNumber);
    const data = fd[id];

    pos[4] += -data.rotationZ;
    const rz = (pos[4] * Math.PI) / 180;
    pos[2] *= data.scaleX;
    pos[3] *= data.scaleY;
    pos[0] += data.positionX;
    pos[1] -= data.positionY;

    if (this.parentIndex[id] >= 0) {
      pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
    }
    return pos;
  }

  /**
   * 矩形セルをメッシュ（5verts4Tri）で作成
   * @param {number} id - セルID
   * @return {PIXI.mesh.Mesh} - メッシュ
   */
  private MakeCellMesh(id: number): PIXI.mesh.Mesh {
    const cell = this.project.getCell(id);
    const u1 = cell.u1;
    const u2 = cell.u2;
    const v1 = cell.v1;
    const v2 = cell.v2;
    const w = cell.width / 2;
    const h = cell.height / 2;
    const verts = new Float32Array([0, 0, -w, -h, w, -h, -w, h, w, h]);
    const uvs = new Float32Array([(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]); // ??? why ???

    const cellMap = cell.cellMap;
    const cellMapName = cellMap.name;
    const cellMapResource = this.resources[cellMapName];
    const texture = cellMapResource.texture;

    const mesh = new PIXI.mesh.Mesh(texture, verts, uvs, indices);
    // const mesh = new PIXI.mesh.Mesh(this.ss6project.ssfbReader.resources[cellMapName].texture, verts, uvs, indices);
    mesh.drawMode = 1; // drawMode=0は四角ポリゴン、drawMode=1は三角ポリゴン
    return mesh;
  }

  /**
   * メッシュセルからメッシュを作成
   * @param {number} partID - パーツID
   * @param {number} cellID - セルID
   * @return {PIXI.mesh.Mesh} - メッシュ
   */
  private MakeMeshCellMesh(partID: number, cellID: number): PIXI.mesh.Mesh {
    const meshsDataUvMap = this.currentAnimation.meshsDataUvMap;
    const meshsDataUV = meshsDataUvMap[partID];
    // const meshsDataUV = this.ss6project.ssfbReader.curAnimation.meshsDataUV(partID);
    const uvArray = meshsDataUV.uvArray;
    const uvLength = uvArray.length;
    // const uvLength = meshsDataUV.uvLength();

    if (uvLength > 0) {
      // 先頭の2データはヘッダになる
      const uvs = new Float32Array(uvLength - 2);
      const num = uvArray[1];
      // const num = meshsDataUV.uv(1);

      for (let idx = 2; idx < uvLength; idx++) {
        // uvs[idx - 2] = meshsDataUV.uv(idx);
        uvs[idx - 2] = uvArray[idx];
      }

      const meshsDataIndicesMap = this.currentAnimation.meshsDataIndicesMap;
      const meshsDataIndices = meshsDataIndicesMap[partID];
      // const meshsDataIndices = this.ss6project.ssfbReader.curAnimation.meshsDataIndices(partID);
      const indicesArray = meshsDataIndices.indicesArray;
      const indicesLength = indicesArray.length;
      // const indicesLength = meshsDataIndices.indicesLength();

      // 先頭の1データはヘッダになる
      const indices = new Uint16Array(indicesLength - 1);
      for (let idx = 1; idx < indicesLength; idx++) {
        // indices[idx - 1] = meshsDataIndices.indices(idx);
        indices[idx - 1] = indicesArray[idx];
      }

      const verts = new Float32Array(num * 2); // Zは必要ない？

      const cell = this.project.getCell(cellID);
      const cellMapName = cell.cellMap.name;
      const cellMapResource = this.resources[cellMapName];
      const texture = cellMapResource.texture;
      // const texture = this.ss6project.ssfbReader.resources[cellMapName].texture;
      const mesh = new PIXI.mesh.Mesh(texture, verts, uvs, indices);
      mesh.drawMode = 1; // drawMode=0は四角ポリゴン、drawMode=1は三角ポリゴン
      return mesh;
    }

    return null;
  }

  /**
   * セルをインスタンスで作成
   * @param {String} refname 参照アニメ名
   * @return {SS6Player} - インスタンス
   */
  private MakeCellPlayer(refname: string): SS6Player {
    const ssp = new SS6Player(this.ss6project, () => {
      const split = refname.split('/');
      ssp.Setup(split[0], split[1]);
      ssp.Play();

    });

    return ssp;
  }

  /**
   * 矩形セルメッシュの頂点情報のみ取得
   * @param {number} id - セルID
   * @param {array} data - アニメーションフレームデータ
   * @return {array} - 頂点情報配列
   */
  private static GetVerts(id: number, data: any): Float32Array {
    const w = data.size_X / 2;
    const h = data.size_Y / 2;
    const px = -w * data.pivotX * 2;
    const py = h * data.pivotY * 2;
    const verts = new Float32Array([px, py, px - w, py - h, px + w, py - h, px - w, py + h, px + w, py + h]);
    return verts;
  }

  /**
   * 矩形セルメッシュの頂点情報のみ取得
   * @param {number} id - セルID
   * @param {array} data - アニメーションフレームデータ
   * @return {array} - 頂点情報配列
   */
  private static GetMeshVerts(id: number, data: any): Float32Array {
    // フレームデータからメッシュデータを取得しvertsを作成する
    let verts = new Float32Array(data.meshNum * 2);
    for (let idx = 0; idx < data.meshNum; idx++) {
      verts[idx * 2 + 0] = data.meshDataPoint[idx * 3 + 0];
      verts[idx * 2 + 1] = -data.meshDataPoint[idx * 3 + 1];
    }
    return verts;
  }

  private static GetDummyVerts(): Float32Array {
    let verts = new Float32Array([0, 0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
    return verts;
  }


  // private getFrameData(frameNumber: number) {
  //   const test = this.ss6project.ssfbReader.GetFrameData(frameNumber);
  //   const frame = this.currentAnimation.getFrameData(frameNumber);
  //   return test;
  // }
  private getFrameData(frameNumber: number) {
    const frame = this.currentAnimation.getFrameData(frameNumber);
    // frame.localscaleX = frame.localScaleX;
    return frame;
  }
}
