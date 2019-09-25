import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';

export class SS6SsfbReaderOld {
    public rootPath: string;
    public fbObj: ss.ssfb.ProjectData;
    public resources: PIXI.loaders.ResourceDictionary;
    public status: string;
    private onComplete: () => void; // ()
    private onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
    private onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
    private onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;

    public curAnimePack: ss.ssfb.AnimePackData = null;
    public curAnimation: ss.ssfb.AnimationData = null;
    private frameDataCache: any = {};
    private currentCachedFrameNumber: number = -1;
    private colorMatrixFilterCache: any[] = [];
    public prio2index: any[] = [];

    private userData: any[] = [];

    private defaultColorFilter: PIXI.filters.ColorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
    private animation: number[] = [];
    private defaultFrameMap: any[] = [];

    public clearCaches() {
        this.prio2index = [];
        this.userData = [];
        this.frameDataCache = [];
        this.currentCachedFrameNumber = -1;
        this.colorMatrixFilterCache = [];
        this.defaultFrameMap = [];

    }

    public Setup(animePackName: string, animeName: string) {
        const animePacksLength = this.fbObj.animePacksLength();
        for (let i = 0; i < animePacksLength; i++) {
            if (this.fbObj.animePacks(i).name() !== animePackName) {
                continue;
            }

            this.curAnimePack = this.fbObj.animePacks(i);

            const animationsLength = this.curAnimePack.animationsLength();
            for (let j = 0; j < animationsLength; j++) {
                if (this.curAnimePack.animations(j).name() === animeName) {
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



        }
    }
    /**
     * SS6Project (used for several SS6Player(s))
     * @constructor
     * @param {string} ssfbPath - FlatBuffers file path
     * @param onComplete - callback on complete
     * @param timeout
     * @param retry
     * @param onError - callback on error
     * @param onTimeout - callback on timeout
     * @param onRetry - callback on retry
     */
    public constructor(ssfbPath: string,
        onComplete: () => void,
        timeout: number = 0,
        retry: number = 0,
        onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
        onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
        onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null) {
        const index = ssfbPath.lastIndexOf('/');
        this.rootPath = ssfbPath.substring(0, index) + '/';

        this.status = 'not ready'; // status

        this.onComplete = onComplete;
        this.onError = onError;
        this.onTimeout = onTimeout;
        this.onRetry = onRetry;
        this.LoadFlatBuffersProject(ssfbPath, timeout, retry);
    }

    /**
     * Load json and parse (then, load textures)
     * @param {string} ssfbPath - FlatBuffers file path
     * @param timeout
     * @param retry
     */
    private LoadFlatBuffersProject(ssfbPath: string, timeout: number = 0, retry: number = 0) {
        const self = this;
        const httpObj = new XMLHttpRequest();
        const method = 'GET';
        httpObj.open(method, ssfbPath, true);
        httpObj.responseType = 'arraybuffer';
        httpObj.timeout = timeout;
        httpObj.onload = function () {
            const arrayBuffer = this.response;
            const bytes = new Uint8Array(arrayBuffer);
            const buf = new flatbuffers.ByteBuffer(bytes);
            self.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
            self.LoadCellResources();
        };
        httpObj.ontimeout = function () {
            if (retry > 0) {
                if (self.onRetry !== null) {
                    self.onRetry(ssfbPath, timeout, retry - 1, httpObj);
                }
                self.LoadFlatBuffersProject(ssfbPath, timeout, retry - 1);
            } else {
                if (self.onTimeout !== null) {
                    self.onTimeout(ssfbPath, timeout, retry, httpObj);
                }
            }
        };

        httpObj.onerror = function () {
            if (self.onTimeout !== null) {
                self.onError(ssfbPath, timeout, retry, httpObj);
            }
        };

        httpObj.send(null);
    }

    /**
     * Load textures
     */
    private LoadCellResources() {
        const self = this;
        // Load textures for all cell at once.
        const loader = new PIXI.loaders.Loader();
        let ids: any = [];
        for (let i = 0; i < self.fbObj.cellsLength(); i++) {
            if (!ids.some(function (id: number) {
                return (id === self.fbObj.cells(i).cellMap().index());
            })) {
                ids.push(self.fbObj.cells(i).cellMap().index());
                loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
            }
        }
        loader.load(function (loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) {
            // SS6Project is ready.
            self.resources = resources;
            self.status = 'ready';
            if (self.onComplete !== null) {
                self.onComplete();
            }
        });
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
     * ユーザーデータの存在チェック
     * @param {number} frameNumber - フレーム番号
     * @return {boolean} - 存在するかどうか
     */
    public HaveUserData(frameNumber: number): boolean {
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
     * １フレーム分のデータを取得する（未設定項目はデフォルト）
     * [注意]現verでは未対応項目があると正常動作しない可能性があります
     * @param {number} frameNumber - フレーム番号
     */
    public GetFrameData(frameNumber: number): any {
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
            if (f1 & ss.ssfb.PART_FLAG.POSITION_X) {
                fd.positionX = this.I2F(curPartState.data(id++));
            }
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
                const mp = new Float32Array(fd.meshNum * 3);

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
                this.curAnimePack.parts(index).type() === 0
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
}

