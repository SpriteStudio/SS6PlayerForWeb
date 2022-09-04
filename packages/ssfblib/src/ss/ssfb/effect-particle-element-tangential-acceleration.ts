// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class EffectParticleElementTangentialAcceleration {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):EffectParticleElementTangentialAcceleration {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

accelerationMinValue():number {
  return this.bb!.readFloat32(this.bb_pos);
}

accelerationMaxValue():number {
  return this.bb!.readFloat32(this.bb_pos + 4);
}

static sizeOf():number {
  return 8;
}

static createEffectParticleElementTangentialAcceleration(builder:flatbuffers.Builder, AccelerationMinValue: number, AccelerationMaxValue: number):flatbuffers.Offset {
  builder.prep(4, 8);
  builder.writeFloat32(AccelerationMaxValue);
  builder.writeFloat32(AccelerationMinValue);
  return builder.offset();
}

}
