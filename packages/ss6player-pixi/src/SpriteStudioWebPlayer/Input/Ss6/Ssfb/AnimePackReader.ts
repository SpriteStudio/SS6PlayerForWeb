import { ss } from 'ssfblib';
import { AnimePack } from '../../../Model/AnimePack';
import { AnimePackAnimation } from '../../../Model/AnimePackAnimation';
import { AnimePackAnimationFrame } from '../../../Model/AnimePackAnimationFrame';
import { AnimePackAnimationFrameState } from '../../../Model/AnimePackAnimationFrameState';
import { AnimePackParts, PartType } from '../../../Model/AnimePackParts';
import { AnimePackAnimationMeshsDataUv } from '../../../Model/AnimePackAnimationMeshsDataUv';
import { AnimePackAnimationMeshsDataIndices } from '../../../Model/AnimePackAnimationMeshsDataIndices';



enum SsPartType {
    Invalid = -1,
    Nulltype = 0,
    Normal = 1,
    Text = 2,
    Instance = 3,
    Armature = 4,
    Effect = 5,
    Mesh = 6,
    Movenode = 7,
    Constraint = 8,
    Mask = 9,
    Joint = 10,
    Bonepoint = 11
}

export class AnimePackReader {

    private currentAnimePackModel: AnimePack;
    private currentAnimePackAnimationModel: AnimePackAnimation;
    private currentSetupStateMap: Map<number, AnimePackAnimationFrameState>;

    
    public createAnimePackMap(projectData: ss.ssfb.ProjectData) {
        if (projectData == null) {
            return;
        }
        const animePacksLength = projectData.animePacksLength();
        const animePackModelMap: Map<string, AnimePack> = new Map<string, AnimePack>();
        for (let i = 0; i < animePacksLength; i++) {
            const animePack = projectData.animePacks(i);
            const animePackModel = new AnimePack();
            this.currentAnimePackModel = animePackModel;
            animePackModel.name = animePack.name();

            animePackModelMap[animePackModel.name] = animePackModel;

            animePackModel.partsModelMap = this.createPartsMap(animePack);


            animePackModel.animationMap = this.createAnimationMap(animePack);

            
        }
        return animePackModelMap;
    }

    private createPartsMap(animePack: any) {
        const partsLength = animePack.partsLength();
        const partsModelMap: Map<string, AnimePackParts> = new Map<string, AnimePackParts>();
        for (let i = 0; i < partsLength; i++) {
            const parts = animePack.parts(i);
            const partsModel = new AnimePackParts();
            const ssPartType = parts.type();
            partsModel.type = parts.type();
            partsModel.name = parts.name();
            partsModel.index = parts.index();
            partsModel.parentIndex = parts.parentIndex();
            partsModel.boundsType = parts.boundsType();
            partsModel.alphaBlendType = parts.alphaBlendType();


            // Invalid = -1,
            // Nulltype = 0,
            // Normal = 1,
            // Text = 2,
            // Instance = 3,
            // Armature = 4,
            // Effect = 5,
            // Mesh = 6,
            // Movenode = 7,
            // Constraint = 8,
            // Mask = 9,
            // Joint = 10,
            // Bonepoint = 11            
            let partType: PartType = null;
            switch (ssPartType){
                case SsPartType.Invalid:
                    partType = PartType.Invalid;
                    break;
                case SsPartType.Nulltype:
                    partType = PartType.Nulltype;
                    break;
                case SsPartType.Normal:
                    partType = PartType.Normal;
                    break;
                case SsPartType.Text:
                    partType = PartType.Text;
                    break;
                case SsPartType.Instance:
                    partType = PartType.Instance;
                    break;
                case SsPartType.Armature:
                    partType = PartType.Armature;
                    break;
                case SsPartType.Effect:
                    partType = PartType.Effect;
                    break;
                case SsPartType.Mesh:
                    partType = PartType.Mesh;
                    break;
                case SsPartType.Movenode:
                    partType = PartType.Movenode;
                    break;
                case SsPartType.Constraint:
                    partType = PartType.Constraint;
                    break;
                case SsPartType.Mask:
                    partType = PartType.Mask;
                    break;
                case SsPartType.Joint:
                    partType = PartType.Joint;
                    break;
                case SsPartType.Bonepoint:
                    partType = PartType.Bonepoint;
                    break;
            }

            partsModelMap[partsModel.index] = partsModel;
        }
        return partsModelMap;
    }

