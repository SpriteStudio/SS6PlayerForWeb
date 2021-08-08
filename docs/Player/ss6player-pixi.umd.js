/**
 * -----------------------------------------------------------
 * SS6Player For pixi.js v1.7.0
 *
 * Copyright(C) Web Technology Corp.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pixi.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'pixi.js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ss6PlayerPixi = {}, global.PIXI));
}(this, (function (exports, PIXI) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var PIXI__namespace = /*#__PURE__*/_interopNamespace(PIXI);

    const SIZEOF_INT = 4;
    const FILE_IDENTIFIER_LENGTH = 4;

    const int32$1 = new Int32Array(2);
    const float32 = new Float32Array(int32$1.buffer);
    const float64 = new Float64Array(int32$1.buffer);
    const isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

    class Long {
        constructor(low, high) {
            this.low = low | 0;
            this.high = high | 0;
        }
        static create(low, high) {
            // Special-case zero to avoid GC overhead for default values
            return low == 0 && high == 0 ? Long.ZERO : new Long(low, high);
        }
        toFloat64() {
            return (this.low >>> 0) + this.high * 0x100000000;
        }
        equals(other) {
            return this.low == other.low && this.high == other.high;
        }
    }
    Long.ZERO = new Long(0, 0);

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
            return new Long(this.readInt32(offset), this.readInt32(offset + 4));
        }
        readUint64(offset) {
            return new Long(this.readUint32(offset), this.readUint32(offset + 4));
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
            this.writeInt32(offset, value.low);
            this.writeInt32(offset + 4, value.high);
        }
        writeUint64(offset, value) {
            this.writeUint32(offset, value.low);
            this.writeUint32(offset + 4, value.high);
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
         * A helper function to avoid generated code depending on this file directly.
         */
        createLong(low, high) {
            return Long.create(low, high);
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

    /**
     * -----------------------------------------------------------
     * ssfblib v1.1.0
     *
     * Copyright(C) Web Technology Corp.
     * https://www.webtech.co.jp/
     * -----------------------------------------------------------
     */

    const SIZE_PREFIX_LENGTH = 4;

    const int32 = new Int32Array(2);
    new Float32Array(int32.buffer);
    new Float64Array(int32.buffer);
    new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

    var Encoding;
    (function (Encoding) {
        Encoding[Encoding["UTF8_BYTES"] = 1] = "UTF8_BYTES";
        Encoding[Encoding["UTF16_STRING"] = 2] = "UTF16_STRING";
    })(Encoding || (Encoding = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var AnimationInitialData = /** @class */ (function () {
        function AnimationInitialData() {
            this.bb = null;
            this.bb_pos = 0;
        }
        AnimationInitialData.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        AnimationInitialData.getRootAsAnimationInitialData = function (bb, obj) {
            return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimationInitialData.getSizePrefixedRootAsAnimationInitialData = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimationInitialData.prototype.index = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.lowflag = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.highflag = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.priority = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.cellIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.opacity = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.localopacity = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.masklimen = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.positionX = function () {
            var offset = this.bb.__offset(this.bb_pos, 20);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.positionY = function () {
            var offset = this.bb.__offset(this.bb_pos, 22);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.positionZ = function () {
            var offset = this.bb.__offset(this.bb_pos, 24);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.pivotX = function () {
            var offset = this.bb.__offset(this.bb_pos, 26);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.pivotY = function () {
            var offset = this.bb.__offset(this.bb_pos, 28);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.rotationX = function () {
            var offset = this.bb.__offset(this.bb_pos, 30);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.rotationY = function () {
            var offset = this.bb.__offset(this.bb_pos, 32);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.rotationZ = function () {
            var offset = this.bb.__offset(this.bb_pos, 34);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.scaleX = function () {
            var offset = this.bb.__offset(this.bb_pos, 36);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.scaleY = function () {
            var offset = this.bb.__offset(this.bb_pos, 38);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.localscaleX = function () {
            var offset = this.bb.__offset(this.bb_pos, 40);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.localscaleY = function () {
            var offset = this.bb.__offset(this.bb_pos, 42);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.sizeX = function () {
            var offset = this.bb.__offset(this.bb_pos, 44);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.sizeY = function () {
            var offset = this.bb.__offset(this.bb_pos, 46);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.uvMoveX = function () {
            var offset = this.bb.__offset(this.bb_pos, 48);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.uvMoveY = function () {
            var offset = this.bb.__offset(this.bb_pos, 50);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.uvRotation = function () {
            var offset = this.bb.__offset(this.bb_pos, 52);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.uvScaleX = function () {
            var offset = this.bb.__offset(this.bb_pos, 54);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.uvScaleY = function () {
            var offset = this.bb.__offset(this.bb_pos, 56);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.boundingRadius = function () {
            var offset = this.bb.__offset(this.bb_pos, 58);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.instanceValueCurKeyframe = function () {
            var offset = this.bb.__offset(this.bb_pos, 60);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.instanceValueStartFrame = function () {
            var offset = this.bb.__offset(this.bb_pos, 62);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.instanceValueEndFrame = function () {
            var offset = this.bb.__offset(this.bb_pos, 64);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.instanceValueLoopNum = function () {
            var offset = this.bb.__offset(this.bb_pos, 66);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.instanceValueSpeed = function () {
            var offset = this.bb.__offset(this.bb_pos, 68);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.instanceValueLoopflag = function () {
            var offset = this.bb.__offset(this.bb_pos, 70);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.effectValueCurKeyframe = function () {
            var offset = this.bb.__offset(this.bb_pos, 72);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.effectValueStartTime = function () {
            var offset = this.bb.__offset(this.bb_pos, 74);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.prototype.effectValueSpeed = function () {
            var offset = this.bb.__offset(this.bb_pos, 76);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationInitialData.prototype.effectValueLoopflag = function () {
            var offset = this.bb.__offset(this.bb_pos, 78);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        AnimationInitialData.startAnimationInitialData = function (builder) {
            builder.startObject(38);
        };
        AnimationInitialData.addIndex = function (builder, index) {
            builder.addFieldInt16(0, index, 0);
        };
        AnimationInitialData.addLowflag = function (builder, lowflag) {
            builder.addFieldInt32(1, lowflag, 0);
        };
        AnimationInitialData.addHighflag = function (builder, highflag) {
            builder.addFieldInt32(2, highflag, 0);
        };
        AnimationInitialData.addPriority = function (builder, priority) {
            builder.addFieldInt16(3, priority, 0);
        };
        AnimationInitialData.addCellIndex = function (builder, cellIndex) {
            builder.addFieldInt16(4, cellIndex, 0);
        };
        AnimationInitialData.addOpacity = function (builder, opacity) {
            builder.addFieldInt16(5, opacity, 0);
        };
        AnimationInitialData.addLocalopacity = function (builder, localopacity) {
            builder.addFieldInt16(6, localopacity, 0);
        };
        AnimationInitialData.addMasklimen = function (builder, masklimen) {
            builder.addFieldInt16(7, masklimen, 0);
        };
        AnimationInitialData.addPositionX = function (builder, positionX) {
            builder.addFieldFloat32(8, positionX, 0.0);
        };
        AnimationInitialData.addPositionY = function (builder, positionY) {
            builder.addFieldFloat32(9, positionY, 0.0);
        };
        AnimationInitialData.addPositionZ = function (builder, positionZ) {
            builder.addFieldFloat32(10, positionZ, 0.0);
        };
        AnimationInitialData.addPivotX = function (builder, pivotX) {
            builder.addFieldFloat32(11, pivotX, 0.0);
        };
        AnimationInitialData.addPivotY = function (builder, pivotY) {
            builder.addFieldFloat32(12, pivotY, 0.0);
        };
        AnimationInitialData.addRotationX = function (builder, rotationX) {
            builder.addFieldFloat32(13, rotationX, 0.0);
        };
        AnimationInitialData.addRotationY = function (builder, rotationY) {
            builder.addFieldFloat32(14, rotationY, 0.0);
        };
        AnimationInitialData.addRotationZ = function (builder, rotationZ) {
            builder.addFieldFloat32(15, rotationZ, 0.0);
        };
        AnimationInitialData.addScaleX = function (builder, scaleX) {
            builder.addFieldFloat32(16, scaleX, 0.0);
        };
        AnimationInitialData.addScaleY = function (builder, scaleY) {
            builder.addFieldFloat32(17, scaleY, 0.0);
        };
        AnimationInitialData.addLocalscaleX = function (builder, localscaleX) {
            builder.addFieldFloat32(18, localscaleX, 0.0);
        };
        AnimationInitialData.addLocalscaleY = function (builder, localscaleY) {
            builder.addFieldFloat32(19, localscaleY, 0.0);
        };
        AnimationInitialData.addSizeX = function (builder, sizeX) {
            builder.addFieldFloat32(20, sizeX, 0.0);
        };
        AnimationInitialData.addSizeY = function (builder, sizeY) {
            builder.addFieldFloat32(21, sizeY, 0.0);
        };
        AnimationInitialData.addUvMoveX = function (builder, uvMoveX) {
            builder.addFieldFloat32(22, uvMoveX, 0.0);
        };
        AnimationInitialData.addUvMoveY = function (builder, uvMoveY) {
            builder.addFieldFloat32(23, uvMoveY, 0.0);
        };
        AnimationInitialData.addUvRotation = function (builder, uvRotation) {
            builder.addFieldFloat32(24, uvRotation, 0.0);
        };
        AnimationInitialData.addUvScaleX = function (builder, uvScaleX) {
            builder.addFieldFloat32(25, uvScaleX, 0.0);
        };
        AnimationInitialData.addUvScaleY = function (builder, uvScaleY) {
            builder.addFieldFloat32(26, uvScaleY, 0.0);
        };
        AnimationInitialData.addBoundingRadius = function (builder, boundingRadius) {
            builder.addFieldFloat32(27, boundingRadius, 0.0);
        };
        AnimationInitialData.addInstanceValueCurKeyframe = function (builder, instanceValueCurKeyframe) {
            builder.addFieldInt32(28, instanceValueCurKeyframe, 0);
        };
        AnimationInitialData.addInstanceValueStartFrame = function (builder, instanceValueStartFrame) {
            builder.addFieldInt32(29, instanceValueStartFrame, 0);
        };
        AnimationInitialData.addInstanceValueEndFrame = function (builder, instanceValueEndFrame) {
            builder.addFieldInt32(30, instanceValueEndFrame, 0);
        };
        AnimationInitialData.addInstanceValueLoopNum = function (builder, instanceValueLoopNum) {
            builder.addFieldInt32(31, instanceValueLoopNum, 0);
        };
        AnimationInitialData.addInstanceValueSpeed = function (builder, instanceValueSpeed) {
            builder.addFieldFloat32(32, instanceValueSpeed, 0.0);
        };
        AnimationInitialData.addInstanceValueLoopflag = function (builder, instanceValueLoopflag) {
            builder.addFieldInt32(33, instanceValueLoopflag, 0);
        };
        AnimationInitialData.addEffectValueCurKeyframe = function (builder, effectValueCurKeyframe) {
            builder.addFieldInt32(34, effectValueCurKeyframe, 0);
        };
        AnimationInitialData.addEffectValueStartTime = function (builder, effectValueStartTime) {
            builder.addFieldInt32(35, effectValueStartTime, 0);
        };
        AnimationInitialData.addEffectValueSpeed = function (builder, effectValueSpeed) {
            builder.addFieldFloat32(36, effectValueSpeed, 0.0);
        };
        AnimationInitialData.addEffectValueLoopflag = function (builder, effectValueLoopflag) {
            builder.addFieldInt32(37, effectValueLoopflag, 0);
        };
        AnimationInitialData.endAnimationInitialData = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        AnimationInitialData.createAnimationInitialData = function (builder, index, lowflag, highflag, priority, cellIndex, opacity, localopacity, masklimen, positionX, positionY, positionZ, pivotX, pivotY, rotationX, rotationY, rotationZ, scaleX, scaleY, localscaleX, localscaleY, sizeX, sizeY, uvMoveX, uvMoveY, uvRotation, uvScaleX, uvScaleY, boundingRadius, instanceValueCurKeyframe, instanceValueStartFrame, instanceValueEndFrame, instanceValueLoopNum, instanceValueSpeed, instanceValueLoopflag, effectValueCurKeyframe, effectValueStartTime, effectValueSpeed, effectValueLoopflag) {
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
        };
        return AnimationInitialData;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var partState = /** @class */ (function () {
        function partState() {
            this.bb = null;
            this.bb_pos = 0;
        }
        partState.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        partState.getRootAspartState = function (bb, obj) {
            return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        partState.getSizePrefixedRootAspartState = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        partState.prototype.index = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        partState.prototype.flag1 = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
        };
        partState.prototype.flag2 = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
        };
        partState.prototype.data = function (index) {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
        };
        partState.prototype.dataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        partState.prototype.dataArray = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
        };
        partState.startpartState = function (builder) {
            builder.startObject(4);
        };
        partState.addIndex = function (builder, index) {
            builder.addFieldInt16(0, index, 0);
        };
        partState.addFlag1 = function (builder, flag1) {
            builder.addFieldInt32(1, flag1, 0);
        };
        partState.addFlag2 = function (builder, flag2) {
            builder.addFieldInt32(2, flag2, 0);
        };
        partState.addData = function (builder, dataOffset) {
            builder.addFieldOffset(3, dataOffset, 0);
        };
        partState.createDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addInt32(data[i]);
            }
            return builder.endVector();
        };
        partState.startDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        partState.endpartState = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        partState.createpartState = function (builder, index, flag1, flag2, dataOffset) {
            partState.startpartState(builder);
            partState.addIndex(builder, index);
            partState.addFlag1(builder, flag1);
            partState.addFlag2(builder, flag2);
            partState.addData(builder, dataOffset);
            return partState.endpartState(builder);
        };
        return partState;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var frameDataIndex = /** @class */ (function () {
        function frameDataIndex() {
            this.bb = null;
            this.bb_pos = 0;
        }
        frameDataIndex.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        frameDataIndex.getRootAsframeDataIndex = function (bb, obj) {
            return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        frameDataIndex.getSizePrefixedRootAsframeDataIndex = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        frameDataIndex.prototype.states = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? (obj || new partState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        frameDataIndex.prototype.statesLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        frameDataIndex.startframeDataIndex = function (builder) {
            builder.startObject(1);
        };
        frameDataIndex.addStates = function (builder, statesOffset) {
            builder.addFieldOffset(0, statesOffset, 0);
        };
        frameDataIndex.createStatesVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        frameDataIndex.startStatesVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        frameDataIndex.endframeDataIndex = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        frameDataIndex.createframeDataIndex = function (builder, statesOffset) {
            frameDataIndex.startframeDataIndex(builder);
            frameDataIndex.addStates(builder, statesOffset);
            return frameDataIndex.endframeDataIndex(builder);
        };
        return frameDataIndex;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var labelDataItem = /** @class */ (function () {
        function labelDataItem() {
            this.bb = null;
            this.bb_pos = 0;
        }
        labelDataItem.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        labelDataItem.getRootAslabelDataItem = function (bb, obj) {
            return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        labelDataItem.getSizePrefixedRootAslabelDataItem = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        labelDataItem.prototype.label = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        labelDataItem.prototype.frameIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        labelDataItem.startlabelDataItem = function (builder) {
            builder.startObject(2);
        };
        labelDataItem.addLabel = function (builder, labelOffset) {
            builder.addFieldOffset(0, labelOffset, 0);
        };
        labelDataItem.addFrameIndex = function (builder, frameIndex) {
            builder.addFieldInt16(1, frameIndex, 0);
        };
        labelDataItem.endlabelDataItem = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        labelDataItem.createlabelDataItem = function (builder, labelOffset, frameIndex) {
            labelDataItem.startlabelDataItem(builder);
            labelDataItem.addLabel(builder, labelOffset);
            labelDataItem.addFrameIndex(builder, frameIndex);
            return labelDataItem.endlabelDataItem(builder);
        };
        return labelDataItem;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var meshDataIndices = /** @class */ (function () {
        function meshDataIndices() {
            this.bb = null;
            this.bb_pos = 0;
        }
        meshDataIndices.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        meshDataIndices.getRootAsmeshDataIndices = function (bb, obj) {
            return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        meshDataIndices.getSizePrefixedRootAsmeshDataIndices = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        meshDataIndices.prototype.indices = function (index) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
        };
        meshDataIndices.prototype.indicesLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        meshDataIndices.prototype.indicesArray = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
        };
        meshDataIndices.startmeshDataIndices = function (builder) {
            builder.startObject(1);
        };
        meshDataIndices.addIndices = function (builder, indicesOffset) {
            builder.addFieldOffset(0, indicesOffset, 0);
        };
        meshDataIndices.createIndicesVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addFloat32(data[i]);
            }
            return builder.endVector();
        };
        meshDataIndices.startIndicesVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        meshDataIndices.endmeshDataIndices = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        meshDataIndices.createmeshDataIndices = function (builder, indicesOffset) {
            meshDataIndices.startmeshDataIndices(builder);
            meshDataIndices.addIndices(builder, indicesOffset);
            return meshDataIndices.endmeshDataIndices(builder);
        };
        return meshDataIndices;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var meshDataUV = /** @class */ (function () {
        function meshDataUV() {
            this.bb = null;
            this.bb_pos = 0;
        }
        meshDataUV.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        meshDataUV.getRootAsmeshDataUV = function (bb, obj) {
            return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        meshDataUV.getSizePrefixedRootAsmeshDataUV = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        meshDataUV.prototype.uv = function (index) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
        };
        meshDataUV.prototype.uvLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        meshDataUV.prototype.uvArray = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
        };
        meshDataUV.startmeshDataUV = function (builder) {
            builder.startObject(1);
        };
        meshDataUV.addUv = function (builder, uvOffset) {
            builder.addFieldOffset(0, uvOffset, 0);
        };
        meshDataUV.createUvVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addFloat32(data[i]);
            }
            return builder.endVector();
        };
        meshDataUV.startUvVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        meshDataUV.endmeshDataUV = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        meshDataUV.createmeshDataUV = function (builder, uvOffset) {
            meshDataUV.startmeshDataUV(builder);
            meshDataUV.addUv(builder, uvOffset);
            return meshDataUV.endmeshDataUV(builder);
        };
        return meshDataUV;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataItem = /** @class */ (function () {
        function userDataItem() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataItem.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataItem.getRootAsuserDataItem = function (bb, obj) {
            return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataItem.getSizePrefixedRootAsuserDataItem = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataItem.prototype.flags = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        userDataItem.prototype.arrayIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        userDataItem.prototype.dataType = function (index) {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
        };
        userDataItem.prototype.dataTypeLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        userDataItem.prototype.dataTypeArray = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
        };
        userDataItem.prototype.data = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
        };
        userDataItem.prototype.dataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        userDataItem.startuserDataItem = function (builder) {
            builder.startObject(4);
        };
        userDataItem.addFlags = function (builder, flags) {
            builder.addFieldInt16(0, flags, 0);
        };
        userDataItem.addArrayIndex = function (builder, arrayIndex) {
            builder.addFieldInt16(1, arrayIndex, 0);
        };
        userDataItem.addDataType = function (builder, dataTypeOffset) {
            builder.addFieldOffset(2, dataTypeOffset, 0);
        };
        userDataItem.createDataTypeVector = function (builder, data) {
            builder.startVector(1, data.length, 1);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addInt8(data[i]);
            }
            return builder.endVector();
        };
        userDataItem.startDataTypeVector = function (builder, numElems) {
            builder.startVector(1, numElems, 1);
        };
        userDataItem.addData = function (builder, dataOffset) {
            builder.addFieldOffset(3, dataOffset, 0);
        };
        userDataItem.createDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        userDataItem.startDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        userDataItem.enduserDataItem = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        userDataItem.createuserDataItem = function (builder, flags, arrayIndex, dataTypeOffset, dataOffset) {
            userDataItem.startuserDataItem(builder);
            userDataItem.addFlags(builder, flags);
            userDataItem.addArrayIndex(builder, arrayIndex);
            userDataItem.addDataType(builder, dataTypeOffset);
            userDataItem.addData(builder, dataOffset);
            return userDataItem.enduserDataItem(builder);
        };
        return userDataItem;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataPerFrame = /** @class */ (function () {
        function userDataPerFrame() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataPerFrame.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataPerFrame.getRootAsuserDataPerFrame = function (bb, obj) {
            return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataPerFrame.getSizePrefixedRootAsuserDataPerFrame = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataPerFrame.prototype.frameIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        userDataPerFrame.prototype.data = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? (obj || new userDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        userDataPerFrame.prototype.dataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        userDataPerFrame.startuserDataPerFrame = function (builder) {
            builder.startObject(2);
        };
        userDataPerFrame.addFrameIndex = function (builder, frameIndex) {
            builder.addFieldInt16(0, frameIndex, 0);
        };
        userDataPerFrame.addData = function (builder, dataOffset) {
            builder.addFieldOffset(1, dataOffset, 0);
        };
        userDataPerFrame.createDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        userDataPerFrame.startDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        userDataPerFrame.enduserDataPerFrame = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        userDataPerFrame.createuserDataPerFrame = function (builder, frameIndex, dataOffset) {
            userDataPerFrame.startuserDataPerFrame(builder);
            userDataPerFrame.addFrameIndex(builder, frameIndex);
            userDataPerFrame.addData(builder, dataOffset);
            return userDataPerFrame.enduserDataPerFrame(builder);
        };
        return userDataPerFrame;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var AnimationData = /** @class */ (function () {
        function AnimationData() {
            this.bb = null;
            this.bb_pos = 0;
        }
        AnimationData.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        AnimationData.getRootAsAnimationData = function (bb, obj) {
            return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimationData.getSizePrefixedRootAsAnimationData = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimationData.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        AnimationData.prototype.defaultData = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? (obj || new AnimationInitialData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.defaultDataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.frameData = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? (obj || new frameDataIndex()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.frameDataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.userData = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? (obj || new userDataPerFrame()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.userDataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.labelData = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? (obj || new labelDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.labelDataLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.meshsDataUV = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? (obj || new meshDataUV()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.meshsDataUVLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.meshsDataIndices = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? (obj || new meshDataIndices()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimationData.prototype.meshsDataIndicesLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.startFrames = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.endFrames = function () {
            var offset = this.bb.__offset(this.bb_pos, 20);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.totalFrames = function () {
            var offset = this.bb.__offset(this.bb_pos, 22);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.fps = function () {
            var offset = this.bb.__offset(this.bb_pos, 24);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.labelNum = function () {
            var offset = this.bb.__offset(this.bb_pos, 26);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.canvasSizeW = function () {
            var offset = this.bb.__offset(this.bb_pos, 28);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.canvasSizeH = function () {
            var offset = this.bb.__offset(this.bb_pos, 30);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        AnimationData.prototype.canvasPvotX = function () {
            var offset = this.bb.__offset(this.bb_pos, 32);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationData.prototype.canvasPvotY = function () {
            var offset = this.bb.__offset(this.bb_pos, 34);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        AnimationData.startAnimationData = function (builder) {
            builder.startObject(16);
        };
        AnimationData.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        AnimationData.addDefaultData = function (builder, defaultDataOffset) {
            builder.addFieldOffset(1, defaultDataOffset, 0);
        };
        AnimationData.createDefaultDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startDefaultDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addFrameData = function (builder, frameDataOffset) {
            builder.addFieldOffset(2, frameDataOffset, 0);
        };
        AnimationData.createFrameDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startFrameDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addUserData = function (builder, userDataOffset) {
            builder.addFieldOffset(3, userDataOffset, 0);
        };
        AnimationData.createUserDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startUserDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addLabelData = function (builder, labelDataOffset) {
            builder.addFieldOffset(4, labelDataOffset, 0);
        };
        AnimationData.createLabelDataVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startLabelDataVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addMeshsDataUV = function (builder, meshsDataUVOffset) {
            builder.addFieldOffset(5, meshsDataUVOffset, 0);
        };
        AnimationData.createMeshsDataUVVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startMeshsDataUVVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addMeshsDataIndices = function (builder, meshsDataIndicesOffset) {
            builder.addFieldOffset(6, meshsDataIndicesOffset, 0);
        };
        AnimationData.createMeshsDataIndicesVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimationData.startMeshsDataIndicesVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimationData.addStartFrames = function (builder, startFrames) {
            builder.addFieldInt16(7, startFrames, 0);
        };
        AnimationData.addEndFrames = function (builder, endFrames) {
            builder.addFieldInt16(8, endFrames, 0);
        };
        AnimationData.addTotalFrames = function (builder, totalFrames) {
            builder.addFieldInt16(9, totalFrames, 0);
        };
        AnimationData.addFps = function (builder, fps) {
            builder.addFieldInt16(10, fps, 0);
        };
        AnimationData.addLabelNum = function (builder, labelNum) {
            builder.addFieldInt16(11, labelNum, 0);
        };
        AnimationData.addCanvasSizeW = function (builder, canvasSizeW) {
            builder.addFieldInt16(12, canvasSizeW, 0);
        };
        AnimationData.addCanvasSizeH = function (builder, canvasSizeH) {
            builder.addFieldInt16(13, canvasSizeH, 0);
        };
        AnimationData.addCanvasPvotX = function (builder, canvasPvotX) {
            builder.addFieldFloat32(14, canvasPvotX, 0.0);
        };
        AnimationData.addCanvasPvotY = function (builder, canvasPvotY) {
            builder.addFieldFloat32(15, canvasPvotY, 0.0);
        };
        AnimationData.endAnimationData = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        AnimationData.createAnimationData = function (builder, nameOffset, defaultDataOffset, frameDataOffset, userDataOffset, labelDataOffset, meshsDataUVOffset, meshsDataIndicesOffset, startFrames, endFrames, totalFrames, fps, labelNum, canvasSizeW, canvasSizeH, canvasPvotX, canvasPvotY) {
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
        };
        return AnimationData;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var SsPartType;
    (function (SsPartType) {
        SsPartType[SsPartType["Invalid"] = -1] = "Invalid";
        SsPartType[SsPartType["Nulltype"] = 0] = "Nulltype";
        SsPartType[SsPartType["Normal"] = 1] = "Normal";
        SsPartType[SsPartType["Text"] = 2] = "Text";
        SsPartType[SsPartType["Instance"] = 3] = "Instance";
        SsPartType[SsPartType["Armature"] = 4] = "Armature";
        SsPartType[SsPartType["Effect"] = 5] = "Effect";
        SsPartType[SsPartType["Mesh"] = 6] = "Mesh";
        SsPartType[SsPartType["Movenode"] = 7] = "Movenode";
        SsPartType[SsPartType["Constraint"] = 8] = "Constraint";
        SsPartType[SsPartType["Mask"] = 9] = "Mask";
        SsPartType[SsPartType["Joint"] = 10] = "Joint";
        SsPartType[SsPartType["Bonepoint"] = 11] = "Bonepoint";
    })(SsPartType || (SsPartType = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var PartData = /** @class */ (function () {
        function PartData() {
            this.bb = null;
            this.bb_pos = 0;
        }
        PartData.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        PartData.getRootAsPartData = function (bb, obj) {
            return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        PartData.getSizePrefixedRootAsPartData = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        PartData.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        PartData.prototype.index = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        PartData.prototype.parentIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        PartData.prototype.type = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt8(this.bb_pos + offset) : SsPartType.Nulltype;
        };
        PartData.prototype.boundsType = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        PartData.prototype.alphaBlendType = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        PartData.prototype.refname = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        PartData.prototype.effectfilename = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        PartData.prototype.colorLabel = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 20);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        PartData.prototype.maskInfluence = function () {
            var offset = this.bb.__offset(this.bb_pos, 22);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        PartData.startPartData = function (builder) {
            builder.startObject(10);
        };
        PartData.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        PartData.addIndex = function (builder, index) {
            builder.addFieldInt16(1, index, 0);
        };
        PartData.addParentIndex = function (builder, parentIndex) {
            builder.addFieldInt16(2, parentIndex, 0);
        };
        PartData.addType = function (builder, type) {
            builder.addFieldInt8(3, type, SsPartType.Nulltype);
        };
        PartData.addBoundsType = function (builder, boundsType) {
            builder.addFieldInt16(4, boundsType, 0);
        };
        PartData.addAlphaBlendType = function (builder, alphaBlendType) {
            builder.addFieldInt16(5, alphaBlendType, 0);
        };
        PartData.addRefname = function (builder, refnameOffset) {
            builder.addFieldOffset(6, refnameOffset, 0);
        };
        PartData.addEffectfilename = function (builder, effectfilenameOffset) {
            builder.addFieldOffset(7, effectfilenameOffset, 0);
        };
        PartData.addColorLabel = function (builder, colorLabelOffset) {
            builder.addFieldOffset(8, colorLabelOffset, 0);
        };
        PartData.addMaskInfluence = function (builder, maskInfluence) {
            builder.addFieldInt16(9, maskInfluence, 0);
        };
        PartData.endPartData = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        PartData.createPartData = function (builder, nameOffset, index, parentIndex, type, boundsType, alphaBlendType, refnameOffset, effectfilenameOffset, colorLabelOffset, maskInfluence) {
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
        };
        return PartData;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var AnimePackData = /** @class */ (function () {
        function AnimePackData() {
            this.bb = null;
            this.bb_pos = 0;
        }
        AnimePackData.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        AnimePackData.getRootAsAnimePackData = function (bb, obj) {
            return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimePackData.getSizePrefixedRootAsAnimePackData = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        AnimePackData.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        AnimePackData.prototype.parts = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? (obj || new PartData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimePackData.prototype.partsLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimePackData.prototype.animations = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? (obj || new AnimationData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        AnimePackData.prototype.animationsLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        AnimePackData.startAnimePackData = function (builder) {
            builder.startObject(3);
        };
        AnimePackData.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        AnimePackData.addParts = function (builder, partsOffset) {
            builder.addFieldOffset(1, partsOffset, 0);
        };
        AnimePackData.createPartsVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimePackData.startPartsVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimePackData.addAnimations = function (builder, animationsOffset) {
            builder.addFieldOffset(2, animationsOffset, 0);
        };
        AnimePackData.createAnimationsVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        AnimePackData.startAnimationsVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        AnimePackData.endAnimePackData = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        AnimePackData.createAnimePackData = function (builder, nameOffset, partsOffset, animationsOffset) {
            AnimePackData.startAnimePackData(builder);
            AnimePackData.addName(builder, nameOffset);
            AnimePackData.addParts(builder, partsOffset);
            AnimePackData.addAnimations(builder, animationsOffset);
            return AnimePackData.endAnimePackData(builder);
        };
        return AnimePackData;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var CellMap = /** @class */ (function () {
        function CellMap() {
            this.bb = null;
            this.bb_pos = 0;
        }
        CellMap.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        CellMap.getRootAsCellMap = function (bb, obj) {
            return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        CellMap.getSizePrefixedRootAsCellMap = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        CellMap.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        CellMap.prototype.imagePath = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        CellMap.prototype.index = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        CellMap.prototype.wrapmode = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        CellMap.prototype.filtermode = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        CellMap.startCellMap = function (builder) {
            builder.startObject(5);
        };
        CellMap.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        CellMap.addImagePath = function (builder, imagePathOffset) {
            builder.addFieldOffset(1, imagePathOffset, 0);
        };
        CellMap.addIndex = function (builder, index) {
            builder.addFieldInt16(2, index, 0);
        };
        CellMap.addWrapmode = function (builder, wrapmode) {
            builder.addFieldInt16(3, wrapmode, 0);
        };
        CellMap.addFiltermode = function (builder, filtermode) {
            builder.addFieldInt16(4, filtermode, 0);
        };
        CellMap.endCellMap = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        CellMap.createCellMap = function (builder, nameOffset, imagePathOffset, index, wrapmode, filtermode) {
            CellMap.startCellMap(builder);
            CellMap.addName(builder, nameOffset);
            CellMap.addImagePath(builder, imagePathOffset);
            CellMap.addIndex(builder, index);
            CellMap.addWrapmode(builder, wrapmode);
            CellMap.addFiltermode(builder, filtermode);
            return CellMap.endCellMap(builder);
        };
        return CellMap;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var Cell = /** @class */ (function () {
        function Cell() {
            this.bb = null;
            this.bb_pos = 0;
        }
        Cell.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        Cell.getRootAsCell = function (bb, obj) {
            return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        Cell.getSizePrefixedRootAsCell = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        Cell.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        Cell.prototype.cellMap = function (obj) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? (obj || new CellMap()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
        };
        Cell.prototype.indexInCellMap = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        Cell.prototype.x = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        Cell.prototype.y = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        Cell.prototype.width = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        Cell.prototype.height = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        Cell.prototype.pivotX = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.prototype.pivotY = function () {
            var offset = this.bb.__offset(this.bb_pos, 20);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.prototype.u1 = function () {
            var offset = this.bb.__offset(this.bb_pos, 22);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.prototype.v1 = function () {
            var offset = this.bb.__offset(this.bb_pos, 24);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.prototype.u2 = function () {
            var offset = this.bb.__offset(this.bb_pos, 26);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.prototype.v2 = function () {
            var offset = this.bb.__offset(this.bb_pos, 28);
            return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
        };
        Cell.startCell = function (builder) {
            builder.startObject(13);
        };
        Cell.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        Cell.addCellMap = function (builder, cellMapOffset) {
            builder.addFieldOffset(1, cellMapOffset, 0);
        };
        Cell.addIndexInCellMap = function (builder, indexInCellMap) {
            builder.addFieldInt16(2, indexInCellMap, 0);
        };
        Cell.addX = function (builder, x) {
            builder.addFieldInt16(3, x, 0);
        };
        Cell.addY = function (builder, y) {
            builder.addFieldInt16(4, y, 0);
        };
        Cell.addWidth = function (builder, width) {
            builder.addFieldInt16(5, width, 0);
        };
        Cell.addHeight = function (builder, height) {
            builder.addFieldInt16(6, height, 0);
        };
        Cell.addPivotX = function (builder, pivotX) {
            builder.addFieldFloat32(7, pivotX, 0.0);
        };
        Cell.addPivotY = function (builder, pivotY) {
            builder.addFieldFloat32(8, pivotY, 0.0);
        };
        Cell.addU1 = function (builder, u1) {
            builder.addFieldFloat32(9, u1, 0.0);
        };
        Cell.addV1 = function (builder, v1) {
            builder.addFieldFloat32(10, v1, 0.0);
        };
        Cell.addU2 = function (builder, u2) {
            builder.addFieldFloat32(11, u2, 0.0);
        };
        Cell.addV2 = function (builder, v2) {
            builder.addFieldFloat32(12, v2, 0.0);
        };
        Cell.endCell = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        return Cell;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var EffectNode = /** @class */ (function () {
        function EffectNode() {
            this.bb = null;
            this.bb_pos = 0;
        }
        EffectNode.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        EffectNode.getRootAsEffectNode = function (bb, obj) {
            return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        EffectNode.getSizePrefixedRootAsEffectNode = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        EffectNode.prototype.arrayIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.parentIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.type = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.cellIndex = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.blendType = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.numBehavior = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.BehaviorType = function (index) {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
        };
        EffectNode.prototype.BehaviorTypeLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        EffectNode.prototype.BehaviorTypeArray = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
        };
        EffectNode.prototype.Behavior = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
        };
        EffectNode.prototype.BehaviorLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        EffectNode.startEffectNode = function (builder) {
            builder.startObject(8);
        };
        EffectNode.addArrayIndex = function (builder, arrayIndex) {
            builder.addFieldInt16(0, arrayIndex, 0);
        };
        EffectNode.addParentIndex = function (builder, parentIndex) {
            builder.addFieldInt16(1, parentIndex, 0);
        };
        EffectNode.addType = function (builder, type) {
            builder.addFieldInt16(2, type, 0);
        };
        EffectNode.addCellIndex = function (builder, cellIndex) {
            builder.addFieldInt16(3, cellIndex, 0);
        };
        EffectNode.addBlendType = function (builder, blendType) {
            builder.addFieldInt16(4, blendType, 0);
        };
        EffectNode.addNumBehavior = function (builder, numBehavior) {
            builder.addFieldInt16(5, numBehavior, 0);
        };
        EffectNode.addBehaviorType = function (builder, BehaviorTypeOffset) {
            builder.addFieldOffset(6, BehaviorTypeOffset, 0);
        };
        EffectNode.createBehaviorTypeVector = function (builder, data) {
            builder.startVector(1, data.length, 1);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addInt8(data[i]);
            }
            return builder.endVector();
        };
        EffectNode.startBehaviorTypeVector = function (builder, numElems) {
            builder.startVector(1, numElems, 1);
        };
        EffectNode.addBehavior = function (builder, BehaviorOffset) {
            builder.addFieldOffset(7, BehaviorOffset, 0);
        };
        EffectNode.createBehaviorVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        EffectNode.startBehaviorVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        EffectNode.endEffectNode = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        EffectNode.createEffectNode = function (builder, arrayIndex, parentIndex, type, cellIndex, blendType, numBehavior, BehaviorTypeOffset, BehaviorOffset) {
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
        };
        return EffectNode;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var EffectFile = /** @class */ (function () {
        function EffectFile() {
            this.bb = null;
            this.bb_pos = 0;
        }
        EffectFile.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        EffectFile.getRootAsEffectFile = function (bb, obj) {
            return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        EffectFile.getSizePrefixedRootAsEffectFile = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        EffectFile.prototype.name = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        EffectFile.prototype.fps = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.isLockRandSeed = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.lockRandSeed = function () {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.layoutScaleX = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.layoutScaleY = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.numNodeList = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        EffectFile.prototype.effectNode = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? (obj || new EffectNode()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        EffectFile.prototype.effectNodeLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        EffectFile.startEffectFile = function (builder) {
            builder.startObject(8);
        };
        EffectFile.addName = function (builder, nameOffset) {
            builder.addFieldOffset(0, nameOffset, 0);
        };
        EffectFile.addFps = function (builder, fps) {
            builder.addFieldInt16(1, fps, 0);
        };
        EffectFile.addIsLockRandSeed = function (builder, isLockRandSeed) {
            builder.addFieldInt16(2, isLockRandSeed, 0);
        };
        EffectFile.addLockRandSeed = function (builder, lockRandSeed) {
            builder.addFieldInt16(3, lockRandSeed, 0);
        };
        EffectFile.addLayoutScaleX = function (builder, layoutScaleX) {
            builder.addFieldInt16(4, layoutScaleX, 0);
        };
        EffectFile.addLayoutScaleY = function (builder, layoutScaleY) {
            builder.addFieldInt16(5, layoutScaleY, 0);
        };
        EffectFile.addNumNodeList = function (builder, numNodeList) {
            builder.addFieldInt16(6, numNodeList, 0);
        };
        EffectFile.addEffectNode = function (builder, effectNodeOffset) {
            builder.addFieldOffset(7, effectNodeOffset, 0);
        };
        EffectFile.createEffectNodeVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        EffectFile.startEffectNodeVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        EffectFile.endEffectFile = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        EffectFile.createEffectFile = function (builder, nameOffset, fps, isLockRandSeed, lockRandSeed, layoutScaleX, layoutScaleY, numNodeList, effectNodeOffset) {
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
        };
        return EffectFile;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var EffectNodeBehavior;
    (function (EffectNodeBehavior) {
        EffectNodeBehavior[EffectNodeBehavior["NONE"] = 0] = "NONE";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementBasic"] = 1] = "EffectParticleElementBasic";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementRndSeedChange"] = 2] = "EffectParticleElementRndSeedChange";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementDelay"] = 3] = "EffectParticleElementDelay";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementGravity"] = 4] = "EffectParticleElementGravity";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementPosition"] = 5] = "EffectParticleElementPosition";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementRotation"] = 6] = "EffectParticleElementRotation";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementRotationTrans"] = 7] = "EffectParticleElementRotationTrans";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementTransSpeed"] = 8] = "EffectParticleElementTransSpeed";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementTangentialAcceleration"] = 9] = "EffectParticleElementTangentialAcceleration";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementInitColor"] = 10] = "EffectParticleElementInitColor";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementTransColor"] = 11] = "EffectParticleElementTransColor";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementAlphaFade"] = 12] = "EffectParticleElementAlphaFade";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementSize"] = 13] = "EffectParticleElementSize";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleElementTransSize"] = 14] = "EffectParticleElementTransSize";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticlePointGravity"] = 15] = "EffectParticlePointGravity";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleTurnToDirectionEnabled"] = 16] = "EffectParticleTurnToDirectionEnabled";
        EffectNodeBehavior[EffectNodeBehavior["EffectParticleInfiniteEmitEnabled"] = 17] = "EffectParticleInfiniteEmitEnabled";
    })(EffectNodeBehavior || (EffectNodeBehavior = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var PART_FLAG;
    (function (PART_FLAG) {
        PART_FLAG[PART_FLAG["INVISIBLE"] = 1] = "INVISIBLE";
        PART_FLAG[PART_FLAG["FLIP_H"] = 2] = "FLIP_H";
        PART_FLAG[PART_FLAG["FLIP_V"] = 4] = "FLIP_V";
        PART_FLAG[PART_FLAG["CELL_INDEX"] = 8] = "CELL_INDEX";
        PART_FLAG[PART_FLAG["POSITION_X"] = 16] = "POSITION_X";
        PART_FLAG[PART_FLAG["POSITION_Y"] = 32] = "POSITION_Y";
        PART_FLAG[PART_FLAG["POSITION_Z"] = 64] = "POSITION_Z";
        PART_FLAG[PART_FLAG["PIVOT_X"] = 128] = "PIVOT_X";
        PART_FLAG[PART_FLAG["PIVOT_Y"] = 256] = "PIVOT_Y";
        PART_FLAG[PART_FLAG["ROTATIONX"] = 512] = "ROTATIONX";
        PART_FLAG[PART_FLAG["ROTATIONY"] = 1024] = "ROTATIONY";
        PART_FLAG[PART_FLAG["ROTATIONZ"] = 2048] = "ROTATIONZ";
        PART_FLAG[PART_FLAG["SCALE_X"] = 4096] = "SCALE_X";
        PART_FLAG[PART_FLAG["SCALE_Y"] = 8192] = "SCALE_Y";
        PART_FLAG[PART_FLAG["LOCALSCALE_X"] = 16384] = "LOCALSCALE_X";
        PART_FLAG[PART_FLAG["LOCALSCALE_Y"] = 32768] = "LOCALSCALE_Y";
        PART_FLAG[PART_FLAG["OPACITY"] = 65536] = "OPACITY";
        PART_FLAG[PART_FLAG["LOCALOPACITY"] = 131072] = "LOCALOPACITY";
        PART_FLAG[PART_FLAG["PARTS_COLOR"] = 262144] = "PARTS_COLOR";
        PART_FLAG[PART_FLAG["VERTEX_TRANSFORM"] = 524288] = "VERTEX_TRANSFORM";
        PART_FLAG[PART_FLAG["SIZE_X"] = 1048576] = "SIZE_X";
        PART_FLAG[PART_FLAG["SIZE_Y"] = 2097152] = "SIZE_Y";
        PART_FLAG[PART_FLAG["U_MOVE"] = 4194304] = "U_MOVE";
        PART_FLAG[PART_FLAG["V_MOVE"] = 8388608] = "V_MOVE";
        PART_FLAG[PART_FLAG["UV_ROTATION"] = 16777216] = "UV_ROTATION";
        PART_FLAG[PART_FLAG["U_SCALE"] = 33554432] = "U_SCALE";
        PART_FLAG[PART_FLAG["V_SCALE"] = 67108864] = "V_SCALE";
        PART_FLAG[PART_FLAG["BOUNDINGRADIUS"] = 134217728] = "BOUNDINGRADIUS";
        PART_FLAG[PART_FLAG["MASK"] = 268435456] = "MASK";
        PART_FLAG[PART_FLAG["PRIORITY"] = 536870912] = "PRIORITY";
        PART_FLAG[PART_FLAG["INSTANCE_KEYFRAME"] = 1073741824] = "INSTANCE_KEYFRAME";
        PART_FLAG[PART_FLAG["EFFECT_KEYFRAME"] = 2147483648] = "EFFECT_KEYFRAME";
    })(PART_FLAG || (PART_FLAG = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var PART_FLAG2;
    (function (PART_FLAG2) {
        PART_FLAG2[PART_FLAG2["MESHDATA"] = 1] = "MESHDATA";
    })(PART_FLAG2 || (PART_FLAG2 = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var ProjectData = /** @class */ (function () {
        function ProjectData() {
            this.bb = null;
            this.bb_pos = 0;
        }
        ProjectData.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        ProjectData.getRootAsProjectData = function (bb, obj) {
            return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        ProjectData.getSizePrefixedRootAsProjectData = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        ProjectData.bufferHasIdentifier = function (bb) {
            return bb.__has_identifier('SSFB');
        };
        ProjectData.prototype.dataId = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.version = function () {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.flags = function () {
            var offset = this.bb.__offset(this.bb_pos, 8);
            return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.imageBaseDir = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 10);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        ProjectData.prototype.cells = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? (obj || new Cell()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        ProjectData.prototype.cellsLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 12);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.animePacks = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? (obj || new AnimePackData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        ProjectData.prototype.animePacksLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 14);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.effectFileList = function (index, obj) {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? (obj || new EffectFile()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
        };
        ProjectData.prototype.effectFileListLength = function () {
            var offset = this.bb.__offset(this.bb_pos, 16);
            return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.numCells = function () {
            var offset = this.bb.__offset(this.bb_pos, 18);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.numAnimePacks = function () {
            var offset = this.bb.__offset(this.bb_pos, 20);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        ProjectData.prototype.numEffectFileList = function () {
            var offset = this.bb.__offset(this.bb_pos, 22);
            return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
        };
        ProjectData.startProjectData = function (builder) {
            builder.startObject(10);
        };
        ProjectData.addDataId = function (builder, dataId) {
            builder.addFieldInt32(0, dataId, 0);
        };
        ProjectData.addVersion = function (builder, version) {
            builder.addFieldInt32(1, version, 0);
        };
        ProjectData.addFlags = function (builder, flags) {
            builder.addFieldInt32(2, flags, 0);
        };
        ProjectData.addImageBaseDir = function (builder, imageBaseDirOffset) {
            builder.addFieldOffset(3, imageBaseDirOffset, 0);
        };
        ProjectData.addCells = function (builder, cellsOffset) {
            builder.addFieldOffset(4, cellsOffset, 0);
        };
        ProjectData.createCellsVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        ProjectData.startCellsVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        ProjectData.addAnimePacks = function (builder, animePacksOffset) {
            builder.addFieldOffset(5, animePacksOffset, 0);
        };
        ProjectData.createAnimePacksVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        ProjectData.startAnimePacksVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        ProjectData.addEffectFileList = function (builder, effectFileListOffset) {
            builder.addFieldOffset(6, effectFileListOffset, 0);
        };
        ProjectData.createEffectFileListVector = function (builder, data) {
            builder.startVector(4, data.length, 4);
            for (var i = data.length - 1; i >= 0; i--) {
                builder.addOffset(data[i]);
            }
            return builder.endVector();
        };
        ProjectData.startEffectFileListVector = function (builder, numElems) {
            builder.startVector(4, numElems, 4);
        };
        ProjectData.addNumCells = function (builder, numCells) {
            builder.addFieldInt16(7, numCells, 0);
        };
        ProjectData.addNumAnimePacks = function (builder, numAnimePacks) {
            builder.addFieldInt16(8, numAnimePacks, 0);
        };
        ProjectData.addNumEffectFileList = function (builder, numEffectFileList) {
            builder.addFieldInt16(9, numEffectFileList, 0);
        };
        ProjectData.endProjectData = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        ProjectData.finishProjectDataBuffer = function (builder, offset) {
            builder.finish(offset, 'SSFB');
        };
        ProjectData.finishSizePrefixedProjectDataBuffer = function (builder, offset) {
            builder.finish(offset, 'SSFB', true);
        };
        ProjectData.createProjectData = function (builder, dataId, version, flags, imageBaseDirOffset, cellsOffset, animePacksOffset, effectFileListOffset, numCells, numAnimePacks, numEffectFileList) {
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
        };
        return ProjectData;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataInteger = /** @class */ (function () {
        function userDataInteger() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataInteger.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataInteger.prototype.integer = function () {
            return this.bb.readInt32(this.bb_pos);
        };
        userDataInteger.sizeOf = function () {
            return 4;
        };
        userDataInteger.createuserDataInteger = function (builder, integer) {
            builder.prep(4, 4);
            builder.writeInt32(integer);
            return builder.offset();
        };
        return userDataInteger;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataPoint = /** @class */ (function () {
        function userDataPoint() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataPoint.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataPoint.prototype.x = function () {
            return this.bb.readInt32(this.bb_pos);
        };
        userDataPoint.prototype.y = function () {
            return this.bb.readInt32(this.bb_pos + 4);
        };
        userDataPoint.sizeOf = function () {
            return 8;
        };
        userDataPoint.createuserDataPoint = function (builder, x, y) {
            builder.prep(4, 8);
            builder.writeInt32(y);
            builder.writeInt32(x);
            return builder.offset();
        };
        return userDataPoint;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataRect = /** @class */ (function () {
        function userDataRect() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataRect.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataRect.prototype.x = function () {
            return this.bb.readInt32(this.bb_pos);
        };
        userDataRect.prototype.y = function () {
            return this.bb.readInt32(this.bb_pos + 4);
        };
        userDataRect.prototype.w = function () {
            return this.bb.readInt32(this.bb_pos + 8);
        };
        userDataRect.prototype.h = function () {
            return this.bb.readInt32(this.bb_pos + 12);
        };
        userDataRect.sizeOf = function () {
            return 16;
        };
        userDataRect.createuserDataRect = function (builder, x, y, w, h) {
            builder.prep(4, 16);
            builder.writeInt32(h);
            builder.writeInt32(w);
            builder.writeInt32(y);
            builder.writeInt32(x);
            return builder.offset();
        };
        return userDataRect;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataString = /** @class */ (function () {
        function userDataString() {
            this.bb = null;
            this.bb_pos = 0;
        }
        userDataString.prototype.__init = function (i, bb) {
            this.bb_pos = i;
            this.bb = bb;
            return this;
        };
        userDataString.getRootAsuserDataString = function (bb, obj) {
            return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataString.getSizePrefixedRootAsuserDataString = function (bb, obj) {
            bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
            return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
        };
        userDataString.prototype.length = function () {
            var offset = this.bb.__offset(this.bb_pos, 4);
            return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
        };
        userDataString.prototype.data = function (optionalEncoding) {
            var offset = this.bb.__offset(this.bb_pos, 6);
            return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
        };
        userDataString.startuserDataString = function (builder) {
            builder.startObject(2);
        };
        userDataString.addLength = function (builder, length) {
            builder.addFieldInt32(0, length, 0);
        };
        userDataString.addData = function (builder, dataOffset) {
            builder.addFieldOffset(1, dataOffset, 0);
        };
        userDataString.enduserDataString = function (builder) {
            var offset = builder.endObject();
            return offset;
        };
        userDataString.createuserDataString = function (builder, length, dataOffset) {
            userDataString.startuserDataString(builder);
            userDataString.addLength(builder, length);
            userDataString.addData(builder, dataOffset);
            return userDataString.enduserDataString(builder);
        };
        return userDataString;
    }());

    // automatically generated by the FlatBuffers compiler, do not modify
    var userDataValue;
    (function (userDataValue) {
        userDataValue[userDataValue["NONE"] = 0] = "NONE";
        userDataValue[userDataValue["userDataInteger"] = 1] = "userDataInteger";
        userDataValue[userDataValue["userDataRect"] = 2] = "userDataRect";
        userDataValue[userDataValue["userDataPoint"] = 3] = "userDataPoint";
        userDataValue[userDataValue["userDataString"] = 4] = "userDataString";
    })(userDataValue || (userDataValue = {}));

    // automatically generated by the FlatBuffers compiler, do not modify
    var VERTEX_FLAG;
    (function (VERTEX_FLAG) {
        VERTEX_FLAG[VERTEX_FLAG["LT"] = 1] = "LT";
        VERTEX_FLAG[VERTEX_FLAG["RT"] = 2] = "RT";
        VERTEX_FLAG[VERTEX_FLAG["LB"] = 4] = "LB";
        VERTEX_FLAG[VERTEX_FLAG["RB"] = 8] = "RB";
        VERTEX_FLAG[VERTEX_FLAG["ONE"] = 16] = "ONE";
    })(VERTEX_FLAG || (VERTEX_FLAG = {}));

    var SS6Project = /** @class */ (function () {
        function SS6Project(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            if (typeof arg1 === 'string') { // get ssfb data via http protocol
                var ssfbPath = arg1;
                var onComplete = arg2;
                var timeout = (arg3 !== undefined) ? arg3 : 0;
                var retry = (arg4 !== undefined) ? arg4 : 0;
                var onError = (arg5 !== undefined) ? arg5 : null;
                var onTimeout = (arg6 !== undefined) ? arg6 : null;
                var onRetry = (arg7 !== undefined) ? arg7 : null;
                // ssfb path
                this.ssfbPath = ssfbPath;
                var index = ssfbPath.lastIndexOf('/');
                this.rootPath = ssfbPath.substring(0, index) + '/';
                this.status = 'not ready'; // status
                this.onComplete = onComplete;
                this.onError = onError;
                this.onTimeout = onTimeout;
                this.onRetry = onRetry;
                this.LoadFlatBuffersProject(ssfbPath, timeout, retry);
            }
            else if (typeof arg1 === 'object' && arg1.constructor === Uint8Array) { // get ssfb data from argument
                var ssfbByte = arg1;
                var imageBinaryMap = arg2;
                this.onComplete = (arg3 !== undefined) ? arg3 : null;
                this.load(ssfbByte, imageBinaryMap);
            }
        }
        /**
         * Load json and parse (then, load textures)
         * @param {string} ssfbPath - FlatBuffers file path
         * @param timeout
         * @param retry
         */
        SS6Project.prototype.LoadFlatBuffersProject = function (ssfbPath, timeout, retry) {
            if (timeout === void 0) { timeout = 0; }
            if (retry === void 0) { retry = 0; }
            var self = this;
            var httpObj = new XMLHttpRequest();
            var method = 'GET';
            httpObj.open(method, ssfbPath, true);
            httpObj.responseType = 'arraybuffer';
            httpObj.timeout = timeout;
            httpObj.onload = function () {
                if (!(httpObj.status >= 200 && httpObj.status < 400)) {
                    if (self.onError !== null) {
                        self.onError(ssfbPath, timeout, retry, httpObj);
                    }
                    return;
                }
                var arrayBuffer = this.response;
                var bytes = new Uint8Array(arrayBuffer);
                var buf = new ByteBuffer(bytes);
                self.fbObj = ProjectData.getRootAsProjectData(buf);
                self.LoadCellResources();
            };
            httpObj.ontimeout = function () {
                if (retry > 0) {
                    if (self.onRetry !== null) {
                        self.onRetry(ssfbPath, timeout, retry - 1, httpObj);
                    }
                    self.LoadFlatBuffersProject(ssfbPath, timeout, retry - 1);
                }
                else {
                    if (self.onTimeout !== null) {
                        self.onTimeout(ssfbPath, timeout, retry, httpObj);
                    }
                }
            };
            httpObj.onerror = function () {
                if (self.onError !== null) {
                    self.onError(ssfbPath, timeout, retry, httpObj);
                }
            };
            httpObj.send(null);
        };
        /**
         * Load textures
         */
        SS6Project.prototype.LoadCellResources = function () {
            var self = this;
            // Load textures for all cell at once.
            var loader = new PIXI__namespace.Loader();
            var ids = [];
            var _loop_1 = function (i) {
                if (!ids.some(function (id) {
                    return (id === self.fbObj.cells(i).cellMap().index());
                })) {
                    ids.push(self.fbObj.cells(i).cellMap().index());
                    loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this_1.fbObj.cells(i).cellMap().imagePath());
                }
            };
            var this_1 = this;
            for (var i = 0; i < self.fbObj.cellsLength(); i++) {
                _loop_1(i);
            }
            loader.load(function (loader, resources) {
                // SS6Project is ready.
                self.resources = resources;
                self.status = 'ready';
                if (self.onComplete !== null) {
                    self.onComplete();
                }
            });
        };
        SS6Project.prototype.load = function (bytes, imageBinaryMap) {
            var buffer = new ByteBuffer(bytes);
            this.fbObj = ProjectData.getRootAsProjectData(buffer);
            var loader = new PIXI__namespace.Loader();
            for (var imageName in imageBinaryMap) {
                var binary = imageBinaryMap[imageName];
                // const base64 = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, binary));
                var b = '';
                var len = binary.byteLength;
                for (var i = 0; i < len; i++) {
                    b += String.fromCharCode(binary[i]);
                }
                var base64 = 'data:image/png;base64,' + window.btoa(b);
                // const blob = new Blob(binary, "image/png");
                // const url = window.URL.createObjectURL(blob);
                loader.add(imageName, base64);
                // let texture = PIXI.Texture.fromBuffer(binary, 100, 100);
            }
            var self = this;
            loader.load(function (loader, resources) {
                // SS6Project is ready.
                self.resources = resources;
                self.status = 'ready';
                if (self.onComplete !== null) {
                    self.onComplete();
                }
            });
        };
        return SS6Project;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * インスタンス差し替え用のキーパラメーター
     */
    var SS6PlayerInstanceKeyParam = /** @class */ (function () {
        function SS6PlayerInstanceKeyParam() {
            this.refStartframe = 0;
            this.refEndframe = 0;
            this.refSpeed = 1.0;
            this.refloopNum = 0;
            this.infinity = false;
            this.reverse = false;
            this.pingpong = false;
            this.independent = false;
        }
        return SS6PlayerInstanceKeyParam;
    }());

    var SS6Player = /** @class */ (function (_super) {
        __extends(SS6Player, _super);
        /**
         * SS6Player (extends PIXI.Container)
         * @constructor
         * @param {SS6Project} ss6project - SS6Project that contains animations.
         * @param {string} animePackName - The name of animePack(SSAE).
         * @param {string} animeName - The name of animation.
         */
        function SS6Player(ss6project, animePackName, animeName) {
            if (animePackName === void 0) { animePackName = null; }
            if (animeName === void 0) { animeName = null; }
            var _this = _super.call(this) || this;
            _this.animation = [];
            _this.curAnimePackName = null;
            _this.curAnimeName = null;
            _this.curAnimation = null;
            _this.curAnimePackData = null;
            _this.parts = -1;
            _this.parentIndex = [];
            _this.prio2index = [];
            _this.userData = [];
            _this.frameDataCache = {};
            _this.currentCachedFrameNumber = -1;
            _this.liveFrame = [];
            _this.colorMatrixFilterCache = [];
            _this.defaultFrameMap = [];
            _this.parentAlpha = 1.0;
            //
            // cell再利用
            _this.prevCellID = []; // 各パーツ（レイヤー）で前回使用したセルID
            _this.prevMesh = [];
            // for change instance
            _this.substituteOverWrite = [];
            _this.substituteKeyParam = [];
            _this.alphaBlendType = [];
            _this._uint32 = new Uint32Array(1);
            _this._float32 = new Float32Array(_this._uint32.buffer);
            _this.defaultColorFilter = new PIXI__namespace.filters.ColorMatrixFilter();
            _this.ss6project = ss6project;
            _this.fbObj = _this.ss6project.fbObj;
            _this.resources = _this.ss6project.resources;
            _this.parentAlpha = 1.0;
            if (animePackName !== null && animeName !== null) {
                _this.Setup(animePackName, animeName);
            }
            // Ticker
            PIXI__namespace.Ticker.shared.add(_this.Update, _this);
            return _this;
        }
        Object.defineProperty(SS6Player.prototype, "startFrame", {
            get: function () {
                return this._startFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "endFrame", {
            get: function () {
                return this.curAnimation.endFrames();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "totalFrame", {
            get: function () {
                return this.curAnimation.totalFrames();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "fps", {
            get: function () {
                return this.curAnimation.fps();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "frameNo", {
            get: function () {
                return Math.floor(this._currentFrame);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "loop", {
            get: function () {
                return this._loops;
            },
            set: function (loop) {
                this._loops = loop;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "isPlaying", {
            get: function () {
                return this._isPlaying;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "isPausing", {
            get: function () {
                return this._isPausing;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "animePackName", {
            get: function () {
                return this.curAnimePackName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SS6Player.prototype, "animeName", {
            get: function () {
                return this.curAnimeName;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Setup
         * @param {string} animePackName - The name of animePack(SSAE).
         * @param {string} animeName - The name of animation.
         */
        SS6Player.prototype.Setup = function (animePackName, animeName) {
            this.clearCaches();
            var animePacksLength = this.fbObj.animePacksLength();
            for (var i = 0; i < animePacksLength; i++) {
                if (this.fbObj.animePacks(i).name() === animePackName) {
                    var j = void 0;
                    var animationsLength = this.fbObj.animePacks(i).animationsLength();
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
                    // default data map
                    var defaultDataLength = this.curAnimation.defaultDataLength();
                    for (var i_1 = 0; i_1 < defaultDataLength; i_1++) {
                        var curDefaultData = this.curAnimation.defaultData(i_1);
                        this.defaultFrameMap[curDefaultData.index()] = curDefaultData;
                    }
                    // parts
                    this.parts = i;
                    var partsLength = this.fbObj.animePacks(this.parts).partsLength();
                    this.parentIndex = new Array(partsLength);
                    // cell再利用
                    this.prevCellID = new Array(partsLength);
                    this.prevMesh = new Array(partsLength);
                    this.substituteOverWrite = new Array(partsLength);
                    this.substituteKeyParam = new Array(partsLength);
                    for (j = 0; j < partsLength; j++) {
                        var index = this.fbObj.animePacks(this.parts).parts(j).index();
                        this.parentIndex[index] = this.fbObj.animePacks(i).parts(j).parentIndex();
                        // cell再利用
                        this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
                        this.prevMesh[index] = null;
                        this.substituteOverWrite[index] = null;
                        this.substituteKeyParam[index] = null;
                    }
                }
            }
            // 各アニメーションステータスを初期化
            this.alphaBlendType = this.GetPartsBlendMode();
            this._isPlaying = false;
            this._isPausing = true;
            this._startFrame = this.curAnimation.startFrames();
            this._endFrame = this.curAnimation.endFrames();
            this._currentFrame = this.curAnimation.startFrames();
            this.nextFrameTime = 0;
            this._loops = -1;
            this.skipEnabled = true;
            this.updateInterval = 1000 / this.curAnimation.fps();
            this.playDirection = 1; // forward
            this.onUserDataCallback = null;
            this.playEndCallback = null;
            this.parentAlpha = 1.0;
        };
        SS6Player.prototype.clearCaches = function () {
            this.prio2index = [];
            this.userData = [];
            this.frameDataCache = [];
            this.currentCachedFrameNumber = -1;
            this.liveFrame = [];
            this.colorMatrixFilterCache = [];
            this.defaultFrameMap = [];
        };
        SS6Player.prototype.Update = function (delta) {
            this.UpdateInternal(delta);
        };
        /**
         * Update is called PIXI.ticker
         * @param {number} delta - expected 1
         */
        SS6Player.prototype.UpdateInternal = function (delta, rewindAfterReachingEndFrame) {
            if (rewindAfterReachingEndFrame === void 0) { rewindAfterReachingEndFrame = true; }
            var elapsedTime = PIXI__namespace.Ticker.shared.elapsedMS;
            var toNextFrame = this._isPlaying && !this._isPausing;
            if (toNextFrame && this.updateInterval !== 0) {
                this.nextFrameTime += elapsedTime; // もっとうまいやり方がありそうなんだけど…
                if (this.nextFrameTime >= this.updateInterval) {
                    var playEndFlag = false;
                    // 処理落ち対応
                    var step = this.nextFrameTime / this.updateInterval;
                    this.nextFrameTime -= this.updateInterval * step;
                    var s = (this.skipEnabled ? step * this.playDirection : this.playDirection);
                    var next = this._currentFrame + s;
                    var nextFrameNo = Math.floor(next);
                    var nextFrameDecimal = next - nextFrameNo;
                    var currentFrameNo = Math.floor(this._currentFrame);
                    if (this.playDirection >= 1) {
                        // speed +
                        for (var c = nextFrameNo - currentFrameNo; c; c--) {
                            var incFrameNo = currentFrameNo + 1;
                            if (incFrameNo > this._endFrame) {
                                if (this._loops === -1) {
                                    // infinite loop
                                    incFrameNo = this._startFrame;
                                }
                                else {
                                    this._loops--;
                                    playEndFlag = true;
                                    if (this._loops === 0) {
                                        this._isPlaying = false;
                                        // stop playing the animation
                                        incFrameNo = (rewindAfterReachingEndFrame) ? this._startFrame : this._endFrame;
                                        break;
                                    }
                                    else {
                                        // continue to play the animation
                                        incFrameNo = this._startFrame;
                                    }
                                }
                            }
                            currentFrameNo = incFrameNo;
                            // Check User Data
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
                        // speed -
                        for (var c = currentFrameNo - nextFrameNo; c; c--) {
                            var decFrameNo = currentFrameNo - 1;
                            if (decFrameNo < this._startFrame) {
                                if (this._loops === -1) {
                                    // infinite loop
                                    decFrameNo = this._endFrame;
                                }
                                else {
                                    this._loops--;
                                    playEndFlag = true;
                                    if (this._loops === 0) {
                                        this._isPlaying = false;
                                        decFrameNo = (rewindAfterReachingEndFrame) ? this._endFrame : this._startFrame;
                                        break;
                                    }
                                    else {
                                        decFrameNo = this._endFrame;
                                    }
                                }
                            }
                            currentFrameNo = decFrameNo;
                            // Check User Data
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
            }
            else {
                this.SetFrameAnimation(Math.floor(this._currentFrame));
            }
        };
        /**
         * アニメーションの速度を設定する (deprecated この関数は削除される可能性があります)
         * @param {number} fps - アニメーション速度(frame per sec.)
         * @param {boolean} _skipEnabled - 描画更新が間に合わないときにフレームをスキップするかどうか
         */
        SS6Player.prototype.SetAnimationFramerate = function (fps, _skipEnabled) {
            if (_skipEnabled === void 0) { _skipEnabled = true; }
            if (fps <= 0)
                return; // illegal
            this.updateInterval = 1000 / fps;
            this.skipEnabled = _skipEnabled;
        };
        /**
         * アニメーションの速度を設定する
         * @param {number} fpsRate - アニメーション速度(設定値に対する乗率)負数設定で逆再生
         * @param {boolean} _skipEnabled - 描画更新が間に合わないときにフレームをスキップするかどうか
         */
        SS6Player.prototype.SetAnimationSpeed = function (fpsRate, _skipEnabled) {
            if (_skipEnabled === void 0) { _skipEnabled = true; }
            if (fpsRate === 0)
                return; // illegal?
            this.playDirection = fpsRate > 0 ? 1 : -1;
            this.updateInterval = 1000 / (this.curAnimation.fps() * fpsRate * this.playDirection);
            this.skipEnabled = _skipEnabled;
        };
        /**
         * アニメーション再生設定
         * @param {number} _startframe - 開始フレーム番号（マイナス設定でデフォルト値を変更しない）
         * @param {number} _endframe - 終了フレーム番号（マイナス設定でデフォルト値を変更しない）
         * @param {number} _loops - ループ回数（ゼロもしくはマイナス設定で無限ループ）
         */
        SS6Player.prototype.SetAnimationSection = function (_startframe, _endframe, _loops) {
            if (_startframe === void 0) { _startframe = -1; }
            if (_endframe === void 0) { _endframe = -1; }
            if (_loops === void 0) { _loops = -1; }
            if (_startframe >= 0 && _startframe < this.curAnimation.totalFrames()) {
                this._startFrame = _startframe;
            }
            if (_endframe >= 0 && _endframe < this.curAnimation.totalFrames()) {
                this._endFrame = _endframe;
            }
            if (_loops > 0) {
                this._loops = _loops;
            }
            else {
                this._loops = -1;
            }
            // 再生方向にあわせて開始フレーム設定（順方向ならstartFrame,逆方法ならendFrame）
            this._currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
        };
        SS6Player.prototype.Play = function (frameNo) {
            this._isPlaying = true;
            this._isPausing = false;
            var currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
            if (frameNo && typeof frameNo === 'number') {
                currentFrame = frameNo;
            }
            this._currentFrame = currentFrame;
            this.resetLiveFrame();
            var currentFrameNo = Math.floor(this._currentFrame);
            this.SetFrameAnimation(currentFrameNo);
            if (this.HaveUserData(currentFrameNo)) {
                if (this.onUserDataCallback !== null) {
                    this.onUserDataCallback(this.GetUserData(currentFrameNo));
                }
            }
        };
        /**
         * アニメーション再生を一時停止する
         */
        SS6Player.prototype.Pause = function () {
            this._isPausing = true;
        };
        /**
         * アニメーション再生を再開する
         */
        SS6Player.prototype.Resume = function () {
            this._isPausing = false;
        };
        /**
         * アニメーションを停止する
         * @constructor
         */
        SS6Player.prototype.Stop = function () {
            this._isPlaying = false;
        };
        /**
         * アニメーション再生を位置（フレーム）を設定する
         */
        SS6Player.prototype.SetFrame = function (frame) {
            this._currentFrame = frame;
        };
        SS6Player.prototype.NextFrame = function () {
            var currentFrame = Math.floor(this._currentFrame);
            var endFrame = this.endFrame;
            if (currentFrame === endFrame) {
                return;
            }
            this.SetFrame(currentFrame + 1);
        };
        SS6Player.prototype.PrevFrame = function () {
            var currentFrame = Math.floor(this._currentFrame);
            if (currentFrame === 0) {
                return;
            }
            this.SetFrame(currentFrame - 1);
        };
        /**
         * アニメーションの透明度を設定する
         */
        SS6Player.prototype.SetAlpha = function (alpha) {
            this.parentAlpha = alpha;
        };
        /**
         * エラー処理
         * @param {any} _error - エラー
         */
        SS6Player.prototype.ThrowError = function (_error) {
        };
        /**
         * ユーザーデータコールバックの設定
         * @param fn
         * @constructor
         *
         * ユーザーデータのフォーマット
         * data = [[d0,d1,...,d10],[da0,da1,...,da10],...])
         * data.length : 当該フレームでユーザーデータの存在するパーツ（レイヤー）数
         * d0 : パーツ（レイヤー）番号
         * d1 : 有効データビット（&1:int, &2:rect(int*4), &4:pos(int*2), &8:string）
         * d2 : int(int)
         * d3 : rect0(int)
         * d4 : rect1(int)
         * d5 : rect2(int)
         * d6 : rect3(int)
         * d7 : pos0(int)
         * d8 : pos1(int)
         * d9 : string.length(int)
         * d10: string(string)
         *
         */
        SS6Player.prototype.SetUserDataCalback = function (fn) {
            this.onUserDataCallback = fn;
        };
        /**
         * 再生終了時に呼び出されるコールバックを設定します.
         * @param fn
         * @constructor
         *
         * ループ回数分再生した後に呼び出される点に注意してください。
         * 無限ループで再生している場合はコールバックが発生しません。
         *
         */
        SS6Player.prototype.SetPlayEndCallback = function (fn) {
            this.playEndCallback = fn;
        };
        /**
         * ユーザーデータの存在チェック
         * @param {number} frameNumber - フレーム番号
         * @return {boolean} - 存在するかどうか
         */
        SS6Player.prototype.HaveUserData = function (frameNumber) {
            if (this.userData[frameNumber] === -1) {
                // データはない
                return false;
            }
            if (this.userData[frameNumber]) {
                // キャッシュされたデータがある
                return true;
            }
            // ユーザーデータ検索する
            for (var k = 0; k < this.curAnimation.userDataLength(); k++) {
                // フレームデータがあるかを調べる
                if (frameNumber === this.curAnimation.userData(k).frameIndex()) {
                    // ついでにキャッシュしておく
                    this.userData[frameNumber] = this.curAnimation.userData(k);
                    return true;
                }
            }
            // データなしにしておく
            this.userData[frameNumber] = -1;
            return false;
        };
        /**
         * ユーザーデータの取得
         * @param {number} frameNumber - フレーム番号
         * @return {array} - ユーザーデータ
         */
        SS6Player.prototype.GetUserData = function (frameNumber) {
            // HaveUserDataでデータのキャッシュするので、ここで確認しておく
            if (this.HaveUserData(frameNumber) === false) {
                return;
            }
            var framedata = this.userData[frameNumber]; // キャッシュされたデータを確認する
            var layers = framedata.dataLength();
            var id = 0;
            var data = [];
            for (var i = 0; i < layers; i++) {
                var bit = framedata.data(i).flags();
                var partsID = framedata.data(i).arrayIndex();
                var d_int = null;
                var d_rect_x = null;
                var d_rect_y = null;
                var d_rect_w = null;
                var d_rect_h = null;
                var d_pos_x = null;
                var d_pos_y = null;
                var d_string_length = null;
                var d_string = null;
                if (bit & 1) {
                    // int
                    d_int = framedata.data(i).data(id, new userDataInteger()).integer();
                    id++;
                }
                if (bit & 2) {
                    // rect
                    d_rect_x = framedata.data(i).data(id, new userDataRect()).x();
                    d_rect_y = framedata.data(i).data(id, new userDataRect()).y();
                    d_rect_w = framedata.data(i).data(id, new userDataRect()).w();
                    d_rect_h = framedata.data(i).data(id, new userDataRect()).h();
                    id++;
                }
                if (bit & 4) {
                    // pos
                    d_pos_x = framedata.data(i).data(id, new userDataPoint()).x();
                    d_pos_y = framedata.data(i).data(id, new userDataPoint()).y();
                    id++;
                }
                if (bit & 8) {
                    // string
                    d_string_length = framedata.data(i).data(id, new userDataString()).length();
                    d_string = framedata.data(i).data(id, new userDataString()).data();
                    id++;
                }
                data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
            }
            return data;
        };
        /**
         * パーツの描画モードを取得する
         * @return {array} - 全パーツの描画モード
         */
        SS6Player.prototype.GetPartsBlendMode = function () {
            var l = this.fbObj.animePacks(this.parts).partsLength();
            var ret = [];
            var animePacks = this.fbObj.animePacks(this.parts);
            for (var i = 0; i < l; i++) {
                ret.push(animePacks.parts(i).alphaBlendType());
            }
            return ret;
        };
        /**
         * int型からfloat型に変換する
         * @return {floatView[0]} - float型に変換したデータ
         */
        SS6Player.prototype.I2F = function (i) {
            this._uint32[0] = i;
            return this._float32[0];
        };
        /**
         * １フレーム分のデータを取得する（未設定項目はデフォルト）
         * [注意]現verでは未対応項目があると正常動作しない可能性があります
         * @param {number} frameNumber - フレーム番号
         */
        SS6Player.prototype.GetFrameData = function (frameNumber) {
            if (this.currentCachedFrameNumber === frameNumber && this.frameDataCache) {
                return this.frameDataCache;
            }
            var layers = this.curAnimation.defaultDataLength();
            var frameData = new Array(layers);
            this.prio2index = new Array(layers);
            var curFrameData = this.curAnimation.frameData(frameNumber);
            for (var i = 0; i < layers; i++) {
                var curPartState = curFrameData.states(i);
                var index = curPartState.index();
                var f1 = curPartState.flag1();
                var f2 = curPartState.flag2();
                var blendType = -1;
                var fd = this.GetDefaultDataByIndex(index);
                // データにフラグを追加する
                fd.flag1 = f1;
                fd.flag2 = f2;
                var id = 0;
                if (f1 & PART_FLAG.INVISIBLE)
                    fd.f_hide = true;
                if (f1 & PART_FLAG.FLIP_H)
                    fd.f_flipH = true;
                if (f1 & PART_FLAG.FLIP_V)
                    fd.f_flipV = true;
                if (f1 & PART_FLAG.CELL_INDEX)
                    fd.cellIndex = curPartState.data(id++); // 8 Cell ID
                if (f1 & PART_FLAG.POSITION_X)
                    fd.positionX = this.I2F(curPartState.data(id++));
                if (f1 & PART_FLAG.POSITION_Y)
                    fd.positionY = this.I2F(curPartState.data(id++));
                if (f1 & PART_FLAG.POSITION_Z)
                    id++; // 64
                if (f1 & PART_FLAG.PIVOT_X)
                    fd.pivotX = this.I2F(curPartState.data(id++)); // 128 Pivot Offset X
                if (f1 & PART_FLAG.PIVOT_Y)
                    fd.pivotY = this.I2F(curPartState.data(id++)); // 256 Pivot Offset Y
                if (f1 & PART_FLAG.ROTATIONX)
                    id++; // 512
                if (f1 & PART_FLAG.ROTATIONY)
                    id++; // 1024
                if (f1 & PART_FLAG.ROTATIONZ)
                    fd.rotationZ = this.I2F(curPartState.data(id++)); // 2048
                if (f1 & PART_FLAG.SCALE_X)
                    fd.scaleX = this.I2F(curPartState.data(id++)); // 4096
                if (f1 & PART_FLAG.SCALE_Y)
                    fd.scaleY = this.I2F(curPartState.data(id++)); // 8192
                if (f1 & PART_FLAG.LOCALSCALE_X)
                    fd.localscaleX = this.I2F(curPartState.data(id++)); // 16384
                if (f1 & PART_FLAG.LOCALSCALE_Y)
                    fd.localscaleY = this.I2F(curPartState.data(id++)); // 32768
                if (f1 & PART_FLAG.OPACITY)
                    fd.opacity = curPartState.data(id++); // 65536
                if (f1 & PART_FLAG.LOCALOPACITY)
                    fd.localopacity = curPartState.data(id++); // 131072
                if (f1 & PART_FLAG.SIZE_X)
                    fd.size_X = this.I2F(curPartState.data(id++)); // 1048576 Size X [1]
                if (f1 & PART_FLAG.SIZE_Y)
                    fd.size_Y = this.I2F(curPartState.data(id++)); // 2097152 Size Y [1]
                if (f1 & PART_FLAG.U_MOVE)
                    fd.uv_move_X = this.I2F(curPartState.data(id++)); // 4194304 UV Move X
                if (f1 & PART_FLAG.V_MOVE)
                    fd.uv_move_Y = this.I2F(curPartState.data(id++)); // 8388608 UV Move Y
                if (f1 & PART_FLAG.UV_ROTATION)
                    fd.uv_rotation = this.I2F(curPartState.data(id++)); // 16777216 UV Rotation
                if (f1 & PART_FLAG.U_SCALE)
                    fd.uv_scale_X = this.I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
                if (f1 & PART_FLAG.V_SCALE)
                    fd.uv_scale_Y = this.I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
                if (f1 & PART_FLAG.BOUNDINGRADIUS)
                    id++; // 134217728 boundingRadius
                if (f1 & PART_FLAG.MASK)
                    fd.masklimen = curPartState.data(id++); // 268435456 masklimen
                if (f1 & PART_FLAG.PRIORITY)
                    fd.priority = curPartState.data(id++); // 536870912 priority
                //
                if (f1 & PART_FLAG.INSTANCE_KEYFRAME) {
                    // 1073741824 instance keyframe
                    fd.instanceValue_curKeyframe = curPartState.data(id++);
                    fd.instanceValue_startFrame = curPartState.data(id++);
                    fd.instanceValue_endFrame = curPartState.data(id++);
                    fd.instanceValue_loopNum = curPartState.data(id++);
                    fd.instanceValue_speed = this.I2F(curPartState.data(id++));
                    fd.instanceValue_loopflag = curPartState.data(id++);
                }
                if (f1 & PART_FLAG.EFFECT_KEYFRAME) {
                    // 2147483648 effect keyframe
                    fd.effectValue_curKeyframe = curPartState.data(id++);
                    fd.effectValue_startTime = curPartState.data(id++);
                    fd.effectValue_speed = this.I2F(curPartState.data(id++));
                    fd.effectValue_loopflag = curPartState.data(id++);
                }
                if (f1 & PART_FLAG.VERTEX_TRANSFORM) {
                    // 524288 verts [4]
                    // verts
                    fd.f_mesh = true;
                    var f = (fd.i_transformVerts = curPartState.data(id++));
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
                    // 262144 parts color [3]
                    var f = curPartState.data(id++);
                    blendType = f & 0xff;
                    // 小西 - パーツカラーが乗算合成ならフィルタを使わないように
                    fd.useColorMatrix = blendType !== 1;
                    // [replaced]//fd.useColorMatrix = true;
                    if (f & 0x1000) {
                        // one color
                        // 小西 - プロパティを一時退避
                        var rate = this.I2F(curPartState.data(id++));
                        var bf = curPartState.data(id++);
                        var bf2 = curPartState.data(id++);
                        var argb32 = (bf << 16) | bf2;
                        // 小西 - パーツカラーが乗算合成ならtintで処理
                        fd.partsColorARGB = argb32 >>> 0;
                        if (blendType === 1) {
                            fd.tint = argb32 & 0xffffff;
                        }
                        else {
                            // 小西 - パーツカラーが乗算合成じゃないならフィルタで処理
                            fd.colorMatrix = this.GetColorMatrixFilter(blendType, rate, argb32);
                        }
                    }
                    if (f & 0x0800) {
                        // LT color
                        id++;
                        id++;
                        id++;
                        fd.colorMatrix = this.defaultColorFilter; // TODO
                    }
                    if (f & 0x0400) {
                        // RT color
                        id++;
                        id++;
                        id++;
                        fd.colorMatrix = this.defaultColorFilter; // TODO
                    }
                    if (f & 0x0200) {
                        // LB color
                        id++;
                        id++;
                        id++;
                        fd.colorMatrix = this.defaultColorFilter; // TODO
                    }
                    if (f & 0x0100) {
                        // RB color
                        id++;
                        id++;
                        id++;
                        fd.colorMatrix = this.defaultColorFilter; // TODO
                    }
                }
                if (f2 & PART_FLAG2.MESHDATA) {
                    // mesh [1]
                    fd.meshIsBind = this.curAnimation.meshsDataUV(index).uv(0);
                    fd.meshNum = this.curAnimation.meshsDataUV(index).uv(1);
                    var mp = new Float32Array(fd.meshNum * 3);
                    for (var idx = 0; idx < fd.meshNum; idx++) {
                        var mx = this.I2F(curPartState.data(id++));
                        var my = this.I2F(curPartState.data(id++));
                        var mz = this.I2F(curPartState.data(id++));
                        mp[idx * 3 + 0] = mx;
                        mp[idx * 3 + 1] = my;
                        mp[idx * 3 + 2] = mz;
                    }
                    fd.meshDataPoint = mp;
                }
                frameData[index] = fd;
                this.prio2index[i] = index;
                // NULLパーツにダミーのセルIDを設定する
                if (this.fbObj.animePacks(this.parts).parts(index).type() === 0) {
                    frameData[index].cellIndex = -2;
                }
            }
            this.frameDataCache = frameData;
            this.currentCachedFrameNumber = frameNumber;
            return frameData;
        };
        /**
         * パーツカラーのブレンド用カラーマトリクス
         * @param {number} blendType - ブレンド方法（0:mix, 1:multiply, 2:add, 3:sub)
         * @param {number} rate - ミックス時の混色レート
         * @param {number} argb32 - パーツカラー（単色）
         * @return {PIXI.filters.ColorMatrixFilter} - カラーマトリクス
         */
        SS6Player.prototype.GetColorMatrixFilter = function (blendType, rate, argb32) {
            var key = blendType.toString() + '_' + rate.toString() + '_' + argb32.toString();
            if (this.colorMatrixFilterCache[key])
                return this.colorMatrixFilterCache[key];
            var colorMatrix = new PIXI__namespace.filters.ColorMatrixFilter();
            var ca = ((argb32 & 0xff000000) >>> 24) / 255;
            var cr = ((argb32 & 0x00ff0000) >>> 16) / 255;
            var cg = ((argb32 & 0x0000ff00) >>> 8) / 255;
            var cb = (argb32 & 0x000000ff) / 255;
            // Mix
            if (blendType === 0) {
                var rate_i = 1 - rate;
                colorMatrix.matrix = [
                    rate_i, 0, 0, 0, cr * rate,
                    0, rate_i, 0, 0, cg * rate,
                    0, 0, rate_i, 0, cb * rate,
                    0, 0, 0, 1, 0
                ];
            }
            else if (blendType === 1) {
                // Multiply
                colorMatrix.matrix = [
                    cr, 0, 0, 0, 0,
                    0, cg, 0, 0, 0,
                    0, 0, cb, 0, 0,
                    0, 0, 0, ca, 0
                ];
            }
            else if (blendType === 2) {
                // Add
                colorMatrix.matrix = [
                    1, 0, 0, 0, cr,
                    0, 1, 0, 0, cg,
                    0, 0, 1, 0, cb,
                    0, 0, 0, ca, 0
                ];
            }
            else if (blendType === 3) {
                // Sub
                colorMatrix.matrix = [
                    1, 0, 0, 0, -cr,
                    0, 1, 0, 0, -cg,
                    0, 0, 1, 0, -cb,
                    0, 0, 0, ca, 0
                ];
            }
            this.colorMatrixFilterCache[key] = colorMatrix;
            return colorMatrix;
        };
        /**
         * デフォルトデータを取得する
         * @param {number} id - パーツ（レイヤー）ID
         * @return {array} - データ
         */
        SS6Player.prototype.GetDefaultDataByIndex = function (id) {
            var curDefaultData = this.defaultFrameMap[id];
            var data = {
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
                // Add visiblity
                f_hide: false,
                // Add flip
                f_flipH: false,
                f_flipV: false,
                // Add mesh
                f_mesh: false,
                // Add vert data
                i_transformVerts: 0,
                u00: 0,
                v00: 0,
                u01: 0,
                v01: 0,
                u10: 0,
                v10: 0,
                u11: 0,
                v11: 0,
                //
                useColorMatrix: false,
                colorMatrix: null,
                //
                meshIsBind: 0,
                meshNum: 0,
                meshDataPoint: 0,
                //
                flag1: 0,
                flag2: 0,
                partsColorARGB: 0
            };
            return data;
        };
        /**
         * １フレーム分のアニメーション描画
         * @param {number} frameNumber - フレーム番号
         * @param {number} ds - delta step
         */
        SS6Player.prototype.SetFrameAnimation = function (frameNumber, ds) {
            if (ds === void 0) { ds = 0.0; }
            var fd = this.GetFrameData(frameNumber);
            this.removeChildren();
            // 優先度順パーツ単位ループ
            var l = fd.length;
            for (var ii = 0; ii < l; ii = (ii + 1) | 0) {
                // 優先度に変換
                var i = this.prio2index[ii];
                var data = fd[i];
                var cellID = data.cellIndex;
                // cell再利用
                var mesh = this.prevMesh[i];
                var part = this.fbObj.animePacks(this.parts).parts(i);
                var partType = part.type();
                var overWrite = (this.substituteOverWrite[i] !== null) ? this.substituteOverWrite[i] : false;
                var overWritekeyParam = this.substituteKeyParam[i];
                // 処理分岐処理
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
                            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
                            mesh.name = part.name();
                        }
                        break;
                    case SsPartType.Mesh:
                        if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                            if (mesh != null)
                                mesh.destroy();
                            mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
                            mesh.name = part.name();
                        }
                        break;
                    case SsPartType.Nulltype:
                    case SsPartType.Joint:
                        if (this.prevCellID[i] !== cellID) {
                            if (mesh != null)
                                mesh.destroy();
                            mesh = new PIXI__namespace.Container();
                            mesh.name = part.name();
                        }
                        break;
                    default:
                        if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                            // 小西 - デストロイ処理
                            if (mesh != null)
                                mesh.destroy();
                            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
                            mesh.name = part.name();
                        }
                        break;
                }
                // 初期化が行われなかった場合(あるの？)
                if (mesh == null)
                    continue;
                this.prevCellID[i] = cellID;
                this.prevMesh[i] = mesh;
                // 描画関係処理
                switch (partType) {
                    case SsPartType.Instance: {
                        // インスタンスパーツのアップデート
                        var pos = new Float32Array(5);
                        pos[0] = 0; // pos x
                        pos[1] = 0; // pos x
                        pos[2] = 1; // scale x
                        pos[3] = 1; // scale x
                        pos[4] = 0; // rot
                        pos = this.TransformPositionLocal(pos, data.index, frameNumber);
                        var rot = (pos[4] * Math.PI) / 180;
                        mesh.rotation = rot;
                        mesh.position.set(pos[0], pos[1]);
                        mesh.scale.set(pos[2], pos[3]);
                        var opacity = data.opacity / 255.0; // fdには継承後の不透明度が反映されているのでそのまま使用する
                        if (data.localopacity < 255) {
                            // ローカル不透明度が使われている場合は255以下の値になるので、255以下の場合にローカル不透明度で上書き
                            opacity = data.localopacity / 255.0;
                        }
                        mesh.SetAlpha(opacity * this.parentAlpha);
                        mesh.visible = !data.f_hide;
                        // 描画
                        var refKeyframe = data.instanceValue_curKeyframe;
                        var refStartframe = data.instanceValue_startFrame;
                        var refEndframe = data.instanceValue_endFrame;
                        var refSpeed = data.instanceValue_speed;
                        var refloopNum = data.instanceValue_loopNum;
                        var infinity = false;
                        var reverse = false;
                        var pingpong = false;
                        var independent = false;
                        var INSTANCE_LOOP_FLAG_INFINITY = 1;
                        var INSTANCE_LOOP_FLAG_REVERSE = 2;
                        var INSTANCE_LOOP_FLAG_PINGPONG = 4;
                        var INSTANCE_LOOP_FLAG_INDEPENDENT = 8;
                        var lflags = data.instanceValue_loopflag;
                        if (lflags & INSTANCE_LOOP_FLAG_INFINITY) {
                            // 無限ループ
                            infinity = true;
                        }
                        if (lflags & INSTANCE_LOOP_FLAG_REVERSE) {
                            // 逆再生
                            reverse = true;
                        }
                        if (lflags & INSTANCE_LOOP_FLAG_PINGPONG) {
                            // 往復
                            pingpong = true;
                        }
                        if (lflags & INSTANCE_LOOP_FLAG_INDEPENDENT) {
                            // 独立
                            independent = true;
                        }
                        // インスタンスパラメータを上書きする
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
                        // タイムライン上の時間 （絶対時間）
                        var time = frameNumber;
                        // 独立動作の場合
                        if (independent === true) {
                            this.liveFrame[ii] += ds;
                            time = Math.floor(this.liveFrame[ii]);
                        }
                        // このインスタンスが配置されたキーフレーム（絶対時間）
                        var selfTopKeyframe = refKeyframe;
                        var reftime = Math.floor((time - selfTopKeyframe) * refSpeed); // 開始から現在の経過時間
                        if (reftime < 0)
                            continue; // そもそも生存時間に存在していない
                        if (selfTopKeyframe > time)
                            continue;
                        var inst_scale = refEndframe - refStartframe + 1; // インスタンスの尺
                        // 尺が０もしくはマイナス（あり得ない
                        if (inst_scale <= 0)
                            continue;
                        var nowloop = Math.floor(reftime / inst_scale); // 現在までのループ数
                        var checkloopnum = refloopNum;
                        // pingpongの場合では２倍にする
                        if (pingpong)
                            checkloopnum = checkloopnum * 2;
                        // 無限ループで無い時にループ数をチェック
                        if (!infinity) {
                            // 無限フラグが有効な場合はチェックせず
                            if (nowloop >= checkloopnum) {
                                reftime = inst_scale - 1;
                                nowloop = checkloopnum - 1;
                            }
                        }
                        var temp_frame = Math.floor(reftime % inst_scale); // ループを加味しないインスタンスアニメ内のフレーム
                        // 参照位置を決める
                        // 現在の再生フレームの計算
                        var _time = 0;
                        if (pingpong && nowloop % 2 === 1) {
                            if (reverse) {
                                reverse = false; // 反転
                            }
                            else {
                                reverse = true; // 反転
                            }
                        }
                        if (this.playDirection <= -1) {
                            reverse = !reverse;
                        }
                        if (reverse) {
                            // リバースの時
                            _time = refEndframe - temp_frame;
                        }
                        else {
                            // 通常時
                            _time = temp_frame + refStartframe;
                        }
                        // インスタンスパラメータを設定
                        // インスタンス用SSPlayerに再生フレームを設定する
                        mesh.SetFrame(Math.floor(_time));
                        // mesh.Pause();
                        this.addChild(mesh);
                        break;
                    }
                    //  Instance以外の通常のMeshと空のContainerで処理分岐
                    case SsPartType.Normal:
                    case SsPartType.Mesh:
                    case SsPartType.Joint:
                    case SsPartType.Mask: {
                        var cell = this.fbObj.cells(cellID);
                        var verts = void 0;
                        if (partType === SsPartType.Mesh) {
                            // ボーンとのバインドの有無によって、TRSの継承行うかが決まる。
                            if (data.meshIsBind === 0) {
                                // バインドがない場合は親からのTRSを継承する
                                verts = this.TransformMeshVertsLocal(SS6Player.GetMeshVerts(cell, data), data.index, frameNumber);
                            }
                            else {
                                // バインドがある場合は変形後の結果が出力されているので、そのままの値を使用する
                                verts = SS6Player.GetMeshVerts(cell, data);
                            }
                        }
                        else {
                            verts = this.TransformVertsLocal(SS6Player.GetVerts(cell, data), data.index, frameNumber);
                        }
                        // 頂点変形、パーツカラーのアトリビュートがある場合のみ行うようにしたい
                        if (data.flag1 & PART_FLAG.VERTEX_TRANSFORM) {
                            // 524288 verts [4]	//
                            // 頂点変形の中心点を算出する
                            var vertexCoordinateLUx = verts[3 * 2 + 0];
                            var vertexCoordinateLUy = verts[3 * 2 + 1];
                            var vertexCoordinateLDx = verts[1 * 2 + 0];
                            var vertexCoordinateLDy = verts[1 * 2 + 1];
                            var vertexCoordinateRUx = verts[4 * 2 + 0];
                            var vertexCoordinateRUy = verts[4 * 2 + 1];
                            var vertexCoordinateRDx = verts[2 * 2 + 0];
                            var vertexCoordinateRDy = verts[2 * 2 + 1];
                            var CoordinateLURUx = (vertexCoordinateLUx + vertexCoordinateRUx) * 0.5;
                            var CoordinateLURUy = (vertexCoordinateLUy + vertexCoordinateRUy) * 0.5;
                            var CoordinateLULDx = (vertexCoordinateLUx + vertexCoordinateLDx) * 0.5;
                            var CoordinateLULDy = (vertexCoordinateLUy + vertexCoordinateLDy) * 0.5;
                            var CoordinateLDRDx = (vertexCoordinateLDx + vertexCoordinateRDx) * 0.5;
                            var CoordinateLDRDy = (vertexCoordinateLDy + vertexCoordinateRDy) * 0.5;
                            var CoordinateRURDx = (vertexCoordinateRUx + vertexCoordinateRDx) * 0.5;
                            var CoordinateRURDy = (vertexCoordinateRUy + vertexCoordinateRDy) * 0.5;
                            var vec2 = SS6Player.CoordinateGetDiagonalIntersection(verts[0], verts[1], CoordinateLURUx, CoordinateLURUy, CoordinateRURDx, CoordinateRURDy, CoordinateLULDx, CoordinateLULDy, CoordinateLDRDx, CoordinateLDRDy);
                            verts[0] = vec2[0];
                            verts[1] = vec2[1];
                        }
                        var px = verts[0];
                        var py = verts[1];
                        for (var j = 0; j < verts.length / 2; j++) {
                            verts[j * 2] -= px;
                            verts[j * 2 + 1] -= py;
                        }
                        mesh.vertices = verts;
                        if (data.flag1 & PART_FLAG.U_MOVE || data.flag1 & PART_FLAG.V_MOVE || data.flag1 & PART_FLAG.U_SCALE || data.flag1 & PART_FLAG.V_SCALE || data.flag1 & PART_FLAG.UV_ROTATION) {
                            // uv X/Y移動
                            var u1 = cell.u1() + data.uv_move_X;
                            var u2 = cell.u2() + data.uv_move_X;
                            var v1 = cell.v1() + data.uv_move_Y;
                            var v2 = cell.v2() + data.uv_move_Y;
                            // uv X/Yスケール
                            var cx = (u2 + u1) / 2;
                            var cy = (v2 + v1) / 2;
                            var uvw = ((u2 - u1) / 2) * data.uv_scale_X;
                            var uvh = ((v2 - v1) / 2) * data.uv_scale_Y;
                            // UV回転
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
                                var rot = (data.uv_rotation * Math.PI) / 180;
                                for (var idx = 0; idx < 5; idx++) {
                                    var dx = mesh.uvs[idx * 2 + 0] - cx; // 中心からの距離(X)
                                    var dy = mesh.uvs[idx * 2 + 1] - cy; // 中心からの距離(Y)
                                    var cos = Math.cos(rot);
                                    var sin = Math.sin(rot);
                                    var tmpX = cos * dx - sin * dy; // 回転
                                    var tmpY = sin * dx + cos * dy;
                                    mesh.uvs[idx * 2 + 0] = cx + tmpX; // 元の座標にオフセットする
                                    mesh.uvs[idx * 2 + 1] = cy + tmpY;
                                }
                            }
                            mesh.dirty++; // 更新回数？をカウントアップすると更新されるようになる
                        }
                        //
                        mesh.position.set(px, py);
                        //
                        // 小西: 256指定と1.0指定が混在していたので統一
                        var opacity = data.opacity / 255.0; // fdには継承後の不透明度が反映されているのでそのまま使用する
                        // 小西: 256指定と1.0指定が混在していたので統一
                        if (data.localopacity < 255) {
                            // ローカル不透明度が使われている場合は255以下の値になるので、255以下の場合にローカル不透明度で上書き
                            opacity = data.localopacity / 255.0;
                        }
                        mesh.alpha = opacity * this.parentAlpha; // 255*255
                        mesh.visible = !data.f_hide;
                        // if (data.h_hide) console.log('hide ! ' + data.cellIndex);
                        //
                        if (data.useColorMatrix) {
                            mesh.filters = [data.colorMatrix];
                        }
                        // 小西 - tintデータがあれば適用
                        if (data.tint) {
                            mesh.tint = data.tint;
                            // パーツカラーのAを不透明度に乗算して処理する
                            var ca = ((data.partsColorARGB & 0xff000000) >>> 24) / 255;
                            mesh.alpha = mesh.alpha * ca;
                        }
                        if (data.tintRgb) {
                            mesh.tintRgb = data.tintRgb;
                        }
                        var blendMode = this.alphaBlendType[i];
                        if (blendMode === 0)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.NORMAL;
                        if (blendMode === 1) {
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.MULTIPLY; // not suported 不透明度が利いてしまう。
                            mesh.alpha = 1.0; // 不透明度を固定にする
                        }
                        if (blendMode === 2)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.ADD;
                        if (blendMode === 3)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.NORMAL; // WebGL does not suported "SUB"
                        if (blendMode === 4)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.MULTIPLY; // WebGL does not suported "alpha multiply"
                        if (blendMode === 5) {
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.SCREEN; // not suported 不透明度が利いてしまう。
                            mesh.alpha = 1.0; // 不透明度を固定にする
                        }
                        if (blendMode === 6)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.EXCLUSION; // WebGL does not suported "Exclusion"
                        if (blendMode === 7)
                            mesh.blendMode = PIXI__namespace.BLEND_MODES.NORMAL; // WebGL does not suported "reverse"
                        if (partType !== SsPartType.Mask)
                            this.addChild(mesh);
                        break;
                    }
                    case SsPartType.Nulltype: {
                        // NULLパーツのOpacity/Transform設定
                        var opacity = this.InheritOpacity(1.0, data.index, frameNumber);
                        mesh.alpha = (opacity * data.localopacity) / 255.0;
                        var verts = this.TransformVerts(SS6Player.GetDummyVerts(), data.index, frameNumber);
                        var px = verts[0];
                        var py = verts[1];
                        mesh.position.set(px, py);
                        var ax = Math.atan2(verts[5] - verts[3], verts[4] - verts[2]);
                        var ay = Math.atan2(verts[7] - verts[3], verts[6] - verts[2]);
                        mesh.rotation = ax;
                        mesh.skew.x = ay - ax - Math.PI / 2;
                        break;
                    }
                }
            }
        };
        /**
         *
         * 名前を指定してパーツの再生するインスタンスアニメを変更します。
         * 指定したパーツがインスタンスパーツでない場合、falseを返します.
         * インスタンスパーツ名はディフォルトでは「ssae名:モーション名」とつけられています。
         * 再生するアニメの名前は アニメパック名 と アニメ名 で指定してください。
         * 現在再生しているアニメを指定することは入れ子となり無限ループとなるためできません。
         *
         * 変更するアニメーションは同じ ssfb に含まれる必要があります。
         * インスタンスパーツが再生するアニメを変更します
         *
         * インスタンスキーは
         *
         * @param partName SS上のパーツ名
         * @param animePackName 参照するアニメパック名
         * @param animeName 参照するアニメ名
         * @param overWrite インスタンスキーの上書きフラグ
         * @param keyParam インスタンスキー
         *
         * @constructor
         */
        SS6Player.prototype.ChangeInstanceAnime = function (partName, animePackName, animeName, overWrite, keyParam) {
            if (keyParam === void 0) { keyParam = null; }
            var rc = false;
            if (this.curAnimePackName !== null && this.curAnimation !== null) {
                var packData = this.curAnimePackData;
                var partsLength = packData.partsLength();
                for (var index = 0; index < partsLength; index++) {
                    var partData = packData.parts(index);
                    if (partData.name() === partName) {
                        var mesh = this.prevMesh[index];
                        if (mesh === null || mesh instanceof SS6Player) {
                            mesh = this.MakeCellPlayer(animePackName + '/' + animeName);
                            mesh.name = partData.name();
                            this.prevMesh[index] = mesh;
                            this.substituteOverWrite[index] = overWrite;
                            if (keyParam === null) {
                                var defaultKeyParam = new SS6PlayerInstanceKeyParam();
                                defaultKeyParam.refStartframe = mesh.startFrame;
                                defaultKeyParam.refEndframe = mesh.endFrame;
                                this.substituteKeyParam[index] = defaultKeyParam;
                            }
                            else {
                                this.substituteKeyParam[index] = keyParam;
                            }
                            rc = true;
                            break;
                        }
                    }
                }
            }
            return rc;
        };
        /**
         * 親を遡って不透明度を継承する
         * @param {number} opacity - 透明度
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {number} - 透明度
         */
        SS6Player.prototype.InheritOpacity = function (opacity, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            opacity = data.opacity / 255.0;
            if (this.parentIndex[id] >= 0) {
                opacity = this.InheritOpacity(opacity, this.parentIndex[id], frameNumber);
            }
            return opacity;
        };
        /**
         * 親を遡って座標変換する（ローカルアトリビュート適用）
         * @param {array} verts - 頂点情報配列
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {array} - 変換された頂点座標配列
         */
        SS6Player.prototype.TransformVertsLocal = function (verts, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            var rz = (-data.rotationZ * Math.PI) / 180;
            var cos = Math.cos(rz);
            var sin = Math.sin(rz);
            for (var i = 0; i < verts.length / 2; i++) {
                var x = verts[i * 2]; // * (data.size_X | 1);
                var y = verts[i * 2 + 1]; // * (data.size_Y | 1);
                if (data.i_transformVerts & 1 && i === 1) {
                    x += data.u00;
                    y -= data.v00; // 上下修正
                }
                if (data.i_transformVerts & 2 && i === 2) {
                    x += data.u01;
                    y -= data.v01; // 上下修正
                }
                if (data.i_transformVerts & 4 && i === 3) {
                    x += data.u10;
                    y -= data.v10; // 上下修正
                }
                if (data.i_transformVerts & 8 && i === 4) {
                    x += data.u11;
                    y -= data.v11; // 上下修正
                }
                x *= data.scaleX * data.localscaleX;
                y *= data.scaleY * data.localscaleY;
                verts[i * 2] = cos * x - sin * y + data.positionX;
                verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
                //
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
        };
        /**
         * 親を遡って座標変換する（ローカルアトリビュート適用）
         * @param {array} verts - 頂点情報配列
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {array} - 変換された頂点座標配列
         */
        SS6Player.prototype.TransformMeshVertsLocal = function (verts, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            var rz = (-data.rotationZ * Math.PI) / 180;
            var cos = Math.cos(rz);
            var sin = Math.sin(rz);
            for (var i = 0; i < verts.length / 2; i++) {
                var x = verts[i * 2]; // * (data.size_X | 1);
                var y = verts[i * 2 + 1]; // * (data.size_Y | 1);
                x *= data.scaleX * data.localscaleX;
                y *= data.scaleY * data.localscaleY;
                verts[i * 2] = cos * x - sin * y + data.positionX;
                verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
            }
            if (this.parentIndex[id] >= 0) {
                verts = this.TransformVerts(verts, this.parentIndex[id], frameNumber);
            }
            return verts;
        };
        /**
         * 親を遡って座標変換する（ローカルアトリビュート適用）
         * @param {array} pos - 頂点情報配列
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {array} - 変換された頂点座標配列
         */
        SS6Player.prototype.TransformPositionLocal = function (pos, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            pos[4] += -data.rotationZ;
            var rz = (-data.rotationZ * Math.PI) / 180;
            var cos = Math.cos(rz);
            var sin = Math.sin(rz);
            var x = pos[0]; // * (data.size_X | 1);
            var y = pos[1]; // * (data.size_Y | 1);
            pos[2] *= data.scaleX * data.localscaleX;
            pos[3] *= data.scaleY * data.localscaleY;
            pos[0] = (cos * x - sin * y) + data.positionX;
            pos[1] = (sin * x + cos * y) - data.positionY;
            if (this.parentIndex[id] >= 0) {
                pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
            }
            return pos;
        };
        /**
         * 5頂点の中間点を求める
         * @param {number} cx - 元の中心点
         * @param {number} cy - 元の中心点
         * @param {number} LUx - 左上座標
         * @param {number} LUy - 左上座標
         * @param {number} RUx - 右上座標
         * @param {number} RUy - 右上座標
         * @param {number} LDx - 左下座標
         * @param {number} LDy - 左下座標
         * @param {number} RDx - 右下座標
         * @param {number} RDy - 右下座標
         * @return {array} vec2 - 4頂点から算出した中心点の座標
         */
        SS6Player.CoordinateGetDiagonalIntersection = function (cx, cy, LUx, LUy, RUx, RUy, LDx, LDy, RDx, RDy) {
            // 中間点を求める
            var vec2 = new Float32Array([cx, cy]);
            // <<< 係数を求める >>>
            var c1 = (LDy - RUy) * (LDx - LUx) - (LDx - RUx) * (LDy - LUy);
            var c2 = (RDx - LUx) * (LDy - LUy) - (RDy - LUy) * (LDx - LUx);
            var c3 = (RDx - LUx) * (LDy - RUy) - (RDy - LUy) * (LDx - RUx);
            if (c3 <= 0 && c3 >= 0)
                return vec2;
            var ca = c1 / c3;
            var cb = c2 / c3;
            // <<< 交差判定 >>>
            if (0.0 <= ca && 1.0 >= ca && (0.0 <= cb && 1.0 >= cb)) {
                // 交差している
                cx = LUx + ca * (RDx - LUx);
                cy = LUy + ca * (RDy - LUy);
            }
            vec2[0] = cx;
            vec2[1] = cy;
            return vec2;
        };
        /**
         * 親を遡って座標変換する
         * @param {array} verts - 頂点情報配列
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {array} - 変換された頂点座標配列
         */
        SS6Player.prototype.TransformVerts = function (verts, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            var rz = (-data.rotationZ * Math.PI) / 180;
            var cos = Math.cos(rz);
            var sin = Math.sin(rz);
            for (var i = 0; i < verts.length / 2; i++) {
                var x = verts[i * 2];
                var y = verts[i * 2 + 1];
                x *= data.scaleX;
                y *= data.scaleY;
                verts[i * 2] = cos * x - sin * y + data.positionX;
                verts[i * 2 + 1] = sin * x + cos * y - data.positionY;
                //
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
        };
        /**
         * 親を遡って座標変換する
         * @param {array} pos - 頂点情報配列
         * @param {number} id - パーツ（レイヤー）ID
         * @param {number} frameNumber - フレーム番号
         * @return {array} - 変換された頂点座標配列
         */
        SS6Player.prototype.TransformPosition = function (pos, id, frameNumber) {
            var data = this.GetFrameData(frameNumber)[id];
            pos[4] += -data.rotationZ;
            var rz = (-data.rotationZ * Math.PI) / 180;
            var cos = Math.cos(rz);
            var sin = Math.sin(rz);
            var x = pos[0];
            var y = pos[1];
            pos[2] *= data.scaleX;
            pos[3] *= data.scaleY;
            pos[0] = (cos * x - sin * y) + data.positionX;
            pos[1] = (sin * x + cos * y) - data.positionY;
            if (this.parentIndex[id] >= 0) {
                pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
            }
            return pos;
        };
        /**
         * 矩形セルをメッシュ（5verts4Tri）で作成
         * @param {number} id - セルID
         * @return {PIXI.SimpleMesh} - メッシュ
         */
        SS6Player.prototype.MakeCellMesh = function (id) {
            var cell = this.fbObj.cells(id);
            var u1 = cell.u1();
            var u2 = cell.u2();
            var v1 = cell.v1();
            var v2 = cell.v2();
            var w = cell.width() / 2;
            var h = cell.height() / 2;
            var verts = new Float32Array([0, 0, -w, -h, w, -h, -w, h, w, h]);
            var uvs = new Float32Array([(u1 + u2) / 2, (v1 + v2) / 2, u1, v1, u2, v1, u1, v2, u2, v2]);
            var indices = new Uint16Array([0, 1, 2, 0, 2, 4, 0, 4, 3, 0, 1, 3]); // ??? why ???
            var mesh = new PIXI__namespace.SimpleMesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices, PIXI__namespace.DRAW_MODES.TRIANGLES);
            return mesh;
        };
        /**
         * メッシュセルからメッシュを作成
         * @param {number} partID - パーツID
         * @param {number} cellID - セルID
         * @return {PIXI.SimpleMesh} - メッシュ
         */
        SS6Player.prototype.MakeMeshCellMesh = function (partID, cellID) {
            var meshsDataUV = this.curAnimation.meshsDataUV(partID);
            var uvLength = meshsDataUV.uvLength();
            if (uvLength > 0) {
                // 先頭の2データはヘッダになる
                var uvs = new Float32Array(uvLength - 2);
                var num = meshsDataUV.uv(1);
                for (var idx = 2; idx < uvLength; idx++) {
                    uvs[idx - 2] = meshsDataUV.uv(idx);
                }
                var meshsDataIndices = this.curAnimation.meshsDataIndices(partID);
                var indicesLength = meshsDataIndices.indicesLength();
                // 先頭の1データはヘッダになる
                var indices = new Uint16Array(indicesLength - 1);
                for (var idx = 1; idx < indicesLength; idx++) {
                    indices[idx - 1] = meshsDataIndices.indices(idx);
                }
                var verts = new Float32Array(num * 2); // Zは必要ない？
                var mesh = new PIXI__namespace.SimpleMesh(this.resources[this.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices, PIXI__namespace.DRAW_MODES.TRIANGLES);
                return mesh;
            }
            return null;
        };
        /**
         * セルをインスタンスで作成
         * @param {String} refname 参照アニメ名
         * @return {SS6Player} - インスタンス
         */
        SS6Player.prototype.MakeCellPlayer = function (refname) {
            var split = refname.split('/');
            var ssp = new SS6Player(this.ss6project);
            ssp.Setup(split[0], split[1]);
            ssp.Play();
            return ssp;
        };
        /**
         * 矩形セルメッシュの頂点情報のみ取得
         * @param {ssfblib.Cell} cell - セル
         * @param {array} data - アニメーションフレームデータ
         * @return {array} - 頂点情報配列
         */
        SS6Player.GetVerts = function (cell, data) {
            var w = data.size_X / 2;
            var h = data.size_Y / 2;
            var px = data.size_X * -(data.pivotX + cell.pivotX());
            var py = data.size_Y * (data.pivotY + cell.pivotY());
            var verts = new Float32Array([px, py, px - w, py - h, px + w, py - h, px - w, py + h, px + w, py + h]);
            return verts;
        };
        /**
         * 矩形セルメッシュの頂点情報のみ取得
         * @param {ssfblib.Cell} cell - セル
         * @param {array} data - アニメーションフレームデータ
         * @return {array} - 頂点情報配列
         */
        SS6Player.GetMeshVerts = function (cell, data) {
            // フレームデータからメッシュデータを取得しvertsを作成する
            var verts = new Float32Array(data.meshNum * 2);
            for (var idx = 0; idx < data.meshNum; idx++) {
                verts[idx * 2 + 0] = data.meshDataPoint[idx * 3 + 0];
                verts[idx * 2 + 1] = -data.meshDataPoint[idx * 3 + 1];
            }
            return verts;
        };
        SS6Player.GetDummyVerts = function () {
            var verts = new Float32Array([0, 0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
            return verts;
        };
        SS6Player.prototype.resetLiveFrame = function () {
            var layers = this.curAnimation.defaultDataLength();
            for (var i = 0; i < layers; i++) {
                this.liveFrame[i] = 0;
            }
        };
        return SS6Player;
    }(PIXI__namespace.Container));

    exports.SS6Player = SS6Player;
    exports.SS6PlayerInstanceKeyParam = SS6PlayerInstanceKeyParam;
    exports.SS6Project = SS6Project;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ss6player-pixi.umd.js.map
