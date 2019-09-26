export class AnimePackAnimationFrameState {
    public index: number;
    public flag1: number;
    public flag2: number;

    public isHide: boolean;
    public isFlipHorizontal: boolean; // f_flipH
    public isFlipVertical: boolean; // f_flipV

    public cellIndex: number;
    
    public positionX: number;
    public positionY: number;
    
    public pivotX: number;
    public pivotY: number;

    public rotationZ: number;

    public scaleX: number = 1;
    public scaleY: number = 1;

    public localScaleX: number = 1;
    public localScaleY: number = 1;

    public opacity: number = 1;
    public localOpacity: number = 1;

    public sizeX: number = 1;
    public sizeY: number = 1;

    public uvMoveX: number;
    public uvMoveY: number;

    public uvRotation: number;
    
    public uvScaleX: number;
    public uvScaleY: number;

    public masklimen: number;
    public priority: number;



    public instanceValue_curKeyframe: number;
    public instanceValue_startFrame: number;
    public instanceValue_endFrame: number;
    public instanceValue_loopNum: number;
    public instanceValue_speed: number;
    public instanceValue_loopflag: number;

    public effectValue_curKeyframe:number;
    public effectValue_startTime: number;
    public effectValue_speed: number;
    public effectValue_loopflag: number;

    public f_mesh: boolean;

    public i_transformVerts: number;

    public u00: number;
    public v00: number;
    public u01: number;
    public v01: number;
    public u10: number;
    public v10: number;
    public u11: number;
    public v11: number;

    public useColorMatrix: boolean;
    public colorMatrix: any;

    public partsColorARGB: number;
    public tint: any;

    public lowflag: number;
    public highflag: number;

}