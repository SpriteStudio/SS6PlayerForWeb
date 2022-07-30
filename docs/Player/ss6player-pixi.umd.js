/**
 * -----------------------------------------------------------
 * SS6Player For pixi.js v1.7.9
 *
 * Copyright(C) CRI Middleware Co., Ltd.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@pixi/loaders'), require('@pixi/display'), require('@pixi/mesh-extras'), require('@pixi/ticker'), require('@pixi/filter-color-matrix'), require('@pixi/constants')) :
    typeof define === 'function' && define.amd ? define(['exports', '@pixi/loaders', '@pixi/display', '@pixi/mesh-extras', '@pixi/ticker', '@pixi/filter-color-matrix', '@pixi/constants'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ss6PlayerPixi = {}, global.PIXI, global.PIXI, global.PIXI, global.PIXI, global.PIXI.filters, global.PIXI));
})(this, (function (exports, loaders, display, meshExtras, ticker, filterColorMatrix, constants) { 'use strict';

    const SIZEOF_INT = 4;
    const FILE_IDENTIFIER_LENGTH = 4;

    const int32$1 = new Int32Array(2);
    const float32 = new Float32Array(int32$1.buffer);
    const float64 = new Float64Array(int32$1.buffer);
    const isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

    var Encoding$1;
    (function (Encoding) {
        Encoding[Encoding["UTF8_BYTES"] = 1] = "UTF8_BYTES";
        Encoding[Encoding["UTF16_STRING"] = 2] = "UTF16_STRING";
    })(Encoding$1 || (Encoding$1 = {}));

    class ByteBuffer {
        /**
         * Create a new ByteBuffer with a given array of bytes (`Uint8Array`)
         */
        constructor(bytes_) {
            this.bytes_ = bytes_;
            this.position_ = 0;
        }
        /**
         * Create and allocate a new ByteBuffer with a given size.
         */
        static allocate(byte_size) {
            return new ByteBuffer(new Uint8Array(byte_size));
        }
        clear() {
            this.position_ = 0;
        }
        /**
         * Get the underlying `Uint8Array`.
         */
        bytes() {
            return this.bytes_;
        }
        /**
         * Get the buffer's position.
         */
        position() {
            return this.position_;
        }
        /**
         * Set the buffer's position.
         */
        setPosition(position) {
            this.position_ = position;
        }
        /**
         * Get the buffer's capacity.
         */
        capacity() {
            return this.bytes_.length;
        }
        readInt8(offset) {
            return this.readUint8(offset) << 24 >> 24;
        }
        readUint8(offset) {
            return this.bytes_[offset];
        }
        readInt16(offset) {
            return this.readUint16(offset) << 16 >> 16;
        }
        readUint16(offset) {
            return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
        }
        readInt32(offset) {
            return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
        }
        readUint32(offset) {
            return this.readInt32(offset) >>> 0;
        }
        readInt64(offset) {
            return BigInt.asIntN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
        }
        readUint64(offset) {
            return BigInt.asUintN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
        }
        readFloat32(offset) {
            int32$1[0] = this.readInt32(offset);
            return float32[0];
        }
        readFloat64(offset) {
            int32$1[isLittleEndian ? 0 : 1] = this.readInt32(offset);
            int32$1[isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
            return float64[0];
        }
        writeInt8(offset, value) {
            this.bytes_[offset] = value;
        }
        writeUint8(offset, value) {
            this.bytes_[offset] = value;
        }
        writeInt16(offset, value) {
            this.bytes_[offset] = value;
            this.bytes_[offset + 1] = value >> 8;
        }
        writeUint16(offset, value) {
            this.bytes_[offset] = value;
            this.bytes_[offset + 1] = value >> 8;
        }
        writeInt32(offset, value) {
            this.bytes_[offset] = value;
            this.bytes_[offset + 1] = value >> 8;
            this.bytes_[offset + 2] = value >> 16;
            this.bytes_[offset + 3] = value >> 24;
        }
        writeUint32(offset, value) {
            this.bytes_[offset] = value;
            this.bytes_[offset + 1] = value >> 8;
            this.bytes_[offset + 2] = value >> 16;
            this.bytes_[offset + 3] = value >> 24;
        }
        writeInt64(offset, value) {
            this.writeInt32(offset, Number(BigInt.asIntN(32, value)));
            this.writeInt32(offset + 4, Number(BigInt.asIntN(32, value >> BigInt(32))));
        }
        writeUint64(offset, value) {
            this.writeUint32(offset, Number(BigInt.asUintN(32, value)));
            this.writeUint32(offset + 4, Number(BigInt.asUintN(32, value >> BigInt(32))));
        }
        writeFloat32(offset, value) {
            float32[0] = value;
            this.writeInt32(offset, int32$1[0]);
        }
        writeFloat64(offset, value) {
            float64[0] = value;
            this.writeInt32(offset, int32$1[isLittleEndian ? 0 : 1]);
            this.writeInt32(offset + 4, int32$1[isLittleEndian ? 1 : 0]);
        }
        /**
         * Return the file identifier.   Behavior is undefined for FlatBuffers whose
         * schema does not include a file_identifier (likely points at padding or the
         * start of a the root vtable).
         */
        getBufferIdentifier() {
            if (this.bytes_.length < this.position_ + SIZEOF_INT +
                FILE_IDENTIFIER_LENGTH) {
                throw new Error('FlatBuffers: ByteBuffer is too short to contain an identifier.');
            }
            let result = "";
            for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
                result += String.fromCharCode(this.readInt8(this.position_ + SIZEOF_INT + i));
            }
            return result;
        }
        /**
         * Look up a field in the vtable, return an offset into the object, or 0 if the
         * field is not present.
         */
        __offset(bb_pos, vtable_offset) {
            const vtable = bb_pos - this.readInt32(bb_pos);
            return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
        }
        /**
         * Initialize any Table-derived type to point to the union at the given offset.
         */
        __union(t, offset) {
            t.bb_pos = offset + this.readInt32(offset);
            t.bb = this;
            return t;
        }
        /**
         * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
         * This allocates a new string and converts to wide chars upon each access.
         *
         * To avoid the conversion to UTF-16, pass Encoding.UTF8_BYTES as
         * the "optionalEncoding" argument. This is useful for avoiding conversion to
         * and from UTF-16 when the data will just be packaged back up in another
         * FlatBuffer later on.
         *
         * @param offset
         * @param opt_encoding Defaults to UTF16_STRING
         */
        __string(offset, opt_encoding) {
            offset += this.readInt32(offset);
            const length = this.readInt32(offset);
            let result = '';
            let i = 0;
            offset += SIZEOF_INT;
            if (opt_encoding === Encoding$1.UTF8_BYTES) {
                return this.bytes_.subarray(offset, offset + length);
            }
            while (i < length) {
                let codePoint;
                // Decode UTF-8
                const a = this.readUint8(offset + i++);
                if (a < 0xC0) {
                    codePoint = a;
                }
                else {
                    const b = this.readUint8(offset + i++);
                    if (a < 0xE0) {
                        codePoint =
                            ((a & 0x1F) << 6) |
                                (b & 0x3F);
                    }
                    else {
                        const c = this.readUint8(offset + i++);
                        if (a < 0xF0) {
                            codePoint =
                                ((a & 0x0F) << 12) |
                                    ((b & 0x3F) << 6) |
                                    (c & 0x3F);
                        }
                        else {
                            const d = this.readUint8(offset + i++);
                            codePoint =
                                ((a & 0x07) << 18) |
                                    ((b & 0x3F) << 12) |
                                    ((c & 0x3F) << 6) |
                                    (d & 0x3F);
                        }
                    }
                }
                // Encode UTF-16
                if (codePoint < 0x10000) {
                    result += String.fromCharCode(codePoint);
                }
                else {
                    codePoint -= 0x10000;
                    result += String.fromCharCode((codePoint >> 10) + 0xD800, (codePoint & ((1 << 10) - 1)) + 0xDC00);
                }
            }
            return result;
        }
        /**
         * Handle unions that can contain string as its member, if a Table-derived type then initialize it,
         * if a string then return a new one
         *
         * WARNING: strings are immutable in JS so we can't change the string that the user gave us, this
         * makes the behaviour of __union_with_string different compared to __union
         */
        __union_with_string(o, offset) {
            if (typeof o === 'string') {
                return this.__string(offset);
            }
            return this.__union(o, offset);
        }
        /**
         * Retrieve the relative offset stored at "offset"
         */
        __indirect(offset) {
            return offset + this.readInt32(offset);
        }
        /**
         * Get the start of data of a vector whose offset is stored at "offset" in this object.
         */
        __vector(offset) {
            return offset + this.readInt32(offset) + SIZEOF_INT; // data starts after the length
        }
        /**
         * Get the length of a vector whose offset is stored at "offset" in this object.
         */
        __vector_len(offset) {
            return this.readInt32(offset + this.readInt32(offset));
        }
        __has_identifier(ident) {
            if (ident.length != FILE_IDENTIFIER_LENGTH) {
                throw new Error('FlatBuffers: file identifier must be length ' +
                    FILE_IDENTIFIER_LENGTH);
            }
            for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
                if (ident.charCodeAt(i) != this.readInt8(this.position() + SIZEOF_INT + i)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * A helper function for generating list for obj api
         */
        createScalarList(listAccessor, listLength) {
            const ret = [];
            for (let i = 0; i < listLength; ++i) {
                if (listAccessor(i) !== null) {
                    ret.push(listAccessor(i));
                }
            }
            return ret;
        }
        /**
         * A helper function for generating list for obj api
         * @param listAccessor function that accepts an index and return data at that index
         * @param listLength listLength
         * @param res result list
         */
        createObjList(listAccessor, listLength) {
            const ret = [];
            for (let i = 0; i < listLength; ++i) {
                const val = listAccessor(i);
                if (val !== null) {
                    ret.push(val.unpack());
                }
            }
            return ret;
        }
    }

    const SIZE_PREFIX_LENGTH = 4;
    const int32 = new Int32Array(2);
    new Float32Array(int32.buffer);
    new Float64Array(int32.buffer);
    new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
    var Encoding;
    (function(Encoding2) {
      Encoding2[Encoding2["UTF8_BYTES"] = 1] = "UTF8_BYTES";
      Encoding2[Encoding2["UTF16_STRING"] = 2] = "UTF16_STRING";
    })(Encoding || (Encoding = {}));
    class AnimationInitialData {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsAnimationInitialData(bb, obj) {
        return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsAnimationInitialData(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      index() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      lowflag() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      highflag() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      priority() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      cellIndex() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      opacity() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      localopacity() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      masklimen() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      positionX() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      positionY() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      positionZ() {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      pivotX() {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      pivotY() {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      rotationX() {
        const offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      rotationY() {
        const offset = this.bb.__offset(this.bb_pos, 32);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      rotationZ() {
        const offset = this.bb.__offset(this.bb_pos, 34);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      scaleX() {
        const offset = this.bb.__offset(this.bb_pos, 36);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      scaleY() {
        const offset = this.bb.__offset(this.bb_pos, 38);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      localscaleX() {
        const offset = this.bb.__offset(this.bb_pos, 40);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      localscaleY() {
        const offset = this.bb.__offset(this.bb_pos, 42);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      sizeX() {
        const offset = this.bb.__offset(this.bb_pos, 44);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      sizeY() {
        const offset = this.bb.__offset(this.bb_pos, 46);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      uvMoveX() {
        const offset = this.bb.__offset(this.bb_pos, 48);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      uvMoveY() {
        const offset = this.bb.__offset(this.bb_pos, 50);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      uvRotation() {
        const offset = this.bb.__offset(this.bb_pos, 52);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      uvScaleX() {
        const offset = this.bb.__offset(this.bb_pos, 54);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      uvScaleY() {
        const offset = this.bb.__offset(this.bb_pos, 56);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      boundingRadius() {
        const offset = this.bb.__offset(this.bb_pos, 58);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      instanceValueCurKeyframe() {
        const offset = this.bb.__offset(this.bb_pos, 60);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      instanceValueStartFrame() {
        const offset = this.bb.__offset(this.bb_pos, 62);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      instanceValueEndFrame() {
        const offset = this.bb.__offset(this.bb_pos, 64);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      instanceValueLoopNum() {
        const offset = this.bb.__offset(this.bb_pos, 66);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      instanceValueSpeed() {
        const offset = this.bb.__offset(this.bb_pos, 68);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      instanceValueLoopflag() {
        const offset = this.bb.__offset(this.bb_pos, 70);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      effectValueCurKeyframe() {
        const offset = this.bb.__offset(this.bb_pos, 72);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      effectValueStartTime() {
        const offset = this.bb.__offset(this.bb_pos, 74);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      effectValueSpeed() {
        const offset = this.bb.__offset(this.bb_pos, 76);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      effectValueLoopflag() {
        const offset = this.bb.__offset(this.bb_pos, 78);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      static startAnimationInitialData(builder) {
        builder.startObject(38);
      }
      static addIndex(builder, index) {
        builder.addFieldInt16(0, index, 0);
      }
      static addLowflag(builder, lowflag) {
        builder.addFieldInt32(1, lowflag, 0);
      }
      static addHighflag(builder, highflag) {
        builder.addFieldInt32(2, highflag, 0);
      }
      static addPriority(builder, priority) {
        builder.addFieldInt16(3, priority, 0);
      }
      static addCellIndex(builder, cellIndex) {
        builder.addFieldInt16(4, cellIndex, 0);
      }
      static addOpacity(builder, opacity) {
        builder.addFieldInt16(5, opacity, 0);
      }
      static addLocalopacity(builder, localopacity) {
        builder.addFieldInt16(6, localopacity, 0);
      }
      static addMasklimen(builder, masklimen) {
        builder.addFieldInt16(7, masklimen, 0);
      }
      static addPositionX(builder, positionX) {
        builder.addFieldFloat32(8, positionX, 0);
      }
      static addPositionY(builder, positionY) {
        builder.addFieldFloat32(9, positionY, 0);
      }
      static addPositionZ(builder, positionZ) {
        builder.addFieldFloat32(10, positionZ, 0);
      }
      static addPivotX(builder, pivotX) {
        builder.addFieldFloat32(11, pivotX, 0);
      }
      static addPivotY(builder, pivotY) {
        builder.addFieldFloat32(12, pivotY, 0);
      }
      static addRotationX(builder, rotationX) {
        builder.addFieldFloat32(13, rotationX, 0);
      }
      static addRotationY(builder, rotationY) {
        builder.addFieldFloat32(14, rotationY, 0);
      }
      static addRotationZ(builder, rotationZ) {
        builder.addFieldFloat32(15, rotationZ, 0);
      }
      static addScaleX(builder, scaleX) {
        builder.addFieldFloat32(16, scaleX, 0);
      }
      static addScaleY(builder, scaleY) {
        builder.addFieldFloat32(17, scaleY, 0);
      }
      static addLocalscaleX(builder, localscaleX) {
        builder.addFieldFloat32(18, localscaleX, 0);
      }
      static addLocalscaleY(builder, localscaleY) {
        builder.addFieldFloat32(19, localscaleY, 0);
      }
      static addSizeX(builder, sizeX) {
        builder.addFieldFloat32(20, sizeX, 0);
      }
      static addSizeY(builder, sizeY) {
        builder.addFieldFloat32(21, sizeY, 0);
      }
      static addUvMoveX(builder, uvMoveX) {
        builder.addFieldFloat32(22, uvMoveX, 0);
      }
      static addUvMoveY(builder, uvMoveY) {
        builder.addFieldFloat32(23, uvMoveY, 0);
      }
      static addUvRotation(builder, uvRotation) {
        builder.addFieldFloat32(24, uvRotation, 0);
      }
      static addUvScaleX(builder, uvScaleX) {
        builder.addFieldFloat32(25, uvScaleX, 0);
      }
      static addUvScaleY(builder, uvScaleY) {
        builder.addFieldFloat32(26, uvScaleY, 0);
      }
      static addBoundingRadius(builder, boundingRadius) {
        builder.addFieldFloat32(27, boundingRadius, 0);
      }
      static addInstanceValueCurKeyframe(builder, instanceValueCurKeyframe) {
        builder.addFieldInt32(28, instanceValueCurKeyframe, 0);
      }
      static addInstanceValueStartFrame(builder, instanceValueStartFrame) {
        builder.addFieldInt32(29, instanceValueStartFrame, 0);
      }
      static addInstanceValueEndFrame(builder, instanceValueEndFrame) {
        builder.addFieldInt32(30, instanceValueEndFrame, 0);
      }
      static addInstanceValueLoopNum(builder, instanceValueLoopNum) {
        builder.addFieldInt32(31, instanceValueLoopNum, 0);
      }
      static addInstanceValueSpeed(builder, instanceValueSpeed) {
        builder.addFieldFloat32(32, instanceValueSpeed, 0);
      }
      static addInstanceValueLoopflag(builder, instanceValueLoopflag) {
        builder.addFieldInt32(33, instanceValueLoopflag, 0);
      }
      static addEffectValueCurKeyframe(builder, effectValueCurKeyframe) {
        builder.addFieldInt32(34, effectValueCurKeyframe, 0);
      }
      static addEffectValueStartTime(builder, effectValueStartTime) {
        builder.addFieldInt32(35, effectValueStartTime, 0);
      }
      static addEffectValueSpeed(builder, effectValueSpeed) {
        builder.addFieldFloat32(36, effectValueSpeed, 0);
      }
      static addEffectValueLoopflag(builder, effectValueLoopflag) {
        builder.addFieldInt32(37, effectValueLoopflag, 0);
      }
      static endAnimationInitialData(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createAnimationInitialData(builder, index, lowflag, highflag, priority, cellIndex, opacity, localopacity, masklimen, positionX, positionY, positionZ, pivotX, pivotY, rotationX, rotationY, rotationZ, scaleX, scaleY, localscaleX, localscaleY, sizeX, sizeY, uvMoveX, uvMoveY, uvRotation, uvScaleX, uvScaleY, boundingRadius, instanceValueCurKeyframe, instanceValueStartFrame, instanceValueEndFrame, instanceValueLoopNum, instanceValueSpeed, instanceValueLoopflag, effectValueCurKeyframe, effectValueStartTime, effectValueSpeed, effectValueLoopflag) {
        AnimationInitialData.startAnimationInitialData(builder);
        AnimationInitialData.addIndex(builder, index);
        AnimationInitialData.addLowflag(builder, lowflag);
        AnimationInitialData.addHighflag(builder, highflag);
        AnimationInitialData.addPriority(builder, priority);
        AnimationInitialData.addCellIndex(builder, cellIndex);
        AnimationInitialData.addOpacity(builder, opacity);
        AnimationInitialData.addLocalopacity(builder, localopacity);
        AnimationInitialData.addMasklimen(builder, masklimen);
        AnimationInitialData.addPositionX(builder, positionX);
        AnimationInitialData.addPositionY(builder, positionY);
        AnimationInitialData.addPositionZ(builder, positionZ);
        AnimationInitialData.addPivotX(builder, pivotX);
        AnimationInitialData.addPivotY(builder, pivotY);
        AnimationInitialData.addRotationX(builder, rotationX);
        AnimationInitialData.addRotationY(builder, rotationY);
        AnimationInitialData.addRotationZ(builder, rotationZ);
        AnimationInitialData.addScaleX(builder, scaleX);
        AnimationInitialData.addScaleY(builder, scaleY);
        AnimationInitialData.addLocalscaleX(builder, localscaleX);
        AnimationInitialData.addLocalscaleY(builder, localscaleY);
        AnimationInitialData.addSizeX(builder, sizeX);
        AnimationInitialData.addSizeY(builder, sizeY);
        AnimationInitialData.addUvMoveX(builder, uvMoveX);
        AnimationInitialData.addUvMoveY(builder, uvMoveY);
        AnimationInitialData.addUvRotation(builder, uvRotation);
        AnimationInitialData.addUvScaleX(builder, uvScaleX);
        AnimationInitialData.addUvScaleY(builder, uvScaleY);
        AnimationInitialData.addBoundingRadius(builder, boundingRadius);
        AnimationInitialData.addInstanceValueCurKeyframe(builder, instanceValueCurKeyframe);
        AnimationInitialData.addInstanceValueStartFrame(builder, instanceValueStartFrame);
        AnimationInitialData.addInstanceValueEndFrame(builder, instanceValueEndFrame);
        AnimationInitialData.addInstanceValueLoopNum(builder, instanceValueLoopNum);
        AnimationInitialData.addInstanceValueSpeed(builder, instanceValueSpeed);
        AnimationInitialData.addInstanceValueLoopflag(builder, instanceValueLoopflag);
        AnimationInitialData.addEffectValueCurKeyframe(builder, effectValueCurKeyframe);
        AnimationInitialData.addEffectValueStartTime(builder, effectValueStartTime);
        AnimationInitialData.addEffectValueSpeed(builder, effectValueSpeed);
        AnimationInitialData.addEffectValueLoopflag(builder, effectValueLoopflag);
        return AnimationInitialData.endAnimationInitialData(builder);
      }
    }
    class partState {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAspartState(bb, obj) {
        return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAspartState(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      index() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      flag1() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
      }
      flag2() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
      }
      data(index) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
      }
      dataLength() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      dataArray() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      static startpartState(builder) {
        builder.startObject(4);
      }
      static addIndex(builder, index) {
        builder.addFieldInt16(0, index, 0);
      }
      static addFlag1(builder, flag1) {
        builder.addFieldInt32(1, flag1, 0);
      }
      static addFlag2(builder, flag2) {
        builder.addFieldInt32(2, flag2, 0);
      }
      static addData(builder, dataOffset) {
        builder.addFieldOffset(3, dataOffset, 0);
      }
      static createDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addInt32(data[i]);
        }
        return builder.endVector();
      }
      static startDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endpartState(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createpartState(builder, index, flag1, flag2, dataOffset) {
        partState.startpartState(builder);
        partState.addIndex(builder, index);
        partState.addFlag1(builder, flag1);
        partState.addFlag2(builder, flag2);
        partState.addData(builder, dataOffset);
        return partState.endpartState(builder);
      }
    }
    class frameDataIndex {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsframeDataIndex(bb, obj) {
        return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsframeDataIndex(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      states(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? (obj || new partState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      statesLength() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startframeDataIndex(builder) {
        builder.startObject(1);
      }
      static addStates(builder, statesOffset) {
        builder.addFieldOffset(0, statesOffset, 0);
      }
      static createStatesVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startStatesVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endframeDataIndex(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createframeDataIndex(builder, statesOffset) {
        frameDataIndex.startframeDataIndex(builder);
        frameDataIndex.addStates(builder, statesOffset);
        return frameDataIndex.endframeDataIndex(builder);
      }
    }
    class labelDataItem {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAslabelDataItem(bb, obj) {
        return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAslabelDataItem(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      label(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      frameIndex() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      static startlabelDataItem(builder) {
        builder.startObject(2);
      }
      static addLabel(builder, labelOffset) {
        builder.addFieldOffset(0, labelOffset, 0);
      }
      static addFrameIndex(builder, frameIndex) {
        builder.addFieldInt16(1, frameIndex, 0);
      }
      static endlabelDataItem(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createlabelDataItem(builder, labelOffset, frameIndex) {
        labelDataItem.startlabelDataItem(builder);
        labelDataItem.addLabel(builder, labelOffset);
        labelDataItem.addFrameIndex(builder, frameIndex);
        return labelDataItem.endlabelDataItem(builder);
      }
    }
    class meshDataIndices {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsmeshDataIndices(bb, obj) {
        return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsmeshDataIndices(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      indices(index) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
      }
      indicesLength() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      indicesArray() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      static startmeshDataIndices(builder) {
        builder.startObject(1);
      }
      static addIndices(builder, indicesOffset) {
        builder.addFieldOffset(0, indicesOffset, 0);
      }
      static createIndicesVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addFloat32(data[i]);
        }
        return builder.endVector();
      }
      static startIndicesVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endmeshDataIndices(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createmeshDataIndices(builder, indicesOffset) {
        meshDataIndices.startmeshDataIndices(builder);
        meshDataIndices.addIndices(builder, indicesOffset);
        return meshDataIndices.endmeshDataIndices(builder);
      }
    }
    class meshDataUV {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsmeshDataUV(bb, obj) {
        return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsmeshDataUV(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      uv(index) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
      }
      uvLength() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      uvArray() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      static startmeshDataUV(builder) {
        builder.startObject(1);
      }
      static addUv(builder, uvOffset) {
        builder.addFieldOffset(0, uvOffset, 0);
      }
      static createUvVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addFloat32(data[i]);
        }
        return builder.endVector();
      }
      static startUvVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endmeshDataUV(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createmeshDataUV(builder, uvOffset) {
        meshDataUV.startmeshDataUV(builder);
        meshDataUV.addUv(builder, uvOffset);
        return meshDataUV.endmeshDataUV(builder);
      }
    }
    class userDataItem {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsuserDataItem(bb, obj) {
        return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsuserDataItem(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      flags() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      arrayIndex() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      dataType(index) {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
      }
      dataTypeLength() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      dataTypeArray() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      data(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
      }
      dataLength() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startuserDataItem(builder) {
        builder.startObject(4);
      }
      static addFlags(builder, flags) {
        builder.addFieldInt16(0, flags, 0);
      }
      static addArrayIndex(builder, arrayIndex) {
        builder.addFieldInt16(1, arrayIndex, 0);
      }
      static addDataType(builder, dataTypeOffset) {
        builder.addFieldOffset(2, dataTypeOffset, 0);
      }
      static createDataTypeVector(builder, data) {
        builder.startVector(1, data.length, 1);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addInt8(data[i]);
        }
        return builder.endVector();
      }
      static startDataTypeVector(builder, numElems) {
        builder.startVector(1, numElems, 1);
      }
      static addData(builder, dataOffset) {
        builder.addFieldOffset(3, dataOffset, 0);
      }
      static createDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static enduserDataItem(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createuserDataItem(builder, flags, arrayIndex, dataTypeOffset, dataOffset) {
        userDataItem.startuserDataItem(builder);
        userDataItem.addFlags(builder, flags);
        userDataItem.addArrayIndex(builder, arrayIndex);
        userDataItem.addDataType(builder, dataTypeOffset);
        userDataItem.addData(builder, dataOffset);
        return userDataItem.enduserDataItem(builder);
      }
    }
    class userDataPerFrame {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsuserDataPerFrame(bb, obj) {
        return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsuserDataPerFrame(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      frameIndex() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      data(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (obj || new userDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      dataLength() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startuserDataPerFrame(builder) {
        builder.startObject(2);
      }
      static addFrameIndex(builder, frameIndex) {
        builder.addFieldInt16(0, frameIndex, 0);
      }
      static addData(builder, dataOffset) {
        builder.addFieldOffset(1, dataOffset, 0);
      }
      static createDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static enduserDataPerFrame(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createuserDataPerFrame(builder, frameIndex, dataOffset) {
        userDataPerFrame.startuserDataPerFrame(builder);
        userDataPerFrame.addFrameIndex(builder, frameIndex);
        userDataPerFrame.addData(builder, dataOffset);
        return userDataPerFrame.enduserDataPerFrame(builder);
      }
    }
    class AnimationData {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsAnimationData(bb, obj) {
        return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsAnimationData(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      defaultData(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (obj || new AnimationInitialData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      defaultDataLength() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      frameData(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (obj || new frameDataIndex()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      frameDataLength() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      userData(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? (obj || new userDataPerFrame()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      userDataLength() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      labelData(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? (obj || new labelDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      labelDataLength() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      meshsDataUV(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? (obj || new meshDataUV()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      meshsDataUVLength() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      meshsDataIndices(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? (obj || new meshDataIndices()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      meshsDataIndicesLength() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      startFrames() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      endFrames() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      totalFrames() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      fps() {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      labelNum() {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      canvasSizeW() {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      canvasSizeH() {
        const offset = this.bb.__offset(this.bb_pos, 30);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      canvasPvotX() {
        const offset = this.bb.__offset(this.bb_pos, 32);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      canvasPvotY() {
        const offset = this.bb.__offset(this.bb_pos, 34);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      static startAnimationData(builder) {
        builder.startObject(16);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addDefaultData(builder, defaultDataOffset) {
        builder.addFieldOffset(1, defaultDataOffset, 0);
      }
      static createDefaultDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startDefaultDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addFrameData(builder, frameDataOffset) {
        builder.addFieldOffset(2, frameDataOffset, 0);
      }
      static createFrameDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startFrameDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addUserData(builder, userDataOffset) {
        builder.addFieldOffset(3, userDataOffset, 0);
      }
      static createUserDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startUserDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addLabelData(builder, labelDataOffset) {
        builder.addFieldOffset(4, labelDataOffset, 0);
      }
      static createLabelDataVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startLabelDataVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addMeshsDataUV(builder, meshsDataUVOffset) {
        builder.addFieldOffset(5, meshsDataUVOffset, 0);
      }
      static createMeshsDataUVVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startMeshsDataUVVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addMeshsDataIndices(builder, meshsDataIndicesOffset) {
        builder.addFieldOffset(6, meshsDataIndicesOffset, 0);
      }
      static createMeshsDataIndicesVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startMeshsDataIndicesVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addStartFrames(builder, startFrames) {
        builder.addFieldInt16(7, startFrames, 0);
      }
      static addEndFrames(builder, endFrames) {
        builder.addFieldInt16(8, endFrames, 0);
      }
      static addTotalFrames(builder, totalFrames) {
        builder.addFieldInt16(9, totalFrames, 0);
      }
      static addFps(builder, fps) {
        builder.addFieldInt16(10, fps, 0);
      }
      static addLabelNum(builder, labelNum) {
        builder.addFieldInt16(11, labelNum, 0);
      }
      static addCanvasSizeW(builder, canvasSizeW) {
        builder.addFieldInt16(12, canvasSizeW, 0);
      }
      static addCanvasSizeH(builder, canvasSizeH) {
        builder.addFieldInt16(13, canvasSizeH, 0);
      }
      static addCanvasPvotX(builder, canvasPvotX) {
        builder.addFieldFloat32(14, canvasPvotX, 0);
      }
      static addCanvasPvotY(builder, canvasPvotY) {
        builder.addFieldFloat32(15, canvasPvotY, 0);
      }
      static endAnimationData(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createAnimationData(builder, nameOffset, defaultDataOffset, frameDataOffset, userDataOffset, labelDataOffset, meshsDataUVOffset, meshsDataIndicesOffset, startFrames, endFrames, totalFrames, fps, labelNum, canvasSizeW, canvasSizeH, canvasPvotX, canvasPvotY) {
        AnimationData.startAnimationData(builder);
        AnimationData.addName(builder, nameOffset);
        AnimationData.addDefaultData(builder, defaultDataOffset);
        AnimationData.addFrameData(builder, frameDataOffset);
        AnimationData.addUserData(builder, userDataOffset);
        AnimationData.addLabelData(builder, labelDataOffset);
        AnimationData.addMeshsDataUV(builder, meshsDataUVOffset);
        AnimationData.addMeshsDataIndices(builder, meshsDataIndicesOffset);
        AnimationData.addStartFrames(builder, startFrames);
        AnimationData.addEndFrames(builder, endFrames);
        AnimationData.addTotalFrames(builder, totalFrames);
        AnimationData.addFps(builder, fps);
        AnimationData.addLabelNum(builder, labelNum);
        AnimationData.addCanvasSizeW(builder, canvasSizeW);
        AnimationData.addCanvasSizeH(builder, canvasSizeH);
        AnimationData.addCanvasPvotX(builder, canvasPvotX);
        AnimationData.addCanvasPvotY(builder, canvasPvotY);
        return AnimationData.endAnimationData(builder);
      }
    }
    var SsPartType = /* @__PURE__ */ ((SsPartType2) => {
      SsPartType2[SsPartType2["Invalid"] = -1] = "Invalid";
      SsPartType2[SsPartType2["Nulltype"] = 0] = "Nulltype";
      SsPartType2[SsPartType2["Normal"] = 1] = "Normal";
      SsPartType2[SsPartType2["Text"] = 2] = "Text";
      SsPartType2[SsPartType2["Instance"] = 3] = "Instance";
      SsPartType2[SsPartType2["Armature"] = 4] = "Armature";
      SsPartType2[SsPartType2["Effect"] = 5] = "Effect";
      SsPartType2[SsPartType2["Mesh"] = 6] = "Mesh";
      SsPartType2[SsPartType2["Movenode"] = 7] = "Movenode";
      SsPartType2[SsPartType2["Constraint"] = 8] = "Constraint";
      SsPartType2[SsPartType2["Mask"] = 9] = "Mask";
      SsPartType2[SsPartType2["Joint"] = 10] = "Joint";
      SsPartType2[SsPartType2["Bonepoint"] = 11] = "Bonepoint";
      return SsPartType2;
    })(SsPartType || {});
    class PartData {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsPartData(bb, obj) {
        return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsPartData(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      index() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      parentIndex() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      type() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt8(this.bb_pos + offset) : SsPartType.Nulltype;
      }
      boundsType() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      alphaBlendType() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      refname(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      effectfilename(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      colorLabel(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      maskInfluence() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      static startPartData(builder) {
        builder.startObject(10);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addIndex(builder, index) {
        builder.addFieldInt16(1, index, 0);
      }
      static addParentIndex(builder, parentIndex) {
        builder.addFieldInt16(2, parentIndex, 0);
      }
      static addType(builder, type) {
        builder.addFieldInt8(3, type, SsPartType.Nulltype);
      }
      static addBoundsType(builder, boundsType) {
        builder.addFieldInt16(4, boundsType, 0);
      }
      static addAlphaBlendType(builder, alphaBlendType) {
        builder.addFieldInt16(5, alphaBlendType, 0);
      }
      static addRefname(builder, refnameOffset) {
        builder.addFieldOffset(6, refnameOffset, 0);
      }
      static addEffectfilename(builder, effectfilenameOffset) {
        builder.addFieldOffset(7, effectfilenameOffset, 0);
      }
      static addColorLabel(builder, colorLabelOffset) {
        builder.addFieldOffset(8, colorLabelOffset, 0);
      }
      static addMaskInfluence(builder, maskInfluence) {
        builder.addFieldInt16(9, maskInfluence, 0);
      }
      static endPartData(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createPartData(builder, nameOffset, index, parentIndex, type, boundsType, alphaBlendType, refnameOffset, effectfilenameOffset, colorLabelOffset, maskInfluence) {
        PartData.startPartData(builder);
        PartData.addName(builder, nameOffset);
        PartData.addIndex(builder, index);
        PartData.addParentIndex(builder, parentIndex);
        PartData.addType(builder, type);
        PartData.addBoundsType(builder, boundsType);
        PartData.addAlphaBlendType(builder, alphaBlendType);
        PartData.addRefname(builder, refnameOffset);
        PartData.addEffectfilename(builder, effectfilenameOffset);
        PartData.addColorLabel(builder, colorLabelOffset);
        PartData.addMaskInfluence(builder, maskInfluence);
        return PartData.endPartData(builder);
      }
    }
    class AnimePackData {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsAnimePackData(bb, obj) {
        return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsAnimePackData(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      parts(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (obj || new PartData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      partsLength() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      animations(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? (obj || new AnimationData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      animationsLength() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startAnimePackData(builder) {
        builder.startObject(3);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addParts(builder, partsOffset) {
        builder.addFieldOffset(1, partsOffset, 0);
      }
      static createPartsVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startPartsVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addAnimations(builder, animationsOffset) {
        builder.addFieldOffset(2, animationsOffset, 0);
      }
      static createAnimationsVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startAnimationsVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endAnimePackData(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createAnimePackData(builder, nameOffset, partsOffset, animationsOffset) {
        AnimePackData.startAnimePackData(builder);
        AnimePackData.addName(builder, nameOffset);
        AnimePackData.addParts(builder, partsOffset);
        AnimePackData.addAnimations(builder, animationsOffset);
        return AnimePackData.endAnimePackData(builder);
      }
    }
    class CellMap {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsCellMap(bb, obj) {
        return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsCellMap(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      imagePath(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      index() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      wrapmode() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      filtermode() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      static startCellMap(builder) {
        builder.startObject(5);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addImagePath(builder, imagePathOffset) {
        builder.addFieldOffset(1, imagePathOffset, 0);
      }
      static addIndex(builder, index) {
        builder.addFieldInt16(2, index, 0);
      }
      static addWrapmode(builder, wrapmode) {
        builder.addFieldInt16(3, wrapmode, 0);
      }
      static addFiltermode(builder, filtermode) {
        builder.addFieldInt16(4, filtermode, 0);
      }
      static endCellMap(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createCellMap(builder, nameOffset, imagePathOffset, index, wrapmode, filtermode) {
        CellMap.startCellMap(builder);
        CellMap.addName(builder, nameOffset);
        CellMap.addImagePath(builder, imagePathOffset);
        CellMap.addIndex(builder, index);
        CellMap.addWrapmode(builder, wrapmode);
        CellMap.addFiltermode(builder, filtermode);
        return CellMap.endCellMap(builder);
      }
    }
    class Cell {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsCell(bb, obj) {
        return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsCell(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      cellMap(obj) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? (obj || new CellMap()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
      }
      indexInCellMap() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      x() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      y() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      width() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      height() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      pivotX() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      pivotY() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      u1() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      v1() {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      u2() {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      v2() {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0;
      }
      static startCell(builder) {
        builder.startObject(13);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addCellMap(builder, cellMapOffset) {
        builder.addFieldOffset(1, cellMapOffset, 0);
      }
      static addIndexInCellMap(builder, indexInCellMap) {
        builder.addFieldInt16(2, indexInCellMap, 0);
      }
      static addX(builder, x) {
        builder.addFieldInt16(3, x, 0);
      }
      static addY(builder, y) {
        builder.addFieldInt16(4, y, 0);
      }
      static addWidth(builder, width) {
        builder.addFieldInt16(5, width, 0);
      }
      static addHeight(builder, height) {
        builder.addFieldInt16(6, height, 0);
      }
      static addPivotX(builder, pivotX) {
        builder.addFieldFloat32(7, pivotX, 0);
      }
      static addPivotY(builder, pivotY) {
        builder.addFieldFloat32(8, pivotY, 0);
      }
      static addU1(builder, u1) {
        builder.addFieldFloat32(9, u1, 0);
      }
      static addV1(builder, v1) {
        builder.addFieldFloat32(10, v1, 0);
      }
      static addU2(builder, u2) {
        builder.addFieldFloat32(11, u2, 0);
      }
      static addV2(builder, v2) {
        builder.addFieldFloat32(12, v2, 0);
      }
      static endCell(builder) {
        const offset = builder.endObject();
        return offset;
      }
    }
    class EffectNode {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsEffectNode(bb, obj) {
        return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsEffectNode(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      arrayIndex() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      parentIndex() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      type() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      cellIndex() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      blendType() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      numBehavior() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      BehaviorType(index) {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
      }
      BehaviorTypeLength() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      BehaviorTypeArray() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
      }
      Behavior(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
      }
      BehaviorLength() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startEffectNode(builder) {
        builder.startObject(8);
      }
      static addArrayIndex(builder, arrayIndex) {
        builder.addFieldInt16(0, arrayIndex, 0);
      }
      static addParentIndex(builder, parentIndex) {
        builder.addFieldInt16(1, parentIndex, 0);
      }
      static addType(builder, type) {
        builder.addFieldInt16(2, type, 0);
      }
      static addCellIndex(builder, cellIndex) {
        builder.addFieldInt16(3, cellIndex, 0);
      }
      static addBlendType(builder, blendType) {
        builder.addFieldInt16(4, blendType, 0);
      }
      static addNumBehavior(builder, numBehavior) {
        builder.addFieldInt16(5, numBehavior, 0);
      }
      static addBehaviorType(builder, BehaviorTypeOffset) {
        builder.addFieldOffset(6, BehaviorTypeOffset, 0);
      }
      static createBehaviorTypeVector(builder, data) {
        builder.startVector(1, data.length, 1);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addInt8(data[i]);
        }
        return builder.endVector();
      }
      static startBehaviorTypeVector(builder, numElems) {
        builder.startVector(1, numElems, 1);
      }
      static addBehavior(builder, BehaviorOffset) {
        builder.addFieldOffset(7, BehaviorOffset, 0);
      }
      static createBehaviorVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startBehaviorVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endEffectNode(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createEffectNode(builder, arrayIndex, parentIndex, type, cellIndex, blendType, numBehavior, BehaviorTypeOffset, BehaviorOffset) {
        EffectNode.startEffectNode(builder);
        EffectNode.addArrayIndex(builder, arrayIndex);
        EffectNode.addParentIndex(builder, parentIndex);
        EffectNode.addType(builder, type);
        EffectNode.addCellIndex(builder, cellIndex);
        EffectNode.addBlendType(builder, blendType);
        EffectNode.addNumBehavior(builder, numBehavior);
        EffectNode.addBehaviorType(builder, BehaviorTypeOffset);
        EffectNode.addBehavior(builder, BehaviorOffset);
        return EffectNode.endEffectNode(builder);
      }
    }
    class EffectFile {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsEffectFile(bb, obj) {
        return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsEffectFile(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      name(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      fps() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      isLockRandSeed() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      lockRandSeed() {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      layoutScaleX() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      layoutScaleY() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      numNodeList() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      effectNode(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? (obj || new EffectNode()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      effectNodeLength() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      static startEffectFile(builder) {
        builder.startObject(8);
      }
      static addName(builder, nameOffset) {
        builder.addFieldOffset(0, nameOffset, 0);
      }
      static addFps(builder, fps) {
        builder.addFieldInt16(1, fps, 0);
      }
      static addIsLockRandSeed(builder, isLockRandSeed) {
        builder.addFieldInt16(2, isLockRandSeed, 0);
      }
      static addLockRandSeed(builder, lockRandSeed) {
        builder.addFieldInt16(3, lockRandSeed, 0);
      }
      static addLayoutScaleX(builder, layoutScaleX) {
        builder.addFieldInt16(4, layoutScaleX, 0);
      }
      static addLayoutScaleY(builder, layoutScaleY) {
        builder.addFieldInt16(5, layoutScaleY, 0);
      }
      static addNumNodeList(builder, numNodeList) {
        builder.addFieldInt16(6, numNodeList, 0);
      }
      static addEffectNode(builder, effectNodeOffset) {
        builder.addFieldOffset(7, effectNodeOffset, 0);
      }
      static createEffectNodeVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startEffectNodeVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static endEffectFile(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createEffectFile(builder, nameOffset, fps, isLockRandSeed, lockRandSeed, layoutScaleX, layoutScaleY, numNodeList, effectNodeOffset) {
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
    var PART_FLAG = /* @__PURE__ */ ((PART_FLAG22) => {
      PART_FLAG22[PART_FLAG22["INVISIBLE"] = 1] = "INVISIBLE";
      PART_FLAG22[PART_FLAG22["FLIP_H"] = 2] = "FLIP_H";
      PART_FLAG22[PART_FLAG22["FLIP_V"] = 4] = "FLIP_V";
      PART_FLAG22[PART_FLAG22["CELL_INDEX"] = 8] = "CELL_INDEX";
      PART_FLAG22[PART_FLAG22["POSITION_X"] = 16] = "POSITION_X";
      PART_FLAG22[PART_FLAG22["POSITION_Y"] = 32] = "POSITION_Y";
      PART_FLAG22[PART_FLAG22["POSITION_Z"] = 64] = "POSITION_Z";
      PART_FLAG22[PART_FLAG22["PIVOT_X"] = 128] = "PIVOT_X";
      PART_FLAG22[PART_FLAG22["PIVOT_Y"] = 256] = "PIVOT_Y";
      PART_FLAG22[PART_FLAG22["ROTATIONX"] = 512] = "ROTATIONX";
      PART_FLAG22[PART_FLAG22["ROTATIONY"] = 1024] = "ROTATIONY";
      PART_FLAG22[PART_FLAG22["ROTATIONZ"] = 2048] = "ROTATIONZ";
      PART_FLAG22[PART_FLAG22["SCALE_X"] = 4096] = "SCALE_X";
      PART_FLAG22[PART_FLAG22["SCALE_Y"] = 8192] = "SCALE_Y";
      PART_FLAG22[PART_FLAG22["LOCALSCALE_X"] = 16384] = "LOCALSCALE_X";
      PART_FLAG22[PART_FLAG22["LOCALSCALE_Y"] = 32768] = "LOCALSCALE_Y";
      PART_FLAG22[PART_FLAG22["OPACITY"] = 65536] = "OPACITY";
      PART_FLAG22[PART_FLAG22["LOCALOPACITY"] = 131072] = "LOCALOPACITY";
      PART_FLAG22[PART_FLAG22["PARTS_COLOR"] = 262144] = "PARTS_COLOR";
      PART_FLAG22[PART_FLAG22["VERTEX_TRANSFORM"] = 524288] = "VERTEX_TRANSFORM";
      PART_FLAG22[PART_FLAG22["SIZE_X"] = 1048576] = "SIZE_X";
      PART_FLAG22[PART_FLAG22["SIZE_Y"] = 2097152] = "SIZE_Y";
      PART_FLAG22[PART_FLAG22["U_MOVE"] = 4194304] = "U_MOVE";
      PART_FLAG22[PART_FLAG22["V_MOVE"] = 8388608] = "V_MOVE";
      PART_FLAG22[PART_FLAG22["UV_ROTATION"] = 16777216] = "UV_ROTATION";
      PART_FLAG22[PART_FLAG22["U_SCALE"] = 33554432] = "U_SCALE";
      PART_FLAG22[PART_FLAG22["V_SCALE"] = 67108864] = "V_SCALE";
      PART_FLAG22[PART_FLAG22["BOUNDINGRADIUS"] = 134217728] = "BOUNDINGRADIUS";
      PART_FLAG22[PART_FLAG22["MASK"] = 268435456] = "MASK";
      PART_FLAG22[PART_FLAG22["PRIORITY"] = 536870912] = "PRIORITY";
      PART_FLAG22[PART_FLAG22["INSTANCE_KEYFRAME"] = 1073741824] = "INSTANCE_KEYFRAME";
      PART_FLAG22[PART_FLAG22["EFFECT_KEYFRAME"] = 2147483648] = "EFFECT_KEYFRAME";
      return PART_FLAG22;
    })(PART_FLAG || {});
    var PART_FLAG2 = /* @__PURE__ */ ((PART_FLAG22) => {
      PART_FLAG22[PART_FLAG22["MESHDATA"] = 1] = "MESHDATA";
      return PART_FLAG22;
    })(PART_FLAG2 || {});
    class ProjectData {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsProjectData(bb, obj) {
        return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsProjectData(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static bufferHasIdentifier(bb) {
        return bb.__has_identifier("SSFB");
      }
      dataId() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
      }
      version() {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
      }
      flags() {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
      }
      imageBaseDir(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      cells(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? (obj || new Cell()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      cellsLength() {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      animePacks(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? (obj || new AnimePackData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      animePacksLength() {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      effectFileList(index, obj) {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? (obj || new EffectFile()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
      }
      effectFileListLength() {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
      }
      numCells() {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      numAnimePacks() {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      numEffectFileList() {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
      }
      static startProjectData(builder) {
        builder.startObject(10);
      }
      static addDataId(builder, dataId) {
        builder.addFieldInt32(0, dataId, 0);
      }
      static addVersion(builder, version) {
        builder.addFieldInt32(1, version, 0);
      }
      static addFlags(builder, flags) {
        builder.addFieldInt32(2, flags, 0);
      }
      static addImageBaseDir(builder, imageBaseDirOffset) {
        builder.addFieldOffset(3, imageBaseDirOffset, 0);
      }
      static addCells(builder, cellsOffset) {
        builder.addFieldOffset(4, cellsOffset, 0);
      }
      static createCellsVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startCellsVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addAnimePacks(builder, animePacksOffset) {
        builder.addFieldOffset(5, animePacksOffset, 0);
      }
      static createAnimePacksVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startAnimePacksVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addEffectFileList(builder, effectFileListOffset) {
        builder.addFieldOffset(6, effectFileListOffset, 0);
      }
      static createEffectFileListVector(builder, data) {
        builder.startVector(4, data.length, 4);
        for (let i = data.length - 1; i >= 0; i--) {
          builder.addOffset(data[i]);
        }
        return builder.endVector();
      }
      static startEffectFileListVector(builder, numElems) {
        builder.startVector(4, numElems, 4);
      }
      static addNumCells(builder, numCells) {
        builder.addFieldInt16(7, numCells, 0);
      }
      static addNumAnimePacks(builder, numAnimePacks) {
        builder.addFieldInt16(8, numAnimePacks, 0);
      }
      static addNumEffectFileList(builder, numEffectFileList) {
        builder.addFieldInt16(9, numEffectFileList, 0);
      }
      static endProjectData(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static finishProjectDataBuffer(builder, offset) {
        builder.finish(offset, "SSFB");
      }
      static finishSizePrefixedProjectDataBuffer(builder, offset) {
        builder.finish(offset, "SSFB", true);
      }
      static createProjectData(builder, dataId, version, flags, imageBaseDirOffset, cellsOffset, animePacksOffset, effectFileListOffset, numCells, numAnimePacks, numEffectFileList) {
        ProjectData.startProjectData(builder);
        ProjectData.addDataId(builder, dataId);
        ProjectData.addVersion(builder, version);
        ProjectData.addFlags(builder, flags);
        ProjectData.addImageBaseDir(builder, imageBaseDirOffset);
        ProjectData.addCells(builder, cellsOffset);
        ProjectData.addAnimePacks(builder, animePacksOffset);
        ProjectData.addEffectFileList(builder, effectFileListOffset);
        ProjectData.addNumCells(builder, numCells);
        ProjectData.addNumAnimePacks(builder, numAnimePacks);
        ProjectData.addNumEffectFileList(builder, numEffectFileList);
        return ProjectData.endProjectData(builder);
      }
    }
    class userDataInteger {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      integer() {
        return this.bb.readInt32(this.bb_pos);
      }
      static sizeOf() {
        return 4;
      }
      static createuserDataInteger(builder, integer) {
        builder.prep(4, 4);
        builder.writeInt32(integer);
        return builder.offset();
      }
    }
    class userDataPoint {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      x() {
        return this.bb.readInt32(this.bb_pos);
      }
      y() {
        return this.bb.readInt32(this.bb_pos + 4);
      }
      static sizeOf() {
        return 8;
      }
      static createuserDataPoint(builder, x, y) {
        builder.prep(4, 8);
        builder.writeInt32(y);
        builder.writeInt32(x);
        return builder.offset();
      }
    }
    class userDataRect {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      x() {
        return this.bb.readInt32(this.bb_pos);
      }
      y() {
        return this.bb.readInt32(this.bb_pos + 4);
      }
      w() {
        return this.bb.readInt32(this.bb_pos + 8);
      }
      h() {
        return this.bb.readInt32(this.bb_pos + 12);
      }
      static sizeOf() {
        return 16;
      }
      static createuserDataRect(builder, x, y, w, h) {
        builder.prep(4, 16);
        builder.writeInt32(h);
        builder.writeInt32(w);
        builder.writeInt32(y);
        builder.writeInt32(x);
        return builder.offset();
      }
    }
    class userDataString {
      constructor() {
        this.bb = null;
        this.bb_pos = 0;
      }
      __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
      }
      static getRootAsuserDataString(bb, obj) {
        return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      static getSizePrefixedRootAsuserDataString(bb, obj) {
        bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
        return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
      }
      length() {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
      }
      data(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
      }
      static startuserDataString(builder) {
        builder.startObject(2);
      }
      static addLength(builder, length) {
        builder.addFieldInt32(0, length, 0);
      }
      static addData(builder, dataOffset) {
        builder.addFieldOffset(1, dataOffset, 0);
      }
      static enduserDataString(builder) {
        const offset = builder.endObject();
        return offset;
      }
      static createuserDataString(builder, length, dataOffset) {
        userDataString.startuserDataString(builder);
        userDataString.addLength(builder, length);
        userDataString.addData(builder, dataOffset);
        return userDataString.enduserDataString(builder);
      }
    }

    class SS6Project {
      constructor(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        if (typeof arg1 === "string") {
          let ssfbPath = arg1;
          let onComplete = arg2;
          let timeout = arg3 !== void 0 ? arg3 : 0;
          let retry = arg4 !== void 0 ? arg4 : 0;
          let onError = arg5 !== void 0 ? arg5 : null;
          let onTimeout = arg6 !== void 0 ? arg6 : null;
          let onRetry = arg7 !== void 0 ? arg7 : null;
          this.ssfbPath = ssfbPath;
          const index = ssfbPath.lastIndexOf("/");
          this.rootPath = ssfbPath.substring(0, index) + "/";
          this.status = "not ready";
          this.onComplete = onComplete;
          this.onError = onError;
          this.onTimeout = onTimeout;
          this.onRetry = onRetry;
          this.LoadFlatBuffersProject(ssfbPath, timeout, retry);
        } else if (typeof arg1 === "object" && arg1.constructor === Uint8Array) {
          let ssfbByte = arg1;
          let imageBinaryMap = arg2;
          this.onComplete = arg3 !== void 0 ? arg3 : null;
          this.load(ssfbByte, imageBinaryMap);
        }
      }
      LoadFlatBuffersProject(ssfbPath, timeout = 0, retry = 0) {
        const self = this;
        const httpObj = new XMLHttpRequest();
        const method = "GET";
        httpObj.open(method, ssfbPath, true);
        httpObj.responseType = "arraybuffer";
        httpObj.timeout = timeout;
        httpObj.onload = function() {
          if (!(httpObj.status >= 200 && httpObj.status < 400)) {
            if (self.onError !== null) {
              self.onError(ssfbPath, timeout, retry, httpObj);
            }
            return;
          }
          const arrayBuffer = this.response;
          const bytes = new Uint8Array(arrayBuffer);
          const buf = new ByteBuffer(bytes);
          self.fbObj = ProjectData.getRootAsProjectData(buf);
          self.LoadCellResources();
        };
        httpObj.ontimeout = function() {
          if (retry > 0) {
            if (self.onRetry !== null) {
              self.onRetry(ssfbPath, timeout, retry - 1, httpObj);
            }
            self.LoadFlatBuffersProject(ssfbPath, timeout, retry - 1);
          } else {
            if (self.onTimeout !== null) {
              self.onTimeout(ssfbPath, timeout, retry, httpObj);
            }
          }
        };
        httpObj.onerror = function() {
          if (self.onError !== null) {
            self.onError(ssfbPath, timeout, retry, httpObj);
          }
        };
        httpObj.send(null);
      }
      LoadCellResources() {
        const self = this;
        let loader = new loaders.Loader();
        let ids = [];
        for (let i = 0; i < self.fbObj.cellsLength(); i++) {
          if (!ids.some(function(id) {
            return id === self.fbObj.cells(i).cellMap().index();
          })) {
            ids.push(self.fbObj.cells(i).cellMap().index());
            loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
          }
        }
        loader.load(function(loader2, resources) {
          self.resources = resources;
          self.status = "ready";
          if (self.onComplete !== null) {
            self.onComplete();
          }
        });
      }
      load(bytes, imageBinaryMap) {
        const buffer = new ByteBuffer(bytes);
        this.fbObj = ProjectData.getRootAsProjectData(buffer);
        const loader = new loaders.Loader();
        for (let imageName in imageBinaryMap) {
          const binary = imageBinaryMap[imageName];
          let b = "";
          const len = binary.byteLength;
          for (let i = 0; i < len; i++) {
            b += String.fromCharCode(binary[i]);
          }
          const base64 = "data:image/png;base64," + window.btoa(b);
          loader.add(imageName, base64);
        }
        const self = this;
        loader.load((loader2, resources) => {
          self.resources = resources;
          self.status = "ready";
          if (self.onComplete !== null) {
            self.onComplete();
          }
        });
      }
    }

    class SS6PlayerInstanceKeyParam {
      constructor() {
        this.refStartframe = 0;
        this.refEndframe = 0;
        this.refSpeed = 1;
        this.refloopNum = 0;
        this.infinity = false;
        this.reverse = false;
        this.pingpong = false;
        this.independent = false;
      }
    }

    class SS6Player extends display.Container {
      constructor(ss6project, animePackName = null, animeName = null) {
        super();
        this.animation = [];
        this.curAnimePackName = null;
        this.curAnimeName = null;
        this.curAnimation = null;
        this.curAnimePackData = null;
        this.parts = -1;
        this.parentIndex = [];
        this.prio2index = [];
        this.userData = [];
        this.frameDataCache = {};
        this.currentCachedFrameNumber = -1;
        this.liveFrame = [];
        this.colorMatrixFilterCache = [];
        this.defaultFrameMap = [];
        this.parentAlpha = 1;
        this.prevCellID = [];
        this.prevMesh = [];
        this.substituteOverWrite = [];
        this.substituteKeyParam = [];
        this.alphaBlendType = [];
        this._uint32 = new Uint32Array(1);
        this._float32 = new Float32Array(this._uint32.buffer);
        this.defaultColorFilter = new filterColorMatrix.ColorMatrixFilter();
        this._instancePos = new Float32Array(5);
        this._CoordinateGetDiagonalIntersectionVec2 = new Float32Array(2);
        this.ss6project = ss6project;
        this.fbObj = this.ss6project.fbObj;
        this.resources = this.ss6project.resources;
        this.parentAlpha = 1;
        if (animePackName !== null && animeName !== null) {
          this.Setup(animePackName, animeName);
        }
        this.on("added", (...args) => {
          ticker.Ticker.shared.add(this.Update, this);
        }, this);
        this.on("removed", (...args) => {
          ticker.Ticker.shared.remove(this.Update, this);
        }, this);
      }
      get startFrame() {
        return this._startFrame;
      }
      get endFrame() {
        return this.curAnimation.endFrames();
      }
      get totalFrame() {
        return this.curAnimation.totalFrames();
      }
      get fps() {
        return this.curAnimation.fps();
      }
      get frameNo() {
        return Math.floor(this._currentFrame);
      }
      set loop(loop) {
        this._loops = loop;
      }
      get loop() {
        return this._loops;
      }
      get isPlaying() {
        return this._isPlaying;
      }
      get isPausing() {
        return this._isPausing;
      }
      get animePackName() {
        return this.curAnimePackName;
      }
      get animeName() {
        return this.curAnimeName;
      }
      Setup(animePackName, animeName) {
        this.clearCaches();
        const animePacksLength = this.fbObj.animePacksLength();
        for (let i = 0; i < animePacksLength; i++) {
          if (this.fbObj.animePacks(i).name() === animePackName) {
            let j;
            const animationsLength = this.fbObj.animePacks(i).animationsLength();
            for (j = 0; j < animationsLength; j++) {
              if (this.fbObj.animePacks(i).animations(j).name() === animeName) {
                this.animation = [i, j];
                this.curAnimePackName = animePackName;
                this.curAnimeName = animeName;
                this.curAnimePackData = this.fbObj.animePacks(this.animation[0]);
                this.curAnimation = this.curAnimePackData.animations(this.animation[1]);
                break;
              }
            }
            const defaultDataLength = this.curAnimation.defaultDataLength();
            for (let i2 = 0; i2 < defaultDataLength; i2++) {
              const curDefaultData = this.curAnimation.defaultData(i2);
              this.defaultFrameMap[curDefaultData.index()] = curDefaultData;
            }
            this.parts = i;
            const partsLength = this.fbObj.animePacks(this.parts).partsLength();
            this.parentIndex = new Array(partsLength);
            this.prevCellID = new Array(partsLength);
            this.prevMesh = new Array(partsLength);
            this.substituteOverWrite = new Array(partsLength);
            this.substituteKeyParam = new Array(partsLength);
            for (j = 0; j < partsLength; j++) {
              const index = this.fbObj.animePacks(this.parts).parts(j).index();
              this.parentIndex[index] = this.fbObj.animePacks(i).parts(j).parentIndex();
              this.prevCellID[index] = -1;
              this.prevMesh[index] = null;
              this.substituteOverWrite[index] = null;
              this.substituteKeyParam[index] = null;
            }
          }
        }
        this.alphaBlendType = this.GetPartsBlendMode();
        this._isPlaying = false;
        this._isPausing = true;
        this._startFrame = this.curAnimation.startFrames();
        this._endFrame = this.curAnimation.endFrames();
        this._currentFrame = this.curAnimation.startFrames();
        this.nextFrameTime = 0;
        this._loops = -1;
        this.skipEnabled = true;
        this.updateInterval = 1e3 / this.curAnimation.fps();
        this.playDirection = 1;
        this.onUserDataCallback = null;
        this.playEndCallback = null;
        this.parentAlpha = 1;
      }
      clearCaches() {
        this.prio2index = [];
        this.userData = [];
        this.frameDataCache = [];
        this.currentCachedFrameNumber = -1;
        this.liveFrame = [];
        this.colorMatrixFilterCache = [];
        this.defaultFrameMap = [];
      }
      Update(delta) {
        this.UpdateInternal(delta);
      }
      UpdateInternal(delta, rewindAfterReachingEndFrame = true) {
        const elapsedTime = ticker.Ticker.shared.elapsedMS;
        const toNextFrame = this._isPlaying && !this._isPausing;
        if (toNextFrame && this.updateInterval !== 0) {
          this.nextFrameTime += elapsedTime;
          if (this.nextFrameTime >= this.updateInterval) {
            let playEndFlag = false;
            const step = this.nextFrameTime / this.updateInterval;
            this.nextFrameTime -= this.updateInterval * step;
            let s = this.skipEnabled ? step * this.playDirection : this.playDirection;
            let next = this._currentFrame + s;
            let nextFrameNo = Math.floor(next);
            let nextFrameDecimal = next - nextFrameNo;
            let currentFrameNo = Math.floor(this._currentFrame);
            if (this.playDirection >= 1) {
              for (let c = nextFrameNo - currentFrameNo; c; c--) {
                let incFrameNo = currentFrameNo + 1;
                if (incFrameNo > this._endFrame) {
                  if (this._loops === -1) {
                    incFrameNo = this._startFrame;
                  } else {
                    this._loops--;
                    playEndFlag = true;
                    if (this._loops === 0) {
                      this._isPlaying = false;
                      incFrameNo = rewindAfterReachingEndFrame ? this._startFrame : this._endFrame;
                      break;
                    } else {
                      incFrameNo = this._startFrame;
                    }
                  }
                }
                currentFrameNo = incFrameNo;
                if (this._isPlaying) {
                  if (this.HaveUserData(currentFrameNo)) {
                    if (this.onUserDataCallback !== null) {
                      this.onUserDataCallback(this.GetUserData(currentFrameNo));
                    }
                  }
                }
              }
            }
            if (this.playDirection <= -1) {
              for (let c = currentFrameNo - nextFrameNo; c; c--) {
                let decFrameNo = currentFrameNo - 1;
                if (decFrameNo < this._startFrame) {
                  if (this._loops === -1) {
                    decFrameNo = this._endFrame;
                  } else {
                    this._loops--;
                    playEndFlag = true;
                    if (this._loops === 0) {
                      this._isPlaying = false;
                      decFrameNo = rewindAfterReachingEndFrame ? this._endFrame : this._startFrame;
                      break;
                    } else {
                      decFrameNo = this._endFrame;
                    }
                  }
                }
                currentFrameNo = decFrameNo;
                if (this._isPlaying) {
                  if (this.HaveUserData(currentFrameNo)) {
                    if (this.onUserDataCallback !== null) {
                      this.onUserDataCallback(this.GetUserData(currentFrameNo));
                    }
                  }
                }
              }
            }
            this._currentFrame = currentFrameNo + nextFrameDecimal;
            if (playEndFlag) {
              if (this.playEndCallback !== null) {
                this.playEndCallback(this);
              }
            }
            this.SetFrameAnimation(Math.floor(this._currentFrame), step);
          }
        } else {
          this.SetFrameAnimation(Math.floor(this._currentFrame));
        }
      }
      SetAnimationFramerate(fps, _skipEnabled = true) {
        if (fps <= 0)
          return;
        this.updateInterval = 1e3 / fps;
        this.skipEnabled = _skipEnabled;
      }
      SetAnimationSpeed(fpsRate, _skipEnabled = true) {
        if (fpsRate === 0)
          return;
        this.playDirection = fpsRate > 0 ? 1 : -1;
        this.updateInterval = 1e3 / (this.curAnimation.fps() * fpsRate * this.playDirection);
        this.skipEnabled = _skipEnabled;
      }
      SetAnimationSection(_startframe = -1, _endframe = -1, _loops = -1) {
        if (_startframe >= 0 && _startframe < this.curAnimation.totalFrames()) {
          this._startFrame = _startframe;
        }
        if (_endframe >= 0 && _endframe < this.curAnimation.totalFrames()) {
          this._endFrame = _endframe;
        }
        if (_loops > 0) {
          this._loops = _loops;
        } else {
          this._loops = -1;
        }
        this._currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
      }
      Play(frameNo) {
        this._isPlaying = true;
        this._isPausing = false;
        let currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
        if (frameNo && typeof frameNo === "number") {
          currentFrame = frameNo;
        }
        this._currentFrame = currentFrame;
        this.resetLiveFrame();
        const currentFrameNo = Math.floor(this._currentFrame);
        this.SetFrameAnimation(currentFrameNo);
        if (this.HaveUserData(currentFrameNo)) {
          if (this.onUserDataCallback !== null) {
            this.onUserDataCallback(this.GetUserData(currentFrameNo));
          }
        }
      }
      Pause() {
        this._isPausing = true;
      }
      Resume() {
        this._isPausing = false;
      }
      Stop() {
        this._isPlaying = false;
      }
      SetFrame(frame) {
        this._currentFrame = frame;
      }
      NextFrame() {
        const currentFrame = Math.floor(this._currentFrame);
        const endFrame = this.endFrame;
        if (currentFrame === endFrame) {
          return;
        }
        this.SetFrame(currentFrame + 1);
      }
      PrevFrame() {
        const currentFrame = Math.floor(this._currentFrame);
        if (currentFrame === 0) {
          return;
        }
        this.SetFrame(currentFrame - 1);
      }
      SetAlpha(alpha) {
        this.parentAlpha = alpha;
      }
      ThrowError(_error) {
      }
      SetUserDataCalback(fn) {
        this.onUserDataCallback = fn;
      }
      SetPlayEndCallback(fn) {
        this.playEndCallback = fn;
      }
      HaveUserData(frameNumber) {
        if (this.userData[frameNumber] === -1) {
          return false;
        }
        if (this.userData[frameNumber]) {
          return true;
        }
        for (let k = 0; k < this.curAnimation.userDataLength(); k++) {
          if (frameNumber === this.curAnimation.userData(k).frameIndex()) {
            this.userData[frameNumber] = this.curAnimation.userData(k);
            return true;
          }
        }
        this.userData[frameNumber] = -1;
        return false;
      }
      GetUserData(frameNumber) {
        if (this.HaveUserData(frameNumber) === false) {
          return;
        }
        const framedata = this.userData[frameNumber];
        const layers = framedata.dataLength();
        let id = 0;
        let data = [];
        for (let i = 0; i < layers; i++) {
          const bit = framedata.data(i).flags();
          const partsID = framedata.data(i).arrayIndex();
          let d_int = null;
          let d_rect_x = null;
          let d_rect_y = null;
          let d_rect_w = null;
          let d_rect_h = null;
          let d_pos_x = null;
          let d_pos_y = null;
          let d_string_length = null;
          let d_string = null;
          if (bit & 1) {
            d_int = framedata.data(i).data(id, new userDataInteger()).integer();
            id++;
          }
          if (bit & 2) {
            d_rect_x = framedata.data(i).data(id, new userDataRect()).x();
            d_rect_y = framedata.data(i).data(id, new userDataRect()).y();
            d_rect_w = framedata.data(i).data(id, new userDataRect()).w();
            d_rect_h = framedata.data(i).data(id, new userDataRect()).h();
            id++;
          }
          if (bit & 4) {
            d_pos_x = framedata.data(i).data(id, new userDataPoint()).x();
            d_pos_y = framedata.data(i).data(id, new userDataPoint()).y();
            id++;
          }
          if (bit & 8) {
            d_string_length = framedata.data(i).data(id, new userDataString()).length();
            d_string = framedata.data(i).data(id, new userDataString()).data();
            id++;
          }
          data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
        }
        return data;
      }
      GetPartsBlendMode() {
        const l = this.fbObj.animePacks(this.parts).partsLength();
        let ret = [];
        const animePacks = this.fbObj.animePacks(this.parts);
        for (let i = 0; i < l; i++) {
          const alphaBlendType = animePacks.parts(i).alphaBlendType();
          let blendMode;
          switch (alphaBlendType) {
            case 0:
              blendMode = constants.BLEND_MODES.NORMAL;
              break;
            case 1:
              blendMode = constants.BLEND_MODES.MULTIPLY;
              break;
            case 2:
              blendMode = constants.BLEND_MODES.ADD;
              break;
            case 3:
              blendMode = constants.BLEND_MODES.NORMAL;
              break;
            case 4:
              blendMode = constants.BLEND_MODES.MULTIPLY;
              break;
            case 5:
              blendMode = constants.BLEND_MODES.SCREEN;
              break;
            case 6:
              blendMode = constants.BLEND_MODES.EXCLUSION;
              break;
            case 7:
              blendMode = constants.BLEND_MODES.NORMAL;
              break;
            default:
              blendMode = constants.BLEND_MODES.NORMAL;
              break;
          }
          ret.push(blendMode);
        }
        return ret;
      }
      I2F(i) {
        this._uint32[0] = i;
        return this._float32[0];
      }
      GetFrameData(frameNumber) {
        if (this.currentCachedFrameNumber === frameNumber && this.frameDataCache) {
          return this.frameDataCache;
        }
        const layers = this.curAnimation.defaultDataLength();
        let frameData = new Array(layers);
        this.prio2index = new Array(layers);
        const curFrameData = this.curAnimation.frameData(frameNumber);
        for (let i = 0; i < layers; i++) {
          const curPartState = curFrameData.states(i);
          const index = curPartState.index();
          let f1 = curPartState.flag1();
          let f2 = curPartState.flag2();
          let blendType = -1;
          let fd = this.GetDefaultDataByIndex(index);
          fd.flag1 = f1;
          fd.flag2 = f2;
          let id = 0;
          if (f1 & PART_FLAG.INVISIBLE)
            fd.f_hide = true;
          if (f1 & PART_FLAG.FLIP_H)
            fd.f_flipH = true;
          if (f1 & PART_FLAG.FLIP_V)
            fd.f_flipV = true;
          if (f1 & PART_FLAG.CELL_INDEX)
            fd.cellIndex = curPartState.data(id++);
          if (f1 & PART_FLAG.POSITION_X)
            fd.positionX = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.POSITION_Y)
            fd.positionY = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.POSITION_Z)
            id++;
          if (f1 & PART_FLAG.PIVOT_X)
            fd.pivotX = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.PIVOT_Y)
            fd.pivotY = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.ROTATIONX)
            id++;
          if (f1 & PART_FLAG.ROTATIONY)
            id++;
          if (f1 & PART_FLAG.ROTATIONZ)
            fd.rotationZ = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.SCALE_X)
            fd.scaleX = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.SCALE_Y)
            fd.scaleY = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.LOCALSCALE_X)
            fd.localscaleX = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.LOCALSCALE_Y)
            fd.localscaleY = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.OPACITY)
            fd.opacity = curPartState.data(id++);
          if (f1 & PART_FLAG.LOCALOPACITY)
            fd.localopacity = curPartState.data(id++);
          if (f1 & PART_FLAG.SIZE_X)
            fd.size_X = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.SIZE_Y)
            fd.size_Y = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.U_MOVE)
            fd.uv_move_X = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.V_MOVE)
            fd.uv_move_Y = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.UV_ROTATION)
            fd.uv_rotation = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.U_SCALE)
            fd.uv_scale_X = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.V_SCALE)
            fd.uv_scale_Y = this.I2F(curPartState.data(id++));
          if (f1 & PART_FLAG.BOUNDINGRADIUS)
            id++;
          if (f1 & PART_FLAG.MASK)
            fd.masklimen = curPartState.data(id++);
          if (f1 & PART_FLAG.PRIORITY)
            fd.priority = curPartState.data(id++);
          if (f1 & PART_FLAG.INSTANCE_KEYFRAME) {
            fd.instanceValue_curKeyframe = curPartState.data(id++);
            fd.instanceValue_startFrame = curPartState.data(id++);
            fd.instanceValue_endFrame = curPartState.data(id++);
            fd.instanceValue_loopNum = curPartState.data(id++);
            fd.instanceValue_speed = this.I2F(curPartState.data(id++));
            fd.instanceValue_loopflag = curPartState.data(id++);
          }
          if (f1 & PART_FLAG.EFFECT_KEYFRAME) {
            fd.effectValue_curKeyframe = curPartState.data(id++);
            fd.effectValue_startTime = curPartState.data(id++);
            fd.effectValue_speed = this.I2F(curPartState.data(id++));
            fd.effectValue_loopflag = curPartState.data(id++);
          }
          if (f1 & PART_FLAG.VERTEX_TRANSFORM) {
            fd.f_mesh = true;
            const f = fd.i_transformVerts = curPartState.data(id++);
            if (f & 1) {
              fd.u00 = this.I2F(curPartState.data(id++));
              fd.v00 = this.I2F(curPartState.data(id++));
            }
            if (f & 2) {
              fd.u01 = this.I2F(curPartState.data(id++));
              fd.v01 = this.I2F(curPartState.data(id++));
            }
            if (f & 4) {
              fd.u10 = this.I2F(curPartState.data(id++));
              fd.v10 = this.I2F(curPartState.data(id++));
            }
            if (f & 8) {
              fd.u11 = this.I2F(curPartState.data(id++));
              fd.v11 = this.I2F(curPartState.data(id++));
            }
          }
          if (f1 & PART_FLAG.PARTS_COLOR) {
            const f = curPartState.data(id++);
            blendType = f & 255;
            fd.useColorMatrix = blendType !== 1;
            if (f & 4096) {
              const rate = this.I2F(curPartState.data(id++));
              const bf = curPartState.data(id++);
              const bf2 = curPartState.data(id++);
              const argb32 = bf << 16 | bf2;
              fd.partsColorARGB = argb32 >>> 0;
              if (blendType === 1) {
                fd.tint = argb32 & 16777215;
              } else {
                fd.colorMatrix = this.GetColorMatrixFilter(blendType, rate, argb32);
              }
            }
            if (f & 2048) {
              id++;
              id++;
              id++;
              fd.colorMatrix = this.defaultColorFilter;
            }
            if (f & 1024) {
              id++;
              id++;
              id++;
              fd.colorMatrix = this.defaultColorFilter;
            }
            if (f & 512) {
              id++;
              id++;
              id++;
              fd.colorMatrix = this.defaultColorFilter;
            }
            if (f & 256) {
              id++;
              id++;
              id++;
              fd.colorMatrix = this.defaultColorFilter;
            }
          }
          if (f2 & PART_FLAG2.MESHDATA) {
            fd.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
            fd.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
            let mp = new Float32Array(fd.meshNum * 3);
            for (let idx = 0; idx < fd.meshNum; idx++) {
              const mx = this.I2F(curPartState.data(id++));
              const my = this.I2F(curPartState.data(id++));
              const mz = this.I2F(curPartState.data(id++));
              mp[idx * 3 + 0] = mx;
              mp[idx * 3 + 1] = my;
              mp[idx * 3 + 2] = mz;
            }
            fd.meshDataPoint = mp;
          }
          frameData[index] = fd;
          this.prio2index[i] = index;
          if (this.fbObj.animePacks(this.parts).parts(index).type() === 0) {
            frameData[index].cellIndex = -2;
          }
        }
        this.frameDataCache = frameData;
        this.currentCachedFrameNumber = frameNumber;
        return frameData;
      }
      GetColorMatrixFilter(blendType, rate, argb32) {
        const key = blendType.toString() + "_" + rate.toString() + "_" + argb32.toString();
        if (this.colorMatrixFilterCache[key])
          return this.colorMatrixFilterCache[key];
        const colorMatrix = new filterColorMatrix.ColorMatrixFilter();
        const ca = ((argb32 & 4278190080) >>> 24) / 255;
        const cr = ((argb32 & 16711680) >>> 16) / 255;
        const cg = ((argb32 & 65280) >>> 8) / 255;
        const cb = (argb32 & 255) / 255;
        if (blendType === 0) {
          const rate_i = 1 - rate;
          colorMatrix.matrix = [
            rate_i,
            0,
            0,
            0,
            cr * rate,
            0,
            rate_i,
            0,
            0,
            cg * rate,
            0,
            0,
            rate_i,
            0,
            cb * rate,
            0,
            0,
            0,
            1,
            0
          ];
        } else if (blendType === 1) {
          colorMatrix.matrix = [
            cr,
            0,
            0,
            0,
            0,
            0,
            cg,
            0,
            0,
            0,
            0,
            0,
            cb,
            0,
            0,
            0,
            0,
            0,
            ca,
            0
          ];
        } else if (blendType === 2) {
          colorMatrix.matrix = [
            1,
            0,
            0,
            0,
            cr,
            0,
            1,
            0,
            0,
            cg,
            0,
            0,
            1,
            0,
            cb,
            0,
            0,
            0,
            ca,
            0
          ];
        } else if (blendType === 3) {
          colorMatrix.matrix = [
            1,
            0,
            0,
            0,
            -cr,
            0,
            1,
            0,
            0,
            -cg,
            0,
            0,
            1,
            0,
            -cb,
            0,
            0,
            0,
            ca,
            0
          ];
        }
        this.colorMatrixFilterCache[key] = colorMatrix;
        return colorMatrix;
      }
      GetDefaultDataByIndex(id) {
        const curDefaultData = this.defaultFrameMap[id];
        return {
          index: curDefaultData.index(),
          lowflag: curDefaultData.lowflag(),
          highflag: curDefaultData.highflag(),
          priority: curDefaultData.priority(),
          cellIndex: curDefaultData.cellIndex(),
          opacity: curDefaultData.opacity(),
          localopacity: curDefaultData.localopacity(),
          masklimen: curDefaultData.masklimen(),
          positionX: curDefaultData.positionX(),
          positionY: curDefaultData.positionY(),
          pivotX: curDefaultData.pivotX(),
          pivotY: curDefaultData.pivotY(),
          rotationX: curDefaultData.rotationX(),
          rotationY: curDefaultData.rotationY(),
          rotationZ: curDefaultData.rotationZ(),
          scaleX: curDefaultData.scaleX(),
          scaleY: curDefaultData.scaleY(),
          localscaleX: curDefaultData.localscaleX(),
          localscaleY: curDefaultData.localscaleY(),
          size_X: curDefaultData.sizeX(),
          size_Y: curDefaultData.sizeY(),
          uv_move_X: curDefaultData.uvMoveX(),
          uv_move_Y: curDefaultData.uvMoveY(),
          uv_rotation: curDefaultData.uvRotation(),
          uv_scale_X: curDefaultData.uvScaleX(),
          uv_scale_Y: curDefaultData.uvScaleY(),
          boundingRadius: curDefaultData.boundingRadius(),
          instanceValue_curKeyframe: curDefaultData.instanceValueCurKeyframe(),
          instanceValue_endFrame: curDefaultData.instanceValueEndFrame(),
          instanceValue_startFrame: curDefaultData.instanceValueStartFrame(),
          instanceValue_loopNum: curDefaultData.instanceValueLoopNum(),
          instanceValue_speed: curDefaultData.instanceValueSpeed(),
          instanceValue_loopflag: curDefaultData.instanceValueLoopflag(),
          effectValue_curKeyframe: curDefaultData.effectValueCurKeyframe(),
          effectValue_startTime: curDefaultData.effectValueStartTime(),
          effectValue_speed: curDefaultData.effectValueSpeed(),
          effectValue_loopflag: curDefaultData.effectValueLoopflag(),
          f_hide: false,
          f_flipH: false,
          f_flipV: false,
          f_mesh: false,
          i_transformVerts: 0,
          u00: 0,
          v00: 0,
          u01: 0,
          v01: 0,
          u10: 0,
          v10: 0,
          u11: 0,
          v11: 0,
          useColorMatrix: false,
          colorMatrix: null,
          meshIsBind: 0,
          meshNum: 0,
          meshDataPoint: 0,
          flag1: 0,
          flag2: 0,
          partsColorARGB: 0
        };
      }
      SetFrameAnimation(frameNumber, ds = 0) {
        const fd = this.GetFrameData(frameNumber);
        this.removeChildren();
        const l = fd.length;
        for (let ii = 0; ii < l; ii = ii + 1 | 0) {
          const i = this.prio2index[ii];
          const data = fd[i];
          const cellID = data.cellIndex;
          let mesh = this.prevMesh[i];
          const part = this.fbObj.animePacks(this.parts).parts(i);
          const partType = part.type();
          let overWrite = this.substituteOverWrite[i] !== null ? this.substituteOverWrite[i] : false;
          let overWritekeyParam = this.substituteKeyParam[i];
          switch (partType) {
            case SsPartType.Instance:
              if (mesh == null) {
                mesh = this.MakeCellPlayer(part.refname());
                mesh.name = part.name();
              }
              break;
            case SsPartType.Normal:
            case SsPartType.Mask:
              if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                if (mesh != null)
                  mesh.destroy();
                mesh = this.MakeCellMesh(cellID);
                mesh.name = part.name();
              }
              break;
            case SsPartType.Mesh:
              if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                if (mesh != null)
                  mesh.destroy();
                mesh = this.MakeMeshCellMesh(i, cellID);
                mesh.name = part.name();
              }
              break;
            case SsPartType.Nulltype:
            case SsPartType.Joint:
              if (this.prevCellID[i] !== cellID) {
                if (mesh != null)
                  mesh.destroy();
                mesh = new display.Container();
                mesh.name = part.name();
              }
              break;
            default:
              if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                if (mesh != null)
                  mesh.destroy();
                mesh = this.MakeCellMesh(cellID);
                mesh.name = part.name();
              }
              break;
          }
          if (mesh == null)
            continue;
          this.prevCellID[i] = cellID;
          this.prevMesh[i] = mesh;
          switch (partType) {
            case SsPartType.Instance: {
              this._instancePos[0] = 0;
              this._instancePos[1] = 0;
              this._instancePos[2] = 1;
              this._instancePos[3] = 1;
              this._instancePos[4] = 0;
              this._instancePos = this.TransformPositionLocal(this._instancePos, data.index, frameNumber);
              mesh.rotation = this._instancePos[4] * Math.PI / 180;
              mesh.position.set(this._instancePos[0], this._instancePos[1]);
              mesh.scale.set(this._instancePos[2], this._instancePos[3]);
              let opacity = data.opacity / 255;
              if (data.localopacity < 255) {
                opacity = data.localopacity / 255;
              }
              mesh.SetAlpha(opacity * this.parentAlpha);
              mesh.visible = !data.f_hide;
              let refKeyframe = data.instanceValue_curKeyframe;
              let refStartframe = data.instanceValue_startFrame;
              let refEndframe = data.instanceValue_endFrame;
              let refSpeed = data.instanceValue_speed;
              let refloopNum = data.instanceValue_loopNum;
              let infinity = false;
              let reverse = false;
              let pingpong = false;
              let independent = false;
              const INSTANCE_LOOP_FLAG_INFINITY = 1;
              const INSTANCE_LOOP_FLAG_REVERSE = 2;
              const INSTANCE_LOOP_FLAG_PINGPONG = 4;
              const INSTANCE_LOOP_FLAG_INDEPENDENT = 8;
              const lflags = data.instanceValue_loopflag;
              if (lflags & INSTANCE_LOOP_FLAG_INFINITY) {
                infinity = true;
              }
              if (lflags & INSTANCE_LOOP_FLAG_REVERSE) {
                reverse = true;
              }
              if (lflags & INSTANCE_LOOP_FLAG_PINGPONG) {
                pingpong = true;
              }
              if (lflags & INSTANCE_LOOP_FLAG_INDEPENDENT) {
                independent = true;
              }
              if (overWrite) {
                refStartframe = overWritekeyParam.refStartframe;
                refEndframe = overWritekeyParam.refEndframe;
                refSpeed = overWritekeyParam.refSpeed;
                refloopNum = overWritekeyParam.refloopNum;
                infinity = overWritekeyParam.infinity;
                reverse = overWritekeyParam.reverse;
                pingpong = overWritekeyParam.pingpong;
                independent = overWritekeyParam.independent;
              }
              if (mesh._startFrame !== refStartframe || mesh._endFrame !== refEndframe) {
                mesh.SetAnimationSection(refStartframe, refEndframe);
              }
              let time = frameNumber;
              if (independent === true) {
                this.liveFrame[ii] += ds;
                time = Math.floor(this.liveFrame[ii]);
              }
              const selfTopKeyframe = refKeyframe;
              let reftime = Math.floor((time - selfTopKeyframe) * refSpeed);
              if (reftime < 0)
                continue;
              if (selfTopKeyframe > time)
                continue;
              const inst_scale = refEndframe - refStartframe + 1;
              if (inst_scale <= 0)
                continue;
              let nowloop = Math.floor(reftime / inst_scale);
              let checkloopnum = refloopNum;
              if (pingpong)
                checkloopnum = checkloopnum * 2;
              if (!infinity) {
                if (nowloop >= checkloopnum) {
                  reftime = inst_scale - 1;
                  nowloop = checkloopnum - 1;
                }
              }
              const temp_frame = Math.floor(reftime % inst_scale);
              let _time = 0;
              if (pingpong && nowloop % 2 === 1) {
                if (reverse) {
                  reverse = false;
                } else {
                  reverse = true;
                }
              }
              if (this.playDirection <= -1) {
                reverse = !reverse;
              }
              if (reverse) {
                _time = refEndframe - temp_frame;
              } else {
                _time = temp_frame + refStartframe;
              }
              mesh.SetFrame(Math.floor(_time));
              this.addChild(mesh);
              break;
            }
            case SsPartType.Normal:
            case SsPartType.Mesh:
            case SsPartType.Joint:
            case SsPartType.Mask: {
              const cell = this.fbObj.cells(cellID);
              let verts;
              if (partType === SsPartType.Mesh) {
                if (data.meshIsBind === 0) {
                  verts = this.TransformMeshVertsLocal(SS6Player.GetMeshVerts(cell, data, mesh.vertices), data.index, frameNumber);
                } else {
                  verts = SS6Player.GetMeshVerts(cell, data, mesh.vertices);
                }
              } else {
                verts = partType === SsPartType.Joint ? new Float32Array(10) : mesh.vertices;
                verts = this.TransformVertsLocal(SS6Player.GetVerts(cell, data, verts), data.index, frameNumber);
              }
              if (data.flag1 & PART_FLAG.VERTEX_TRANSFORM) {
                const vertexCoordinateLUx = verts[3 * 2 + 0];
                const vertexCoordinateLUy = verts[3 * 2 + 1];
                const vertexCoordinateLDx = verts[1 * 2 + 0];
                const vertexCoordinateLDy = verts[1 * 2 + 1];
                const vertexCoordinateRUx = verts[4 * 2 + 0];
                const vertexCoordinateRUy = verts[4 * 2 + 1];
                const vertexCoordinateRDx = verts[2 * 2 + 0];
                const vertexCoordinateRDy = verts[2 * 2 + 1];
                const CoordinateLURUx = (vertexCoordinateLUx + vertexCoordinateRUx) * 0.5;
                const CoordinateLURUy = (vertexCoordinateLUy + vertexCoordinateRUy) * 0.5;
                const CoordinateLULDx = (vertexCoordinateLUx + vertexCoordinateLDx) * 0.5;
                const CoordinateLULDy = (vertexCoordinateLUy + vertexCoordinateLDy) * 0.5;
                const CoordinateLDRDx = (vertexCoordinateLDx + vertexCoordinateRDx) * 0.5;
                const CoordinateLDRDy = (vertexCoordinateLDy + vertexCoordinateRDy) * 0.5;
                const CoordinateRURDx = (vertexCoordinateRUx + vertexCoordinateRDx) * 0.5;
                const CoordinateRURDy = (vertexCoordinateRUy + vertexCoordinateRDy) * 0.5;
                const vec2 = SS6Player.CoordinateGetDiagonalIntersection(verts[0], verts[1], CoordinateLURUx, CoordinateLURUy, CoordinateRURDx, CoordinateRURDy, CoordinateLULDx, CoordinateLULDy, CoordinateLDRDx, CoordinateLDRDy, this._CoordinateGetDiagonalIntersectionVec2);
                verts[0] = vec2[0];
                verts[1] = vec2[1];
              }
              const px = verts[0];
              const py = verts[1];
              for (let j = 0; j < verts.length / 2; j++) {
                verts[j * 2] -= px;
                verts[j * 2 + 1] -= py;
              }
              mesh.vertices = verts;
              if (data.flag1 & PART_FLAG.U_MOVE || data.flag1 & PART_FLAG.V_MOVE || data.flag1 & PART_FLAG.U_SCALE || data.flag1 & PART_FLAG.V_SCALE || data.flag1 & PART_FLAG.UV_ROTATION) {
                const u1 = cell.u1() + data.uv_move_X;
                const u2 = cell.u2() + data.uv_move_X;
                const v1 = cell.v1() + data.uv_move_Y;
                const v2 = cell.v2() + data.uv_move_Y;
                const cx = (u2 + u1) / 2;
                const cy = (v2 + v1) / 2;
                const uvw = (u2 - u1) / 2 * data.uv_scale_X;
                const uvh = (v2 - v1) / 2 * data.uv_scale_Y;
                mesh.uvs[0] = cx;
                mesh.uvs[1] = cy;
                mesh.uvs[2] = cx - uvw;
                mesh.uvs[3] = cy - uvh;
                mesh.uvs[4] = cx + uvw;
                mesh.uvs[5] = cy - uvh;
                mesh.uvs[6] = cx - uvw;
                mesh.uvs[7] = cy + uvh;
                mesh.uvs[8] = cx + uvw;
                mesh.uvs[9] = cy + uvh;
                if (data.flag1 & PART_FLAG.UV_ROTATION) {
                  const rot = data.uv_rotation * Math.PI / 180;
                  for (let idx = 0; idx < 5; idx++) {
                    const dx = mesh.uvs[idx * 2 + 0] - cx;
                    const dy = mesh.uvs[idx * 2 + 1] - cy;
                    const cos = Math.cos(rot);
                    const sin = Math.sin(rot);
                    const tmpX = cos * dx - sin * dy;
                    const tmpY = sin * dx + cos * dy;
                    mesh.uvs[idx * 2 + 0] = cx + tmpX;
                    mesh.uvs[idx * 2 + 1] = cy + tmpY;
                  }
                }
                mesh.dirty++;
              }
              mesh.position.set(px, py);
              let opacity = data.opacity / 255;
              if (data.localopacity < 255) {
                opacity = data.localopacity / 255;
              }
              mesh.alpha = opacity * this.parentAlpha;
              mesh.visible = !data.f_hide;
              if (data.useColorMatrix) {
                mesh.filters = [data.colorMatrix];
              }
              if (data.tint) {
                mesh.tint = data.tint;
                const ca = ((data.partsColorARGB & 4278190080) >>> 24) / 255;
                mesh.alpha = mesh.alpha * ca;
              }
              if (data.tintRgb) {
                mesh.tintRgb = data.tintRgb;
              }
              const blendMode = this.alphaBlendType[i];
              if (blendMode === constants.BLEND_MODES.MULTIPLY || blendMode === constants.BLEND_MODES.SCREEN) {
                mesh.alpha = 1;
              }
              if (partType !== SsPartType.Mask)
                this.addChild(mesh);
              break;
            }
            case SsPartType.Nulltype: {
              const opacity = this.InheritOpacity(1, data.index, frameNumber);
              mesh.alpha = opacity * data.localopacity / 255;
              const verts = this.TransformVerts(SS6Player.GetDummyVerts(), data.index, frameNumber);
              const px = verts[0];
              const py = verts[1];
              mesh.position.set(px, py);
              const ax = Math.atan2(verts[5] - verts[3], verts[4] - verts[2]);
              const ay = Math.atan2(verts[7] - verts[3], verts[6] - verts[2]);
              mesh.rotation = ax;
              mesh.skew.x = ay - ax - Math.PI / 2;
              break;
            }
          }
        }
      }
      ChangeInstanceAnime(partName, animePackName, animeName, overWrite, keyParam = null) {
        let rc = false;
        if (this.curAnimePackName !== null && this.curAnimation !== null) {
          let packData = this.curAnimePackData;
          let partsLength = packData.partsLength();
          for (let index = 0; index < partsLength; index++) {
            let partData = packData.parts(index);
            if (partData.name() === partName) {
              let mesh = this.prevMesh[index];
              if (mesh === null || mesh instanceof SS6Player) {
                this.substituteOverWrite[index] = overWrite;
                let keyParamAsSubstitute;
                if (keyParam !== null) {
                  keyParamAsSubstitute = keyParam;
                  mesh = this.MakeCellPlayer(animePackName + "/" + animeName, keyParam.refStartframe);
                } else {
                  mesh = this.MakeCellPlayer(animePackName + "/" + animeName);
                  keyParamAsSubstitute = new SS6PlayerInstanceKeyParam();
                  keyParamAsSubstitute.refStartframe = mesh.startFrame;
                  keyParamAsSubstitute.refEndframe = mesh.endFrame;
                }
                mesh.name = partData.name();
                this.prevMesh[index] = mesh;
                this.substituteKeyParam[index] = keyParamAsSubstitute;
                rc = true;
                break;
              }
            }
          }
        }
        return rc;
      }
      InheritOpacity(opacity, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        opacity = data.opacity / 255;
        if (this.parentIndex[id] >= 0) {
          opacity = this.InheritOpacity(opacity, this.parentIndex[id], frameNumber);
        }
        return opacity;
      }
      TransformVertsLocal(verts, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        const rz = -data.rotationZ * Math.PI / 180;
        const cos = Math.cos(rz);
        const sin = Math.sin(rz);
        for (let i = 0; i < verts.length / 2; i++) {
          let x = verts[i * 2];
          let y = verts[i * 2 + 1];
          if (data.i_transformVerts & 1 && i === 1) {
            x += data.u00;
            y -= data.v00;
          }
          if (data.i_transformVerts & 2 && i === 2) {
            x += data.u01;
            y -= data.v01;
          }
          if (data.i_transformVerts & 4 && i === 3) {
            x += data.u10;
            y -= data.v10;
          }
          if (data.i_transformVerts & 8 && i === 4) {
            x += data.u11;
            y -= data.v11;
          }
          x *= data.scaleX * data.localscaleX;
          y *= data.scaleY * data.localscaleY;
          verts[i * 2] = cos * x - sin * y + data.positionX;
          verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
          if (data.f_flipH) {
            verts[i * 2] = verts[0] * 2 - verts[i * 2];
          }
          if (data.f_flipV) {
            verts[i * 2 + 1] = verts[1] * 2 - verts[i * 2 + 1];
          }
        }
        if (this.parentIndex[id] >= 0) {
          verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
        }
        return verts;
      }
      TransformMeshVertsLocal(verts, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        const rz = -data.rotationZ * Math.PI / 180;
        const cos = Math.cos(rz);
        const sin = Math.sin(rz);
        for (let i = 0; i < verts.length / 2; i++) {
          let x = verts[i * 2];
          let y = verts[i * 2 + 1];
          x *= data.scaleX * data.localscaleX;
          y *= data.scaleY * data.localscaleY;
          verts[i * 2] = cos * x - sin * y + data.positionX;
          verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
        }
        if (this.parentIndex[id] >= 0) {
          verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
        }
        return verts;
      }
      TransformPositionLocal(pos, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        pos[4] += -data.rotationZ;
        const rz = -data.rotationZ * Math.PI / 180;
        const cos = Math.cos(rz);
        const sin = Math.sin(rz);
        const x = pos[0] * data.scaleX * data.localscaleX;
        const y = pos[1] * data.scaleY * data.localscaleY;
        pos[2] *= data.scaleX * data.localscaleX;
        pos[3] *= data.scaleY * data.localscaleY;
        pos[0] = cos * x - sin * y + data.positionX;
        pos[1] = sin * x + cos * y - data.positionY;
        if (this.parentIndex[id] >= 0) {
          pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
        }
        return pos;
      }
      static CoordinateGetDiagonalIntersection(cx, cy, LUx, LUy, RUx, RUy, LDx, LDy, RDx, RDy, vec2) {
        const c1 = (LDy - RUy) * (LDx - LUx) - (LDx - RUx) * (LDy - LUy);
        const c2 = (RDx - LUx) * (LDy - LUy) - (RDy - LUy) * (LDx - LUx);
        const c3 = (RDx - LUx) * (LDy - RUy) - (RDy - LUy) * (LDx - RUx);
        if (c3 <= 0 && c3 >= 0)
          return vec2;
        const ca = c1 / c3;
        const cb = c2 / c3;
        if (0 <= ca && 1 >= ca && (0 <= cb && 1 >= cb)) {
          cx = LUx + ca * (RDx - LUx);
          cy = LUy + ca * (RDy - LUy);
        }
        vec2[0] = cx;
        vec2[1] = cy;
        return vec2;
      }
      TransformVerts(verts, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        const rz = -data.rotationZ * Math.PI / 180;
        const cos = Math.cos(rz);
        const sin = Math.sin(rz);
        for (let i = 0; i < verts.length / 2; i++) {
          let x = verts[i * 2];
          let y = verts[i * 2 + 1];
          x *= data.scaleX;
          y *= data.scaleY;
          verts[i * 2] = cos * x - sin * y + data.positionX;
          verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
          if (data.f_flipH) {
            verts[i * 2] = verts[0] * 2 - verts[i * 2];
          }
          if (data.f_flipV) {
            verts[i * 2 + 1] = verts[1] * 2 - verts[i * 2 + 1];
          }
        }
        if (this.parentIndex[id] >= 0) {
          verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
        }
        return verts;
      }
      TransformPosition(pos, id, frameNumber) {
        const data = this.GetFrameData(frameNumber)[id];
        pos[4] += -data.rotationZ;
        const rz = -data.rotationZ * Math.PI / 180;
        const cos = Math.cos(rz);
        const sin = Math.sin(rz);
        const x = pos[0] * data.scaleX;
        const y = pos[1] * data.scaleY;
        pos[2] *= data.scaleX;
        pos[3] *= data.scaleY;
        pos[0] = cos * x - sin * y + data.positionX;
        pos[1] = sin * x + cos * y - data.positionY;
        if (this.parentIndex[id] >= 0) {
          pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
        }
        return pos;
      }
      MakeCellMesh(id) {
        const cell = this.fbObj.cells(id);
        const u1 = cell.u1();
        const u2 = cell.u2();
        const v1 = cell.v1();
        const v2 = cell.v2();
        const w = cell.width() / 2;
        const h = cell.height() / 2;
        const verts = new Float32Array([0, 0, -w, -h, w, -h, -w, h, w, h]);
        const uvs = new Float32Array([(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2]);
        const indices = new Uint16Array([0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]);
        return new meshExtras.SimpleMesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices, constants.DRAW_MODES.TRIANGLES);
      }
      MakeMeshCellMesh(partID, cellID) {
        const meshsDataUV = this.curAnimation.meshsDataUV(partID);
        const uvLength = meshsDataUV.uvLength();
        if (uvLength > 0) {
          const uvs = new Float32Array(uvLength - 2);
          const meshNum = meshsDataUV.uv(1);
          for (let idx = 2; idx < uvLength; idx++) {
            uvs[idx - 2] = meshsDataUV.uv(idx);
          }
          const meshsDataIndices = this.curAnimation.meshsDataIndices(partID);
          const indicesLength = meshsDataIndices.indicesLength();
          const indices = new Uint16Array(indicesLength - 1);
          for (let idx = 1; idx < indicesLength; idx++) {
            indices[idx - 1] = meshsDataIndices.indices(idx);
          }
          const verts = new Float32Array(meshNum * 2);
          return new meshExtras.SimpleMesh(this.resources[this.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices, constants.DRAW_MODES.TRIANGLES);
        }
        return null;
      }
      MakeCellPlayer(refname, refStart = void 0) {
        const split = refname.split("/");
        const ssp = new SS6Player(this.ss6project);
        ssp.Setup(split[0], split[1]);
        ssp.Play(refStart);
        return ssp;
      }
      static GetVerts(cell, data, verts) {
        const w = data.size_X / 2;
        const h = data.size_Y / 2;
        const px = data.size_X * -(data.pivotX + cell.pivotX());
        const py = data.size_Y * (data.pivotY + cell.pivotY());
        verts.set([px, py, px - w, py - h, px + w, py - h, px - w, py + h, px + w, py + h]);
        return verts;
      }
      static GetMeshVerts(cell, data, verts) {
        for (let idx = 0; idx < data.meshNum; idx++) {
          verts[idx * 2] = data.meshDataPoint[idx * 3];
          verts[idx * 2 + 1] = -data.meshDataPoint[idx * 3 + 1];
        }
        return verts;
      }
      static GetDummyVerts() {
        return new Float32Array([0, 0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
      }
      resetLiveFrame() {
        const layers = this.curAnimation.defaultDataLength();
        for (let i = 0; i < layers; i++) {
          this.liveFrame[i] = 0;
        }
      }
    }

    exports.SS6Player = SS6Player;
    exports.SS6PlayerInstanceKeyParam = SS6PlayerInstanceKeyParam;
    exports.SS6Project = SS6Project;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ss6player-pixi.umd.js.map
