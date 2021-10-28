// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class EffectParticleElementRotation {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):EffectParticleElementRotation {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

RotationMinValue():number {
  return this.bb!.readFloat32(this.bb_pos);
}

RotationMaxValue():number {
  return this.bb!.readFloat32(this.bb_pos + 4);
}

RotationAddMinValue():number {
  return this.bb!.readFloat32(this.bb_pos + 8);
}

RotationAddMaxValue():number {
  return this.bb!.readFloat32(this.bb_pos + 12);
}

static sizeOf():number {
  return 16;
}

static createEffectParticleElementRotation(builder:flatbuffers.Builder, RotationMinValue: number, RotationMaxValue: number, RotationAddMinValue: number, RotationAddMaxValue: number):flatbuffers.Offset {
  builder.prep(4, 16);
  builder.writeFloat32(RotationAddMaxValue);
  builder.writeFloat32(RotationAddMinValue);
  builder.writeFloat32(RotationMaxValue);
  builder.writeFloat32(RotationMinValue);
  return builder.offset();
}

}