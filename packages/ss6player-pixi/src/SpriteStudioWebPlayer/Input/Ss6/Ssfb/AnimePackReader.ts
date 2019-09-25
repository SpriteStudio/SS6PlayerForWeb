import { ss } from 'ssfblib';
import { AnimePack } from '../../../Model/AnimePack';
import { AnimePackAnimation } from '../../../Model/AnimePackAnimation';
import { AnimePackAnimationFrame } from '../../../Model/AnimePackAnimationFrame';
import { AnimePackAnimationFrameState } from '../../../Model/AnimePackAnimationFrameState';
import { AnimePackParts } from '../../../Model/AnimePackParts';
import { AnimePackAnimationMeshsDataUv } from '../../../Model/AnimePackAnimationMeshsDataUv';
import { AnimePackAnimationMeshsDataIndices } from '../../../Model/AnimePackAnimationMeshsDataIndices';
import { AnimePackAnimationDefaultData } from '../../../Model/AnimePackAnimationDefaultData';




export class AnimePackReader {


    public static createAnimePackMap(projectData: ss.ssfb.ProjectData) {
        if (projectData == null) {
            return;
        }
        const animePacksLength = projectData.animePacksLength();
        const animePackModelMap: Map<string, AnimePack> = new Map<string, AnimePack>();
        for (let i = 0; i < animePacksLength; i++) {
            const animePack = projectData.animePacks(i);
            const animePackModel = new AnimePack();
            animePackModel.name = animePack.name();

            animePackModelMap[animePackModel.name] = animePackModel;

            animePackModel.partsModelMap = this.createPartsMap(animePack);
            animePackModel.animationMap = this.createAnimationMap(animePack);

        }
        return animePackModelMap;
    }

    private static createPartsMap(animePack: any) {
        const partsLength = animePack.partsLength();
        const partsModelMap: Map<string, AnimePackParts> = new Map<string, AnimePackParts>();
        for (let i = 0; i < partsLength; i++) {
            const parts = animePack.parts(i);
            const partsModel = new AnimePackParts();
            partsModel.type = parts.type();
            partsModel.name = parts.name();
            partsModel.index = parts.index();
            partsModel.parentIndex = parts.parentIndex();
            partsModel.boundsType = parts.boundsType();
            partsModel.alphaBlendType = parts.alphaBlendType();

            partsModelMap[i] = partsModel;
        }
        return partsModelMap;
    }

    private static createAnimationMap(animePack: any) {
        const animationModelMap: Map<string, AnimePackAnimation> = new Map<string, AnimePackAnimation>();
        const animationsLength = animePack.animationsLength();
        for (let i = 0; i < animationsLength; i++) {
            const animation = animePack.animations(i);
            const animationModel = new AnimePackAnimation();
            animationModel.name = animation.name();
            animationModel.fps = animation.fps();
            animationModel.startFrame = animation.startFrames();
            animationModel.endFrame = animation.endFrames();
            animationModel.totalFrame = animation.totalFrames();

            // DefaultData ( AnimationInitialData )
            animationModel.defaultDataMap = this.createAnimationDefaultDataMap(animation);

            // MeshsDataUv
            animationModel.meshsDataUvMap = this.createAnimationMeshsDataUvMap(animation);

            // MeshsDataIndices
            animationModel.meshsDataIndicesMap = this.createAnimationMeshsDataIndicesMap(animation);

            // FrameData
            animationModel.frameMap = this.createAnimationFrameMap(animation);

            animationModelMap[animationModel.name] = animationModel;

        }
        return animationModelMap;
    }

    private static createAnimationDefaultDataMap(animation: any) {
        const defaultDataMap:Map<number, AnimePackAnimationDefaultData> = new Map<number, AnimePackAnimationDefaultData>();
        const defaultDataLength = animation.defaultDataLength();
        for (let i = 0; i < defaultDataLength; i++) {
            const defaultData = animation.defaultData(i);
            const defaultDataModel = new AnimePackAnimationDefaultData();

            defaultDataMap[i] = defaultDataModel;
        }


        return defaultDataMap;
    }