    private createAnimationMap(animePack: any) {
        const animationModelMap: Map<string, AnimePackAnimation> = new Map<string, AnimePackAnimation>();
        const animationsLength = animePack.animationsLength();
        for (let i = 0; i < animationsLength; i++) {
            const animation = animePack.animations(i);
            const animationModel = new AnimePackAnimation();
            this.currentAnimePackAnimationModel = animationModel;
            animationModel.name = animation.name();
            animationModel.fps = animation.fps();
            animationModel.startFrame = animation.startFrames();
            animationModel.endFrame = animation.endFrames();
            animationModel.totalFrame = animation.totalFrames();
            // animationModel.isSetup = animation.isSetup();

            // DefaultData ( AnimationInitialData )
            const setupStateMap = this.createAnimationSetupStateMap(animation);
            animationModel.setupStateMap = setupStateMap;
            this.currentSetupStateMap = setupStateMap;

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

    private createAnimationSetupStateMap(animation: any) {
        const defaultDataMap: Map<number, AnimePackAnimationFrameState> = new Map<number, AnimePackAnimationFrameState>();
        const defaultDataLength = animation.defaultDataLength();
        for (let i = 0; i < defaultDataLength; i++) {
            const setupFrameStateModel = new AnimePackAnimationFrameState();
            const defaultData = animation.defaultData(i);

            setupFrameStateModel.index = defaultData.index();
            // index: curDefaultData.index(),
            // lowflag: curDefaultData.lowflag(),
            // highflag: curDefaultData.highflag(),
            setupFrameStateModel.priority = defaultData.priority();
            // priority: curDefaultData.priority(),
            setupFrameStateModel.cellIndex = defaultData.cellIndex();
            // cellIndex: curDefaultData.cellIndex(),
            setupFrameStateModel.opacity = defaultData.opacity();
            // opacity: curDefaultData.opacity(),
            setupFrameStateModel.localOpacity = defaultData.localopacity();
            // localopacity: curDefaultData.localopacity(),
            setupFrameStateModel.masklimen = defaultData.masklimen();
            // masklimen: curDefaultData.masklimen(),
            setupFrameStateModel.positionX = defaultData.positionX();
            // positionX: curDefaultData.positionX(),
            setupFrameStateModel.positionY = defaultData.positionY();
            // positionY: curDefaultData.positionY(),
            setupFrameStateModel.pivotX = defaultData.pivotX();
            // pivotX: curDefaultData.pivotX(),
            setupFrameStateModel.pivotY = defaultData.pivotY();
            // pivotY: curDefaultData.pivotY(),
            setupFrameStateModel.pivotY = defaultData.pivotY();
            // rotationX: curDefaultData.rotationX(),
            // rotationY: curDefaultData.rotationY(),
            setupFrameStateModel.rotationZ = defaultData.rotationZ();
            // rotationZ: curDefaultData.rotationZ(),
            setupFrameStateModel.scaleX = defaultData.scaleX();
            // scaleX: curDefaultData.scaleX(),
            setupFrameStateModel.scaleY = defaultData.scaleY();
            // scaleY: curDefaultData.scaleY(),
            setupFrameStateModel.localScaleX = defaultData.localscaleX();
            // localscaleX: curDefaultData.localscaleX(),
            setupFrameStateModel.localScaleY = defaultData.localscaleY();
            // localscaleY: curDefaultData.localscaleY(),
            setupFrameStateModel.sizeX = defaultData.sizeX();
            // size_X: curDefaultData.sizeX(),
            setupFrameStateModel.sizeY = defaultData.sizeY();
            // size_Y: curDefaultData.sizeY(),
            setupFrameStateModel.uvMoveX = defaultData.uvMoveX();
            // uv_move_X: curDefaultData.uvMoveX(),
            setupFrameStateModel.uvMoveY = defaultData.uvMoveY();
            // uv_move_Y: curDefaultData.uvMoveY(),
            setupFrameStateModel.uvRotation = defaultData.uvRotation();
            // uv_rotation: curDefaultData.uvRotation(),
            setupFrameStateModel.uvScaleX = defaultData.uvScaleX();
            // uv_scale_X: curDefaultData.uvScaleX(),
            setupFrameStateModel.uvScaleY = defaultData.uvScaleY();
            // uv_scale_Y: curDefaultData.uvScaleY(),
            // boundingRadius: curDefaultData.boundingRadius(),
            setupFrameStateModel.instanceValue_curKeyframe = defaultData.instanceValueCurKeyframe();
            // instanceValue_curKeyframe: curDefaultData.instanceValueCurKeyframe(),
            setupFrameStateModel.instanceValue_endFrame = defaultData.instanceValueEndFrame();
            // instanceValue_endFrame: curDefaultData.instanceValueEndFrame(),
            setupFrameStateModel.instanceValue_startFrame = defaultData.instanceValueStartFrame();
            // instanceValue_startFrame: curDefaultData.instanceValueStartFrame(),
            setupFrameStateModel.instanceValue_loopNum = defaultData.instanceValueLoopNum();
            // instanceValue_loopNum: curDefaultData.instanceValueLoopNum(),
            setupFrameStateModel.instanceValue_speed = defaultData.instanceValueSpeed();
            // instanceValue_speed: curDefaultData.instanceValueSpeed(),
            setupFrameStateModel.instanceValue_loopflag = defaultData.instanceValueLoopflag();
            // instanceValue_loopflag: curDefaultData.instanceValueLoopflag(),
            setupFrameStateModel.effectValue_curKeyframe = defaultData.effectValueCurKeyframe();
            // effectValue_curKeyframe: curDefaultData.effectValueCurKeyframe(),
            setupFrameStateModel.effectValue_startTime = defaultData.effectValueStartTime();
            // effectValue_startTime: curDefaultData.effectValueStartTime(),
            setupFrameStateModel.effectValue_speed = defaultData.effectValueSpeed();
            // effectValue_speed: curDefaultData.effectValueSpeed(),
            setupFrameStateModel.effectValue_loopflag = defaultData.effectValueLoopflag();
            // effectValue_loopflag: curDefaultData.effectValueLoopflag(),


            defaultDataMap[setupFrameStateModel.index] = setupFrameStateModel;
        }


        return defaultDataMap;
    }

    private createAnimationMeshsDataUvMap(animation: any){
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
    private createAnimationMeshsDataIndicesMap(animation: any) {
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

    private createAnimationFrameMap(animation: any) {
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



    private createAnimationFrameStateMap(frameData: any) {
        const stateMap: Map<number, AnimePackAnimationFrameState> = new Map<number, AnimePackAnimationFrameState>();
        const statesLength = frameData.statesLength();
        for (let i = 0; i < statesLength; i++) {
            const state = frameData.states(i);
            
            const index = state.index();

            // stateModel に DefaultData 設定
            const setupStateModel = this.currentSetupStateMap[index];
            const stateModel = Object.assign({}, setupStateModel);

            
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
            if (flag1 & ss.ssfb.PART_FLAG.CELL_INDEX) {
                stateModel.cellIndex = state.data(stateDataId++); // 8 Cell ID
            }
            if (flag1 & ss.ssfb.PART_FLAG.POSITION_X) {
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
            const currentAnimePackAnimationModel = this.currentAnimePackAnimationModel;

            if (flag2 & ss.ssfb.PART_FLAG2.MESHDATA) {
                // mesh [1]
                const meshsDataUvMap = currentAnimePackAnimationModel.meshsDataUvMap[index];
                const uvArray = meshsDataUvMap.uvArray;
                stateModel.meshIsBind = uvArray[0]
                stateModel.meshNum = uvArray[1];
                // stateModel.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
                // stateModel.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
                const mp = new Float32Array(stateModel.meshNum * 3);

                for (let idx = 0; idx < stateModel.meshNum; idx++) {
                    const mx = I2F(state.data(stateDataId++));
                    const my = I2F(state.data(stateDataId++));
                    const mz = I2F(state.data(stateDataId++));
                    mp[idx * 3 + 0] = mx;
                    mp[idx * 3 + 1] = my;
                    mp[idx * 3 + 2] = mz;

                }
                stateModel.meshDataPoint = mp;
            }

            // NULLパーツにダミーのセルIDを設定する
            const parts = this.currentAnimePackModel.partsModelMap[index];
            if ( parts.type === 0 ) {
                stateModel.cellIndex = -2;
            }

            stateMap[i] = stateModel;
        }

        return stateMap;
    }

}