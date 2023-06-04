/**
 * FrameData
 */
export class FrameData {
  index: number;
  lowflag: number;
  highflag: number;
  priority: number;
  cellIndex: number;
  opacity: number;
  localopacity: number;
  masklimen: number;
  positionX: number;
  positionY: number;
  pivotX: number;
  pivotY: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  localscaleX: number;
  localscaleY: number;
  size_X: number;
  size_Y: number;
  uv_move_X: number;
  uv_move_Y: number;
  uv_rotation: number;
  uv_scale_X: number;
  uv_scale_Y: number;
  boundingRadius: number;
  instanceValue_curKeyframe: number;
  instanceValue_endFrame: number;
  instanceValue_startFrame: number;
  instanceValue_loopNum: number;
  instanceValue_speed: number;
  instanceValue_loopflag: number;
  effectValue_curKeyframe: number;
  effectValue_startTime: number;
  effectValue_speed: number;
  effectValue_loopflag: number;

  /// Add visiblity
  f_hide: boolean;
  /// Add flip
  f_flipH: boolean;
  f_flipV: boolean;
  /// Add mesh
  f_mesh: boolean;
  /// Add vert data
  i_transformVerts: number;
  u00: number;
  v00: number;
  u01: number;
  v01: number;
  u10: number;
  v10: number;
  u11: number;
  v11: number;

  //
  useColorMatrix: boolean;
  colorBlendType: number;
  colorRate: number;
  colorArgb32: number;

  //
  meshIsBind: number;
  meshNum: number;
  meshDataPoint: Float32Array;
  //
  flag1: number;
  flag2: number;

  partsColorARGB: number;

  tint: number;
}
