import * as PIXI from 'pixi.js';
import { ss } from 'ssfblib';
import { SS6Project } from './SS6Project';

export class SS6Player extends PIXI.Container {
  // Properties
  private readonly ss6project: SS6Project;
  private readonly fbObj: ss.ssfb.ProjectData;
  private readonly resources: Partial<Record<string, PIXI.LoaderResource>>;
  private animation: number[] = [];
  private curAnimation: ss.ssfb.AnimationData = null;
  private parts: number = -1;
  private parentIndex: number[] = [];
  private prio2index: any[] = [];
  private userData: any[] = [];
  private frameDataCache: any = {};
  private currentCachedFrameNumber: number = -1;
  private liveFrame: any[] = [];
  private colorMatrixFilterCache: any[] = [];
  private defaultFrameMap: any[] = [];

  private parentAlpha: number = 1.0;

  //
  // cell再利用
  private prevCellID: number[] = []; // 各パーツ（レイヤー）で前回使用したセルID
  private prevMesh: (SS6Player | PIXI.SimpleMesh)[] = [];

  private alphaBlendType: number[] = [];
  private isPlaying: boolean;
  private isPausing: boolean;
  private _startFrame: number;
  private _endFrame: number;
  private _currentFrame: number;
  private nextFrameTime: number;
  private _loops: number;
  private skipEnabled: boolean;
  private updateInterval: number;
  private playDirection: number;
  private pastTime: number;
  private onUserDataCallback: (data: any) => void;
  private playEndCallback: (player: SS6Player) => void;

  public get startFrame(): number {
    return this._startFrame;
  }

  public get endFrame(): number {
    return this.curAnimation.endFrames();
  }

  public get totalFrame(): number {
    return this.curAnimation.totalFrames();
  }

  public get fps(): number {
    return this.curAnimation.fps();
  }

  public get frameNo(): number {
    return this._currentFrame;
  }

  public set loop(loop: number) {
    this._loops = loop;
  }

  public get loop(): number {
    return this._loops;
  }