    private static createAnimationMeshsDataUvMap(animation: any){
        const meshsDataUvMap: Map<number, AnimePackAnimationMeshsDataUv> = new Map<number, AnimePackAnimationMeshsDataUv>();
        const meshsDataUvLength = animation.meshsDataUVLength();
        for (let i = 0; i < meshsDataUvLength; i++) {
            const meshsDataUV = animation.meshsDataUV(i);
            const meshsDataUvModel = new AnimePackAnimationMeshsDataUv();

            const uvArray = Array<number>();
            const uvLength = meshsDataUV.uvLength();
            for(let uvIndex = 0; uvIndex < uvLength; uvIndex++){
                const uv = meshsDataUV.uv(uvIndex);
                uvArray.push(uv);
            }
            meshsDataUvModel.uvArray = uvArray;

            meshsDataUvMap[i] = meshsDataUvModel;
        }
        return meshsDataUvMap;
    }
    private static createAnimationMeshsDataIndicesMap(animation: any) {
        const MeshsDataIndicesMap: Map<number, AnimePackAnimationMeshsDataIndices> = new Map<number, AnimePackAnimationMeshsDataIndices>();
        const MeshsDataIndicesLength = animation.meshsDataIndicesLength();
        for (let i = 0; i < MeshsDataIndicesLength; i++) {
            const MeshsDataIndices = animation.meshsDataIndices(i);
            const MeshsDataIndicesModel = new AnimePackAnimationMeshsDataIndices();

            const indicesArray = Array<number>();
            const indicesLength = MeshsDataIndices.indicesLength();
            for (let indicesIndex = 0; indicesIndex < indicesLength; indicesIndex++) {
                const indices = MeshsDataIndices.indices(indicesIndex);
                indicesArray.push(indices);
            }
            MeshsDataIndicesModel.indicesArray = indicesArray;

            MeshsDataIndicesMap[i] = MeshsDataIndicesModel;
        }
        return MeshsDataIndicesMap;
    }

    private static createAnimationFrameMap(animation: any) {
        const frameMap: Map<number, AnimePackAnimationFrame> = new Map<number, AnimePackAnimationFrame>();
        const frameDataLength = animation.frameDataLength();
        for (let i = 0; i < frameDataLength; i++) {
            const frameData = animation.frameData(i);
            const frameModel = new AnimePackAnimationFrame();

            frameModel.stateMap = this.createAnimationFrameStateMap(frameData);

            frameMap[i] = frameModel;
        }

        return frameMap;
    }



