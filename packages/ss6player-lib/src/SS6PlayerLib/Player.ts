import { ProjectData, AnimationData, AnimePackData, userDataInteger,
  userDataRect, userDataPoint, userDataString, userDataPerFrame,
  PART_FLAG, PART_FLAG2, Cell, AnimationInitialData } from 'ssfblib';
import {FrameData} from './FrameData';
import {Utils} from './Utils';

export class Player {
  private readonly _fbObj: ProjectData;

  private curAnimePackName: string = null;
  private curAnimeName: string = null;
  protected curAnimation: AnimationData = null;
  protected curAnimePackData: AnimePackData = null;
  private _animePackIdx: number = -1;

  private _parentIndex: number[] = [];
  private _prio2index: number[] = [];
  private userData: userDataPerFrame[] = [];
  private frameDataCache: FrameData[] = null;
  private currentCachedFrameNumber: number = -1;
  private defaultFrameMap: AnimationInitialData[] = [];

  public get fbObj(): ProjectData {
    return this._fbObj;
  }

  public get animePackName(): string {
    return this.curAnimePackName;
  }

  public get animeName(): string {
    return this.curAnimeName;
  }

  public get animePackIdx(): number {
    return this._animePackIdx;
  }

  public get animePackData(): AnimePackData {
    return this.curAnimePackData;
  }

  public get animationData(): AnimationData {
    return this.curAnimation;
  }

  public get parentIndex(): number[] {
    return this._parentIndex;
  }

  public get prio2index(): number[] {
    return this._prio2index;
  }

  public constructor(ssfbData: ProjectData | Uint8Array, animePackName: string = null, animeName: string = null) {
    if (Object.prototype.hasOwnProperty.call(ssfbData, 'bb')) {
      this._fbObj = ssfbData as ProjectData;
    } else {
      // Uint8Array
      this._fbObj = Utils.getProjectData(ssfbData as Uint8Array);
    }

    if (animePackName !== null && animeName !== null) {
      this.Setup(animePackName, animeName);
    }
  }

  /**
   * Setup
   * @param {string} animePackName - The name of animePack(SSAE).
   * @param {string} animeName - The name of animation.
   */
  public Setup(animePackName: string, animeName: string): void {
    this.clearCaches();
    const animePacksLength = this._fbObj.animePacksLength();
    let found: boolean = false;
    for (let i = 0; i < animePacksLength; i++) {
      if (this._fbObj.animePacks(i).name() === animePackName) {
        let j;
        const animationsLength = this._fbObj.animePacks(i).animationsLength();
        for (j = 0; j < animationsLength; j++) {
          if (this._fbObj.animePacks(i).animations(j).name() === animeName) {
            this.curAnimePackName = animePackName;
            this.curAnimeName = animeName;
            this.curAnimePackData = this._fbObj.animePacks(i);
            this.curAnimation = this.curAnimePackData.animations(j);
            found = true;
            break;
          }
        }
        if (!found) {
          continue;
        }

        // default data map
        const defaultDataLength = this.curAnimation.defaultDataLength();
        for (let j = 0; j < defaultDataLength; j++) {
          const curDefaultData = this.curAnimation.defaultData(j);
          this.defaultFrameMap[curDefaultData.index()] = curDefaultData;
        }

        // parts
        this._animePackIdx = i;
        const partsLength = this.curAnimePackData.partsLength();
        this._parentIndex = new Array(partsLength);

        for (j = 0; j < partsLength; j++) {
          const index = this.curAnimePackData.parts(j).index();
          this._parentIndex[index] = this._fbObj.animePacks(i).parts(j).parentIndex();
        }
      }
    }
    if (!found) {
      throw Error('not found animePackName: ' + animePackName + ' animeName: ' + animeName);
    }
  }

