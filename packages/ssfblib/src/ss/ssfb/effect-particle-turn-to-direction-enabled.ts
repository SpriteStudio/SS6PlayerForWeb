// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class EffectParticleTurnToDirectionEnabled {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):EffectParticleTurnToDirectionEnabled {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

Rotation():number {
  return this.bb!.readFloat32(this.bb_pos);
}

static sizeOf():number {
  return 4;
}

static createEffectParticleTurnToDirectionEnabled(builder:flatbuffers.Builder, Rotation: number):flatbuffers.Offset {
  builder.prep(4, 4);
  builder.writeFloat32(Rotation);
  return builder.offset();
}

}
