import { LoaderResource } from '@pixi/loaders';
import { Container } from '@pixi/display';
import { SimpleMesh } from '@pixi/mesh-extras';
import { Ticker } from '@pixi/ticker';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import { Filter } from '@pixi/core';
import { BLEND_MODES, DRAW_MODES } from '@pixi/constants';

import { Player, AnimePackData, PART_FLAG, PartData, SsPartType } from 'ss6player-lib';
import { SS6Project } from './SS6Project';

import { SS6PlayerInstanceKeyParam } from './SS6PlayerInstanceKeyParam';

export class SS6Player extends Container {
  protected playerLib: Player;

  // Properties
  private readonly ss6project: SS6Project;
  private readonly resources: Partial<Record<string, LoaderResource>>;
  private liveFrame: any[] = [];
  private colorMatrixFilterCache: any[] = [];

  private parentAlpha: number = 1.0;

  //
  // cell再利用
  private prevCellID: number[] = []; // 各パーツ（レイヤー）で前回使用したセルID
  private prevMesh: (SS6Player | SimpleMesh)[] = [];

  // for change instance
  private substituteOverWrite: boolean[] = [];
  private substituteKeyParam: SS6PlayerInstanceKeyParam[] = [];

  private alphaBlendType: BLEND_MODES[] = [];
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
  protected playEndCallback: (player: SS6Player) => void;

  public get startFrame(): number {
    return this._startFrame;
  }

  public get endFrame(): number {
    return this._endFrame;
  }

  public get totalFrame(): number {
    return this.playerLib.animationData.totalFrames();
  }

  public get fps(): number {
    return this.playerLib.animationData.fps();
  }

  public get frameNo(): number {
    return Math.floor(this._currentFrame);
  }

  public set loop(loop: number) {
    this._loops = loop;
  }

