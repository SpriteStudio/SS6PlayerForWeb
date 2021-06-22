// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class userDataString {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):userDataString {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsuserDataString(bb:flatbuffers.ByteBuffer, obj?:userDataString):userDataString {
  return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsuserDataString(bb:flatbuffers.ByteBuffer, obj?:userDataString):userDataString {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

length():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

data():string|null
data(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
data(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startuserDataString(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addLength(builder:flatbuffers.Builder, length:number) {
  builder.addFieldInt32(0, length, 0);
}

static addData(builder:flatbuffers.Builder, dataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, dataOffset, 0);
}

static enduserDataString(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createuserDataString(builder:flatbuffers.Builder, length:number, dataOffset:flatbuffers.Offset):flatbuffers.Offset {
  userDataString.startuserDataString(builder);
  userDataString.addLength(builder, length);
  userDataString.addData(builder, dataOffset);
  return userDataString.enduserDataString(builder);
}
}