    private static createAnimationFrameStateMap(frameData: any) {
        const stateMap: Map<number, AnimePackAnimationFrameState> = new Map<number, AnimePackAnimationFrameState>();
        const statesLength = frameData.statesLength();
        for (let i = 0; i < statesLength; i++) {
            const stateModel = new AnimePackAnimationFrameState();
            const state = frameData.states(i);
            stateModel.index = state.index();
            const flag1 = state.flag1();
            stateModel.flag1 = flag1;
            const flag2 = state.flag2();
            stateModel.flag2 = flag2;

/*
            if (f1 & ss.ssfb.PART_FLAG.INVISIBLE) fd.f_hide = true;
            if (f1 & ss.ssfb.PART_FLAG.FLIP_H) fd.f_flipH = true;
            if (f1 & ss.ssfb.PART_FLAG.FLIP_V) fd.f_flipV = true;
            if (f1 & ss.ssfb.PART_FLAG.CELL_INDEX) fd.cellIndex = curPartState.data(id++); // 8 Cell ID
            if (f1 & ss.ssfb.PART_FLAG.POSITION_X) fd.positionX = I2F(curPartState.data(id++));
            if (f1 & ss.ssfb.PART_FLAG.POSITION_Y) fd.positionY = I2F(curPartState.data(id++));
            if (f1 & ss.ssfb.PART_FLAG.POSITION_Z) id++; // 64
            if (f1 & ss.ssfb.PART_FLAG.PIVOT_X) fd.pivotX = I2F(curPartState.data(id++)); // 128 Pivot Offset X
            if (f1 & ss.ssfb.PART_FLAG.PIVOT_Y) fd.pivotY = I2F(curPartState.data(id++)); // 256 Pivot Offset Y
            if (f1 & ss.ssfb.PART_FLAG.ROTATIONX) id++; // 512
            if (f1 & ss.ssfb.PART_FLAG.ROTATIONY) id++; // 1024
            if (f1 & ss.ssfb.PART_FLAG.ROTATIONZ) fd.rotationZ = I2F(curPartState.data(id++)); // 2048
            if (f1 & ss.ssfb.PART_FLAG.SCALE_X) fd.scaleX = I2F(curPartState.data(id++)); // 4096
            if (f1 & ss.ssfb.PART_FLAG.SCALE_Y) fd.scaleY = I2F(curPartState.data(id++)); // 8192
            if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_X) fd.localscaleX = I2F(curPartState.data(id++)); // 16384
            if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_Y) fd.localscaleY = I2F(curPartState.data(id++)); // 32768
            if (f1 & ss.ssfb.PART_FLAG.OPACITY) fd.opacity = curPartState.data(id++); // 65536
            if (f1 & ss.ssfb.PART_FLAG.LOCALOPACITY) fd.localopacity = curPartState.data(id++); // 131072
            if (f1 & ss.ssfb.PART_FLAG.SIZE_X) fd.size_X = I2F(curPartState.data(id++)); // 1048576 Size X [1]
            if (f1 & ss.ssfb.PART_FLAG.SIZE_Y) fd.size_Y = I2F(curPartState.data(id++)); // 2097152 Size Y [1]
            if (f1 & ss.ssfb.PART_FLAG.U_MOVE) fd.uv_move_X = I2F(curPartState.data(id++)); // 4194304 UV Move X
            if (f1 & ss.ssfb.PART_FLAG.V_MOVE) fd.uv_move_Y = I2F(curPartState.data(id++)); // 8388608 UV Move Y
            if (f1 & ss.ssfb.PART_FLAG.UV_ROTATION) fd.uv_rotation = I2F(curPartState.data(id++)); // 16777216 UV Rotation
            if (f1 & ss.ssfb.PART_FLAG.U_SCALE) fd.uv_scale_X = I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
            if (f1 & ss.ssfb.PART_FLAG.V_SCALE) fd.uv_scale_Y = I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
            if (f1 & ss.ssfb.PART_FLAG.BOUNDINGRADIUS) id++; // 134217728 boundingRadius
            if (f1 & ss.ssfb.PART_FLAG.MASK) fd.masklimen = curPartState.data(id++); // 268435456 masklimen
            if (f1 & ss.ssfb.PART_FLAG.PRIORITY) fd.priority = curPartState.data(id++); // 536870912 priority
*/

            const _uint32 = new Uint32Array(1);
            const _float32 = new Float32Array(_uint32.buffer);
            const I2F = (data: any) => {
                _uint32[0] = data;
                return _float32[0];
            };

            // frag1 の解析
            let stateDataId = 0;
            if (flag1 & ss.ssfb.PART_FLAG.INVISIBLE) {
                stateModel.isHide = true;
            }
            if (flag1 & ss.ssfb.PART_FLAG.FLIP_H) {
                stateModel.isFlipHorizontal = true;
            }
            if (flag1 & ss.ssfb.PART_FLAG.FLIP_V) {
                stateModel.isFlipVertical = true;
            }
            if (flag1 & ss.ssfb.PART_FLAG.CELL_INDEX){
                stateModel.cellIndex = state.data(stateDataId++); // 8 Cell ID
            }
            if (flag1 & ss.ssfb.PART_FLAG.POSITION_X){
                stateModel.positionX = I2F(state.data(stateDataId++));
            }
            if (flag1 & ss.ssfb.PART_FLAG.POSITION_Y) {
                stateModel.positionY = I2F(state.data(stateDataId++));
            }
            if (flag1 & ss.ssfb.PART_FLAG.POSITION_Z) {
                stateDataId++; // 64
            }
            if (flag1 & ss.ssfb.PART_FLAG.PIVOT_X) {
                stateModel.pivotX = I2F(state.data(stateDataId++)); // 128 Pivot Offset X
            }
            if (flag1 & ss.ssfb.PART_FLAG.PIVOT_Y) {
                stateModel.pivotY = I2F(state.data(stateDataId++)); // 256 Pivot Offset Y
            }
            if (flag1 & ss.ssfb.PART_FLAG.ROTATIONX) {
                stateDataId++; // 512
            }
            if (flag1 & ss.ssfb.PART_FLAG.ROTATIONY) {
                stateDataId++; // 1024
            }
            if (flag1 & ss.ssfb.PART_FLAG.ROTATIONZ) {
                stateModel.rotationZ = I2F(state.data(stateDataId++)); // 2048
            }
            if (flag1 & ss.ssfb.PART_FLAG.SCALE_X) {
                stateModel.scaleX = I2F(state.data(stateDataId++)); // 4096
            }
            if (flag1 & ss.ssfb.PART_FLAG.SCALE_Y) {
                stateModel.scaleY = I2F(state.data(stateDataId++)); // 8192
            }
            if (flag1 & ss.ssfb.PART_FLAG.LOCALSCALE_X) {
                stateModel.localScaleX = I2F(state.data(stateDataId++)); // 16384
            }
            if (flag1 & ss.ssfb.PART_FLAG.LOCALSCALE_Y) {
                stateModel.localScaleY = I2F(state.data(stateDataId++)); // 32768
            }
            if (flag1 & ss.ssfb.PART_FLAG.OPACITY) {
                stateModel.opacity = state.data(stateDataId++); // 65536
            }
            if (flag1 & ss.ssfb.PART_FLAG.LOCALOPACITY) {
                stateModel.localOpacity = state.data(stateDataId++); // 131072
            }
            if (flag1 & ss.ssfb.PART_FLAG.SIZE_X) {
                stateModel.sizeX = I2F(state.data(stateDataId++)); // 1048576 Size X [1]
            }
            if (flag1 & ss.ssfb.PART_FLAG.SIZE_Y) {
                stateModel.sizeY = I2F(state.data(stateDataId++)); // 2097152 Size Y [1]
            }
            if (flag1 & ss.ssfb.PART_FLAG.U_MOVE) {
                stateModel.uvMoveX = I2F(state.data(stateDataId++)); // 4194304 UV Move X
            }
            if (flag1 & ss.ssfb.PART_FLAG.V_MOVE) {
                stateModel.uvMoveY = I2F(state.data(stateDataId++)); // 8388608 UV Move Y
            }
            if (flag1 & ss.ssfb.PART_FLAG.UV_ROTATION) {
                stateModel.uvRotation = I2F(state.data(stateDataId++)); // 16777216 UV Rotation
            }
            if (flag1 & ss.ssfb.PART_FLAG.U_SCALE) {
                stateModel.uvScaleX = I2F(state.data(stateDataId++)); // 33554432 ? UV Scale X
            }
            if (flag1 & ss.ssfb.PART_FLAG.V_SCALE) {
                stateModel.uvScaleY = I2F(state.data(stateDataId++)); // 67108864 ? UV Scale Y
            }
            if (flag1 & ss.ssfb.PART_FLAG.BOUNDINGRADIUS) {
                stateDataId++; // 134217728 boundingRadius
            }
            if (flag1 & ss.ssfb.PART_FLAG.MASK) {
                stateModel.masklimen = state.data(stateDataId++); // 268435456 masklimen
            }
            if (flag1 & ss.ssfb.PART_FLAG.PRIORITY) {
                stateModel.priority = state.data(stateDataId++); // 536870912 priority
            }


/*           //
            if (f1 & ss.ssfb.PART_FLAG.INSTANCE_KEYFRAME) {
                // 1073741824 instance keyframe
                fd.instanceValue_curKeyframe = curPartState.data(id++);
                fd.instanceValue_startFrame = curPartState.data(id++);
                fd.instanceValue_endFrame = curPartState.data(id++);
                fd.instanceValue_loopNum = curPartState.data(id++);
                fd.instanceValue_speed = I2F(curPartState.data(id++));
                fd.instanceValue_loopflag = curPartState.data(id++);
            }
            */
            if (flag1 & ss.ssfb.PART_FLAG.INSTANCE_KEYFRAME) {
                // 1073741824 instance keyframe
                stateModel.instanceValue_curKeyframe = state.data(stateDataId++);
                stateModel.instanceValue_startFrame = state.data(stateDataId++);
                stateModel.instanceValue_endFrame = state.data(stateDataId++);
                stateModel.instanceValue_loopNum = state.data(stateDataId++);
                stateModel.instanceValue_speed = I2F(state.data(stateDataId++));
                stateModel.instanceValue_loopflag = state.data(stateDataId++);
            }

           /*
            if (f1 & ss.ssfb.PART_FLAG.EFFECT_KEYFRAME) {
                // 2147483648 effect keyframe
                fd.effectValue_curKeyframe = curPartState.data(id++);
                fd.effectValue_startTime = curPartState.data(id++);
                fd.effectValue_speed = I2F(curPartState.data(id++));
                fd.effectValue_loopflag = curPartState.data(id++);
            }
            */
            if (flag1 & ss.ssfb.PART_FLAG.EFFECT_KEYFRAME) {
                // 2147483648 effect keyframe
                stateModel.effectValue_curKeyframe = state.data(stateDataId++);
                stateModel.effectValue_startTime = state.data(stateDataId++);
                stateModel.effectValue_speed = I2F(state.data(stateDataId++));
                stateModel.effectValue_loopflag = state.data(stateDataId++);
            }

            /*
            if (f1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
                // 524288 verts [4]
                // verts
                fd.f_mesh = true;
                const f = (fd.i_transformVerts = curPartState.data(id++));
                if (f & 1) {
                    fd.u00 = I2F(curPartState.data(id++));
                    fd.v00 = I2F(curPartState.data(id++));
                }
                if (f & 2) {
                    fd.u01 = I2F(curPartState.data(id++));
                    fd.v01 = I2F(curPartState.data(id++));
                }
                if (f & 4) {
                    fd.u10 = I2F(curPartState.data(id++));
                    fd.v10 = I2F(curPartState.data(id++));
                }
                if (f & 8) {
                    fd.u11 = I2F(curPartState.data(id++));
                    fd.v11 = I2F(curPartState.data(id++));
                }
            }
            */
            if (flag1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
                // 524288 verts [4]
                // verts
                stateModel.f_mesh = true;
                const f = (stateModel.i_transformVerts = state.data(stateDataId++));
                if (f & 1) {
                    stateModel.u00 = I2F(state.data(stateDataId++));
                    stateModel.v00 = I2F(state.data(stateDataId++));
                }
                if (f & 2) {
                    stateModel.u01 = I2F(state.data(stateDataId++));
                    stateModel.v01 = I2F(state.data(stateDataId++));
                }
                if (f & 4) {
                    stateModel.u10 = I2F(state.data(stateDataId++));
                    stateModel.v10 = I2F(state.data(stateDataId++));
                }
                if (f & 8) {
                    stateModel.u11 = I2F(state.data(stateDataId++));
                    stateModel.v11 = I2F(state.data(stateDataId++));
                }
            }

            /*
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
                    const rate = I2F(curPartState.data(id++));
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
            */
            if (flag1 & ss.ssfb.PART_FLAG.PARTS_COLOR) {
                let blendType = -1;
                // 262144 parts color [3]
                const f = state.data(stateDataId++);
                blendType = f & 0xff;
                // 小西 - パーツカラーが乗算合成ならフィルタを使わないように
                stateModel.useColorMatrix = blendType !== 1;
                // [replaced]//stateModel.useColorMatrix = true;
                if (f & 0x1000) {
                    // one color
                    // 小西 - プロパティを一時退避
                    const rate = I2F(state.data(stateDataId++));
                    const bf = state.data(stateDataId++);
                    const bf2 = state.data(stateDataId++);
                    const argb32 = (bf << 16) | bf2;

                    // 小西 - パーツカラーが乗算合成ならtintで処理
                    stateModel.partsColorARGB = argb32 >>> 0;
                    if (blendType === 1) {
                        stateModel.tint = argb32 & 0xffffff;
                    } else {
                        // 小西 - パーツカラーが乗算合成じゃないならフィルタで処理
                        // stateModel.colorMatrix = this.GetColorMatrixFilter(blendType, rate, argb32);
                    }
                }

                if (f & 0x0800) {
                    // LT color
                    stateDataId++;
                    stateDataId++;
                    stateDataId++;
                    // stateModel.colorMatrix = this.defaultColorFilter; // TODO
                }
                if (f & 0x0400) {
                    // RT color
                    stateDataId++;
                    stateDataId++;
                    stateDataId++;
                    // stateModel.colorMatrix = this.defaultColorFilter; // TODO
                }
                if (f & 0x0200) {
                    // LB color
                    stateDataId++;
                    stateDataId++;
                    stateDataId++;
                    // stateModel.colorMatrix = this.defaultColorFilter; // TODO
                }
                if (f & 0x0100) {
                    // RB color
                    stateDataId++;
                    stateDataId++;
                    stateDataId++;
                    // stateModel.colorMatrix = this.defaultColorFilter; // TODO
                }
            }


            /*
            if (f2 & ss.ssfb.PART_FLAG2.MESHDATA) {
                // mesh [1]
                fd.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
                fd.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
                const mp = new Float32Array(fd.meshNum * 3);

                for (let idx = 0; idx < fd.meshNum; idx++) {
                    const mx = I2F(curPartState.data(id++));
                    const my = I2F(curPartState.data(id++));
                    const mz = I2F(curPartState.data(id++));
                    mp[idx * 3 + 0] = mx;
                    mp[idx * 3 + 1] = my;
                    mp[idx * 3 + 2] = mz;

                }
                fd.meshDataPoint = mp;
            }
            */
            // if (flag2 & ss.ssfb.PART_FLAG2.MESHDATA) {
                // mesh [1]
                // stateModel.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
                // stateModel.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
                // const mp = new Float32Array(stateModel.meshNum * 3);

                // for (let idx = 0; idx < stateModel.meshNum; idx++) {
                //     const mx = I2F(state.data(stateDataId++));
                //     const my = I2F(state.data(stateDataId++));
                //     const mz = I2F(state.data(stateDataId++));
                //     mp[idx * 3 + 0] = mx;
                //     mp[idx * 3 + 1] = my;
                //     mp[idx * 3 + 2] = mz;

                // }
                // stateModel.meshDataPoint = mp;
            // }



            stateMap[i] = stateModel;
        }

        return stateMap;
    }


    

}