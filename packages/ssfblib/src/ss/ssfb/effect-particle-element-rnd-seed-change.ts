// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class EffectParticleElementRndSeedChange {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):EffectParticleElementRndSeedChange {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

seed():number {
  return this.bb!.readInt32(this.bb_pos);
}

static sizeOf():number {
  return 4;
}

static createEffectParticleElementRndSeedChange(builder:flatbuffers.Builder, Seed: number):flatbuffers.Offset {
  builder.prep(4, 4);
  builder.writeInt32(Seed);
  return builder.offset();
}

}
