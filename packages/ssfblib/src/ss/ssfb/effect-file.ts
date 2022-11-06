// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { EffectNode } from '../../ss/ssfb/effect-node.js';


export class EffectFile {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):EffectFile {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsEffectFile(bb:flatbuffers.ByteBuffer, obj?:EffectFile):EffectFile {
  return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsEffectFile(bb:flatbuffers.ByteBuffer, obj?:EffectFile):EffectFile {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

fps():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

isLockRandSeed():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

lockRandSeed():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

layoutScaleX():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

layoutScaleY():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

numNodeList():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

effectNode(index: number, obj?:EffectNode):EffectNode|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? (obj || new EffectNode()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

effectNodeLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startEffectFile(builder:flatbuffers.Builder) {
  builder.startObject(8);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addFps(builder:flatbuffers.Builder, fps:number) {
  builder.addFieldInt16(1, fps, 0);
}

static addIsLockRandSeed(builder:flatbuffers.Builder, isLockRandSeed:number) {
  builder.addFieldInt16(2, isLockRandSeed, 0);
}

static addLockRandSeed(builder:flatbuffers.Builder, lockRandSeed:number) {
  builder.addFieldInt16(3, lockRandSeed, 0);
}

static addLayoutScaleX(builder:flatbuffers.Builder, layoutScaleX:number) {
  builder.addFieldInt16(4, layoutScaleX, 0);
}

static addLayoutScaleY(builder:flatbuffers.Builder, layoutScaleY:number) {
  builder.addFieldInt16(5, layoutScaleY, 0);
}

static addNumNodeList(builder:flatbuffers.Builder, numNodeList:number) {
  builder.addFieldInt16(6, numNodeList, 0);
}

static addEffectNode(builder:flatbuffers.Builder, effectNodeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, effectNodeOffset, 0);
}

static createEffectNodeVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startEffectNodeVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endEffectFile(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createEffectFile(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset, fps:number, isLockRandSeed:number, lockRandSeed:number, layoutScaleX:number, layoutScaleY:number, numNodeList:number, effectNodeOffset:flatbuffers.Offset):flatbuffers.Offset {
  EffectFile.startEffectFile(builder);
  EffectFile.addName(builder, nameOffset);
  EffectFile.addFps(builder, fps);
  EffectFile.addIsLockRandSeed(builder, isLockRandSeed);
  EffectFile.addLockRandSeed(builder, lockRandSeed);
  EffectFile.addLayoutScaleX(builder, layoutScaleX);
  EffectFile.addLayoutScaleY(builder, layoutScaleY);
  EffectFile.addNumNodeList(builder, numNodeList);
  EffectFile.addEffectNode(builder, effectNodeOffset);
  return EffectFile.endEffectFile(builder);
}
}
