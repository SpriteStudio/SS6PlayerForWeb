// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { CellMap } from '../../ss/ssfb/cell-map';


export class Cell {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Cell {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsCell(bb:flatbuffers.ByteBuffer, obj?:Cell):Cell {
  return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsCell(bb:flatbuffers.ByteBuffer, obj?:Cell):Cell {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

cellMap(obj?:CellMap):CellMap|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new CellMap()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

indexInCellMap():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

x():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

y():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

width():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

height():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

pivotX():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

pivotY():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

u1():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

v1():number {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

u2():number {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

v2():number {
  const offset = this.bb!.__offset(this.bb_pos, 28);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

static startCell(builder:flatbuffers.Builder) {
  builder.startObject(13);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addCellMap(builder:flatbuffers.Builder, cellMapOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, cellMapOffset, 0);
}

static addIndexInCellMap(builder:flatbuffers.Builder, indexInCellMap:number) {
  builder.addFieldInt16(2, indexInCellMap, 0);
}

static addX(builder:flatbuffers.Builder, x:number) {
  builder.addFieldInt16(3, x, 0);
}

static addY(builder:flatbuffers.Builder, y:number) {
  builder.addFieldInt16(4, y, 0);
}

static addWidth(builder:flatbuffers.Builder, width:number) {
  builder.addFieldInt16(5, width, 0);
}

static addHeight(builder:flatbuffers.Builder, height:number) {
  builder.addFieldInt16(6, height, 0);
}

static addPivotX(builder:flatbuffers.Builder, pivotX:number) {
  builder.addFieldFloat32(7, pivotX, 0.0);
}

static addPivotY(builder:flatbuffers.Builder, pivotY:number) {
  builder.addFieldFloat32(8, pivotY, 0.0);
}

static addU1(builder:flatbuffers.Builder, u1:number) {
  builder.addFieldFloat32(9, u1, 0.0);
}

static addV1(builder:flatbuffers.Builder, v1:number) {
  builder.addFieldFloat32(10, v1, 0.0);
}

static addU2(builder:flatbuffers.Builder, u2:number) {
  builder.addFieldFloat32(11, u2, 0.0);
}

static addV2(builder:flatbuffers.Builder, v2:number) {
  builder.addFieldFloat32(12, v2, 0.0);
}

static endCell(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}
