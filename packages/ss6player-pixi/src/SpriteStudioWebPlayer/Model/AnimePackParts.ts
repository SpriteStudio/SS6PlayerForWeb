import { AnimePackAnimationFrameState } from "./AnimePackAnimationFrameState";

export enum PartType {
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

export enum PART_FLAG {
    INVISIBLE = 1,
    FLIP_H = 2,
    FLIP_V = 4,
    CELL_INDEX = 8,
    POSITION_X = 16,
    POSITION_Y = 32,
    POSITION_Z = 64,
    PIVOT_X = 128,
    PIVOT_Y = 256,
    ROTATIONX = 512,
    ROTATIONY = 1024,
    ROTATIONZ = 2048,
    SCALE_X = 4096,
    SCALE_Y = 8192,
    LOCALSCALE_X = 16384,
    LOCALSCALE_Y = 32768,
    OPACITY = 65536,
    LOCALOPACITY = 131072,
    PARTS_COLOR = 262144,
    VERTEX_TRANSFORM = 524288,
    SIZE_X = 1048576,
    SIZE_Y = 2097152,
    U_MOVE = 4194304,
    V_MOVE = 8388608,
    UV_ROTATION = 16777216,
    U_SCALE = 33554432,
    V_SCALE = 67108864,
    BOUNDINGRADIUS = 134217728,
    MASK = 268435456,
    PRIORITY = 536870912,
    INSTANCE_KEYFRAME = 1073741824,
    EFFECT_KEYFRAME = 2147483648
}
export class AnimePackParts {
    public name: string;

    public type: PartType;

    public boundsType: number;
    public alphaBlendType: number;

    public index: number;
    public parentIndex: number;

    public setupState: AnimePackAnimationFrameState;


}