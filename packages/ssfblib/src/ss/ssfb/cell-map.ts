// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class CellMap {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):CellMap {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsCellMap(bb:flatbuffers.ByteBuffer, obj?:CellMap):CellMap {
  return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsCellMap(bb:flatbuffers.ByteBuffer, obj?:CellMap):CellMap {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

imagePath():string|null
imagePath(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
imagePath(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

index():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

wrapmode():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

filtermode():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

static startCellMap(builder:flatbuffers.Builder) {
  builder.startObject(5);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addImagePath(builder:flatbuffers.Builder, imagePathOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, imagePathOffset, 0);
}

static addIndex(builder:flatbuffers.Builder, index:number) {
  builder.addFieldInt16(2, index, 0);
}

static addWrapmode(builder:flatbuffers.Builder, wrapmode:number) {
  builder.addFieldInt16(3, wrapmode, 0);
}

static addFiltermode(builder:flatbuffers.Builder, filtermode:number) {
  builder.addFieldInt16(4, filtermode, 0);
}

static endCellMap(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createCellMap(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset, imagePathOffset:flatbuffers.Offset, index:number, wrapmode:number, filtermode:number):flatbuffers.Offset {
  CellMap.startCellMap(builder);
  CellMap.addName(builder, nameOffset);
  CellMap.addImagePath(builder, imagePathOffset);
  CellMap.addIndex(builder, index);
  CellMap.addWrapmode(builder, wrapmode);
  CellMap.addFiltermode(builder, filtermode);
  return CellMap.endCellMap(builder);
}
}
