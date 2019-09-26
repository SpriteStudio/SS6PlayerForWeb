export class AnimePackAnimationFrameState {
    public index: number;
    public flag1: number = 0;
    public flag2: number = 0;

    public isHide: boolean = false;
    public get f_hide() {
        return this.isHide;
    }

    public isFlipHorizontal: boolean = false; // f_flipH
    public isFlipVertical: boolean = false; // f_flipV

    public cellIndex: number;
    
    public positionX: number = 0;
    public positionY: number = 0;
    
    public pivotX: number = 0;
    public pivotY: number = 0;

    public rotationX: number = 0;
    public rotationY: number = 0;
    public rotationZ: number = 0;

    public scaleX: number = 1;
    public scaleY: number = 1;

    public localScaleX: number = 1;
    public get localscalex() {
        return this.localScaleX;
    }
    public localScaleY: number = 1;
    public get localscaley() {
        return this.localScaleX;
    }

    public opacity: number = 1;
    public localOpacity: number = 1;
    public get localopacity() {
        return this.localOpacity;
    }

    public sizeX: number = 1;
    public sizeY: number = 1;

    public uvMoveX: number = 0;
    public get uv_move_X() {
        return this.uvMoveX;
    }
    public uvMoveY: number = 0;
    public get uv_move_Y() {
        return this.uvMoveY;
    }

    public uvRotation: number;
    public get uv_rotation() {
        return this.uvRotation;
    }
    
    public uvScaleX: number = 0;
    public get uv_scale_x() {
        return this.uvScaleX;
    }
    public uvScaleY: number = 0;
    public get uv_scale_y() {
        return this.uvScaleY;
    }

    public masklimen: number;
    public priority: number;



    public instanceValue_curKeyframe: number = 0;
    public instanceValue_startFrame: number = 0;
    public instanceValue_endFrame: number = 0;
    public instanceValue_loopNum: number = 0;
    public instanceValue_speed: number = 0;
    public instanceValue_loopflag: number = 0;

    public effectValue_curKeyframe:number = 0;
    public effectValue_startTime: number = 0;
    public effectValue_speed: number = 0;
    public effectValue_loopflag: number = 0;

    public f_mesh: boolean = false;

    public i_transformVerts: number = 0;

    public u00: number = 0;
    public v00: number = 0;
    public u01: number = 0;
    public v01: number = 0;
    public u10: number = 0;
    public v10: number = 0;
    public u11: number = 0;
    public v11: number = 0;

    public useColorMatrix: boolean;
    public colorMatrix: any;

    public partsColorARGB: number;
    public tint: any;


    public boundingRadius: number = 0;


    public lowflag: number = 0;
    public highflag: number = 0;



}