  private clearCaches() {
    this._prio2index = [];
    this.userData = [];
    this.frameDataCache = null;
    this.currentCachedFrameNumber = -1;
    this.defaultFrameMap = [];
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

  /**
   * ユーザーデータの存在チェック
   * @param {number} frameNumber - フレーム番号
   * @return {boolean} - 存在するかどうか
   */
  public HaveUserData(frameNumber: number): boolean {
    if (this.userData[frameNumber] === null) {
      // データはない
      return false;
    }
    if (this.userData[frameNumber] !== undefined) {
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
    this.userData[frameNumber] = null;
    return false;
  }

  /**
   * ユーザーデータの取得
   * @param {number} frameNumber - フレーム番号
   * @return {array} - ユーザーデータ
   */
  public GetUserData(frameNumber: number): any[] {
    // HaveUserDataでデータのキャッシュするので、ここで確認しておく
    if (this.HaveUserData(frameNumber) === false) {
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
        d_int = framedata.data(i).data(id, new userDataInteger()).integer();
        id++;
      }
      if (bit & 2) {
        // rect
        d_rect_x = framedata.data(i).data(id, new userDataRect()).x();
        d_rect_y = framedata.data(i).data(id, new userDataRect()).y();
        d_rect_w = framedata.data(i).data(id, new userDataRect()).w();
        d_rect_h = framedata.data(i).data(id, new userDataRect()).h();
        id++;
      }
      if (bit & 4) {
        // pos
        d_pos_x = framedata.data(i).data(id, new userDataPoint()).x();
        d_pos_y = framedata.data(i).data(id, new userDataPoint()).y();
        id++;
      }
      if (bit & 8) {
        // string
        d_string_length = framedata.data(i).data(id, new userDataString()).length();
        d_string = framedata.data(i).data(id, new userDataString()).data();
        id++;
      }
      data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
    }
    return data;
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

  /**
   * １フレーム分のデータを取得する（未設定項目はデフォルト）
   * [注意]現verでは未対応項目があると正常動作しない可能性があります
   * @param {number} frameNumber - フレーム番号
   */
  public GetFrameData(frameNumber: number): FrameData[] {
    if (this.currentCachedFrameNumber === frameNumber && this.frameDataCache) {
      return this.frameDataCache;
    }
    const layers = this.curAnimation.defaultDataLength();
    let frameData: FrameData[] = new Array(layers);
    this._prio2index = new Array(layers);
    const curFrameData = this.curAnimation.frameData(frameNumber);
    for (let i = 0; i < layers; i++) {
      const curPartState = curFrameData.states(i);
      const index = curPartState.index();
      let f1 = curPartState.flag1();
      let f2 = curPartState.flag2();
      let fd = this.GetDefaultDataByIndex(index);
      // データにフラグを追加する
      fd.flag1 = f1;
      fd.flag2 = f2;

      let id = 0;
      if (f1 & PART_FLAG.INVISIBLE) fd.f_hide = true;
      if (f1 & PART_FLAG.FLIP_H) fd.f_flipH = true;
      if (f1 & PART_FLAG.FLIP_V) fd.f_flipV = true;
      if (f1 & PART_FLAG.CELL_INDEX) fd.cellIndex = curPartState.data(id++); // 8 Cell ID
      if (f1 & PART_FLAG.POSITION_X) fd.positionX = this.I2F(curPartState.data(id++));
      if (f1 & PART_FLAG.POSITION_Y) fd.positionY = this.I2F(curPartState.data(id++));
      if (f1 & PART_FLAG.POSITION_Z) id++; // 64
      if (f1 & PART_FLAG.PIVOT_X) fd.pivotX = this.I2F(curPartState.data(id++)); // 128 Pivot Offset X
      if (f1 & PART_FLAG.PIVOT_Y) fd.pivotY = this.I2F(curPartState.data(id++)); // 256 Pivot Offset Y
      if (f1 & PART_FLAG.ROTATIONX) id++; // 512
      if (f1 & PART_FLAG.ROTATIONY) id++; // 1024
      if (f1 & PART_FLAG.ROTATIONZ) fd.rotationZ = this.I2F(curPartState.data(id++)); // 2048
      if (f1 & PART_FLAG.SCALE_X) fd.scaleX = this.I2F(curPartState.data(id++)); // 4096
      if (f1 & PART_FLAG.SCALE_Y) fd.scaleY = this.I2F(curPartState.data(id++)); // 8192
      if (f1 & PART_FLAG.LOCALSCALE_X) fd.localscaleX = this.I2F(curPartState.data(id++)); // 16384
      if (f1 & PART_FLAG.LOCALSCALE_Y) fd.localscaleY = this.I2F(curPartState.data(id++)); // 32768
      if (f1 & PART_FLAG.OPACITY) fd.opacity = curPartState.data(id++); // 65536
      if (f1 & PART_FLAG.LOCALOPACITY) fd.localopacity = curPartState.data(id++); // 131072
      if (f1 & PART_FLAG.SIZE_X) fd.size_X = this.I2F(curPartState.data(id++)); // 1048576 Size X [1]
      if (f1 & PART_FLAG.SIZE_Y) fd.size_Y = this.I2F(curPartState.data(id++)); // 2097152 Size Y [1]
      if (f1 & PART_FLAG.U_MOVE) fd.uv_move_X = this.I2F(curPartState.data(id++)); // 4194304 UV Move X
      if (f1 & PART_FLAG.V_MOVE) fd.uv_move_Y = this.I2F(curPartState.data(id++)); // 8388608 UV Move Y
      if (f1 & PART_FLAG.UV_ROTATION) fd.uv_rotation = this.I2F(curPartState.data(id++)); // 16777216 UV Rotation
      if (f1 & PART_FLAG.U_SCALE) fd.uv_scale_X = this.I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
      if (f1 & PART_FLAG.V_SCALE) fd.uv_scale_Y = this.I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
      if (f1 & PART_FLAG.BOUNDINGRADIUS) id++; // 134217728 boundingRadius
      if (f1 & PART_FLAG.MASK) fd.masklimen = curPartState.data(id++); // 268435456 masklimen
      if (f1 & PART_FLAG.PRIORITY) fd.priority = curPartState.data(id++); // 536870912 priority
      //
      if (f1 & PART_FLAG.INSTANCE_KEYFRAME) {
        // 1073741824 instance keyframe
        fd.instanceValue_curKeyframe = curPartState.data(id++);
        fd.instanceValue_startFrame = curPartState.data(id++);
        fd.instanceValue_endFrame = curPartState.data(id++);
        fd.instanceValue_loopNum = curPartState.data(id++);
        fd.instanceValue_speed = this.I2F(curPartState.data(id++));
        fd.instanceValue_loopflag = curPartState.data(id++);
      }
      if (f1 & PART_FLAG.EFFECT_KEYFRAME) {
        // 2147483648 effect keyframe
        fd.effectValue_curKeyframe = curPartState.data(id++);
        fd.effectValue_startTime = curPartState.data(id++);
        fd.effectValue_speed = this.I2F(curPartState.data(id++));
        fd.effectValue_loopflag = curPartState.data(id++);
      }
      if (f1 & PART_FLAG.VERTEX_TRANSFORM) {
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

      if (f1 & PART_FLAG.PARTS_COLOR) {
        // 262144 parts color [3]
        const f = curPartState.data(id++);
        fd.colorBlendType = f & 0xff;
        fd.useColorMatrix = fd.colorBlendType !== 1;
        if (f & 0x1000) {
          fd.colorRate = this.I2F(curPartState.data(id++));
          const bf = curPartState.data(id++);
          const bf2 = curPartState.data(id++);
          fd.colorArgb32 = (bf << 16) | bf2;

          fd.partsColorARGB = fd.colorArgb32 >>> 0;
          if (fd.colorBlendType === 1) {
            fd.tint = fd.colorArgb32 & 0xffffff;
          }
        }

        /* TODO:
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
         */

      }
      if (f2 & PART_FLAG2.MESHDATA) {
        // mesh [1]
        const meshUv = this.curAnimation.meshsDataUv(index);
        fd.meshIsBind = meshUv.uv(0);
        fd.meshNum = meshUv.uv(1);
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
      this._prio2index[i] = index;

      // NULLパーツにダミーのセルIDを設定する
      if (
        this.curAnimePackData.parts(index).type() === 0
      ) {
        frameData[index].cellIndex = -2;
      }
    }
    this.frameDataCache = frameData;
    this.currentCachedFrameNumber = frameNumber;
    return frameData;
  }

  /**
   * デフォルトデータを取得する
   * @param {number} id - パーツ（レイヤー）ID
   * @return {array} - データ
   */
  private GetDefaultDataByIndex(id: number): FrameData {
    const curDefaultData = this.defaultFrameMap[id];
    let dfd = new FrameData();
    dfd.index = curDefaultData.index();
    dfd.lowflag = curDefaultData.lowflag();
    dfd.highflag = curDefaultData.highflag();
    dfd.priority = curDefaultData.priority();
    dfd.cellIndex = curDefaultData.cellIndex();
    dfd.opacity = curDefaultData.opacity();
    dfd.localopacity = curDefaultData.localopacity();
    dfd.masklimen = curDefaultData.masklimen();
    dfd.positionX = curDefaultData.positionX();
    dfd.positionY = curDefaultData.positionY();
    dfd.pivotX = curDefaultData.pivotX();
    dfd.pivotY = curDefaultData.pivotY();
    dfd.rotationX = curDefaultData.rotationX();
    dfd.rotationY = curDefaultData.rotationY();
    dfd.rotationZ = curDefaultData.rotationZ();
    dfd.scaleX = curDefaultData.scaleX();
    dfd.scaleY = curDefaultData.scaleY();
    dfd.localscaleX = curDefaultData.localscaleX();
    dfd.localscaleY = curDefaultData.localscaleY();
    dfd.size_X = curDefaultData.sizeX();
    dfd.size_Y = curDefaultData.sizeY();
    dfd.uv_move_X = curDefaultData.uvMoveX();
    dfd.uv_move_Y = curDefaultData.uvMoveY();
    dfd.uv_rotation = curDefaultData.uvRotation();
    dfd.uv_scale_X = curDefaultData.uvScaleX();
    dfd.uv_scale_Y = curDefaultData.uvScaleY();
    dfd.boundingRadius = curDefaultData.boundingRadius();
    dfd.instanceValue_curKeyframe = curDefaultData.instanceValueCurKeyframe();
    dfd.instanceValue_endFrame = curDefaultData.instanceValueEndFrame();
    dfd.instanceValue_startFrame = curDefaultData.instanceValueStartFrame();
    dfd.instanceValue_loopNum = curDefaultData.instanceValueLoopNum();
    dfd.instanceValue_speed = curDefaultData.instanceValueSpeed();
    dfd.instanceValue_loopflag = curDefaultData.instanceValueLoopflag();
    dfd.effectValue_curKeyframe = curDefaultData.effectValueCurKeyframe();
    dfd.effectValue_startTime = curDefaultData.effectValueStartTime();
    dfd.effectValue_speed = curDefaultData.effectValueSpeed();
    dfd.effectValue_loopflag = curDefaultData.effectValueLoopflag();

    // Add visiblity
    dfd.f_hide = false;
    // Add flip
    dfd.f_flipH = false;
    dfd.f_flipV = false;
    // Add mesh
    dfd.f_mesh = false;
    // Add vert data
    dfd.i_transformVerts = 0;
    dfd.u00 = 0;
    dfd.v00 = 0;
    dfd.u01 = 0;
    dfd.v01 = 0;
    dfd.u10 = 0;
    dfd.v10 = 0;
    dfd.u11 = 0;
    dfd.v11 = 0;
    //
    dfd.useColorMatrix = false;
    dfd.colorBlendType = 0;
    dfd.colorRate = 0;
    dfd.colorArgb32 = 0;

    //
    dfd.meshIsBind = 0;
    dfd.meshNum = 0;
    dfd.meshDataPoint = null;
    //
    dfd.flag1 = 0;
    dfd.flag2 = 0;

    dfd.partsColorARGB = 0;

    return dfd;
  }

  /**
   * 親を遡って不透明度を継承する
   * @param {number} opacity - 透明度
   * @param {number} partId - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {number} - 透明度
   */
  public InheritOpacity(opacity: number, partId: number, frameNumber: number): number {
    const data: FrameData = this.GetFrameData(frameNumber)[partId];
    opacity = data.opacity / 255.0;

    if (this._parentIndex[partId] >= 0) {
      opacity = this.InheritOpacity(opacity, this._parentIndex[partId], frameNumber);
    }
    return opacity;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} verts - 頂点情報配列
   * @param {number} partId - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  public TransformVertsLocal(verts: Float32Array, partId: number, frameNumber: number): Float32Array {
    const data: FrameData = this.GetFrameData(frameNumber)[partId];

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
    if (this._parentIndex[partId] >= 0) {
      verts = this.TransformVerts(verts, this._parentIndex[partId], frameNumber);
    }
    return verts;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} verts - 頂点情報配列
   * @param {number} partId - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  public TransformMeshVertsLocal(verts: Float32Array, partId: number, frameNumber: number): Float32Array {
    const data: FrameData = this.GetFrameData(frameNumber)[partId];

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
    if (this._parentIndex[partId] >= 0) {
      verts = this.TransformVerts(verts, this._parentIndex[partId], frameNumber);
    }
    return verts;
  }

  /**
   * 親を遡って座標変換する（ローカルアトリビュート適用）
   * @param {array} pos - 頂点情報配列
   * @param {number} partId - パーツ（レイヤー）ID
   * @param {number} frameNumber - フレーム番号
   * @return {array} - 変換された頂点座標配列
   */
  public TransformPositionLocal(pos: Float32Array, partId: number, frameNumber: number): Float32Array {
    const data: FrameData = this.GetFrameData(frameNumber)[partId];

    pos[4] += -data.rotationZ;

    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    const x = pos[0] * data.scaleX * data.localscaleX; // * (data.size_X | 1);
    const y = pos[1] * data.scaleY * data.localscaleY; // * (data.size_Y | 1);

    pos[2] *= data.scaleX * data.localscaleX;
    pos[3] *= data.scaleY * data.localscaleY;
    pos[0] = (cos * x - sin * y) + data.positionX;
    pos[1] = (sin * x + cos * y) - data.positionY;

    if (this._parentIndex[partId] >= 0) {
      pos = this.TransformPosition(pos, this._parentIndex[partId], frameNumber);
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
   * @param vec2
   * @return {array} vec2 - 4頂点から算出した中心点の座標
   */
  public static CoordinateGetDiagonalIntersection(cx: number, cy: number, LUx: number, LUy: number, RUx: number, RUy: number, LDx: number, LDy: number, RDx: number, RDy: number, vec2: Float32Array): Float32Array {
    // 中間点を求める

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
  public TransformVerts(verts: Float32Array, id: number, frameNumber: number): Float32Array {
    const data: FrameData = this.GetFrameData(frameNumber)[id];

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

    if (this._parentIndex[id] >= 0) {
      verts = this.TransformVerts(verts, this._parentIndex[id], frameNumber);
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
  public TransformPosition(pos: Float32Array, id: number, frameNumber: number): Float32Array {
    const data: FrameData = this.GetFrameData(frameNumber)[id];

    pos[4] += -data.rotationZ;
    const rz = (-data.rotationZ * Math.PI) / 180;
    const cos = Math.cos(rz);
    const sin = Math.sin(rz);
    const x = pos[0] * data.scaleX;
    const y = pos[1] * data.scaleY;

    pos[2] *= data.scaleX;
    pos[3] *= data.scaleY;
    pos[0] = (cos * x - sin * y) + data.positionX;
    pos[1] = (sin * x + cos * y) - data.positionY;

    if (this._parentIndex[id] >= 0) {
      pos = this.TransformPosition(pos, this._parentIndex[id], frameNumber);
    }

    return pos;
  }

  /**
   * 矩形セルメッシュの頂点情報のみ取得
   * @param {ssfblib.Cell} cell - セル
   * @param {array} data - アニメーションフレームデータ
   * @param verts
   * @return {array} - 頂点情報配列
   */
  public static GetVerts(cell: Cell, data: FrameData, verts: Float32Array): Float32Array {
    const w: number = data.size_X / 2;
    const h: number = data.size_Y / 2;
    const px: number = data.size_X * -(data.pivotX + cell.pivotX());
    const py: number = data.size_Y * (data.pivotY + cell.pivotY());

    verts.set([px, py, px - w, py - h, px + w, py - h, px - w, py + h, px + w, py + h]);
    return verts;
  }

  /**
   * 矩形セルメッシュの頂点情報のみ取得
   * @param {ssfblib.Cell} cell - セル
   * @param {array} data - アニメーションフレームデータ
   * @param verts
   * @return {array} - 頂点情報配列
   */
  public static GetMeshVerts(cell: Cell, data: FrameData, verts: Float32Array): Float32Array {
    // フレームデータからメッシュデータを取得しvertsを作成する
    for (let idx: number = 0; idx < data.meshNum; idx++) {
      verts[idx * 2 /*+ 0*/] = data.meshDataPoint[idx * 3 /* + 0 */ ];
      verts[idx * 2 + 1] = -data.meshDataPoint[idx * 3 + 1];
    }
    return verts;
  }

  public static GetDummyVerts(): Float32Array {
    return new Float32Array([0, 0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
  }
}