  /**
   * SS6Player (extends PIXI.Container)
   * @constructor
   * @param {SS6Project} ss6project - SS6Project that contains animations.
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public constructor(ss6project: SS6Project, animePackName: string = null, animeName: string = null) {
    super();

    this.ss6project = ss6project;
    this.fbObj = this.ss6project.fbObj;
    this.resources = this.ss6project.resources;
    this.parentAlpha = 1.0;

    if (animePackName !== null && animeName !== null) {
      this.Setup(animePackName, animeName);
    }

    // Ticker
    this.pastTime = 0;
    PIXI.Ticker.shared.add(this.Update, this);
  }

  /**
   * Setup
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public Setup(animePackName: string, animeName: string): void {
    this.clearCaches();
    const animePacksLength = this.fbObj.animePacksLength();
    for (let i = 0; i < animePacksLength; i++) {
      if (this.fbObj.animePacks(i).name() === animePackName) {
        let j;
        const animationsLength = this.fbObj.animePacks(i).animationsLength();
        for (j = 0; j < animationsLength; j++) {
          if (this.fbObj.animePacks(i).animations(j).name() === animeName) {
            this.animation = [i, j];
            this.curAnimation = this.fbObj.animePacks(this.animation[0]).animations(this.animation[1]);
            break;
          }
        }

        // default data map
        const defaultDataLength = this.curAnimation.defaultDataLength();
        for (let i = 0; i < defaultDataLength; i++) {
          const curDefaultData = this.curAnimation.defaultData(i);
          this.defaultFrameMap[curDefaultData.index()] = curDefaultData;
        }

        // parts
        this.parts = i;
        const partsLength = this.fbObj.animePacks(this.parts).partsLength();
        this.parentIndex = new Array(partsLength);
        // cell再利用
        this.prevCellID = new Array(partsLength);
        this.prevMesh = new Array(partsLength);
        for (j = 0; j < partsLength; j++) {
          const index = this.fbObj.animePacks(this.parts).parts(j).index();
          this.parentIndex[index] = this.fbObj.animePacks(i).parts(j).parentIndex();
          // cell再利用
          this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
          this.prevMesh[index] = null;
        }
      }
    }

    // 各アニメーションステータスを初期化
    this.alphaBlendType = this.GetPartsBlendMode();

    this.isPlaying = false;
    this.isPausing = true;
    this._startFrame = this.curAnimation.startFrames();
    this._endFrame = this.curAnimation.endFrames();
    this._currentFrame = this.curAnimation.startFrames();
    this.nextFrameTime = 0;
    this._loops = -1;
    this.skipEnabled = false;
    this.updateInterval = 1000 / this.curAnimation.fps();
    this.playDirection = 1; // forward
    this.onUserDataCallback = null;
    this.playEndCallback = null;
    this.parentAlpha = 1.0;
  }

  private clearCaches() {
    this.prio2index = [];
    this.userData = [];
    this.frameDataCache = [];
    this.currentCachedFrameNumber = -1;
    this.liveFrame = [];
    this.colorMatrixFilterCache = [];
    this.defaultFrameMap = [];
  }

  /**
   * Update is called PIXI.ticker
   * @param {number} delta - expected 1
   */
  private Update(delta: number): void {
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
            if (this._loops === 0) this.isPlaying = false;
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
            if (this._loops === 0) this.isPlaying = false;
          }
        }
        this.SetFrameAnimation(this._currentFrame);
        if (this.isPlaying) {
          if (this.HaveUserData(this._currentFrame)) {
            if (this.onUserDataCallback !== null) {
              this.onUserDataCallback(this.GetUserData(this._currentFrame));
            }
          }
        }
      }
    } else {
      this.SetFrameAnimation(this._currentFrame);
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
    this.updateInterval = 1000 / (this.curAnimation.fps() * fpsRate * this.playDirection);
    this.skipEnabled = _skipEnabled;
  }

  /**
   * アニメーション再生設定
   * @param {number} _startframe - 開始フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _endframe - 終了フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _loops - ループ回数（ゼロもしくはマイナス設定で無限ループ）
   */
  public SetAnimationSection(_startframe: number = -1, _endframe: number = -1, _loops: number = -1): void {
    if (_startframe >= 0 && _startframe < this.curAnimation.totalFrames()) {
      this._startFrame = _startframe;
    }
    if (_endframe >= 0 && _endframe < this.curAnimation.totalFrames()) {
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
    this.isPlaying = true;
    this.isPausing = false;
    this._currentFrame = this._startFrame;
    this.pastTime = Date.now();

    this.resetLiveFrame();

    this.SetFrameAnimation(this._currentFrame);
    if (this.HaveUserData(this._currentFrame)) {
      if (this.onUserDataCallback !== null) {
        this.onUserDataCallback(this.GetUserData(this._currentFrame));
      }
    }
  }
  /**
   * アニメーション再生を一時停止する
   */
  public Pause(): void {
    this.isPausing = true;
  }

  /**
   * アニメーション再生を再開する
   */
  public Resume(): void {
    this.isPausing = false;
  }

  /**
   * アニメーションを停止する
   * @constructor
   */
  public Stop(): void {
    this.isPlaying = false;
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
   * ユーザーデータの存在チェック
   * @param {number} frameNumber - フレーム番号
   * @return {boolean} - 存在するかどうか
   */
  private HaveUserData(frameNumber: number): boolean {
    if (this.userData[frameNumber] === -1) {
      // データはない
      return false;
    }
    if (this.userData[frameNumber]) {
      // キャッシュされたデータがある
      return true;
    }
    // ユーザーデータ検索する
    for (let k = 0; k < this.curAnimation.userDataLength(); k++) {
      // フレームデータがあるかを調べる
      if (frameNumber === this.curAnimation.userData(k).frameIndex()) {
        // ついでにキャッシュしておく
        this.userData[frameNumber] = this.curAnimation.userData(k);
        return true;
      }
    }
    // データなしにしておく
    this.userData[frameNumber] = -1;
    return false;
  }

  /**
   * ユーザーデータの取得
   * @param {number} frameNumber - フレーム番号
   * @return {array} - ユーザーデータ
   */
  private GetUserData(frameNumber: number): any[] {
    // HaveUserDataでデータのキャッシュするので、ここで確認しておく
    if (this.HaveUserData(this._currentFrame) === false) {
      return;
    }
    const framedata = this.userData[frameNumber]; // キャッシュされたデータを確認する
    const layers = framedata.dataLength();
    let id = 0;
    let data = [];
    for (let i = 0; i < layers; i++) {
      const bit = framedata.data(i).flags();
      const partsID = framedata.data(i).arrayIndex();
      let d_int = null;
      let d_rect_x = null;
      let d_rect_y = null;
      let d_rect_w = null;
      let d_rect_h = null;
      let d_pos_x = null;
      let d_pos_y = null;
      let d_string_length = null;
      let d_string = null;
      if (bit & 1) {
        // int
        d_int = framedata.data(i).data(id, new ss.ssfb.userDataInteger()).integer();
        id++;
      }
      if (bit & 2) {
        // rect
        d_rect_x = framedata.data(i).data(id, new ss.ssfb.userDataRect()).x();
        d_rect_y = framedata.data(i).data(id, new ss.ssfb.userDataRect()).y();
        d_rect_w = framedata.data(i).data(id, new ss.ssfb.userDataRect()).w();
        d_rect_h = framedata.data(i).data(id, new ss.ssfb.userDataRect()).h();
        id++;
      }
      if (bit & 4) {
        // pos
        d_pos_x = framedata.data(i).data(id, new ss.ssfb.userDataPoint()).x();
        d_pos_y = framedata.data(i).data(id, new ss.ssfb.userDataPoint()).y();
        id++;
      }
      if (bit & 8) {
        // string
        d_string_length = framedata.data(i).data(id, new ss.ssfb.userDataString()).length();
        d_string = framedata.data(i).data(id, new ss.ssfb.userDataString()).data();
        id++;
      }
      data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
    }
    return data;
  }

  /**
   * パーツの描画モードを取得する
   * @return {array} - 全パーツの描画モード
   */
  private GetPartsBlendMode(): any[] {
    const l = this.fbObj.animePacks(this.parts).partsLength();
    const ret = [];
    const animePacks = this.fbObj.animePacks(this.parts);
    for (let i = 0; i < l; i++) {
      ret.push(animePacks.parts(i).alphaBlendType());
    }
    return ret;
  }

  private _uint32 = new Uint32Array(1);
  private _float32 = new Float32Array(this._uint32.buffer);
  /**
   * int型からfloat型に変換する
   * @return {floatView[0]} - float型に変換したデータ
   */
  private I2F(i: number): number {
    this._uint32[0] = i;
    return this._float32[0];
  }

  private defaultColorFilter: PIXI.filters.ColorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

  /**
   * １フレーム分のデータを取得する（未設定項目はデフォルト）
   * [注意]現verでは未対応項目があると正常動作しない可能性があります
   * @param {number} frameNumber - フレーム番号
   */
  private GetFrameData(frameNumber: number): any {
    if (this.currentCachedFrameNumber === frameNumber && this.frameDataCache) {
      return this.frameDataCache;
    }
    const layers = this.curAnimation.defaultDataLength();
    let frameData = new Array(layers);
    this.prio2index = new Array(layers);
    const curFrameData = this.curAnimation.frameData(frameNumber);
    for (let i = 0; i < layers; i++) {
      const curPartState = curFrameData.states(i);
      const index = curPartState.index();
      let f1 = curPartState.flag1();
      let f2 = curPartState.flag2();
      let blendType = -1;
      let fd = this.GetDefaultDataByIndex(index);
      // データにフラグを追加する
      fd.flag1 = f1;
      fd.flag2 = f2;

      let id = 0;
      if (f1 & ss.ssfb.PART_FLAG.INVISIBLE) fd.f_hide = true;
      if (f1 & ss.ssfb.PART_FLAG.FLIP_H) fd.f_flipH = true;
      if (f1 & ss.ssfb.PART_FLAG.FLIP_V) fd.f_flipV = true;
      if (f1 & ss.ssfb.PART_FLAG.CELL_INDEX) fd.cellIndex = curPartState.data(id++); // 8 Cell ID
      if (f1 & ss.ssfb.PART_FLAG.POSITION_X) fd.positionX = this.I2F(curPartState.data(id++));
      if (f1 & ss.ssfb.PART_FLAG.POSITION_Y) fd.positionY = this.I2F(curPartState.data(id++));
      if (f1 & ss.ssfb.PART_FLAG.POSITION_Z) id++; // 64
      if (f1 & ss.ssfb.PART_FLAG.PIVOT_X) fd.pivotX = this.I2F(curPartState.data(id++)); // 128 Pivot Offset X
      if (f1 & ss.ssfb.PART_FLAG.PIVOT_Y) fd.pivotY = this.I2F(curPartState.data(id++)); // 256 Pivot Offset Y
      if (f1 & ss.ssfb.PART_FLAG.ROTATIONX) id++; // 512
      if (f1 & ss.ssfb.PART_FLAG.ROTATIONY) id++; // 1024
      if (f1 & ss.ssfb.PART_FLAG.ROTATIONZ) fd.rotationZ = this.I2F(curPartState.data(id++)); // 2048
      if (f1 & ss.ssfb.PART_FLAG.SCALE_X) fd.scaleX = this.I2F(curPartState.data(id++)); // 4096
      if (f1 & ss.ssfb.PART_FLAG.SCALE_Y) fd.scaleY = this.I2F(curPartState.data(id++)); // 8192
      if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_X) fd.localscaleX = this.I2F(curPartState.data(id++)); // 16384
      if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_Y) fd.localscaleY = this.I2F(curPartState.data(id++)); // 32768
      if (f1 & ss.ssfb.PART_FLAG.OPACITY) fd.opacity = curPartState.data(id++); // 65536
      if (f1 & ss.ssfb.PART_FLAG.LOCALOPACITY) fd.localopacity = curPartState.data(id++); // 131072
      if (f1 & ss.ssfb.PART_FLAG.SIZE_X) fd.size_X = this.I2F(curPartState.data(id++)); // 1048576 Size X [1]
      if (f1 & ss.ssfb.PART_FLAG.SIZE_Y) fd.size_Y = this.I2F(curPartState.data(id++)); // 2097152 Size Y [1]
      if (f1 & ss.ssfb.PART_FLAG.U_MOVE) fd.uv_move_X = this.I2F(curPartState.data(id++)); // 4194304 UV Move X
      if (f1 & ss.ssfb.PART_FLAG.V_MOVE) fd.uv_move_Y = this.I2F(curPartState.data(id++)); // 8388608 UV Move Y
      if (f1 & ss.ssfb.PART_FLAG.UV_ROTATION) fd.uv_rotation = this.I2F(curPartState.data(id++)); // 16777216 UV Rotation
      if (f1 & ss.ssfb.PART_FLAG.U_SCALE) fd.uv_scale_X = this.I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
      if (f1 & ss.ssfb.PART_FLAG.V_SCALE) fd.uv_scale_Y = this.I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
      if (f1 & ss.ssfb.PART_FLAG.BOUNDINGRADIUS) id++; // 134217728 boundingRadius
      if (f1 & ss.ssfb.PART_FLAG.MASK) fd.masklimen = curPartState.data(id++); // 268435456 masklimen
      if (f1 & ss.ssfb.PART_FLAG.PRIORITY) fd.priority = curPartState.data(id++); // 536870912 priority
      //
      if (f1 & ss.ssfb.PART_FLAG.INSTANCE_KEYFRAME) {
        // 1073741824 instance keyframe
        fd.instanceValue_curKeyframe = curPartState.data(id++);
        fd.instanceValue_startFrame = curPartState.data(id++);
        fd.instanceValue_endFrame = curPartState.data(id++);
        fd.instanceValue_loopNum = curPartState.data(id++);
        fd.instanceValue_speed = this.I2F(curPartState.data(id++));
        fd.instanceValue_loopflag = curPartState.data(id++);
      }
      if (f1 & ss.ssfb.PART_FLAG.EFFECT_KEYFRAME) {
        // 2147483648 effect keyframe
        fd.effectValue_curKeyframe = curPartState.data(id++);
        fd.effectValue_startTime = curPartState.data(id++);
        fd.effectValue_speed = this.I2F(curPartState.data(id++));
        fd.effectValue_loopflag = curPartState.data(id++);
      }
      if (f1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
        // 524288 verts [4]
        // verts
        fd.f_mesh = true;
        const f = (fd.i_transformVerts = curPartState.data(id++));
        if (f & 1) {
          fd.u00 = this.I2F(curPartState.data(id++));
          fd.v00 = this.I2F(curPartState.data(id++));
        }
        if (f & 2) {
          fd.u01 = this.I2F(curPartState.data(id++));
          fd.v01 = this.I2F(curPartState.data(id++));
        }
        if (f & 4) {
          fd.u10 = this.I2F(curPartState.data(id++));
          fd.v10 = this.I2F(curPartState.data(id++));
        }
        if (f & 8) {
          fd.u11 = this.I2F(curPartState.data(id++));
          fd.v11 = this.I2F(curPartState.data(id++));
        }
      }

      if (f1 & ss.ssfb.PART_FLAG.PARTS_COLOR) {
        // 262144 parts color [3]
        const f = curPartState.data(id++);
        blendType = f & 0xff;
        // 小西 - パーツカラーが乗算合成ならフィルタを使わないように
        fd.useColorMatrix = blendType !== 1;
        // [replaced]//fd.useColorMatrix = true;
        if (f & 0x1000) {
          // one color
          // 小西 - プロパティを一時退避
          const rate = this.I2F(curPartState.data(id++));
          const bf = curPartState.data(id++);
          const bf2 = curPartState.data(id++);
          const argb32 = (bf << 16) | bf2;

          // 小西 - パーツカラーが乗算合成ならtintで処理
          fd.partsColorARGB = argb32 >>> 0;
          if (blendType === 1) {
            fd.tint = argb32 & 0xffffff;
          } else {
            // 小西 - パーツカラーが乗算合成じゃないならフィルタで処理
            fd.colorMatrix = this.GetColorMatrixFilter(blendType, rate, argb32);
          }
        }

        if (f & 0x0800) {
          // LT color
          id++;
          id++;
          id++;
          fd.colorMatrix = this.defaultColorFilter; // TODO
        }
        if (f & 0x0400) {
          // RT color
          id++;
          id++;
          id++;
          fd.colorMatrix = this.defaultColorFilter; // TODO
        }
        if (f & 0x0200) {
          // LB color
          id++;
          id++;
          id++;
          fd.colorMatrix = this.defaultColorFilter; // TODO
        }
        if (f & 0x0100) {
          // RB color
          id++;
          id++;
          id++;
          fd.colorMatrix = this.defaultColorFilter; // TODO
        }
      }
      if (f2 & ss.ssfb.PART_FLAG2.MESHDATA) {
        // mesh [1]
        fd.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
        fd.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
        let mp = new Float32Array(fd.meshNum * 3);

        for (let idx = 0; idx < fd.meshNum; idx++) {
          const mx = this.I2F(curPartState.data(id++));
          const my = this.I2F(curPartState.data(id++));
          const mz = this.I2F(curPartState.data(id++));
          mp[idx * 3 + 0] = mx;
          mp[idx * 3 + 1] = my;
          mp[idx * 3 + 2] = mz;

        }
        fd.meshDataPoint = mp;
      }

      frameData[index] = fd;
      this.prio2index[i] = index;

      // NULLパーツにダミーのセルIDを設定する
      if (
        this.fbObj.animePacks(this.parts).parts(index).type() === 0
      ) {
        frameData[index].cellIndex = -2;
      }
    }
    this.frameDataCache = frameData;
    this.currentCachedFrameNumber = frameNumber;
    return frameData;
  }

  /**
   * パーツカラーのブレンド用カラーマトリクス
   * @param {number} blendType - ブレンド方法（0:mix, 1:multiply, 2:add, 3:sub)
   * @param {number} rate - ミックス時の混色レート
   * @param {number} argb32 - パーツカラー（単色）
   * @return {PIXI.filters.ColorMatrixFilter} - カラーマトリクス
   */
  private GetColorMatrixFilter(blendType: number, rate: number, argb32: number): PIXI.filters.ColorMatrixFilter {
    const key: string = blendType.toString() + '_' + rate.toString() + '_' + argb32.toString();
    if (this.colorMatrixFilterCache[key]) return this.colorMatrixFilterCache[key];

    const colorMatrix = new PIXI.filters.ColorMatrixFilter();
    const ca = ((argb32 & 0xff000000) >>> 24) / 255;
    const cr = ((argb32 & 0x00ff0000) >>> 16) / 255;
    const cg = ((argb32 & 0x0000ff00) >>> 8) / 255;
    const cb = (argb32 & 0x000000ff) / 255;
    // Mix
    if (blendType === 0) {
      const rate_i = 1 - rate;

      colorMatrix.matrix = [
        rate_i, 0, 0, 0, cr * rate,
        0, rate_i, 0, 0, cg * rate,
        0, 0, rate_i, 0, cb * rate,
        0, 0, 0, 1, 0
      ];
    } else if (blendType === 1) {
      // Multiply
      colorMatrix.matrix = [
        cr, 0, 0, 0, 0,
        0, cg, 0, 0, 0,
        0, 0, cb, 0, 0,
        0, 0, 0, ca, 0
      ];
    } else if (blendType === 2) {
      // Add
      colorMatrix.matrix = [
        1, 0, 0, 0, cr,
        0, 1, 0, 0, cg,
        0, 0, 1, 0, cb,
        0, 0, 0, ca, 0
      ];
    } else if (blendType === 3) {
      // Sub
      colorMatrix.matrix = [
        1, 0, 0, 0, -cr,
        0, 1, 0, 0, -cg,
        0, 0, 1, 0, -cb,
        0, 0, 0, ca, 0
      ];
    }
    this.colorMatrixFilterCache[key] = colorMatrix;
    return colorMatrix;
  }

  /**
   * デフォルトデータを取得する
   * @param {number} id - パーツ（レイヤー）ID
   * @return {array} - データ
   */
  private GetDefaultDataByIndex(id: number): any {
    const curDefaultData = this.defaultFrameMap[id];
    let data = {
      index: curDefaultData.index(),
      lowflag: curDefaultData.lowflag(),
      highflag: curDefaultData.highflag(),
      priority: curDefaultData.priority(),
      cellIndex: curDefaultData.cellIndex(),
      opacity: curDefaultData.opacity(),
      localopacity: curDefaultData.localopacity(),
      masklimen: curDefaultData.masklimen(),
      positionX: curDefaultData.positionX(),
      positionY: curDefaultData.positionY(),
      pivotX: curDefaultData.pivotX(),
      pivotY: curDefaultData.pivotY(),
      rotationX: curDefaultData.rotationX(),
      rotationY: curDefaultData.rotationY(),
      rotationZ: curDefaultData.rotationZ(),
      scaleX: curDefaultData.scaleX(),
      scaleY: curDefaultData.scaleY(),
      localscaleX: curDefaultData.localscaleX(),
      localscaleY: curDefaultData.localscaleY(),
      size_X: curDefaultData.sizeX(),
      size_Y: curDefaultData.sizeY(),
      uv_move_X: curDefaultData.uvMoveX(),
      uv_move_Y: curDefaultData.uvMoveY(),
      uv_rotation: curDefaultData.uvRotation(),
      uv_scale_X: curDefaultData.uvScaleX(),
      uv_scale_Y: curDefaultData.uvScaleY(),
      boundingRadius: curDefaultData.boundingRadius(),
      instanceValue_curKeyframe: curDefaultData.instanceValueCurKeyframe(),
      instanceValue_endFrame: curDefaultData.instanceValueEndFrame(),
      instanceValue_startFrame: curDefaultData.instanceValueStartFrame(),
      instanceValue_loopNum: curDefaultData.instanceValueLoopNum(),
      instanceValue_speed: curDefaultData.instanceValueSpeed(),
      instanceValue_loopflag: curDefaultData.instanceValueLoopflag(),
      effectValue_curKeyframe: curDefaultData.effectValueCurKeyframe(),
      effectValue_startTime: curDefaultData.effectValueStartTime(),
      effectValue_speed: curDefaultData.effectValueSpeed(),
      effectValue_loopflag: curDefaultData.effectValueLoopflag(),

      // Add visiblity
      f_hide: false,
      // Add flip
      f_flipH: false,
      f_flipV: false,
      // Add mesh
      f_mesh: false,
      // Add vert data
      i_transformVerts: 0,
      u00: 0,
      v00: 0,
      u01: 0,
      v01: 0,
      u10: 0,
      v10: 0,
      u11: 0,
      v11: 0,
      //
      useColorMatrix: false,
      colorMatrix: null,
      //
      meshIsBind: 0,
      meshNum: 0,
      meshDataPoint: 0,
      //
      flag1: 0,
      flag2: 0,

      partsColorARGB: 0
    };

    return data;
  }

  /**
   * １フレーム分のアニメーション描画
   * @param {number} frameNumber - フレーム番号
   */
  private SetFrameAnimation(frameNumber: number): void {
    const fd = this.GetFrameData(frameNumber);
    this.removeChildren();

    // 優先度順パーツ単位ループ
    const l = fd.length;
    for (let ii = 0; ii < l; ii = (ii + 1) | 0) {
      // 優先度に変換
      const i = this.prio2index[ii];

      const data = fd[i];
      const cellID = data.cellIndex;

      // cell再利用
      let mesh: any = this.prevMesh[i];

      const part: ss.ssfb.PartData = this.fbObj.animePacks(this.parts).parts(i);
      const partType = part.type();
      const partName = part.name();

      // 処理分岐処理
      switch (partType) {
        case ss.ssfb.SsPartType.Instance:
          if (mesh == null) {
            mesh = this.MakeCellPlayer(part.refname());
            mesh.name = partName;
          }
          break;
        case ss.ssfb.SsPartType.Normal:
        case ss.ssfb.SsPartType.Mask:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
            mesh.name = partName;
          }
          break;
        case ss.ssfb.SsPartType.Mesh:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
            mesh.name = partName;
          }
          break;
        case ss.ssfb.SsPartType.Nulltype:
        case ss.ssfb.SsPartType.Joint:
          if (this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = new PIXI.Container();
            mesh.name = partName;
          }
          break;
        default:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            // 小西 - デストロイ処理
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
            mesh.name = partName;
          }
          break;
      }

      // 初期化が行われなかった場合(あるの？)
      if (mesh == null) continue;

      this.prevCellID[i] = cellID;
      this.prevMesh[i] = mesh;

      // 描画関係処理
      switch (partType) {
        case ss.ssfb.SsPartType.Instance: {
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
            const delta = this.updateInterval * (1.0 / this.curAnimation.fps());

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
          break;
        }
        //  Instance以外の通常のMeshと空のContainerで処理分岐
        case ss.ssfb.SsPartType.Normal:
        case ss.ssfb.SsPartType.Mesh:
        case ss.ssfb.SsPartType.Joint:
        case ss.ssfb.SsPartType.Mask: {
          let verts: Float32Array;
          if (partType === ss.ssfb.SsPartType.Mesh) {
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
          if (data.flag1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
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
          if (data.flag1 & ss.ssfb.PART_FLAG.U_MOVE || data.flag1 & ss.ssfb.PART_FLAG.V_MOVE || data.flag1 & ss.ssfb.PART_FLAG.U_SCALE || data.flag1 & ss.ssfb.PART_FLAG.V_SCALE || data.flag1 & ss.ssfb.PART_FLAG.UV_ROTATION) {
            // uv X/Y移動
            const u1 = this.fbObj.cells(cellID).u1() + data.uv_move_X;
            const u2 = this.fbObj.cells(cellID).u2() + data.uv_move_X;
            const v1 = this.fbObj.cells(cellID).v1() + data.uv_move_Y;
            const v2 = this.fbObj.cells(cellID).v2() + data.uv_move_Y;

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

            if (data.flag1 & ss.ssfb.PART_FLAG.UV_ROTATION) {
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

          //
          if (partType === ss.ssfb.SsPartType.Mesh && data.meshIsBind !== 0) {
            mesh.position.set(px, py);
          } else {
            const pivot = this.GetPivot(verts, cellID);
            mesh.position.set(px + pivot.x, py + pivot.y);
          }
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

          if (partType !== ss.ssfb.SsPartType.Mask) this.addChild(mesh);
          break;
        }
        case ss.ssfb.SsPartType.Nulltype: {
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
  }

  /**
   * 矩形セルの中心(0,1)から、X軸方向：右下(4,5)-左下(2,3)、Y軸方向：左上（6,7）-左下(2,3)の座標系でpivot分ずらした座標
   * @param {array} verts - 頂点情報配列
   * @param {number} cellID - セルID
   * @return {PIXI.Point} - 座標
   */
  private GetPivot(verts: Float32Array, cellID: number): PIXI.Point {
    const cell = this.fbObj.cells(cellID);
    const px = cell.pivotX();
    const py = cell.pivotY();

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
    const data = this.GetFrameData(frameNumber)[id];
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
    const data = this.GetFrameData(frameNumber)[id];

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
      x *= data.scaleX * data.localscaleX;
      y *= data.scaleY * data.localscaleY;
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
    const data = this.GetFrameData(frameNumber)[id];

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    for (let i = 0; i < verts.length / 2; i++) {
      let x = verts[i * 2]; // * (data.size_X | 1);
      let y = verts[i * 2 + 1]; // * (data.size_Y | 1);
      x *= data.scaleX * data.localscaleX;
      y *= data.scaleY * data.localscaleY;
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
    const data = this.GetFrameData(frameNumber)[id];

    pos[4] += -data.rotationZ;

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    const x = pos[0];// * (data.size_X | 1);
    const y = pos[1];// * (data.size_Y | 1);

    pos[2] *= data.scaleX;
    pos[3] *= data.scaleY;
    pos[0] = (cos * x - sin * y) + data.positionX;
    pos[1] = (sin * x + cos * y) - data.positionY;

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
    const data = this.GetFrameData(frameNumber)[id];

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
    const data = this.GetFrameData(frameNumber)[id];

    pos[4] += -data.rotationZ;
    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    const x = pos[0];
    const y = pos[1];

    pos[2] *= data.scaleX;
    pos[3] *= data.scaleY;
    pos[0] = (cos * x - sin * y) + data.positionX;
    pos[1] = (sin * x + cos * y) - data.positionY;

    if (this.parentIndex[id] >= 0) {
      pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
    }

    return pos;
  }

  /**
   * 矩形セルをメッシュ（5verts4Tri）で作成
   * @param {number} id - セルID
   * @return {PIXI.SimpleMesh} - メッシュ
   */
  private MakeCellMesh(id: number): PIXI.SimpleMesh {
    const cell = this.fbObj.cells(id);
    const u1 = cell.u1();
    const u2 = cell.u2();
    const v1 = cell.v1();
    const v2 = cell.v2();
    const w = cell.width() / 2;
    const h = cell.height() / 2;
    const verts = new Float32Array([0, 0, -w, -h, w, -h, -w, h, w, h]);
    const uvs = new Float32Array([(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]); // ??? why ???
    const mesh = new PIXI.SimpleMesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices);
    mesh.drawMode = PIXI.DRAW_MODES.TRIANGLES;
    return mesh;
  }

  /**
   * メッシュセルからメッシュを作成
   * @param {number} partID - パーツID
   * @param {number} cellID - セルID
   * @return {PIXI.SimpleMesh} - メッシュ
   */
  private MakeMeshCellMesh(partID: number, cellID: number): PIXI.SimpleMesh {
    const meshsDataUV = this.curAnimation.meshsDataUV(partID);
    const uvLength = meshsDataUV.uvLength();

    if (uvLength > 0) {
      // 先頭の2データはヘッダになる
      const uvs = new Float32Array(uvLength - 2);
      const num = meshsDataUV.uv(1);

      for (let idx = 2; idx < uvLength; idx++) {
        uvs[idx - 2] = meshsDataUV.uv(idx);
      }

      const meshsDataIndices = this.curAnimation.meshsDataIndices(partID);
      const indicesLength = meshsDataIndices.indicesLength();

      // 先頭の1データはヘッダになる
      const indices = new Uint16Array(indicesLength - 1);
      for (let idx = 1; idx < indicesLength; idx++) {
        indices[idx - 1] = meshsDataIndices.indices(idx);
      }

      const verts = new Float32Array(num * 2); // Zは必要ない？

      const mesh = new PIXI.SimpleMesh(this.resources[this.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices);
      mesh.drawMode = PIXI.DRAW_MODES.TRIANGLES;
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
    const split = refname.split('/');
    const ssp = new SS6Player(this.ss6project);
    ssp.Setup(split[0], split[1]);
    ssp.Play();

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

  private resetLiveFrame() {
    const layers = this.curAnimation.defaultDataLength();
    for (let i = 0; i < layers; i++) {
      this.liveFrame[i] = 0;
    }
  }
}