  public get loop(): number {
    return this._loops;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get isPausing(): boolean {
    return this._isPausing;
  }

  public get animePackName(): string {
    return this.playerLib.animePackName;
  }

  public get animeName(): string {
    return this.playerLib.animeName;
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
    this.playerLib = new Player(ss6project.fbObj, animePackName, animeName);
    this.resources = this.ss6project.resources;
    this.parentAlpha = 1.0;

    if (animePackName !== null && animeName !== null) {
      this.Setup(animePackName, animeName);
    }

    // Ticker
    this.on('added', (...args: Array<any>) => {
      Ticker.shared.add(this.Update, this);
    }, this);
    this.on('removed', (...args: Array<any>) => {
      Ticker.shared.remove(this.Update, this);
    }, this);
  }

  /**
   * Setup
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public Setup(animePackName: string, animeName: string): void {
    this.playerLib.Setup(animePackName, animeName);

    this.clearCaches();

    const animePackData: AnimePackData = this.playerLib.animePackData;
    const partsLength = animePackData.partsLength();

    // cell再利用
    this.prevCellID = new Array(partsLength);
    this.prevMesh = new Array(partsLength);
    this.substituteOverWrite = new Array(partsLength);
    this.substituteKeyParam = new Array(partsLength);

    for (let j = 0; j < partsLength; j++) {
      const index = animePackData.parts(j).index();

      // cell再利用
      this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
      this.prevMesh[index] = null;
      this.substituteOverWrite[index] = null;
      this.substituteKeyParam[index] = null;
    }

    // 各アニメーションステータスを初期化
    this.alphaBlendType = this.GetPartsBlendMode();

    this._isPlaying = false;
    this._isPausing = true;
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

  protected Update(delta: number): void {
    this.UpdateInternal(delta);
  }

  /**
   * Update is called PIXI.ticker
   * @param {number} delta - expected 1
   */
  protected UpdateInternal(delta: number, rewindAfterReachingEndFrame: boolean = true): void {
    const elapsedTime = Ticker.shared.elapsedMS;
    const toNextFrame = this._isPlaying && !this._isPausing;
    if (toNextFrame && this.updateInterval !== 0) {
      this.nextFrameTime += elapsedTime; // もっとうまいやり方がありそうなんだけど…
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
    this.updateInterval = 1000 / (this.playerLib.animationData.fps() * fpsRate * this.playDirection);
    this.skipEnabled = _skipEnabled;
  }

  /**
   * アニメーション再生設定
   * @param {number} _startframe - 開始フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _endframe - 終了フレーム番号（マイナス設定でデフォルト値を変更しない）
   * @param {number} _loops - ループ回数（ゼロもしくはマイナス設定で無限ループ）
   */
  public SetAnimationSection(_startframe: number = -1, _endframe: number = -1, _loops: number = -1): void {
    if (_startframe >= 0 && _startframe < this.playerLib.animationData.totalFrames()) {
      this._startFrame = _startframe;
    }
    if (_endframe >= 0 && _endframe < this.playerLib.animationData.totalFrames()) {
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
  public Play();
  // tslint:disable-next-line:unified-signatures
  public Play(frameNo: number);
  public Play(frameNo?: number): void {
    this._isPlaying = true;
    this._isPausing = false;

    let currentFrame: number = this.playDirection > 0 ? this._startFrame : this._endFrame;
    if (frameNo && typeof frameNo === 'number') {
      currentFrame = frameNo;
    }
    this._currentFrame = currentFrame;

    this.resetLiveFrame();

    const currentFrameNo = Math.floor(this._currentFrame);
    this.SetFrameAnimation(currentFrameNo);
    if (this.playerLib.HaveUserData(currentFrameNo)) {
      if (this.onUserDataCallback !== null) {
        this.onUserDataCallback(this.playerLib.GetUserData(currentFrameNo));
      }
    }
  }

  /**
   * アニメーション再生を一時停止する
   */
  public Pause(): void {
    this._isPausing = true;
  }

  /**
   * アニメーション再生を再開する
   */
  public Resume(): void {
    this._isPausing = false;
  }

  /**
   * アニメーションを停止する
   * @constructor
   */
  public Stop(): void {
    this._isPlaying = false;
  }

  /**
   * アニメーション再生を位置（フレーム）を設定する
   */
  public SetFrame(frame: number): void {
    this._currentFrame = frame;
  }

  public NextFrame() {
    const currentFrame = Math.floor(this._currentFrame);
    const endFrame = this.endFrame;
    if (currentFrame === endFrame) {
      return;
    }
    this.SetFrame(currentFrame + 1);
  }

  public PrevFrame() {
    const currentFrame = Math.floor(this._currentFrame);
    if (currentFrame === 0) {
      return;
    }
    this.SetFrame(currentFrame - 1);
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
   * パーツの描画モードを取得する
   * @return {array} - 全パーツの描画モード
   */
  private GetPartsBlendMode(): BLEND_MODES[] {
    const animePacks: AnimePackData = this.playerLib.animePackData;
    const l = animePacks.partsLength();
    let ret = [];
    for (let i = 0; i < l; i++) {
      const alphaBlendType: number = animePacks.parts(i).alphaBlendType();
      let blendMode: BLEND_MODES;
      switch (alphaBlendType) {
        case 0:
          blendMode = BLEND_MODES.NORMAL;
          break;
        case 1:
          blendMode = BLEND_MODES.MULTIPLY; // not supported 不透明度が利いてしまう。
          break;
        case 2:
          blendMode = BLEND_MODES.ADD;
          break;
        case 3:
          blendMode = BLEND_MODES.NORMAL; // WebGL does not supported "SUB"
          break;
        case 4:
          blendMode = BLEND_MODES.MULTIPLY; // WebGL does not supported "alpha multiply"
          break;
        case 5:
          blendMode = BLEND_MODES.SCREEN; // not supported 不透明度が利いてしまう。
          break;
        case 6:
          blendMode = BLEND_MODES.EXCLUSION; // WebGL not supported "Exclusion"
          break;
        case 7:
          blendMode = BLEND_MODES.NORMAL; // WebGL not supported "reverse"
          break;
        default:
          blendMode = BLEND_MODES.NORMAL; // WebGL not supported "SUB"
          break;
      }
      ret.push(blendMode);
    }
    return ret;
  }

  private defaultColorFilter: Filter = new ColorMatrixFilter();

  /**
   * パーツカラーのブレンド用カラーマトリクス
   * @param {number} blendType - ブレンド方法（0:mix, 1:multiply, 2:add, 3:sub)
   * @param {number} rate - ミックス時の混色レート
   * @param {number} argb32 - パーツカラー（単色）
   * @return {PIXI.filters.ColorMatrixFilter} - カラーマトリクス
   */
  private GetColorMatrixFilter(blendType: number, rate: number, argb32: number): Filter {
    const key: string = blendType.toString() + '_' + rate.toString() + '_' + argb32.toString();
    if (this.colorMatrixFilterCache[key]) return this.colorMatrixFilterCache[key];

    const colorMatrix = new ColorMatrixFilter();
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

  private _instancePos: Float32Array = new Float32Array(5);
  private _CoordinateGetDiagonalIntersectionVec2: Float32Array = new Float32Array(2);

  /**
   * １フレーム分のアニメーション描画
   * @param {number} frameNumber - フレーム番号
   * @param {number} ds - delta step
   */
  protected SetFrameAnimation(frameNumber: number, ds: number = 0.0): void {
    const fd = this.playerLib.GetFrameData(frameNumber);
    this.removeChildren();

    // 優先度順パーツ単位ループ
    const l = fd.length;
    for (let ii = 0; ii < l; ii = (ii + 1) | 0) {
      // 優先度に変換
      const i = this.playerLib.prio2index[ii];

      const data = fd[i];
      const cellID = data.cellIndex;

      // cell再利用
      let mesh: any = this.prevMesh[i];
      const part: PartData = this.playerLib.animePackData.parts(i);
      const partType = part.type();
      let overWrite: boolean = (this.substituteOverWrite[i] !== null) ? this.substituteOverWrite[i] : false;
      let overWritekeyParam: SS6PlayerInstanceKeyParam = this.substituteKeyParam[i];

      // 処理分岐処理
      switch (partType) {
        case SsPartType.Instance:
          if (mesh == null) {
            mesh = this.MakeCellPlayer(part.refname());
            mesh.name = part.name();
          }
          break;
        case SsPartType.Normal:
        case SsPartType.Mask:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
            mesh.name = part.name();
          }
          break;
        case SsPartType.Mesh:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
            mesh.name = part.name();
          }
          break;
        case SsPartType.Nulltype:
        case SsPartType.Joint:
          if (this.prevCellID[i] !== cellID) {
            if (mesh != null) mesh.destroy();
            mesh = new Container();
            mesh.name = part.name();
          }
          break;
        default:
          if (cellID >= 0 && this.prevCellID[i] !== cellID) {
            // 小西 - デストロイ処理
            if (mesh != null) mesh.destroy();
            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
            mesh.name = part.name();
          }
          break;
      }

      // 初期化が行われなかった場合(あるの？)
      if (mesh == null) continue;

      this.prevCellID[i] = cellID;
      this.prevMesh[i] = mesh;

      // 描画関係処理
      switch (partType) {
        case SsPartType.Instance: {
          // インスタンスパーツのアップデート
          // let pos = new Float32Array(5);
          this._instancePos[0] = 0; // pos x
          this._instancePos[1] = 0; // pos x
          this._instancePos[2] = 1; // scale x
          this._instancePos[3] = 1; // scale x
          this._instancePos[4] = 0; // rot
          this._instancePos = this.playerLib.TransformPositionLocal(this._instancePos, data.index, frameNumber);

          mesh.rotation = (this._instancePos[4] * Math.PI) / 180;
          mesh.position.set(this._instancePos[0], this._instancePos[1]);
          mesh.scale.set(this._instancePos[2], this._instancePos[3]);

          let opacity = data.opacity / 255.0; // fdには継承後の不透明度が反映されているのでそのまま使用する
          if (data.localopacity < 255) {
            // ローカル不透明度が使われている場合は255以下の値になるので、255以下の場合にローカル不透明度で上書き
            opacity = data.localopacity / 255.0;
          }
          mesh.SetAlpha(opacity * this.parentAlpha);
          mesh.visible = !data.f_hide;

          // 描画
          let refKeyframe = data.instanceValue_curKeyframe;
          let refStartframe = data.instanceValue_startFrame;
          let refEndframe = data.instanceValue_endFrame;
          let refSpeed = data.instanceValue_speed;
          let refloopNum = data.instanceValue_loopNum;
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

          // インスタンスパラメータを上書きする
          if (overWrite) {
            refStartframe = overWritekeyParam.refStartframe;
            refEndframe = overWritekeyParam.refEndframe;
            refSpeed = overWritekeyParam.refSpeed;
            refloopNum = overWritekeyParam.refloopNum;
            infinity = overWritekeyParam.infinity;
            reverse = overWritekeyParam.reverse;
            pingpong = overWritekeyParam.pingpong;
            independent = overWritekeyParam.independent;
          }

          if (mesh._startFrame !== refStartframe || mesh._endFrame !== refEndframe) {
            mesh.SetAnimationSection(refStartframe, refEndframe);
          }

          // タイムライン上の時間 （絶対時間）
          let time = frameNumber;

          // 独立動作の場合
          if (independent === true) {
            this.liveFrame[ii] += ds;
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

          if (this.playDirection <= -1) {
            reverse = !reverse;
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
          // mesh.Pause();
          this.addChild(mesh);
          break;
        }
        //  Instance以外の通常のMeshと空のContainerで処理分岐
        case SsPartType.Normal:
        case SsPartType.Mesh:
        case SsPartType.Joint:
        case SsPartType.Mask: {
          const cell = this.playerLib.fbObj.cells(cellID);
          let verts: Float32Array;
          if (partType === SsPartType.Mesh) {
            // ボーンとのバインドの有無によって、TRSの継承行うかが決まる。
            if (data.meshIsBind === 0) {
              // バインドがない場合は親からのTRSを継承する
              verts = this.playerLib.TransformMeshVertsLocal(Player.GetMeshVerts(cell, data, mesh.vertices), data.index, frameNumber);
            } else {
              // バインドがある場合は変形後の結果が出力されているので、そのままの値を使用する
              verts = Player.GetMeshVerts(cell, data, mesh.vertices);
            }
          } else {
            verts = (partType === SsPartType.Joint) ? new Float32Array(10) /* dummy */ : mesh.vertices;
            verts = this.playerLib.TransformVertsLocal(Player.GetVerts(cell, data, verts), data.index, frameNumber);
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

            const vec2 = Player.CoordinateGetDiagonalIntersection(verts[0], verts[1], CoordinateLURUx, CoordinateLURUy, CoordinateRURDx, CoordinateRURDy, CoordinateLULDx, CoordinateLULDy, CoordinateLDRDx, CoordinateLDRDy, this._CoordinateGetDiagonalIntersectionVec2);
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
            const u1 = cell.u1() + data.uv_move_X;
            const u2 = cell.u2() + data.uv_move_X;
            const v1 = cell.v1() + data.uv_move_Y;
            const v2 = cell.v2() + data.uv_move_Y;

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

          //
          mesh.position.set(px, py);

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
            // 小西 - パーツカラーが乗算合成じゃないならフィルタで処理
            const colorMatrix: Filter = this.GetColorMatrixFilter(data.colorBlendType, data.colorRate, data.colorArgb32);
            mesh.filters = [colorMatrix];
          }

          // 小西 - tintデータがあれば適用
          if (data.tint) {
            mesh.tint = data.tint;
            // パーツカラーのAを不透明度に乗算して処理する
            const ca = ((data.partsColorARGB & 0xff000000) >>> 24) / 255;
            mesh.alpha = mesh.alpha * ca;
          }

          // TODO:
          /*
          if (data.tintRgb) {
            mesh.tintRgb = data.tintRgb;
          }
           */

          const blendMode: BLEND_MODES = this.alphaBlendType[i];
          if (blendMode === BLEND_MODES.MULTIPLY || blendMode === BLEND_MODES.SCREEN) {
            mesh.alpha = 1.0; // 不透明度を固定にする
          }

          if (partType !== SsPartType.Mask) this.addChild(mesh);
          break;
        }
        case SsPartType.Nulltype: {
          // NULLパーツのOpacity/Transform設定
          const opacity = this.playerLib.InheritOpacity(1.0, data.index, frameNumber);
          mesh.alpha = (opacity * data.localopacity) / 255.0;
          const verts = this.playerLib.TransformVerts(Player.GetDummyVerts(), data.index, frameNumber);
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
   *
   * 名前を指定してパーツの再生するインスタンスアニメを変更します。
   * 指定したパーツがインスタンスパーツでない場合、falseを返します.
   * インスタンスパーツ名はディフォルトでは「ssae名:モーション名」とつけられています。
   * 再生するアニメの名前は アニメパック名 と アニメ名 で指定してください。
   * 現在再生しているアニメを指定することは入れ子となり無限ループとなるためできません。
   *
   * 変更するアニメーションは同じ ssfb に含まれる必要があります。
   * インスタンスパーツが再生するアニメを変更します
   *
   * インスタンスキーは
   *
   * @param partName SS上のパーツ名
   * @param animePackName 参照するアニメパック名
   * @param animeName 参照するアニメ名
   * @param overWrite インスタンスキーの上書きフラグ
   * @param keyParam インスタンスキー
   *
   * @constructor
   */
  public ChangeInstanceAnime(partName: string, animePackName: string, animeName: string, overWrite: boolean, keyParam: SS6PlayerInstanceKeyParam = null): boolean {
    let rc = false;

    if (this.animePackName !== null && this.animeName !== null) {
      let packData: AnimePackData = this.playerLib.animePackData;
      let partsLength = packData.partsLength();
      for (let index = 0; index < partsLength; index++) {

        let partData = packData.parts(index);
        if (partData.name() === partName) {
          let mesh: any = this.prevMesh[index];
          if (mesh === null || mesh instanceof SS6Player) {
            this.substituteOverWrite[index] = overWrite;

            let keyParamAsSubstitute: SS6PlayerInstanceKeyParam;
            if (keyParam !== null) {
              keyParamAsSubstitute = keyParam;
              mesh = this.MakeCellPlayer(animePackName + '/' + animeName, keyParam.refStartframe);
            } else {
              mesh = this.MakeCellPlayer(animePackName + '/' + animeName);
              keyParamAsSubstitute = new SS6PlayerInstanceKeyParam();
              keyParamAsSubstitute.refStartframe = (mesh as SS6Player).startFrame;
              keyParamAsSubstitute.refEndframe = (mesh as SS6Player).endFrame;
            }
            mesh.name = partData.name();
            this.prevMesh[index] = mesh;
            this.substituteKeyParam[index] = keyParamAsSubstitute;

            rc = true;
            break;
          }
        }
      }
    }
    return rc;
  }

  /**
   * 矩形セルをメッシュ（5verts4Tri）で作成
   * @param {number} id - セルID
   * @return {PIXI.SimpleMesh} - メッシュ
   */
  private MakeCellMesh(id: number): SimpleMesh {
    const cell = this.playerLib.fbObj.cells(id);
    const u1 = cell.u1();
    const u2 = cell.u2();
    const v1 = cell.v1();
    const v2 = cell.v2();
    const w = cell.width() / 2;
    const h = cell.height() / 2;
    const verts = new Float32Array([0, 0, -w, -h, w, -h, -w, h, w, h]);
    const uvs = new Float32Array([(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]); // ??? why ???
    return new SimpleMesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices, DRAW_MODES.TRIANGLES);
  }

  /**
   * メッシュセルからメッシュを作成
   * @param {number} partID - パーツID
   * @param {number} cellID - セルID
   * @return {PIXI.SimpleMesh} - メッシュ
   */
  private MakeMeshCellMesh(partID: number, cellID: number): SimpleMesh {
    const meshsDataUV = this.playerLib.animationData.meshsDataUv(partID);
    const uvLength = meshsDataUV.uvLength();

    if (uvLength > 0) {
      // 先頭の2データはヘッダになる
      const uvs = new Float32Array(uvLength - 2);
      const meshNum = meshsDataUV.uv(1);

      for (let idx = 2; idx < uvLength; idx++) {
        uvs[idx - 2] = meshsDataUV.uv(idx);
      }

      const meshsDataIndices = this.playerLib.animationData.meshsDataIndices(partID);
      const indicesLength = meshsDataIndices.indicesLength();

      // 先頭の1データはヘッダになる
      const indices = new Uint16Array(indicesLength - 1);
      for (let idx = 1; idx < indicesLength; idx++) {
        indices[idx - 1] = meshsDataIndices.indices(idx);
      }

      const verts = new Float32Array(meshNum * 2); // Zは必要ない？

      return new SimpleMesh(this.resources[this.playerLib.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices, DRAW_MODES.TRIANGLES);
    }

    return null;
  }

  /**
   * セルをインスタンスで作成
   * @param {String} refname 参照アニメ名
   * @param {number or undefined} refStart
   * @return {SS6Player} - インスタンス
   */
  private MakeCellPlayer(refname: string, refStart: number = undefined): SS6Player {
    const split = refname.split('/');
    const ssp = new SS6Player(this.ss6project);
    ssp.Setup(split[0], split[1]);
    ssp.Play(refStart);

    return ssp;
  }

  private resetLiveFrame() {
    const layers = this.playerLib.animationData.defaultDataLength();
    for (let i = 0; i < layers; i++) {
      this.liveFrame[i] = 0;
    }
  }
}
