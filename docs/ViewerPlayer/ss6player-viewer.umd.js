/**
 * -----------------------------------------------------------
 * SS6Player For Viewer v1.1.1
 *
 * Copyright(C) Web Technology Corp.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

var ss6PlayerViewer = (function (exports) {
    'use strict';

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

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics$1(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var ZOOM_ARRAY = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 300, 400, 800];
    /**
     *
     */
    var MainContainer = /** @class */ (function (_super) {
        __extends$1(MainContainer, _super);
        function MainContainer() {
            var _this = _super.call(this) || this;
            _this.rootLineGraphics = null;
            _this.gridGraphics = null;
            _this.defaultScaleRatio = null;
            _this.zoomPercent = null;
            _this.isDisplayGrid = false;
            var rootLineGraphics = new PIXI.Graphics();
            var gridGraphics = new PIXI.Graphics();
            // コンテナに追加する
            _this.addChild(rootLineGraphics);
            _this.addChild(gridGraphics);
            _this.rootLineGraphics = rootLineGraphics;
            _this.gridGraphics = gridGraphics;
            return _this;
        }
        MainContainer.prototype.setDefaultScaleRatio = function (defaultScaleRatio) {
            this.defaultScaleRatio = defaultScaleRatio;
        };
        MainContainer.prototype.setPosition = function (positionX, positionY) {
            this.position = new PIXI.Point(positionX, positionY);
        };
        MainContainer.prototype.movePosition = function (movementX, movementY) {
            var position = this.position;
            position.x += movementX;
            position.y += movementY;
            this.position = position;
        };
        MainContainer.prototype.zoom = function (zoomPercent) {
            var scaleRatio = this.defaultScaleRatio;
            if (zoomPercent !== 100) {
                scaleRatio = this.defaultScaleRatio * (zoomPercent * 0.01);
            }
            this.zoomPercent = zoomPercent;
            this.scale = new PIXI.Point(scaleRatio, scaleRatio);
        };
        MainContainer.prototype.zoomIn = function () {
            var zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
            var nextZoomArrayIndex = zoomArrayIndex + 1;
            if (nextZoomArrayIndex >= ZOOM_ARRAY.length) {
                // 拡大するズーム率が存在しない場合は処理しない
                return;
            }
            var nextZoomPercent = ZOOM_ARRAY[nextZoomArrayIndex];
            this.zoom(nextZoomPercent);
        };
        MainContainer.prototype.zoomOut = function () {
            var zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
            var prevZoomArrayIndex = zoomArrayIndex - 1;
            if (prevZoomArrayIndex < 0) {
                // 縮小するズーム率が存在しない場合は処理しない
                return;
            }
            var prevZoomPercent = ZOOM_ARRAY[prevZoomArrayIndex];
            this.zoom(prevZoomPercent);
        };
        MainContainer.prototype.switchGridDisplay = function () {
            // console.log('switchGridDisplay');
            var rootLineGraphics = this.rootLineGraphics;
            var gridGraphics = this.gridGraphics;
            if (rootLineGraphics == null || gridGraphics == null) {
                return;
            }
            rootLineGraphics.clear();
            gridGraphics.clear();
            this.isDisplayGrid = !this.isDisplayGrid;
            if (this.isDisplayGrid) {
                var min = -5000;
                var max = (min * -1) + 1;
                // 基準点の描画
                rootLineGraphics.lineStyle(1, 0x000000);
                rootLineGraphics.alpha = 0.3;
                rootLineGraphics.moveTo(min, 0).lineTo(max, 0);
                rootLineGraphics.moveTo(0, min).lineTo(0, max);
                // グリッドの描画
                gridGraphics.lineStyle(1, 0x000000);
                gridGraphics.alpha = 0.1;
                var gridSize = 100;
                for (var x = min; x < max; x += gridSize) {
                    gridGraphics.moveTo(x, min).lineTo(x, max);
                }
                for (var y = min; y < max; y += gridSize) {
                    gridGraphics.moveTo(min, -y).lineTo(max, -y);
                }
            }
        };
        return MainContainer;
    }(PIXI.Container));

    /**
     * -----------------------------------------------------------
     * SS6Player For pixi.js v1.5.0
     *
     * Copyright(C) Web Technology Corp.
     * https://www.webtech.co.jp/
     * -----------------------------------------------------------
     */

    /// @file
    /// @addtogroup flatbuffers_javascript_api
    /// @{
    /// @cond FLATBUFFERS_INTERNAL

    /**
     * @fileoverview
     *
     * Need to suppress 'global this' error so the Node.js export line doesn't cause
     * closure compile to error out.
     * @suppress {globalThis}
     */

    /**
     * @const
     * @namespace
     */
    var flatbuffers$1 = {};

    /**
     * @type {number}
     * @const
     */
    flatbuffers$1.SIZEOF_SHORT = 2;

    /**
     * @type {number}
     * @const
     */
    flatbuffers$1.SIZEOF_INT = 4;

    /**
     * @type {number}
     * @const
     */
    flatbuffers$1.FILE_IDENTIFIER_LENGTH = 4;

    /**
     * @type {number}
     * @const
     */
    flatbuffers$1.SIZE_PREFIX_LENGTH = 4;

    /**
     * @enum {number}
     */
    flatbuffers$1.Encoding = {
      UTF8_BYTES: 1,
      UTF16_STRING: 2
    };

    /**
     * @type {Int32Array}
     * @const
     */
    flatbuffers$1.int32 = new Int32Array(2);

    /**
     * @type {Float32Array}
     * @const
     */
    flatbuffers$1.float32 = new Float32Array(flatbuffers$1.int32.buffer);

    /**
     * @type {Float64Array}
     * @const
     */
    flatbuffers$1.float64 = new Float64Array(flatbuffers$1.int32.buffer);

    /**
     * @type {boolean}
     * @const
     */
    flatbuffers$1.isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @constructor
     * @param {number} low
     * @param {number} high
     */
    flatbuffers$1.Long = function(low, high) {
      /**
       * @type {number}
       * @const
       */
      this.low = low | 0;

      /**
       * @type {number}
       * @const
       */
      this.high = high | 0;
    };

    /**
     * @param {number} low
     * @param {number} high
     * @returns {!flatbuffers.Long}
     */
    flatbuffers$1.Long.create = function(low, high) {
      // Special-case zero to avoid GC overhead for default values
      return low == 0 && high == 0 ? flatbuffers$1.Long.ZERO : new flatbuffers$1.Long(low, high);
    };

    /**
     * @returns {number}
     */
    flatbuffers$1.Long.prototype.toFloat64 = function() {
      return (this.low >>> 0) + this.high * 0x100000000;
    };

    /**
     * @param {flatbuffers.Long} other
     * @returns {boolean}
     */
    flatbuffers$1.Long.prototype.equals = function(other) {
      return this.low == other.low && this.high == other.high;
    };

    /**
     * @type {!flatbuffers.Long}
     * @const
     */
    flatbuffers$1.Long.ZERO = new flatbuffers$1.Long(0, 0);

    /// @endcond
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * Create a FlatBufferBuilder.
     *
     * @constructor
     * @param {number=} opt_initial_size
     */
    flatbuffers$1.Builder = function(opt_initial_size) {
      if (!opt_initial_size) {
        var initial_size = 1024;
      } else {
        var initial_size = opt_initial_size;
      }

      /**
       * @type {flatbuffers.ByteBuffer}
       * @private
       */
      this.bb = flatbuffers$1.ByteBuffer.allocate(initial_size);

      /**
       * Remaining space in the ByteBuffer.
       *
       * @type {number}
       * @private
       */
      this.space = initial_size;

      /**
       * Minimum alignment encountered so far.
       *
       * @type {number}
       * @private
       */
      this.minalign = 1;

      /**
       * The vtable for the current table.
       *
       * @type {Array.<number>}
       * @private
       */
      this.vtable = null;

      /**
       * The amount of fields we're actually using.
       *
       * @type {number}
       * @private
       */
      this.vtable_in_use = 0;

      /**
       * Whether we are currently serializing a table.
       *
       * @type {boolean}
       * @private
       */
      this.isNested = false;

      /**
       * Starting offset of the current struct/table.
       *
       * @type {number}
       * @private
       */
      this.object_start = 0;

      /**
       * List of offsets of all vtables.
       *
       * @type {Array.<number>}
       * @private
       */
      this.vtables = [];

      /**
       * For the current vector being built.
       *
       * @type {number}
       * @private
       */
      this.vector_num_elems = 0;

      /**
       * False omits default values from the serialized data
       *
       * @type {boolean}
       * @private
       */
      this.force_defaults = false;
    };

    flatbuffers$1.Builder.prototype.clear = function() {
      this.bb.clear();
      this.space = this.bb.capacity();
      this.minalign = 1;
      this.vtable = null;
      this.vtable_in_use = 0;
      this.isNested = false;
      this.object_start = 0;
      this.vtables = [];
      this.vector_num_elems = 0;
      this.force_defaults = false;
    };

    /**
     * In order to save space, fields that are set to their default value
     * don't get serialized into the buffer. Forcing defaults provides a
     * way to manually disable this optimization.
     *
     * @param {boolean} forceDefaults true always serializes default values
     */
    flatbuffers$1.Builder.prototype.forceDefaults = function(forceDefaults) {
      this.force_defaults = forceDefaults;
    };

    /**
     * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
     * called finish(). The actual data starts at the ByteBuffer's current position,
     * not necessarily at 0.
     *
     * @returns {flatbuffers.ByteBuffer}
     */
    flatbuffers$1.Builder.prototype.dataBuffer = function() {
      return this.bb;
    };

    /**
     * Get the bytes representing the FlatBuffer. Only call this after you've
     * called finish().
     *
     * @returns {!Uint8Array}
     */
    flatbuffers$1.Builder.prototype.asUint8Array = function() {
      return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
    };

    /// @cond FLATBUFFERS_INTERNAL
    /**
     * Prepare to write an element of `size` after `additional_bytes` have been
     * written, e.g. if you write a string, you need to align such the int length
     * field is aligned to 4 bytes, and the string data follows it directly. If all
     * you need to do is alignment, `additional_bytes` will be 0.
     *
     * @param {number} size This is the of the new element to write
     * @param {number} additional_bytes The padding size
     */
    flatbuffers$1.Builder.prototype.prep = function(size, additional_bytes) {
      // Track the biggest thing we've ever aligned to.
      if (size > this.minalign) {
        this.minalign = size;
      }

      // Find the amount of alignment needed such that `size` is properly
      // aligned after `additional_bytes`
      var align_size = ((~(this.bb.capacity() - this.space + additional_bytes)) + 1) & (size - 1);

      // Reallocate the buffer if needed.
      while (this.space < align_size + size + additional_bytes) {
        var old_buf_size = this.bb.capacity();
        this.bb = flatbuffers$1.Builder.growByteBuffer(this.bb);
        this.space += this.bb.capacity() - old_buf_size;
      }

      this.pad(align_size);
    };

    /**
     * @param {number} byte_size
     */
    flatbuffers$1.Builder.prototype.pad = function(byte_size) {
      for (var i = 0; i < byte_size; i++) {
        this.bb.writeInt8(--this.space, 0);
      }
    };

    /**
     * @param {number} value
     */
    flatbuffers$1.Builder.prototype.writeInt8 = function(value) {
      this.bb.writeInt8(this.space -= 1, value);
    };

    /**
     * @param {number} value
     */
    flatbuffers$1.Builder.prototype.writeInt16 = function(value) {
      this.bb.writeInt16(this.space -= 2, value);
    };

    /**
     * @param {number} value
     */
    flatbuffers$1.Builder.prototype.writeInt32 = function(value) {
      this.bb.writeInt32(this.space -= 4, value);
    };

    /**
     * @param {flatbuffers.Long} value
     */
    flatbuffers$1.Builder.prototype.writeInt64 = function(value) {
      this.bb.writeInt64(this.space -= 8, value);
    };

    /**
     * @param {number} value
     */
    flatbuffers$1.Builder.prototype.writeFloat32 = function(value) {
      this.bb.writeFloat32(this.space -= 4, value);
    };

    /**
     * @param {number} value
     */
    flatbuffers$1.Builder.prototype.writeFloat64 = function(value) {
      this.bb.writeFloat64(this.space -= 8, value);
    };
    /// @endcond

    /**
     * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {number} value The `int8` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addInt8 = function(value) {
      this.prep(1, 0);
      this.writeInt8(value);
    };

    /**
     * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {number} value The `int16` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addInt16 = function(value) {
      this.prep(2, 0);
      this.writeInt16(value);
    };

    /**
     * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {number} value The `int32` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addInt32 = function(value) {
      this.prep(4, 0);
      this.writeInt32(value);
    };

    /**
     * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {flatbuffers.Long} value The `int64` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addInt64 = function(value) {
      this.prep(8, 0);
      this.writeInt64(value);
    };

    /**
     * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {number} value The `float32` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addFloat32 = function(value) {
      this.prep(4, 0);
      this.writeFloat32(value);
    };

    /**
     * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param {number} value The `float64` to add the the buffer.
     */
    flatbuffers$1.Builder.prototype.addFloat64 = function(value) {
      this.prep(8, 0);
      this.writeFloat64(value);
    };

    /// @cond FLATBUFFERS_INTERNAL
    /**
     * @param {number} voffset
     * @param {number} value
     * @param {number} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldInt8 = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addInt8(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {number} value
     * @param {number} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldInt16 = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addInt16(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {number} value
     * @param {number} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldInt32 = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addInt32(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {flatbuffers.Long} value
     * @param {flatbuffers.Long} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldInt64 = function(voffset, value, defaultValue) {
      if (this.force_defaults || !value.equals(defaultValue)) {
        this.addInt64(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {number} value
     * @param {number} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldFloat32 = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addFloat32(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {number} value
     * @param {number} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldFloat64 = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addFloat64(value);
        this.slot(voffset);
      }
    };

    /**
     * @param {number} voffset
     * @param {flatbuffers.Offset} value
     * @param {flatbuffers.Offset} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldOffset = function(voffset, value, defaultValue) {
      if (this.force_defaults || value != defaultValue) {
        this.addOffset(value);
        this.slot(voffset);
      }
    };

    /**
     * Structs are stored inline, so nothing additional is being added. `d` is always 0.
     *
     * @param {number} voffset
     * @param {flatbuffers.Offset} value
     * @param {flatbuffers.Offset} defaultValue
     */
    flatbuffers$1.Builder.prototype.addFieldStruct = function(voffset, value, defaultValue) {
      if (value != defaultValue) {
        this.nested(value);
        this.slot(voffset);
      }
    };

    /**
     * Structures are always stored inline, they need to be created right
     * where they're used.  You'll get this assertion failure if you
     * created it elsewhere.
     *
     * @param {flatbuffers.Offset} obj The offset of the created object
     */
    flatbuffers$1.Builder.prototype.nested = function(obj) {
      if (obj != this.offset()) {
        throw new Error('FlatBuffers: struct must be serialized inline.');
      }
    };

    /**
     * Should not be creating any other object, string or vector
     * while an object is being constructed
     */
    flatbuffers$1.Builder.prototype.notNested = function() {
      if (this.isNested) {
        throw new Error('FlatBuffers: object serialization must not be nested.');
      }
    };

    /**
     * Set the current vtable at `voffset` to the current location in the buffer.
     *
     * @param {number} voffset
     */
    flatbuffers$1.Builder.prototype.slot = function(voffset) {
      this.vtable[voffset] = this.offset();
    };

    /**
     * @returns {flatbuffers.Offset} Offset relative to the end of the buffer.
     */
    flatbuffers$1.Builder.prototype.offset = function() {
      return this.bb.capacity() - this.space;
    };

    /**
     * Doubles the size of the backing ByteBuffer and copies the old data towards
     * the end of the new buffer (since we build the buffer backwards).
     *
     * @param {flatbuffers.ByteBuffer} bb The current buffer with the existing data
     * @returns {!flatbuffers.ByteBuffer} A new byte buffer with the old data copied
     * to it. The data is located at the end of the buffer.
     *
     * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
     * it a uint8Array we need to suppress the type check:
     * @suppress {checkTypes}
     */
    flatbuffers$1.Builder.growByteBuffer = function(bb) {
      var old_buf_size = bb.capacity();

      // Ensure we don't grow beyond what fits in an int.
      if (old_buf_size & 0xC0000000) {
        throw new Error('FlatBuffers: cannot grow buffer beyond 2 gigabytes.');
      }

      var new_buf_size = old_buf_size << 1;
      var nbb = flatbuffers$1.ByteBuffer.allocate(new_buf_size);
      nbb.setPosition(new_buf_size - old_buf_size);
      nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
      return nbb;
    };
    /// @endcond

    /**
     * Adds on offset, relative to where it will be written.
     *
     * @param {flatbuffers.Offset} offset The offset to add.
     */
    flatbuffers$1.Builder.prototype.addOffset = function(offset) {
      this.prep(flatbuffers$1.SIZEOF_INT, 0); // Ensure alignment is already done.
      this.writeInt32(this.offset() - offset + flatbuffers$1.SIZEOF_INT);
    };

    /// @cond FLATBUFFERS_INTERNAL
    /**
     * Start encoding a new object in the buffer.  Users will not usually need to
     * call this directly. The FlatBuffers compiler will generate helper methods
     * that call this method internally.
     *
     * @param {number} numfields
     */
    flatbuffers$1.Builder.prototype.startObject = function(numfields) {
      this.notNested();
      if (this.vtable == null) {
        this.vtable = [];
      }
      this.vtable_in_use = numfields;
      for (var i = 0; i < numfields; i++) {
        this.vtable[i] = 0; // This will push additional elements as needed
      }
      this.isNested = true;
      this.object_start = this.offset();
    };

    /**
     * Finish off writing the object that is under construction.
     *
     * @returns {flatbuffers.Offset} The offset to the object inside `dataBuffer`
     */
    flatbuffers$1.Builder.prototype.endObject = function() {
      if (this.vtable == null || !this.isNested) {
        throw new Error('FlatBuffers: endObject called without startObject');
      }

      this.addInt32(0);
      var vtableloc = this.offset();

      // Trim trailing zeroes.
      var i = this.vtable_in_use - 1;
      for (; i >= 0 && this.vtable[i] == 0; i--) {}
      var trimmed_size = i + 1;

      // Write out the current vtable.
      for (; i >= 0; i--) {
        // Offset relative to the start of the table.
        this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
      }

      var standard_fields = 2; // The fields below:
      this.addInt16(vtableloc - this.object_start);
      var len = (trimmed_size + standard_fields) * flatbuffers$1.SIZEOF_SHORT;
      this.addInt16(len);

      // Search for an existing vtable that matches the current one.
      var existing_vtable = 0;
      var vt1 = this.space;
    outer_loop:
      for (i = 0; i < this.vtables.length; i++) {
        var vt2 = this.bb.capacity() - this.vtables[i];
        if (len == this.bb.readInt16(vt2)) {
          for (var j = flatbuffers$1.SIZEOF_SHORT; j < len; j += flatbuffers$1.SIZEOF_SHORT) {
            if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
              continue outer_loop;
            }
          }
          existing_vtable = this.vtables[i];
          break;
        }
      }

      if (existing_vtable) {
        // Found a match:
        // Remove the current vtable.
        this.space = this.bb.capacity() - vtableloc;

        // Point table to existing vtable.
        this.bb.writeInt32(this.space, existing_vtable - vtableloc);
      } else {
        // No match:
        // Add the location of the current vtable to the list of vtables.
        this.vtables.push(this.offset());

        // Point table to current vtable.
        this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
      }

      this.isNested = false;
      return vtableloc;
    };
    /// @endcond

    /**
     * Finalize a buffer, poiting to the given `root_table`.
     *
     * @param {flatbuffers.Offset} root_table
     * @param {string=} opt_file_identifier
     * @param {boolean=} opt_size_prefix
     */
    flatbuffers$1.Builder.prototype.finish = function(root_table, opt_file_identifier, opt_size_prefix) {
      var size_prefix = opt_size_prefix ? flatbuffers$1.SIZE_PREFIX_LENGTH : 0;
      if (opt_file_identifier) {
        var file_identifier = opt_file_identifier;
        this.prep(this.minalign, flatbuffers$1.SIZEOF_INT +
          flatbuffers$1.FILE_IDENTIFIER_LENGTH + size_prefix);
        if (file_identifier.length != flatbuffers$1.FILE_IDENTIFIER_LENGTH) {
          throw new Error('FlatBuffers: file identifier must be length ' +
            flatbuffers$1.FILE_IDENTIFIER_LENGTH);
        }
        for (var i = flatbuffers$1.FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
          this.writeInt8(file_identifier.charCodeAt(i));
        }
      }
      this.prep(this.minalign, flatbuffers$1.SIZEOF_INT + size_prefix);
      this.addOffset(root_table);
      if (size_prefix) {
        this.addInt32(this.bb.capacity() - this.space);
      }
      this.bb.setPosition(this.space);
    };

    /**
     * Finalize a size prefixed buffer, pointing to the given `root_table`.
     *
     * @param {flatbuffers.Offset} root_table
     * @param {string=} opt_file_identifier
     */
    flatbuffers$1.Builder.prototype.finishSizePrefixed = function (root_table, opt_file_identifier) {
      this.finish(root_table, opt_file_identifier, true);
    };

    /// @cond FLATBUFFERS_INTERNAL
    /**
     * This checks a required field has been set in a given table that has
     * just been constructed.
     *
     * @param {flatbuffers.Offset} table
     * @param {number} field
     */
    flatbuffers$1.Builder.prototype.requiredField = function(table, field) {
      var table_start = this.bb.capacity() - table;
      var vtable_start = table_start - this.bb.readInt32(table_start);
      var ok = this.bb.readInt16(vtable_start + field) != 0;

      // If this fails, the caller will show what field needs to be set.
      if (!ok) {
        throw new Error('FlatBuffers: field ' + field + ' must be set');
      }
    };

    /**
     * Start a new array/vector of objects.  Users usually will not call
     * this directly. The FlatBuffers compiler will create a start/end
     * method for vector types in generated code.
     *
     * @param {number} elem_size The size of each element in the array
     * @param {number} num_elems The number of elements in the array
     * @param {number} alignment The alignment of the array
     */
    flatbuffers$1.Builder.prototype.startVector = function(elem_size, num_elems, alignment) {
      this.notNested();
      this.vector_num_elems = num_elems;
      this.prep(flatbuffers$1.SIZEOF_INT, elem_size * num_elems);
      this.prep(alignment, elem_size * num_elems); // Just in case alignment > int.
    };

    /**
     * Finish off the creation of an array and all its elements. The array must be
     * created with `startVector`.
     *
     * @returns {flatbuffers.Offset} The offset at which the newly created array
     * starts.
     */
    flatbuffers$1.Builder.prototype.endVector = function() {
      this.writeInt32(this.vector_num_elems);
      return this.offset();
    };
    /// @endcond

    /**
     * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
     * instead of a string, it is assumed to contain valid UTF-8 encoded data.
     *
     * @param {string|Uint8Array} s The string to encode
     * @return {flatbuffers.Offset} The offset in the buffer where the encoded string starts
     */
    flatbuffers$1.Builder.prototype.createString = function(s) {
      if (s instanceof Uint8Array) {
        var utf8 = s;
      } else {
        var utf8 = [];
        var i = 0;

        while (i < s.length) {
          var codePoint;

          // Decode UTF-16
          var a = s.charCodeAt(i++);
          if (a < 0xD800 || a >= 0xDC00) {
            codePoint = a;
          } else {
            var b = s.charCodeAt(i++);
            codePoint = (a << 10) + b + (0x10000 - (0xD800 << 10) - 0xDC00);
          }

          // Encode UTF-8
          if (codePoint < 0x80) {
            utf8.push(codePoint);
          } else {
            if (codePoint < 0x800) {
              utf8.push(((codePoint >> 6) & 0x1F) | 0xC0);
            } else {
              if (codePoint < 0x10000) {
                utf8.push(((codePoint >> 12) & 0x0F) | 0xE0);
              } else {
                utf8.push(
                  ((codePoint >> 18) & 0x07) | 0xF0,
                  ((codePoint >> 12) & 0x3F) | 0x80);
              }
              utf8.push(((codePoint >> 6) & 0x3F) | 0x80);
            }
            utf8.push((codePoint & 0x3F) | 0x80);
          }
        }
      }

      this.addInt8(0);
      this.startVector(1, utf8.length, 1);
      this.bb.setPosition(this.space -= utf8.length);
      for (var i = 0, offset = this.space, bytes = this.bb.bytes(); i < utf8.length; i++) {
        bytes[offset++] = utf8[i];
      }
      return this.endVector();
    };

    /**
     * A helper function to avoid generated code depending on this file directly.
     *
     * @param {number} low
     * @param {number} high
     * @returns {!flatbuffers.Long}
     */
    flatbuffers$1.Builder.prototype.createLong = function(low, high) {
      return flatbuffers$1.Long.create(low, high);
    };
    ////////////////////////////////////////////////////////////////////////////////
    /// @cond FLATBUFFERS_INTERNAL
    /**
     * Create a new ByteBuffer with a given array of bytes (`Uint8Array`).
     *
     * @constructor
     * @param {Uint8Array} bytes
     */
    flatbuffers$1.ByteBuffer = function(bytes) {
      /**
       * @type {Uint8Array}
       * @private
       */
      this.bytes_ = bytes;

      /**
       * @type {number}
       * @private
       */
      this.position_ = 0;
    };

    /**
     * Create and allocate a new ByteBuffer with a given size.
     *
     * @param {number} byte_size
     * @returns {!flatbuffers.ByteBuffer}
     */
    flatbuffers$1.ByteBuffer.allocate = function(byte_size) {
      return new flatbuffers$1.ByteBuffer(new Uint8Array(byte_size));
    };

    flatbuffers$1.ByteBuffer.prototype.clear = function() {
      this.position_ = 0;
    };

    /**
     * Get the underlying `Uint8Array`.
     *
     * @returns {Uint8Array}
     */
    flatbuffers$1.ByteBuffer.prototype.bytes = function() {
      return this.bytes_;
    };

    /**
     * Get the buffer's position.
     *
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.position = function() {
      return this.position_;
    };

    /**
     * Set the buffer's position.
     *
     * @param {number} position
     */
    flatbuffers$1.ByteBuffer.prototype.setPosition = function(position) {
      this.position_ = position;
    };

    /**
     * Get the buffer's capacity.
     *
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.capacity = function() {
      return this.bytes_.length;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readInt8 = function(offset) {
      return this.readUint8(offset) << 24 >> 24;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readUint8 = function(offset) {
      return this.bytes_[offset];
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readInt16 = function(offset) {
      return this.readUint16(offset) << 16 >> 16;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readUint16 = function(offset) {
      return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readInt32 = function(offset) {
      return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readUint32 = function(offset) {
      return this.readInt32(offset) >>> 0;
    };

    /**
     * @param {number} offset
     * @returns {!flatbuffers.Long}
     */
    flatbuffers$1.ByteBuffer.prototype.readInt64 = function(offset) {
      return new flatbuffers$1.Long(this.readInt32(offset), this.readInt32(offset + 4));
    };

    /**
     * @param {number} offset
     * @returns {!flatbuffers.Long}
     */
    flatbuffers$1.ByteBuffer.prototype.readUint64 = function(offset) {
      return new flatbuffers$1.Long(this.readUint32(offset), this.readUint32(offset + 4));
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readFloat32 = function(offset) {
      flatbuffers$1.int32[0] = this.readInt32(offset);
      return flatbuffers$1.float32[0];
    };

    /**
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.readFloat64 = function(offset) {
      flatbuffers$1.int32[flatbuffers$1.isLittleEndian ? 0 : 1] = this.readInt32(offset);
      flatbuffers$1.int32[flatbuffers$1.isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
      return flatbuffers$1.float64[0];
    };

    /**
     * @param {number} offset
     * @param {number|boolean} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeInt8 = function(offset, value) {
      this.bytes_[offset] = /** @type {number} */(value);
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeUint8 = function(offset, value) {
      this.bytes_[offset] = value;
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeInt16 = function(offset, value) {
      this.bytes_[offset] = value;
      this.bytes_[offset + 1] = value >> 8;
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeUint16 = function(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeInt32 = function(offset, value) {
      this.bytes_[offset] = value;
      this.bytes_[offset + 1] = value >> 8;
      this.bytes_[offset + 2] = value >> 16;
      this.bytes_[offset + 3] = value >> 24;
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeUint32 = function(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
        this.bytes_[offset + 2] = value >> 16;
        this.bytes_[offset + 3] = value >> 24;
    };

    /**
     * @param {number} offset
     * @param {flatbuffers.Long} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeInt64 = function(offset, value) {
      this.writeInt32(offset, value.low);
      this.writeInt32(offset + 4, value.high);
    };

    /**
     * @param {number} offset
     * @param {flatbuffers.Long} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeUint64 = function(offset, value) {
        this.writeUint32(offset, value.low);
        this.writeUint32(offset + 4, value.high);
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeFloat32 = function(offset, value) {
      flatbuffers$1.float32[0] = value;
      this.writeInt32(offset, flatbuffers$1.int32[0]);
    };

    /**
     * @param {number} offset
     * @param {number} value
     */
    flatbuffers$1.ByteBuffer.prototype.writeFloat64 = function(offset, value) {
      flatbuffers$1.float64[0] = value;
      this.writeInt32(offset, flatbuffers$1.int32[flatbuffers$1.isLittleEndian ? 0 : 1]);
      this.writeInt32(offset + 4, flatbuffers$1.int32[flatbuffers$1.isLittleEndian ? 1 : 0]);
    };

    /**
     * Return the file identifier.   Behavior is undefined for FlatBuffers whose
     * schema does not include a file_identifier (likely points at padding or the
     * start of a the root vtable).
     * @returns {string}
     */
    flatbuffers$1.ByteBuffer.prototype.getBufferIdentifier = function() {
      if (this.bytes_.length < this.position_ + flatbuffers$1.SIZEOF_INT +
          flatbuffers$1.FILE_IDENTIFIER_LENGTH) {
        throw new Error(
            'FlatBuffers: ByteBuffer is too short to contain an identifier.');
      }
      var result = "";
      for (var i = 0; i < flatbuffers$1.FILE_IDENTIFIER_LENGTH; i++) {
        result += String.fromCharCode(
            this.readInt8(this.position_ + flatbuffers$1.SIZEOF_INT + i));
      }
      return result;
    };

    /**
     * Look up a field in the vtable, return an offset into the object, or 0 if the
     * field is not present.
     *
     * @param {number} bb_pos
     * @param {number} vtable_offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.__offset = function(bb_pos, vtable_offset) {
      var vtable = bb_pos - this.readInt32(bb_pos);
      return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
    };

    /**
     * Initialize any Table-derived type to point to the union at the given offset.
     *
     * @param {flatbuffers.Table} t
     * @param {number} offset
     * @returns {flatbuffers.Table}
     */
    flatbuffers$1.ByteBuffer.prototype.__union = function(t, offset) {
      t.bb_pos = offset + this.readInt32(offset);
      t.bb = this;
      return t;
    };

    /**
     * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
     * This allocates a new string and converts to wide chars upon each access.
     *
     * To avoid the conversion to UTF-16, pass flatbuffers.Encoding.UTF8_BYTES as
     * the "optionalEncoding" argument. This is useful for avoiding conversion to
     * and from UTF-16 when the data will just be packaged back up in another
     * FlatBuffer later on.
     *
     * @param {number} offset
     * @param {flatbuffers.Encoding=} opt_encoding Defaults to UTF16_STRING
     * @returns {string|!Uint8Array}
     */
    flatbuffers$1.ByteBuffer.prototype.__string = function(offset, opt_encoding) {
      offset += this.readInt32(offset);

      var length = this.readInt32(offset);
      var result = '';
      var i = 0;

      offset += flatbuffers$1.SIZEOF_INT;

      if (opt_encoding === flatbuffers$1.Encoding.UTF8_BYTES) {
        return this.bytes_.subarray(offset, offset + length);
      }

      while (i < length) {
        var codePoint;

        // Decode UTF-8
        var a = this.readUint8(offset + i++);
        if (a < 0xC0) {
          codePoint = a;
        } else {
          var b = this.readUint8(offset + i++);
          if (a < 0xE0) {
            codePoint =
              ((a & 0x1F) << 6) |
              (b & 0x3F);
          } else {
            var c = this.readUint8(offset + i++);
            if (a < 0xF0) {
              codePoint =
                ((a & 0x0F) << 12) |
                ((b & 0x3F) << 6) |
                (c & 0x3F);
            } else {
              var d = this.readUint8(offset + i++);
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
        } else {
          codePoint -= 0x10000;
          result += String.fromCharCode(
            (codePoint >> 10) + 0xD800,
            (codePoint & ((1 << 10) - 1)) + 0xDC00);
        }
      }

      return result;
    };

    /**
     * Retrieve the relative offset stored at "offset"
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.__indirect = function(offset) {
      return offset + this.readInt32(offset);
    };

    /**
     * Get the start of data of a vector whose offset is stored at "offset" in this object.
     *
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.__vector = function(offset) {
      return offset + this.readInt32(offset) + flatbuffers$1.SIZEOF_INT; // data starts after the length
    };

    /**
     * Get the length of a vector whose offset is stored at "offset" in this object.
     *
     * @param {number} offset
     * @returns {number}
     */
    flatbuffers$1.ByteBuffer.prototype.__vector_len = function(offset) {
      return this.readInt32(offset + this.readInt32(offset));
    };

    /**
     * @param {string} ident
     * @returns {boolean}
     */
    flatbuffers$1.ByteBuffer.prototype.__has_identifier = function(ident) {
      if (ident.length != flatbuffers$1.FILE_IDENTIFIER_LENGTH) {
        throw new Error('FlatBuffers: file identifier must be length ' +
                        flatbuffers$1.FILE_IDENTIFIER_LENGTH);
      }
      for (var i = 0; i < flatbuffers$1.FILE_IDENTIFIER_LENGTH; i++) {
        if (ident.charCodeAt(i) != this.readInt8(this.position_ + flatbuffers$1.SIZEOF_INT + i)) {
          return false;
        }
      }
      return true;
    };

    /**
     * A helper function to avoid generated code depending on this file directly.
     *
     * @param {number} low
     * @param {number} high
     * @returns {!flatbuffers.Long}
     */
    flatbuffers$1.ByteBuffer.prototype.createLong = function(low, high) {
      return flatbuffers$1.Long.create(low, high);
    };

    /// @endcond
    /// @}

    /**
     * -----------------------------------------------------------
     * ssfblib v1.0.1
     *
     * Copyright(C) Web Technology Corp.
     * https://www.webtech.co.jp/
     * -----------------------------------------------------------
     */

    // automatically generated by the FlatBuffers compiler, do not modify
    /**
     * @enum {number}
     */
    var ss;
    (function (ss) {
        (function (ssfb) {
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
            })(ssfb.SsPartType || (ssfb.SsPartType = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @enum {number}
     */
    (function (ss) {
        (function (ssfb) {
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
            })(ssfb.PART_FLAG || (ssfb.PART_FLAG = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @enum {number}
     */
    (function (ss) {
        (function (ssfb) {
            (function (PART_FLAG2) {
                PART_FLAG2[PART_FLAG2["MESHDATA"] = 1] = "MESHDATA";
            })(ssfb.PART_FLAG2 || (ssfb.PART_FLAG2 = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @enum {number}
     */
    (function (ss) {
        (function (ssfb) {
            (function (VERTEX_FLAG) {
                VERTEX_FLAG[VERTEX_FLAG["LT"] = 1] = "LT";
                VERTEX_FLAG[VERTEX_FLAG["RT"] = 2] = "RT";
                VERTEX_FLAG[VERTEX_FLAG["LB"] = 4] = "LB";
                VERTEX_FLAG[VERTEX_FLAG["RB"] = 8] = "RB";
                VERTEX_FLAG[VERTEX_FLAG["ONE"] = 16] = "ONE";
            })(ssfb.VERTEX_FLAG || (ssfb.VERTEX_FLAG = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @enum {number}
     */
    (function (ss) {
        (function (ssfb) {
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
            })(ssfb.EffectNodeBehavior || (ssfb.EffectNodeBehavior = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @enum {number}
     */
    (function (ss) {
        (function (ssfb) {
            (function (userDataValue) {
                userDataValue[userDataValue["NONE"] = 0] = "NONE";
                userDataValue[userDataValue["userDataInteger"] = 1] = "userDataInteger";
                userDataValue[userDataValue["userDataRect"] = 2] = "userDataRect";
                userDataValue[userDataValue["userDataPoint"] = 3] = "userDataPoint";
                userDataValue[userDataValue["userDataString"] = 4] = "userDataString";
            })(ssfb.userDataValue || (ssfb.userDataValue = {}));
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleInfiniteEmitEnabled = /** @class */ (function () {
                function EffectParticleInfiniteEmitEnabled() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleInfiniteEmitEnabled
                 */
                EffectParticleInfiniteEmitEnabled.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleInfiniteEmitEnabled.prototype.flag = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number flag
                 * @returns flatbuffers.Offset
                 */
                EffectParticleInfiniteEmitEnabled.createEffectParticleInfiniteEmitEnabled = function (builder, flag) {
                    builder.prep(4, 4);
                    builder.writeInt32(flag);
                    return builder.offset();
                };
                return EffectParticleInfiniteEmitEnabled;
            }());
            ssfb.EffectParticleInfiniteEmitEnabled = EffectParticleInfiniteEmitEnabled;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleTurnToDirectionEnabled = /** @class */ (function () {
                function EffectParticleTurnToDirectionEnabled() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleTurnToDirectionEnabled
                 */
                EffectParticleTurnToDirectionEnabled.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleTurnToDirectionEnabled.prototype.Rotation = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number Rotation
                 * @returns flatbuffers.Offset
                 */
                EffectParticleTurnToDirectionEnabled.createEffectParticleTurnToDirectionEnabled = function (builder, Rotation) {
                    builder.prep(4, 4);
                    builder.writeFloat32(Rotation);
                    return builder.offset();
                };
                return EffectParticleTurnToDirectionEnabled;
            }());
            ssfb.EffectParticleTurnToDirectionEnabled = EffectParticleTurnToDirectionEnabled;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticlePointGravity = /** @class */ (function () {
                function EffectParticlePointGravity() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticlePointGravity
                 */
                EffectParticlePointGravity.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticlePointGravity.prototype.PositionX = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticlePointGravity.prototype.PositionY = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticlePointGravity.prototype.Power = function () {
                    return this.bb.readFloat32(this.bb_pos + 8);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number Position_x
                 * @param number Position_y
                 * @param number Power
                 * @returns flatbuffers.Offset
                 */
                EffectParticlePointGravity.createEffectParticlePointGravity = function (builder, Position_x, Position_y, Power) {
                    builder.prep(4, 12);
                    builder.writeFloat32(Power);
                    builder.writeFloat32(Position_y);
                    builder.writeFloat32(Position_x);
                    return builder.offset();
                };
                return EffectParticlePointGravity;
            }());
            ssfb.EffectParticlePointGravity = EffectParticlePointGravity;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementTransSize = /** @class */ (function () {
                function EffectParticleElementTransSize() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementTransSize
                 */
                EffectParticleElementTransSize.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.SizeXMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.SizeXMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.SizeYMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.SizeYMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 12);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.ScaleFactorMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 16);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSize.prototype.ScaleFactorMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 20);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number SizeXMinValue
                 * @param number SizeXMaxValue
                 * @param number SizeYMinValue
                 * @param number SizeYMaxValue
                 * @param number ScaleFactorMinValue
                 * @param number ScaleFactorMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementTransSize.createEffectParticleElementTransSize = function (builder, SizeXMinValue, SizeXMaxValue, SizeYMinValue, SizeYMaxValue, ScaleFactorMinValue, ScaleFactorMaxValue) {
                    builder.prep(4, 24);
                    builder.writeFloat32(ScaleFactorMaxValue);
                    builder.writeFloat32(ScaleFactorMinValue);
                    builder.writeFloat32(SizeYMaxValue);
                    builder.writeFloat32(SizeYMinValue);
                    builder.writeFloat32(SizeXMaxValue);
                    builder.writeFloat32(SizeXMinValue);
                    return builder.offset();
                };
                return EffectParticleElementTransSize;
            }());
            ssfb.EffectParticleElementTransSize = EffectParticleElementTransSize;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementSize = /** @class */ (function () {
                function EffectParticleElementSize() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementSize
                 */
                EffectParticleElementSize.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.SizeXMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.SizeXMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.SizeYMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.SizeYMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 12);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.ScaleFactorMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 16);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementSize.prototype.ScaleFactorMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 20);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number SizeXMinValue
                 * @param number SizeXMaxValue
                 * @param number SizeYMinValue
                 * @param number SizeYMaxValue
                 * @param number ScaleFactorMinValue
                 * @param number ScaleFactorMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementSize.createEffectParticleElementSize = function (builder, SizeXMinValue, SizeXMaxValue, SizeYMinValue, SizeYMaxValue, ScaleFactorMinValue, ScaleFactorMaxValue) {
                    builder.prep(4, 24);
                    builder.writeFloat32(ScaleFactorMaxValue);
                    builder.writeFloat32(ScaleFactorMinValue);
                    builder.writeFloat32(SizeYMaxValue);
                    builder.writeFloat32(SizeYMinValue);
                    builder.writeFloat32(SizeXMaxValue);
                    builder.writeFloat32(SizeXMinValue);
                    return builder.offset();
                };
                return EffectParticleElementSize;
            }());
            ssfb.EffectParticleElementSize = EffectParticleElementSize;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementAlphaFade = /** @class */ (function () {
                function EffectParticleElementAlphaFade() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementAlphaFade
                 */
                EffectParticleElementAlphaFade.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementAlphaFade.prototype.disprangeMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementAlphaFade.prototype.disprangeMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number disprangeMinValue
                 * @param number disprangeMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementAlphaFade.createEffectParticleElementAlphaFade = function (builder, disprangeMinValue, disprangeMaxValue) {
                    builder.prep(4, 8);
                    builder.writeFloat32(disprangeMaxValue);
                    builder.writeFloat32(disprangeMinValue);
                    return builder.offset();
                };
                return EffectParticleElementAlphaFade;
            }());
            ssfb.EffectParticleElementAlphaFade = EffectParticleElementAlphaFade;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementTransColor = /** @class */ (function () {
                function EffectParticleElementTransColor() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementTransColor
                 */
                EffectParticleElementTransColor.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransColor.prototype.ColorMinValue = function () {
                    return this.bb.readUint32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransColor.prototype.ColorMaxValue = function () {
                    return this.bb.readUint32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number ColorMinValue
                 * @param number ColorMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementTransColor.createEffectParticleElementTransColor = function (builder, ColorMinValue, ColorMaxValue) {
                    builder.prep(4, 8);
                    builder.writeInt32(ColorMaxValue);
                    builder.writeInt32(ColorMinValue);
                    return builder.offset();
                };
                return EffectParticleElementTransColor;
            }());
            ssfb.EffectParticleElementTransColor = EffectParticleElementTransColor;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementInitColor = /** @class */ (function () {
                function EffectParticleElementInitColor() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementInitColor
                 */
                EffectParticleElementInitColor.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementInitColor.prototype.ColorMinValue = function () {
                    return this.bb.readUint32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementInitColor.prototype.ColorMaxValue = function () {
                    return this.bb.readUint32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number ColorMinValue
                 * @param number ColorMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementInitColor.createEffectParticleElementInitColor = function (builder, ColorMinValue, ColorMaxValue) {
                    builder.prep(4, 8);
                    builder.writeInt32(ColorMaxValue);
                    builder.writeInt32(ColorMinValue);
                    return builder.offset();
                };
                return EffectParticleElementInitColor;
            }());
            ssfb.EffectParticleElementInitColor = EffectParticleElementInitColor;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementTangentialAcceleration = /** @class */ (function () {
                function EffectParticleElementTangentialAcceleration() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementTangentialAcceleration
                 */
                EffectParticleElementTangentialAcceleration.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTangentialAcceleration.prototype.AccelerationMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTangentialAcceleration.prototype.AccelerationMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number AccelerationMinValue
                 * @param number AccelerationMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementTangentialAcceleration.createEffectParticleElementTangentialAcceleration = function (builder, AccelerationMinValue, AccelerationMaxValue) {
                    builder.prep(4, 8);
                    builder.writeFloat32(AccelerationMaxValue);
                    builder.writeFloat32(AccelerationMinValue);
                    return builder.offset();
                };
                return EffectParticleElementTangentialAcceleration;
            }());
            ssfb.EffectParticleElementTangentialAcceleration = EffectParticleElementTangentialAcceleration;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementTransSpeed = /** @class */ (function () {
                function EffectParticleElementTransSpeed() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementTransSpeed
                 */
                EffectParticleElementTransSpeed.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSpeed.prototype.SpeedMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementTransSpeed.prototype.SpeedMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number SpeedMinValue
                 * @param number SpeedMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementTransSpeed.createEffectParticleElementTransSpeed = function (builder, SpeedMinValue, SpeedMaxValue) {
                    builder.prep(4, 8);
                    builder.writeFloat32(SpeedMaxValue);
                    builder.writeFloat32(SpeedMinValue);
                    return builder.offset();
                };
                return EffectParticleElementTransSpeed;
            }());
            ssfb.EffectParticleElementTransSpeed = EffectParticleElementTransSpeed;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementRotationTrans = /** @class */ (function () {
                function EffectParticleElementRotationTrans() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementRotationTrans
                 */
                EffectParticleElementRotationTrans.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotationTrans.prototype.RotationFactor = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotationTrans.prototype.EndLifeTimePer = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number RotationFactor
                 * @param number EndLifeTimePer
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementRotationTrans.createEffectParticleElementRotationTrans = function (builder, RotationFactor, EndLifeTimePer) {
                    builder.prep(4, 8);
                    builder.writeFloat32(EndLifeTimePer);
                    builder.writeFloat32(RotationFactor);
                    return builder.offset();
                };
                return EffectParticleElementRotationTrans;
            }());
            ssfb.EffectParticleElementRotationTrans = EffectParticleElementRotationTrans;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementRotation = /** @class */ (function () {
                function EffectParticleElementRotation() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementRotation
                 */
                EffectParticleElementRotation.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotation.prototype.RotationMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotation.prototype.RotationMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotation.prototype.RotationAddMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRotation.prototype.RotationAddMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 12);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number RotationMinValue
                 * @param number RotationMaxValue
                 * @param number RotationAddMinValue
                 * @param number RotationAddMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementRotation.createEffectParticleElementRotation = function (builder, RotationMinValue, RotationMaxValue, RotationAddMinValue, RotationAddMaxValue) {
                    builder.prep(4, 16);
                    builder.writeFloat32(RotationAddMaxValue);
                    builder.writeFloat32(RotationAddMinValue);
                    builder.writeFloat32(RotationMaxValue);
                    builder.writeFloat32(RotationMinValue);
                    return builder.offset();
                };
                return EffectParticleElementRotation;
            }());
            ssfb.EffectParticleElementRotation = EffectParticleElementRotation;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementPosition = /** @class */ (function () {
                function EffectParticleElementPosition() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementPosition
                 */
                EffectParticleElementPosition.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementPosition.prototype.OffsetXMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementPosition.prototype.OffsetXMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementPosition.prototype.OffsetYMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementPosition.prototype.OffsetYMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 12);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number OffsetXMinValue
                 * @param number OffsetXMaxValue
                 * @param number OffsetYMinValue
                 * @param number OffsetYMaxValue
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementPosition.createEffectParticleElementPosition = function (builder, OffsetXMinValue, OffsetXMaxValue, OffsetYMinValue, OffsetYMaxValue) {
                    builder.prep(4, 16);
                    builder.writeFloat32(OffsetYMaxValue);
                    builder.writeFloat32(OffsetYMinValue);
                    builder.writeFloat32(OffsetXMaxValue);
                    builder.writeFloat32(OffsetXMinValue);
                    return builder.offset();
                };
                return EffectParticleElementPosition;
            }());
            ssfb.EffectParticleElementPosition = EffectParticleElementPosition;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementGravity = /** @class */ (function () {
                function EffectParticleElementGravity() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementGravity
                 */
                EffectParticleElementGravity.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementGravity.prototype.GravityX = function () {
                    return this.bb.readFloat32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementGravity.prototype.GravityY = function () {
                    return this.bb.readFloat32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number Gravity_x
                 * @param number Gravity_y
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementGravity.createEffectParticleElementGravity = function (builder, Gravity_x, Gravity_y) {
                    builder.prep(4, 8);
                    builder.writeFloat32(Gravity_y);
                    builder.writeFloat32(Gravity_x);
                    return builder.offset();
                };
                return EffectParticleElementGravity;
            }());
            ssfb.EffectParticleElementGravity = EffectParticleElementGravity;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementDelay = /** @class */ (function () {
                function EffectParticleElementDelay() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementDelay
                 */
                EffectParticleElementDelay.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementDelay.prototype.DelayTime = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number DelayTime
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementDelay.createEffectParticleElementDelay = function (builder, DelayTime) {
                    builder.prep(4, 4);
                    builder.writeInt32(DelayTime);
                    return builder.offset();
                };
                return EffectParticleElementDelay;
            }());
            ssfb.EffectParticleElementDelay = EffectParticleElementDelay;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementRndSeedChange = /** @class */ (function () {
                function EffectParticleElementRndSeedChange() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementRndSeedChange
                 */
                EffectParticleElementRndSeedChange.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementRndSeedChange.prototype.Seed = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number Seed
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementRndSeedChange.createEffectParticleElementRndSeedChange = function (builder, Seed) {
                    builder.prep(4, 4);
                    builder.writeInt32(Seed);
                    return builder.offset();
                };
                return EffectParticleElementRndSeedChange;
            }());
            ssfb.EffectParticleElementRndSeedChange = EffectParticleElementRndSeedChange;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectParticleElementBasic = /** @class */ (function () {
                function EffectParticleElementBasic() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectParticleElementBasic
                 */
                EffectParticleElementBasic.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.SsEffectFunctionType = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.priority = function () {
                    return this.bb.readInt32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.maximumParticle = function () {
                    return this.bb.readInt32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.attimeCreate = function () {
                    return this.bb.readInt32(this.bb_pos + 12);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.interval = function () {
                    return this.bb.readInt32(this.bb_pos + 16);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.lifetime = function () {
                    return this.bb.readInt32(this.bb_pos + 20);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.speedMinValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 24);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.speedMaxValue = function () {
                    return this.bb.readFloat32(this.bb_pos + 28);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.lifespanMinValue = function () {
                    return this.bb.readInt32(this.bb_pos + 32);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.lifespanMaxValue = function () {
                    return this.bb.readInt32(this.bb_pos + 36);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.angle = function () {
                    return this.bb.readFloat32(this.bb_pos + 40);
                };
                /**
                 * @returns number
                 */
                EffectParticleElementBasic.prototype.angleVariance = function () {
                    return this.bb.readFloat32(this.bb_pos + 44);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number SsEffectFunctionType
                 * @param number priority
                 * @param number maximumParticle
                 * @param number attimeCreate
                 * @param number interval
                 * @param number lifetime
                 * @param number speedMinValue
                 * @param number speedMaxValue
                 * @param number lifespanMinValue
                 * @param number lifespanMaxValue
                 * @param number angle
                 * @param number angleVariance
                 * @returns flatbuffers.Offset
                 */
                EffectParticleElementBasic.createEffectParticleElementBasic = function (builder, SsEffectFunctionType, priority, maximumParticle, attimeCreate, interval, lifetime, speedMinValue, speedMaxValue, lifespanMinValue, lifespanMaxValue, angle, angleVariance) {
                    builder.prep(4, 48);
                    builder.writeFloat32(angleVariance);
                    builder.writeFloat32(angle);
                    builder.writeInt32(lifespanMaxValue);
                    builder.writeInt32(lifespanMinValue);
                    builder.writeFloat32(speedMaxValue);
                    builder.writeFloat32(speedMinValue);
                    builder.writeInt32(lifetime);
                    builder.writeInt32(interval);
                    builder.writeInt32(attimeCreate);
                    builder.writeInt32(maximumParticle);
                    builder.writeInt32(priority);
                    builder.writeInt32(SsEffectFunctionType);
                    return builder.offset();
                };
                return EffectParticleElementBasic;
            }());
            ssfb.EffectParticleElementBasic = EffectParticleElementBasic;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectNode = /** @class */ (function () {
                function EffectNode() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectNode
                 */
                EffectNode.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param EffectNode= obj
                 * @returns EffectNode
                 */
                EffectNode.getRootAsEffectNode = function (bb, obj) {
                    return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param EffectNode= obj
                 * @returns EffectNode
                 */
                EffectNode.getSizePrefixedRootAsEffectNode = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new EffectNode()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.arrayIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.parentIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.type = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.cellIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.blendType = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.numBehavior = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @returns ss.ssfb.EffectNodeBehavior
                 */
                EffectNode.prototype.BehaviorType = function (index) {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? /**  */ (this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index)) : /**  */ (0);
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.BehaviorTypeLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns Uint8Array
                 */
                EffectNode.prototype.BehaviorTypeArray = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
                };
                /**
                 * @param number index
                 * @param flatbuffers.Table= obj
                 * @returns ?flatbuffers.Table
                 */
                EffectNode.prototype.Behavior = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
                };
                /**
                 * @returns number
                 */
                EffectNode.prototype.BehaviorLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                EffectNode.startEffectNode = function (builder) {
                    builder.startObject(8);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number arrayIndex
                 */
                EffectNode.addArrayIndex = function (builder, arrayIndex) {
                    builder.addFieldInt16(0, arrayIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number parentIndex
                 */
                EffectNode.addParentIndex = function (builder, parentIndex) {
                    builder.addFieldInt16(1, parentIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number type
                 */
                EffectNode.addType = function (builder, type) {
                    builder.addFieldInt16(2, type, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number cellIndex
                 */
                EffectNode.addCellIndex = function (builder, cellIndex) {
                    builder.addFieldInt16(3, cellIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number blendType
                 */
                EffectNode.addBlendType = function (builder, blendType) {
                    builder.addFieldInt16(4, blendType, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numBehavior
                 */
                EffectNode.addNumBehavior = function (builder, numBehavior) {
                    builder.addFieldInt16(5, numBehavior, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset BehaviorTypeOffset
                 */
                EffectNode.addBehaviorType = function (builder, BehaviorTypeOffset) {
                    builder.addFieldOffset(6, BehaviorTypeOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<ss.ssfb.EffectNodeBehavior> data
                 * @returns flatbuffers.Offset
                 */
                EffectNode.createBehaviorTypeVector = function (builder, data) {
                    builder.startVector(1, data.length, 1);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addInt8(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                EffectNode.startBehaviorTypeVector = function (builder, numElems) {
                    builder.startVector(1, numElems, 1);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset BehaviorOffset
                 */
                EffectNode.addBehavior = function (builder, BehaviorOffset) {
                    builder.addFieldOffset(7, BehaviorOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                EffectNode.createBehaviorVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                EffectNode.startBehaviorVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.EffectNode = EffectNode;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var EffectFile = /** @class */ (function () {
                function EffectFile() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns EffectFile
                 */
                EffectFile.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param EffectFile= obj
                 * @returns EffectFile
                 */
                EffectFile.getRootAsEffectFile = function (bb, obj) {
                    return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param EffectFile= obj
                 * @returns EffectFile
                 */
                EffectFile.getSizePrefixedRootAsEffectFile = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new EffectFile()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                EffectFile.prototype.name = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.fps = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.isLockRandSeed = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.lockRandSeed = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.layoutScaleX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.layoutScaleY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.numNodeList = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.EffectNode= obj
                 * @returns ss.ssfb.EffectNode
                 */
                EffectFile.prototype.effectNode = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? (obj || new ss.ssfb.EffectNode()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                EffectFile.prototype.effectNodeLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                EffectFile.startEffectFile = function (builder) {
                    builder.startObject(8);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                EffectFile.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number fps
                 */
                EffectFile.addFps = function (builder, fps) {
                    builder.addFieldInt16(1, fps, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number isLockRandSeed
                 */
                EffectFile.addIsLockRandSeed = function (builder, isLockRandSeed) {
                    builder.addFieldInt16(2, isLockRandSeed, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number lockRandSeed
                 */
                EffectFile.addLockRandSeed = function (builder, lockRandSeed) {
                    builder.addFieldInt16(3, lockRandSeed, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number layoutScaleX
                 */
                EffectFile.addLayoutScaleX = function (builder, layoutScaleX) {
                    builder.addFieldInt16(4, layoutScaleX, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number layoutScaleY
                 */
                EffectFile.addLayoutScaleY = function (builder, layoutScaleY) {
                    builder.addFieldInt16(5, layoutScaleY, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numNodeList
                 */
                EffectFile.addNumNodeList = function (builder, numNodeList) {
                    builder.addFieldInt16(6, numNodeList, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset effectNodeOffset
                 */
                EffectFile.addEffectNode = function (builder, effectNodeOffset) {
                    builder.addFieldOffset(7, effectNodeOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                EffectFile.createEffectNodeVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                EffectFile.startEffectNodeVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.EffectFile = EffectFile;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var CellMap = /** @class */ (function () {
                function CellMap() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns CellMap
                 */
                CellMap.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param CellMap= obj
                 * @returns CellMap
                 */
                CellMap.getRootAsCellMap = function (bb, obj) {
                    return (obj || new CellMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param CellMap= obj
                 * @returns CellMap
                 */
                CellMap.getSizePrefixedRootAsCellMap = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
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
                /**
                 * @returns number
                 */
                CellMap.prototype.index = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                CellMap.prototype.wrapmode = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                CellMap.prototype.filtermode = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                CellMap.startCellMap = function (builder) {
                    builder.startObject(5);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                CellMap.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset imagePathOffset
                 */
                CellMap.addImagePath = function (builder, imagePathOffset) {
                    builder.addFieldOffset(1, imagePathOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number index
                 */
                CellMap.addIndex = function (builder, index) {
                    builder.addFieldInt16(2, index, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number wrapmode
                 */
                CellMap.addWrapmode = function (builder, wrapmode) {
                    builder.addFieldInt16(3, wrapmode, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number filtermode
                 */
                CellMap.addFiltermode = function (builder, filtermode) {
                    builder.addFieldInt16(4, filtermode, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.CellMap = CellMap;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var Cell = /** @class */ (function () {
                function Cell() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns Cell
                 */
                Cell.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param Cell= obj
                 * @returns Cell
                 */
                Cell.getRootAsCell = function (bb, obj) {
                    return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param Cell= obj
                 * @returns Cell
                 */
                Cell.getSizePrefixedRootAsCell = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new Cell()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                Cell.prototype.name = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @param ss.ssfb.CellMap= obj
                 * @returns ss.ssfb.CellMap|null
                 */
                Cell.prototype.cellMap = function (obj) {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? (obj || new ss.ssfb.CellMap()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.indexInCellMap = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.x = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.y = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.width = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.height = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.pivotX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.pivotY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 20);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.u1 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 22);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.v1 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 24);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.u2 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 26);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                Cell.prototype.v2 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 28);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                Cell.startCell = function (builder) {
                    builder.startObject(13);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                Cell.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset cellMapOffset
                 */
                Cell.addCellMap = function (builder, cellMapOffset) {
                    builder.addFieldOffset(1, cellMapOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number indexInCellMap
                 */
                Cell.addIndexInCellMap = function (builder, indexInCellMap) {
                    builder.addFieldInt16(2, indexInCellMap, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number x
                 */
                Cell.addX = function (builder, x) {
                    builder.addFieldInt16(3, x, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number y
                 */
                Cell.addY = function (builder, y) {
                    builder.addFieldInt16(4, y, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number width
                 */
                Cell.addWidth = function (builder, width) {
                    builder.addFieldInt16(5, width, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number height
                 */
                Cell.addHeight = function (builder, height) {
                    builder.addFieldInt16(6, height, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number pivotX
                 */
                Cell.addPivotX = function (builder, pivotX) {
                    builder.addFieldFloat32(7, pivotX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number pivotY
                 */
                Cell.addPivotY = function (builder, pivotY) {
                    builder.addFieldFloat32(8, pivotY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number u1
                 */
                Cell.addU1 = function (builder, u1) {
                    builder.addFieldFloat32(9, u1, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number v1
                 */
                Cell.addV1 = function (builder, v1) {
                    builder.addFieldFloat32(10, v1, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number u2
                 */
                Cell.addU2 = function (builder, u2) {
                    builder.addFieldFloat32(11, u2, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number v2
                 */
                Cell.addV2 = function (builder, v2) {
                    builder.addFieldFloat32(12, v2, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
                Cell.endCell = function (builder) {
                    var offset = builder.endObject();
                    return offset;
                };
                Cell.createCell = function (builder, nameOffset, cellMapOffset, indexInCellMap, x, y, width, height, pivotX, pivotY, u1, v1, u2, v2) {
                    Cell.startCell(builder);
                    Cell.addName(builder, nameOffset);
                    Cell.addCellMap(builder, cellMapOffset);
                    Cell.addIndexInCellMap(builder, indexInCellMap);
                    Cell.addX(builder, x);
                    Cell.addY(builder, y);
                    Cell.addWidth(builder, width);
                    Cell.addHeight(builder, height);
                    Cell.addPivotX(builder, pivotX);
                    Cell.addPivotY(builder, pivotY);
                    Cell.addU1(builder, u1);
                    Cell.addV1(builder, v1);
                    Cell.addU2(builder, u2);
                    Cell.addV2(builder, v2);
                    return Cell.endCell(builder);
                };
                return Cell;
            }());
            ssfb.Cell = Cell;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var meshDataUV = /** @class */ (function () {
                function meshDataUV() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns meshDataUV
                 */
                meshDataUV.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param meshDataUV= obj
                 * @returns meshDataUV
                 */
                meshDataUV.getRootAsmeshDataUV = function (bb, obj) {
                    return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param meshDataUV= obj
                 * @returns meshDataUV
                 */
                meshDataUV.getSizePrefixedRootAsmeshDataUV = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new meshDataUV()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param number index
                 * @returns number
                 */
                meshDataUV.prototype.uv = function (index) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
                };
                /**
                 * @returns number
                 */
                meshDataUV.prototype.uvLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns Float32Array
                 */
                meshDataUV.prototype.uvArray = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                meshDataUV.startmeshDataUV = function (builder) {
                    builder.startObject(1);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset uvOffset
                 */
                meshDataUV.addUv = function (builder, uvOffset) {
                    builder.addFieldOffset(0, uvOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<number> data
                 * @returns flatbuffers.Offset
                 */
                meshDataUV.createUvVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addFloat32(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                meshDataUV.startUvVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.meshDataUV = meshDataUV;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var meshDataIndices = /** @class */ (function () {
                function meshDataIndices() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns meshDataIndices
                 */
                meshDataIndices.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param meshDataIndices= obj
                 * @returns meshDataIndices
                 */
                meshDataIndices.getRootAsmeshDataIndices = function (bb, obj) {
                    return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param meshDataIndices= obj
                 * @returns meshDataIndices
                 */
                meshDataIndices.getSizePrefixedRootAsmeshDataIndices = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new meshDataIndices()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param number index
                 * @returns number
                 */
                meshDataIndices.prototype.indices = function (index) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
                };
                /**
                 * @returns number
                 */
                meshDataIndices.prototype.indicesLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns Float32Array
                 */
                meshDataIndices.prototype.indicesArray = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                meshDataIndices.startmeshDataIndices = function (builder) {
                    builder.startObject(1);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset indicesOffset
                 */
                meshDataIndices.addIndices = function (builder, indicesOffset) {
                    builder.addFieldOffset(0, indicesOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<number> data
                 * @returns flatbuffers.Offset
                 */
                meshDataIndices.createIndicesVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addFloat32(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                meshDataIndices.startIndicesVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.meshDataIndices = meshDataIndices;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var partState = /** @class */ (function () {
                function partState() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns partState
                 */
                partState.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param partState= obj
                 * @returns partState
                 */
                partState.getRootAspartState = function (bb, obj) {
                    return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param partState= obj
                 * @returns partState
                 */
                partState.getSizePrefixedRootAspartState = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new partState()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                partState.prototype.index = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                partState.prototype.flag1 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                partState.prototype.flag2 = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @returns number
                 */
                partState.prototype.data = function (index) {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
                };
                /**
                 * @returns number
                 */
                partState.prototype.dataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns Uint32Array
                 */
                partState.prototype.dataArray = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                partState.startpartState = function (builder) {
                    builder.startObject(4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number index
                 */
                partState.addIndex = function (builder, index) {
                    builder.addFieldInt16(0, index, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number flag1
                 */
                partState.addFlag1 = function (builder, flag1) {
                    builder.addFieldInt32(1, flag1, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number flag2
                 */
                partState.addFlag2 = function (builder, flag2) {
                    builder.addFieldInt32(2, flag2, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset dataOffset
                 */
                partState.addData = function (builder, dataOffset) {
                    builder.addFieldOffset(3, dataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<number> data
                 * @returns flatbuffers.Offset
                 */
                partState.createDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addInt32(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                partState.startDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.partState = partState;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var frameDataIndex = /** @class */ (function () {
                function frameDataIndex() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns frameDataIndex
                 */
                frameDataIndex.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param frameDataIndex= obj
                 * @returns frameDataIndex
                 */
                frameDataIndex.getRootAsframeDataIndex = function (bb, obj) {
                    return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param frameDataIndex= obj
                 * @returns frameDataIndex
                 */
                frameDataIndex.getSizePrefixedRootAsframeDataIndex = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new frameDataIndex()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param number index
                 * @param ss.ssfb.partState= obj
                 * @returns ss.ssfb.partState
                 */
                frameDataIndex.prototype.states = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? (obj || new ss.ssfb.partState()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                frameDataIndex.prototype.statesLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                frameDataIndex.startframeDataIndex = function (builder) {
                    builder.startObject(1);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset statesOffset
                 */
                frameDataIndex.addStates = function (builder, statesOffset) {
                    builder.addFieldOffset(0, statesOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                frameDataIndex.createStatesVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                frameDataIndex.startStatesVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.frameDataIndex = frameDataIndex;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataInteger = /** @class */ (function () {
                function userDataInteger() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataInteger
                 */
                userDataInteger.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                userDataInteger.prototype.integer = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number integer
                 * @returns flatbuffers.Offset
                 */
                userDataInteger.createuserDataInteger = function (builder, integer) {
                    builder.prep(4, 4);
                    builder.writeInt32(integer);
                    return builder.offset();
                };
                return userDataInteger;
            }());
            ssfb.userDataInteger = userDataInteger;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataRect = /** @class */ (function () {
                function userDataRect() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataRect
                 */
                userDataRect.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                userDataRect.prototype.x = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                userDataRect.prototype.y = function () {
                    return this.bb.readInt32(this.bb_pos + 4);
                };
                /**
                 * @returns number
                 */
                userDataRect.prototype.w = function () {
                    return this.bb.readInt32(this.bb_pos + 8);
                };
                /**
                 * @returns number
                 */
                userDataRect.prototype.h = function () {
                    return this.bb.readInt32(this.bb_pos + 12);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number x
                 * @param number y
                 * @param number w
                 * @param number h
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.userDataRect = userDataRect;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataPoint = /** @class */ (function () {
                function userDataPoint() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataPoint
                 */
                userDataPoint.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @returns number
                 */
                userDataPoint.prototype.x = function () {
                    return this.bb.readInt32(this.bb_pos);
                };
                /**
                 * @returns number
                 */
                userDataPoint.prototype.y = function () {
                    return this.bb.readInt32(this.bb_pos + 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number x
                 * @param number y
                 * @returns flatbuffers.Offset
                 */
                userDataPoint.createuserDataPoint = function (builder, x, y) {
                    builder.prep(4, 8);
                    builder.writeInt32(y);
                    builder.writeInt32(x);
                    return builder.offset();
                };
                return userDataPoint;
            }());
            ssfb.userDataPoint = userDataPoint;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataString = /** @class */ (function () {
                function userDataString() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataString
                 */
                userDataString.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataString= obj
                 * @returns userDataString
                 */
                userDataString.getRootAsuserDataString = function (bb, obj) {
                    return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataString= obj
                 * @returns userDataString
                 */
                userDataString.getSizePrefixedRootAsuserDataString = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new userDataString()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                userDataString.prototype.length = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                userDataString.prototype.data = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                userDataString.startuserDataString = function (builder) {
                    builder.startObject(2);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number length
                 */
                userDataString.addLength = function (builder, length) {
                    builder.addFieldInt32(0, length, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset dataOffset
                 */
                userDataString.addData = function (builder, dataOffset) {
                    builder.addFieldOffset(1, dataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.userDataString = userDataString;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataItem = /** @class */ (function () {
                function userDataItem() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataItem
                 */
                userDataItem.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataItem= obj
                 * @returns userDataItem
                 */
                userDataItem.getRootAsuserDataItem = function (bb, obj) {
                    return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataItem= obj
                 * @returns userDataItem
                 */
                userDataItem.getSizePrefixedRootAsuserDataItem = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new userDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                userDataItem.prototype.flags = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                userDataItem.prototype.arrayIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @returns ss.ssfb.userDataValue
                 */
                userDataItem.prototype.dataType = function (index) {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? /**  */ (this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index)) : /**  */ (0);
                };
                /**
                 * @returns number
                 */
                userDataItem.prototype.dataTypeLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns Uint8Array
                 */
                userDataItem.prototype.dataTypeArray = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
                };
                /**
                 * @param number index
                 * @param flatbuffers.Table= obj
                 * @returns ?flatbuffers.Table
                 */
                userDataItem.prototype.data = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.__union(obj, this.bb.__vector(this.bb_pos + offset) + index * 4) : null;
                };
                /**
                 * @returns number
                 */
                userDataItem.prototype.dataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                userDataItem.startuserDataItem = function (builder) {
                    builder.startObject(4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number flags
                 */
                userDataItem.addFlags = function (builder, flags) {
                    builder.addFieldInt16(0, flags, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number arrayIndex
                 */
                userDataItem.addArrayIndex = function (builder, arrayIndex) {
                    builder.addFieldInt16(1, arrayIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset dataTypeOffset
                 */
                userDataItem.addDataType = function (builder, dataTypeOffset) {
                    builder.addFieldOffset(2, dataTypeOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<ss.ssfb.userDataValue> data
                 * @returns flatbuffers.Offset
                 */
                userDataItem.createDataTypeVector = function (builder, data) {
                    builder.startVector(1, data.length, 1);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addInt8(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                userDataItem.startDataTypeVector = function (builder, numElems) {
                    builder.startVector(1, numElems, 1);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset dataOffset
                 */
                userDataItem.addData = function (builder, dataOffset) {
                    builder.addFieldOffset(3, dataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                userDataItem.createDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                userDataItem.startDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.userDataItem = userDataItem;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var userDataPerFrame = /** @class */ (function () {
                function userDataPerFrame() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns userDataPerFrame
                 */
                userDataPerFrame.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataPerFrame= obj
                 * @returns userDataPerFrame
                 */
                userDataPerFrame.getRootAsuserDataPerFrame = function (bb, obj) {
                    return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param userDataPerFrame= obj
                 * @returns userDataPerFrame
                 */
                userDataPerFrame.getSizePrefixedRootAsuserDataPerFrame = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new userDataPerFrame()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                userDataPerFrame.prototype.frameIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.userDataItem= obj
                 * @returns ss.ssfb.userDataItem
                 */
                userDataPerFrame.prototype.data = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? (obj || new ss.ssfb.userDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                userDataPerFrame.prototype.dataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                userDataPerFrame.startuserDataPerFrame = function (builder) {
                    builder.startObject(2);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number frameIndex
                 */
                userDataPerFrame.addFrameIndex = function (builder, frameIndex) {
                    builder.addFieldInt16(0, frameIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset dataOffset
                 */
                userDataPerFrame.addData = function (builder, dataOffset) {
                    builder.addFieldOffset(1, dataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                userDataPerFrame.createDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                userDataPerFrame.startDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.userDataPerFrame = userDataPerFrame;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var labelDataItem = /** @class */ (function () {
                function labelDataItem() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns labelDataItem
                 */
                labelDataItem.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param labelDataItem= obj
                 * @returns labelDataItem
                 */
                labelDataItem.getRootAslabelDataItem = function (bb, obj) {
                    return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param labelDataItem= obj
                 * @returns labelDataItem
                 */
                labelDataItem.getSizePrefixedRootAslabelDataItem = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new labelDataItem()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                labelDataItem.prototype.label = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @returns number
                 */
                labelDataItem.prototype.frameIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                labelDataItem.startlabelDataItem = function (builder) {
                    builder.startObject(2);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset labelOffset
                 */
                labelDataItem.addLabel = function (builder, labelOffset) {
                    builder.addFieldOffset(0, labelOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number frameIndex
                 */
                labelDataItem.addFrameIndex = function (builder, frameIndex) {
                    builder.addFieldInt16(1, frameIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.labelDataItem = labelDataItem;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var AnimationData = /** @class */ (function () {
                function AnimationData() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns AnimationData
                 */
                AnimationData.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimationData= obj
                 * @returns AnimationData
                 */
                AnimationData.getRootAsAnimationData = function (bb, obj) {
                    return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimationData= obj
                 * @returns AnimationData
                 */
                AnimationData.getSizePrefixedRootAsAnimationData = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new AnimationData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                AnimationData.prototype.name = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.AnimationInitialData= obj
                 * @returns ss.ssfb.AnimationInitialData
                 */
                AnimationData.prototype.defaultData = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? (obj || new ss.ssfb.AnimationInitialData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.defaultDataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.frameDataIndex= obj
                 * @returns ss.ssfb.frameDataIndex
                 */
                AnimationData.prototype.frameData = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? (obj || new ss.ssfb.frameDataIndex()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.frameDataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.userDataPerFrame= obj
                 * @returns ss.ssfb.userDataPerFrame
                 */
                AnimationData.prototype.userData = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? (obj || new ss.ssfb.userDataPerFrame()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.userDataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.labelDataItem= obj
                 * @returns ss.ssfb.labelDataItem
                 */
                AnimationData.prototype.labelData = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? (obj || new ss.ssfb.labelDataItem()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.labelDataLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.meshDataUV= obj
                 * @returns ss.ssfb.meshDataUV
                 */
                AnimationData.prototype.meshsDataUV = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? (obj || new ss.ssfb.meshDataUV()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.meshsDataUVLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.meshDataIndices= obj
                 * @returns ss.ssfb.meshDataIndices
                 */
                AnimationData.prototype.meshsDataIndices = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? (obj || new ss.ssfb.meshDataIndices()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.meshsDataIndicesLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.startFrames = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.endFrames = function () {
                    var offset = this.bb.__offset(this.bb_pos, 20);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.totalFrames = function () {
                    var offset = this.bb.__offset(this.bb_pos, 22);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.fps = function () {
                    var offset = this.bb.__offset(this.bb_pos, 24);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.labelNum = function () {
                    var offset = this.bb.__offset(this.bb_pos, 26);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.canvasSizeW = function () {
                    var offset = this.bb.__offset(this.bb_pos, 28);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.canvasSizeH = function () {
                    var offset = this.bb.__offset(this.bb_pos, 30);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.canvasPvotX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 32);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationData.prototype.canvasPvotY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 34);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                AnimationData.startAnimationData = function (builder) {
                    builder.startObject(16);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                AnimationData.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset defaultDataOffset
                 */
                AnimationData.addDefaultData = function (builder, defaultDataOffset) {
                    builder.addFieldOffset(1, defaultDataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createDefaultDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startDefaultDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset frameDataOffset
                 */
                AnimationData.addFrameData = function (builder, frameDataOffset) {
                    builder.addFieldOffset(2, frameDataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createFrameDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startFrameDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset userDataOffset
                 */
                AnimationData.addUserData = function (builder, userDataOffset) {
                    builder.addFieldOffset(3, userDataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createUserDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startUserDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset labelDataOffset
                 */
                AnimationData.addLabelData = function (builder, labelDataOffset) {
                    builder.addFieldOffset(4, labelDataOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createLabelDataVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startLabelDataVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset meshsDataUVOffset
                 */
                AnimationData.addMeshsDataUV = function (builder, meshsDataUVOffset) {
                    builder.addFieldOffset(5, meshsDataUVOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createMeshsDataUVVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startMeshsDataUVVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset meshsDataIndicesOffset
                 */
                AnimationData.addMeshsDataIndices = function (builder, meshsDataIndicesOffset) {
                    builder.addFieldOffset(6, meshsDataIndicesOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimationData.createMeshsDataIndicesVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimationData.startMeshsDataIndicesVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number startFrames
                 */
                AnimationData.addStartFrames = function (builder, startFrames) {
                    builder.addFieldInt16(7, startFrames, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number endFrames
                 */
                AnimationData.addEndFrames = function (builder, endFrames) {
                    builder.addFieldInt16(8, endFrames, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number totalFrames
                 */
                AnimationData.addTotalFrames = function (builder, totalFrames) {
                    builder.addFieldInt16(9, totalFrames, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number fps
                 */
                AnimationData.addFps = function (builder, fps) {
                    builder.addFieldInt16(10, fps, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number labelNum
                 */
                AnimationData.addLabelNum = function (builder, labelNum) {
                    builder.addFieldInt16(11, labelNum, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number canvasSizeW
                 */
                AnimationData.addCanvasSizeW = function (builder, canvasSizeW) {
                    builder.addFieldInt16(12, canvasSizeW, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number canvasSizeH
                 */
                AnimationData.addCanvasSizeH = function (builder, canvasSizeH) {
                    builder.addFieldInt16(13, canvasSizeH, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number canvasPvotX
                 */
                AnimationData.addCanvasPvotX = function (builder, canvasPvotX) {
                    builder.addFieldFloat32(14, canvasPvotX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number canvasPvotY
                 */
                AnimationData.addCanvasPvotY = function (builder, canvasPvotY) {
                    builder.addFieldFloat32(15, canvasPvotY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.AnimationData = AnimationData;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var AnimationInitialData = /** @class */ (function () {
                function AnimationInitialData() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns AnimationInitialData
                 */
                AnimationInitialData.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimationInitialData= obj
                 * @returns AnimationInitialData
                 */
                AnimationInitialData.getRootAsAnimationInitialData = function (bb, obj) {
                    return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimationInitialData= obj
                 * @returns AnimationInitialData
                 */
                AnimationInitialData.getSizePrefixedRootAsAnimationInitialData = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new AnimationInitialData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.index = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.lowflag = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.highflag = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.priority = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.cellIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.opacity = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.localopacity = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.masklimen = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.positionX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 20);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.positionY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 22);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.positionZ = function () {
                    var offset = this.bb.__offset(this.bb_pos, 24);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.pivotX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 26);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.pivotY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 28);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.rotationX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 30);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.rotationY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 32);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.rotationZ = function () {
                    var offset = this.bb.__offset(this.bb_pos, 34);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.scaleX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 36);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.scaleY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 38);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.localscaleX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 40);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.localscaleY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 42);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.sizeX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 44);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.sizeY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 46);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.uvMoveX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 48);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.uvMoveY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 50);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.uvRotation = function () {
                    var offset = this.bb.__offset(this.bb_pos, 52);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.uvScaleX = function () {
                    var offset = this.bb.__offset(this.bb_pos, 54);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.uvScaleY = function () {
                    var offset = this.bb.__offset(this.bb_pos, 56);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.boundingRadius = function () {
                    var offset = this.bb.__offset(this.bb_pos, 58);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueCurKeyframe = function () {
                    var offset = this.bb.__offset(this.bb_pos, 60);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueStartFrame = function () {
                    var offset = this.bb.__offset(this.bb_pos, 62);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueEndFrame = function () {
                    var offset = this.bb.__offset(this.bb_pos, 64);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueLoopNum = function () {
                    var offset = this.bb.__offset(this.bb_pos, 66);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueSpeed = function () {
                    var offset = this.bb.__offset(this.bb_pos, 68);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.instanceValueLoopflag = function () {
                    var offset = this.bb.__offset(this.bb_pos, 70);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.effectValueCurKeyframe = function () {
                    var offset = this.bb.__offset(this.bb_pos, 72);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.effectValueStartTime = function () {
                    var offset = this.bb.__offset(this.bb_pos, 74);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.effectValueSpeed = function () {
                    var offset = this.bb.__offset(this.bb_pos, 76);
                    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
                };
                /**
                 * @returns number
                 */
                AnimationInitialData.prototype.effectValueLoopflag = function () {
                    var offset = this.bb.__offset(this.bb_pos, 78);
                    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                AnimationInitialData.startAnimationInitialData = function (builder) {
                    builder.startObject(38);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number index
                 */
                AnimationInitialData.addIndex = function (builder, index) {
                    builder.addFieldInt16(0, index, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number lowflag
                 */
                AnimationInitialData.addLowflag = function (builder, lowflag) {
                    builder.addFieldInt32(1, lowflag, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number highflag
                 */
                AnimationInitialData.addHighflag = function (builder, highflag) {
                    builder.addFieldInt32(2, highflag, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number priority
                 */
                AnimationInitialData.addPriority = function (builder, priority) {
                    builder.addFieldInt16(3, priority, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number cellIndex
                 */
                AnimationInitialData.addCellIndex = function (builder, cellIndex) {
                    builder.addFieldInt16(4, cellIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number opacity
                 */
                AnimationInitialData.addOpacity = function (builder, opacity) {
                    builder.addFieldInt16(5, opacity, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number localopacity
                 */
                AnimationInitialData.addLocalopacity = function (builder, localopacity) {
                    builder.addFieldInt16(6, localopacity, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number masklimen
                 */
                AnimationInitialData.addMasklimen = function (builder, masklimen) {
                    builder.addFieldInt16(7, masklimen, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number positionX
                 */
                AnimationInitialData.addPositionX = function (builder, positionX) {
                    builder.addFieldFloat32(8, positionX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number positionY
                 */
                AnimationInitialData.addPositionY = function (builder, positionY) {
                    builder.addFieldFloat32(9, positionY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number positionZ
                 */
                AnimationInitialData.addPositionZ = function (builder, positionZ) {
                    builder.addFieldFloat32(10, positionZ, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number pivotX
                 */
                AnimationInitialData.addPivotX = function (builder, pivotX) {
                    builder.addFieldFloat32(11, pivotX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number pivotY
                 */
                AnimationInitialData.addPivotY = function (builder, pivotY) {
                    builder.addFieldFloat32(12, pivotY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number rotationX
                 */
                AnimationInitialData.addRotationX = function (builder, rotationX) {
                    builder.addFieldFloat32(13, rotationX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number rotationY
                 */
                AnimationInitialData.addRotationY = function (builder, rotationY) {
                    builder.addFieldFloat32(14, rotationY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number rotationZ
                 */
                AnimationInitialData.addRotationZ = function (builder, rotationZ) {
                    builder.addFieldFloat32(15, rotationZ, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number scaleX
                 */
                AnimationInitialData.addScaleX = function (builder, scaleX) {
                    builder.addFieldFloat32(16, scaleX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number scaleY
                 */
                AnimationInitialData.addScaleY = function (builder, scaleY) {
                    builder.addFieldFloat32(17, scaleY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number localscaleX
                 */
                AnimationInitialData.addLocalscaleX = function (builder, localscaleX) {
                    builder.addFieldFloat32(18, localscaleX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number localscaleY
                 */
                AnimationInitialData.addLocalscaleY = function (builder, localscaleY) {
                    builder.addFieldFloat32(19, localscaleY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number sizeX
                 */
                AnimationInitialData.addSizeX = function (builder, sizeX) {
                    builder.addFieldFloat32(20, sizeX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number sizeY
                 */
                AnimationInitialData.addSizeY = function (builder, sizeY) {
                    builder.addFieldFloat32(21, sizeY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number uvMoveX
                 */
                AnimationInitialData.addUvMoveX = function (builder, uvMoveX) {
                    builder.addFieldFloat32(22, uvMoveX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number uvMoveY
                 */
                AnimationInitialData.addUvMoveY = function (builder, uvMoveY) {
                    builder.addFieldFloat32(23, uvMoveY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number uvRotation
                 */
                AnimationInitialData.addUvRotation = function (builder, uvRotation) {
                    builder.addFieldFloat32(24, uvRotation, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number uvScaleX
                 */
                AnimationInitialData.addUvScaleX = function (builder, uvScaleX) {
                    builder.addFieldFloat32(25, uvScaleX, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number uvScaleY
                 */
                AnimationInitialData.addUvScaleY = function (builder, uvScaleY) {
                    builder.addFieldFloat32(26, uvScaleY, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number boundingRadius
                 */
                AnimationInitialData.addBoundingRadius = function (builder, boundingRadius) {
                    builder.addFieldFloat32(27, boundingRadius, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueCurKeyframe
                 */
                AnimationInitialData.addInstanceValueCurKeyframe = function (builder, instanceValueCurKeyframe) {
                    builder.addFieldInt32(28, instanceValueCurKeyframe, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueStartFrame
                 */
                AnimationInitialData.addInstanceValueStartFrame = function (builder, instanceValueStartFrame) {
                    builder.addFieldInt32(29, instanceValueStartFrame, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueEndFrame
                 */
                AnimationInitialData.addInstanceValueEndFrame = function (builder, instanceValueEndFrame) {
                    builder.addFieldInt32(30, instanceValueEndFrame, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueLoopNum
                 */
                AnimationInitialData.addInstanceValueLoopNum = function (builder, instanceValueLoopNum) {
                    builder.addFieldInt32(31, instanceValueLoopNum, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueSpeed
                 */
                AnimationInitialData.addInstanceValueSpeed = function (builder, instanceValueSpeed) {
                    builder.addFieldFloat32(32, instanceValueSpeed, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number instanceValueLoopflag
                 */
                AnimationInitialData.addInstanceValueLoopflag = function (builder, instanceValueLoopflag) {
                    builder.addFieldInt32(33, instanceValueLoopflag, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number effectValueCurKeyframe
                 */
                AnimationInitialData.addEffectValueCurKeyframe = function (builder, effectValueCurKeyframe) {
                    builder.addFieldInt32(34, effectValueCurKeyframe, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number effectValueStartTime
                 */
                AnimationInitialData.addEffectValueStartTime = function (builder, effectValueStartTime) {
                    builder.addFieldInt32(35, effectValueStartTime, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number effectValueSpeed
                 */
                AnimationInitialData.addEffectValueSpeed = function (builder, effectValueSpeed) {
                    builder.addFieldFloat32(36, effectValueSpeed, 0.0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number effectValueLoopflag
                 */
                AnimationInitialData.addEffectValueLoopflag = function (builder, effectValueLoopflag) {
                    builder.addFieldInt32(37, effectValueLoopflag, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.AnimationInitialData = AnimationInitialData;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var PartData = /** @class */ (function () {
                function PartData() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns PartData
                 */
                PartData.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param PartData= obj
                 * @returns PartData
                 */
                PartData.getRootAsPartData = function (bb, obj) {
                    return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param PartData= obj
                 * @returns PartData
                 */
                PartData.getSizePrefixedRootAsPartData = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new PartData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                PartData.prototype.name = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @returns number
                 */
                PartData.prototype.index = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                PartData.prototype.parentIndex = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns ss.ssfb.SsPartType
                 */
                PartData.prototype.type = function () {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? /**  */ (this.bb.readInt8(this.bb_pos + offset)) : ss.ssfb.SsPartType.Nulltype;
                };
                /**
                 * @returns number
                 */
                PartData.prototype.boundsType = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
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
                /**
                 * @returns number
                 */
                PartData.prototype.maskInfluence = function () {
                    var offset = this.bb.__offset(this.bb_pos, 22);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                PartData.startPartData = function (builder) {
                    builder.startObject(10);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                PartData.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number index
                 */
                PartData.addIndex = function (builder, index) {
                    builder.addFieldInt16(1, index, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number parentIndex
                 */
                PartData.addParentIndex = function (builder, parentIndex) {
                    builder.addFieldInt16(2, parentIndex, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param ss.ssfb.SsPartType type
                 */
                PartData.addType = function (builder, type) {
                    builder.addFieldInt8(3, type, ss.ssfb.SsPartType.Nulltype);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number boundsType
                 */
                PartData.addBoundsType = function (builder, boundsType) {
                    builder.addFieldInt16(4, boundsType, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number alphaBlendType
                 */
                PartData.addAlphaBlendType = function (builder, alphaBlendType) {
                    builder.addFieldInt16(5, alphaBlendType, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset refnameOffset
                 */
                PartData.addRefname = function (builder, refnameOffset) {
                    builder.addFieldOffset(6, refnameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset effectfilenameOffset
                 */
                PartData.addEffectfilename = function (builder, effectfilenameOffset) {
                    builder.addFieldOffset(7, effectfilenameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset colorLabelOffset
                 */
                PartData.addColorLabel = function (builder, colorLabelOffset) {
                    builder.addFieldOffset(8, colorLabelOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number maskInfluence
                 */
                PartData.addMaskInfluence = function (builder, maskInfluence) {
                    builder.addFieldInt16(9, maskInfluence, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.PartData = PartData;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var AnimePackData = /** @class */ (function () {
                function AnimePackData() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns AnimePackData
                 */
                AnimePackData.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimePackData= obj
                 * @returns AnimePackData
                 */
                AnimePackData.getRootAsAnimePackData = function (bb, obj) {
                    return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param AnimePackData= obj
                 * @returns AnimePackData
                 */
                AnimePackData.getSizePrefixedRootAsAnimePackData = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new AnimePackData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                AnimePackData.prototype.name = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.PartData= obj
                 * @returns ss.ssfb.PartData
                 */
                AnimePackData.prototype.parts = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? (obj || new ss.ssfb.PartData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimePackData.prototype.partsLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.AnimationData= obj
                 * @returns ss.ssfb.AnimationData
                 */
                AnimePackData.prototype.animations = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? (obj || new ss.ssfb.AnimationData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                AnimePackData.prototype.animationsLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                AnimePackData.startAnimePackData = function (builder) {
                    builder.startObject(3);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset nameOffset
                 */
                AnimePackData.addName = function (builder, nameOffset) {
                    builder.addFieldOffset(0, nameOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset partsOffset
                 */
                AnimePackData.addParts = function (builder, partsOffset) {
                    builder.addFieldOffset(1, partsOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimePackData.createPartsVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimePackData.startPartsVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset animationsOffset
                 */
                AnimePackData.addAnimations = function (builder, animationsOffset) {
                    builder.addFieldOffset(2, animationsOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                AnimePackData.createAnimationsVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                AnimePackData.startAnimationsVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
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
            ssfb.AnimePackData = AnimePackData;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));
    /**
     * @constructor
     */
    (function (ss) {
        (function (ssfb) {
            var ProjectData = /** @class */ (function () {
                function ProjectData() {
                    this.bb = null;
                    this.bb_pos = 0;
                }
                /**
                 * @param number i
                 * @param flatbuffers.ByteBuffer bb
                 * @returns ProjectData
                 */
                ProjectData.prototype.__init = function (i, bb) {
                    this.bb_pos = i;
                    this.bb = bb;
                    return this;
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param ProjectData= obj
                 * @returns ProjectData
                 */
                ProjectData.getRootAsProjectData = function (bb, obj) {
                    return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @param ProjectData= obj
                 * @returns ProjectData
                 */
                ProjectData.getSizePrefixedRootAsProjectData = function (bb, obj) {
                    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
                    return (obj || new ProjectData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
                };
                /**
                 * @param flatbuffers.ByteBuffer bb
                 * @returns boolean
                 */
                ProjectData.bufferHasIdentifier = function (bb) {
                    return bb.__has_identifier('SSFB');
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.dataId = function () {
                    var offset = this.bb.__offset(this.bb_pos, 4);
                    return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.version = function () {
                    var offset = this.bb.__offset(this.bb_pos, 6);
                    return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.flags = function () {
                    var offset = this.bb.__offset(this.bb_pos, 8);
                    return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
                };
                ProjectData.prototype.imageBaseDir = function (optionalEncoding) {
                    var offset = this.bb.__offset(this.bb_pos, 10);
                    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.Cell= obj
                 * @returns ss.ssfb.Cell
                 */
                ProjectData.prototype.cells = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? (obj || new ss.ssfb.Cell()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.cellsLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 12);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.AnimePackData= obj
                 * @returns ss.ssfb.AnimePackData
                 */
                ProjectData.prototype.animePacks = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? (obj || new ss.ssfb.AnimePackData()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.animePacksLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 14);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @param number index
                 * @param ss.ssfb.EffectFile= obj
                 * @returns ss.ssfb.EffectFile
                 */
                ProjectData.prototype.effectFileList = function (index, obj) {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? (obj || new ss.ssfb.EffectFile()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.effectFileListLength = function () {
                    var offset = this.bb.__offset(this.bb_pos, 16);
                    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.numCells = function () {
                    var offset = this.bb.__offset(this.bb_pos, 18);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.numAnimePacks = function () {
                    var offset = this.bb.__offset(this.bb_pos, 20);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @returns number
                 */
                ProjectData.prototype.numEffectFileList = function () {
                    var offset = this.bb.__offset(this.bb_pos, 22);
                    return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
                };
                /**
                 * @param flatbuffers.Builder builder
                 */
                ProjectData.startProjectData = function (builder) {
                    builder.startObject(10);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number dataId
                 */
                ProjectData.addDataId = function (builder, dataId) {
                    builder.addFieldInt32(0, dataId, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number version
                 */
                ProjectData.addVersion = function (builder, version) {
                    builder.addFieldInt32(1, version, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number flags
                 */
                ProjectData.addFlags = function (builder, flags) {
                    builder.addFieldInt32(2, flags, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset imageBaseDirOffset
                 */
                ProjectData.addImageBaseDir = function (builder, imageBaseDirOffset) {
                    builder.addFieldOffset(3, imageBaseDirOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset cellsOffset
                 */
                ProjectData.addCells = function (builder, cellsOffset) {
                    builder.addFieldOffset(4, cellsOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                ProjectData.createCellsVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                ProjectData.startCellsVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset animePacksOffset
                 */
                ProjectData.addAnimePacks = function (builder, animePacksOffset) {
                    builder.addFieldOffset(5, animePacksOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                ProjectData.createAnimePacksVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                ProjectData.startAnimePacksVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset effectFileListOffset
                 */
                ProjectData.addEffectFileList = function (builder, effectFileListOffset) {
                    builder.addFieldOffset(6, effectFileListOffset, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param Array.<flatbuffers.Offset> data
                 * @returns flatbuffers.Offset
                 */
                ProjectData.createEffectFileListVector = function (builder, data) {
                    builder.startVector(4, data.length, 4);
                    for (var i = data.length - 1; i >= 0; i--) {
                        builder.addOffset(data[i]);
                    }
                    return builder.endVector();
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numElems
                 */
                ProjectData.startEffectFileListVector = function (builder, numElems) {
                    builder.startVector(4, numElems, 4);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numCells
                 */
                ProjectData.addNumCells = function (builder, numCells) {
                    builder.addFieldInt16(7, numCells, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numAnimePacks
                 */
                ProjectData.addNumAnimePacks = function (builder, numAnimePacks) {
                    builder.addFieldInt16(8, numAnimePacks, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param number numEffectFileList
                 */
                ProjectData.addNumEffectFileList = function (builder, numEffectFileList) {
                    builder.addFieldInt16(9, numEffectFileList, 0);
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @returns flatbuffers.Offset
                 */
                ProjectData.endProjectData = function (builder) {
                    var offset = builder.endObject();
                    return offset;
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset offset
                 */
                ProjectData.finishProjectDataBuffer = function (builder, offset) {
                    builder.finish(offset, 'SSFB');
                };
                /**
                 * @param flatbuffers.Builder builder
                 * @param flatbuffers.Offset offset
                 */
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
            ssfb.ProjectData = ProjectData;
        })(ss.ssfb || (ss.ssfb = {}));
    })(ss || (ss = {}));

    // import * as PIXI from 'pixi.js';
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
                var buf = new flatbuffers$1.ByteBuffer(bytes);
                self.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
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
            var loader = new PIXI.Loader();
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
            var buffer = new flatbuffers$1.ByteBuffer(bytes);
            this.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buffer);
            var loader = new PIXI.Loader();
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
            _this.defaultColorFilter = new PIXI.filters.ColorMatrixFilter();
            _this.ss6project = ss6project;
            _this.fbObj = _this.ss6project.fbObj;
            _this.resources = _this.ss6project.resources;
            _this.parentAlpha = 1.0;
            if (animePackName !== null && animeName !== null) {
                _this.Setup(animePackName, animeName);
            }
            // Ticker
            PIXI.Ticker.shared.add(_this.Update, _this);
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
        /**
         * Update is called PIXI.ticker
         * @param {number} delta - expected 1
         */
        SS6Player.prototype.Update = function (delta) {
            var elapsedTime = PIXI.Ticker.shared.elapsedMS;
            var toNextFrame = this._isPlaying && !this._isPausing;
            if (toNextFrame && this.updateInterval !== 0) {
                this.nextFrameTime += elapsedTime; // もっとうまいやり方がありそうなんだけど…
                if (this.nextFrameTime >= this.updateInterval) {
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
                                if (this._loops === -1) ;
                                else {
                                    this._loops--;
                                    if (this.playEndCallback !== null) {
                                        this.playEndCallback(this);
                                    }
                                    if (this._loops === 0)
                                        this._isPlaying = false;
                                }
                                incFrameNo = this._startFrame;
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
                                if (this._loops === -1) ;
                                else {
                                    this._loops--;
                                    if (this.playEndCallback !== null) {
                                        this.playEndCallback(this);
                                    }
                                    if (this._loops === 0)
                                        this._isPlaying = false;
                                }
                                decFrameNo = this._endFrame;
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
                    d_int = framedata.data(i).data(id, new ss.ssfb.userDataInteger()).integer();
                    id++;
                }
                if (bit & 2) {
                    // rect
                    d_rect_x = framedata.data(i).data(id, new ss.ssfb.userDataRect()).x();
                    d_rect_y = framedata.data(i).data(id, new ss.ssfb.userDataRect()).y();
                    d_rect_w = framedata.data(i).data(id, new ss.ssfb.userDataRect()).w();
                    d_rect_h = framedata.data(i).data(id, new ss.ssfb.userDataRect()).h();
                    id++;
                }
                if (bit & 4) {
                    // pos
                    d_pos_x = framedata.data(i).data(id, new ss.ssfb.userDataPoint()).x();
                    d_pos_y = framedata.data(i).data(id, new ss.ssfb.userDataPoint()).y();
                    id++;
                }
                if (bit & 8) {
                    // string
                    d_string_length = framedata.data(i).data(id, new ss.ssfb.userDataString()).length();
                    d_string = framedata.data(i).data(id, new ss.ssfb.userDataString()).data();
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
                if (f1 & ss.ssfb.PART_FLAG.INVISIBLE)
                    fd.f_hide = true;
                if (f1 & ss.ssfb.PART_FLAG.FLIP_H)
                    fd.f_flipH = true;
                if (f1 & ss.ssfb.PART_FLAG.FLIP_V)
                    fd.f_flipV = true;
                if (f1 & ss.ssfb.PART_FLAG.CELL_INDEX)
                    fd.cellIndex = curPartState.data(id++); // 8 Cell ID
                if (f1 & ss.ssfb.PART_FLAG.POSITION_X)
                    fd.positionX = this.I2F(curPartState.data(id++));
                if (f1 & ss.ssfb.PART_FLAG.POSITION_Y)
                    fd.positionY = this.I2F(curPartState.data(id++));
                if (f1 & ss.ssfb.PART_FLAG.POSITION_Z)
                    id++; // 64
                if (f1 & ss.ssfb.PART_FLAG.PIVOT_X)
                    fd.pivotX = this.I2F(curPartState.data(id++)); // 128 Pivot Offset X
                if (f1 & ss.ssfb.PART_FLAG.PIVOT_Y)
                    fd.pivotY = this.I2F(curPartState.data(id++)); // 256 Pivot Offset Y
                if (f1 & ss.ssfb.PART_FLAG.ROTATIONX)
                    id++; // 512
                if (f1 & ss.ssfb.PART_FLAG.ROTATIONY)
                    id++; // 1024
                if (f1 & ss.ssfb.PART_FLAG.ROTATIONZ)
                    fd.rotationZ = this.I2F(curPartState.data(id++)); // 2048
                if (f1 & ss.ssfb.PART_FLAG.SCALE_X)
                    fd.scaleX = this.I2F(curPartState.data(id++)); // 4096
                if (f1 & ss.ssfb.PART_FLAG.SCALE_Y)
                    fd.scaleY = this.I2F(curPartState.data(id++)); // 8192
                if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_X)
                    fd.localscaleX = this.I2F(curPartState.data(id++)); // 16384
                if (f1 & ss.ssfb.PART_FLAG.LOCALSCALE_Y)
                    fd.localscaleY = this.I2F(curPartState.data(id++)); // 32768
                if (f1 & ss.ssfb.PART_FLAG.OPACITY)
                    fd.opacity = curPartState.data(id++); // 65536
                if (f1 & ss.ssfb.PART_FLAG.LOCALOPACITY)
                    fd.localopacity = curPartState.data(id++); // 131072
                if (f1 & ss.ssfb.PART_FLAG.SIZE_X)
                    fd.size_X = this.I2F(curPartState.data(id++)); // 1048576 Size X [1]
                if (f1 & ss.ssfb.PART_FLAG.SIZE_Y)
                    fd.size_Y = this.I2F(curPartState.data(id++)); // 2097152 Size Y [1]
                if (f1 & ss.ssfb.PART_FLAG.U_MOVE)
                    fd.uv_move_X = this.I2F(curPartState.data(id++)); // 4194304 UV Move X
                if (f1 & ss.ssfb.PART_FLAG.V_MOVE)
                    fd.uv_move_Y = this.I2F(curPartState.data(id++)); // 8388608 UV Move Y
                if (f1 & ss.ssfb.PART_FLAG.UV_ROTATION)
                    fd.uv_rotation = this.I2F(curPartState.data(id++)); // 16777216 UV Rotation
                if (f1 & ss.ssfb.PART_FLAG.U_SCALE)
                    fd.uv_scale_X = this.I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
                if (f1 & ss.ssfb.PART_FLAG.V_SCALE)
                    fd.uv_scale_Y = this.I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
                if (f1 & ss.ssfb.PART_FLAG.BOUNDINGRADIUS)
                    id++; // 134217728 boundingRadius
                if (f1 & ss.ssfb.PART_FLAG.MASK)
                    fd.masklimen = curPartState.data(id++); // 268435456 masklimen
                if (f1 & ss.ssfb.PART_FLAG.PRIORITY)
                    fd.priority = curPartState.data(id++); // 536870912 priority
                //
                if (f1 & ss.ssfb.PART_FLAG.INSTANCE_KEYFRAME) {
                    // 1073741824 instance keyframe
                    fd.instanceValue_curKeyframe = curPartState.data(id++);
                    fd.instanceValue_startFrame = curPartState.data(id++);
                    fd.instanceValue_endFrame = curPartState.data(id++);
                    fd.instanceValue_loopNum = curPartState.data(id++);
                    fd.instanceValue_speed = this.I2F(curPartState.data(id++));
                    fd.instanceValue_loopflag = curPartState.data(id++);
                }
                if (f1 & ss.ssfb.PART_FLAG.EFFECT_KEYFRAME) {
                    // 2147483648 effect keyframe
                    fd.effectValue_curKeyframe = curPartState.data(id++);
                    fd.effectValue_startTime = curPartState.data(id++);
                    fd.effectValue_speed = this.I2F(curPartState.data(id++));
                    fd.effectValue_loopflag = curPartState.data(id++);
                }
                if (f1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
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
                if (f1 & ss.ssfb.PART_FLAG.PARTS_COLOR) {
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
                if (f2 & ss.ssfb.PART_FLAG2.MESHDATA) {
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
            var colorMatrix = new PIXI.filters.ColorMatrixFilter();
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
                    case ss.ssfb.SsPartType.Instance:
                        if (mesh == null) {
                            mesh = this.MakeCellPlayer(part.refname());
                            mesh.name = part.name();
                        }
                        break;
                    case ss.ssfb.SsPartType.Normal:
                    case ss.ssfb.SsPartType.Mask:
                        if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                            if (mesh != null)
                                mesh.destroy();
                            mesh = this.MakeCellMesh(cellID); // (cellID, i)?
                            mesh.name = part.name();
                        }
                        break;
                    case ss.ssfb.SsPartType.Mesh:
                        if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                            if (mesh != null)
                                mesh.destroy();
                            mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
                            mesh.name = part.name();
                        }
                        break;
                    case ss.ssfb.SsPartType.Nulltype:
                    case ss.ssfb.SsPartType.Joint:
                        if (this.prevCellID[i] !== cellID) {
                            if (mesh != null)
                                mesh.destroy();
                            mesh = new PIXI.Container();
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
                    case ss.ssfb.SsPartType.Instance: {
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
                    case ss.ssfb.SsPartType.Normal:
                    case ss.ssfb.SsPartType.Mesh:
                    case ss.ssfb.SsPartType.Joint:
                    case ss.ssfb.SsPartType.Mask: {
                        var cell = this.fbObj.cells(cellID);
                        var verts = void 0;
                        if (partType === ss.ssfb.SsPartType.Mesh) {
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
                        if (data.flag1 & ss.ssfb.PART_FLAG.VERTEX_TRANSFORM) {
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
                        if (data.flag1 & ss.ssfb.PART_FLAG.U_MOVE || data.flag1 & ss.ssfb.PART_FLAG.V_MOVE || data.flag1 & ss.ssfb.PART_FLAG.U_SCALE || data.flag1 & ss.ssfb.PART_FLAG.V_SCALE || data.flag1 & ss.ssfb.PART_FLAG.UV_ROTATION) {
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
                            if (data.flag1 & ss.ssfb.PART_FLAG.UV_ROTATION) {
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
                            mesh.blendMode = PIXI.BLEND_MODES.NORMAL;
                        if (blendMode === 1) {
                            mesh.blendMode = PIXI.BLEND_MODES.MULTIPLY; // not suported 不透明度が利いてしまう。
                            mesh.alpha = 1.0; // 不透明度を固定にする
                        }
                        if (blendMode === 2)
                            mesh.blendMode = PIXI.BLEND_MODES.ADD;
                        if (blendMode === 3)
                            mesh.blendMode = PIXI.BLEND_MODES.NORMAL; // WebGL does not suported "SUB"
                        if (blendMode === 4)
                            mesh.blendMode = PIXI.BLEND_MODES.MULTIPLY; // WebGL does not suported "alpha multiply"
                        if (blendMode === 5) {
                            mesh.blendMode = PIXI.BLEND_MODES.SCREEN; // not suported 不透明度が利いてしまう。
                            mesh.alpha = 1.0; // 不透明度を固定にする
                        }
                        if (blendMode === 6)
                            mesh.blendMode = PIXI.BLEND_MODES.EXCLUSION; // WebGL does not suported "Exclusion"
                        if (blendMode === 7)
                            mesh.blendMode = PIXI.BLEND_MODES.NORMAL; // WebGL does not suported "reverse"
                        if (partType !== ss.ssfb.SsPartType.Mask)
                            this.addChild(mesh);
                        break;
                    }
                    case ss.ssfb.SsPartType.Nulltype: {
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
            var mesh = new PIXI.SimpleMesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices, PIXI.DRAW_MODES.TRIANGLES);
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
                var mesh = new PIXI.SimpleMesh(this.resources[this.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices, PIXI.DRAW_MODES.TRIANGLES);
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
         * @param {ss.ssfb.Cell} cell - セル
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
         * @param {ss.ssfb.Cell} cell - セル
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
    }(PIXI.Container));

    /**
     * PIXI のアニメーションを再生するコンテナ
     */
    var AnimationContainer = /** @class */ (function (_super) {
        __extends$1(AnimationContainer, _super);
        function AnimationContainer(ssWebPlayer) {
            var _this = _super.call(this, ssWebPlayer.projectData) || this;
            _this.currentAnimationFrameDataMap = null;
            _this.ssWebPlayer = ssWebPlayer;
            _this.skipEnabled = false;
            return _this;
        }
        Object.defineProperty(AnimationContainer.prototype, "_playEndCallback", {
            get: function () {
                return this.ssWebPlayer.playEndCallback;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnimationContainer.prototype, "_onUserDataCallback", {
            get: function () {
                return this.ssWebPlayer.onUserDataCallback;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnimationContainer.prototype, "onUpdateCallback", {
            get: function () {
                return this.ssWebPlayer.onUpdateCallback;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnimationContainer.prototype, "onPlayStateChangeCallback", {
            get: function () {
                return this.ssWebPlayer.onPlayStateChangeCallback;
            },
            enumerable: false,
            configurable: true
        });
        AnimationContainer.prototype.Setup = function (animePackName, animeName) {
            _super.prototype.Setup.call(this, animePackName, animeName);
            // アニメーションの FrameDataMap を準備する
            this.setupCurrentAnimationFrameDataMap();
        };
        AnimationContainer.prototype.getCurrentAnimationFrameDataMap = function () {
            return this.currentAnimationFrameDataMap;
        };
        AnimationContainer.prototype.setupCurrentAnimationFrameDataMap = function () {
            var currentAnimation = this.curAnimation;
            var frameDataMap = {};
            // ユーザーデータ
            var userDataLength = currentAnimation.userDataLength();
            // console.log('userDataLength', userDataLength);
            for (var i = 0; i < userDataLength; i++) {
                var userData = currentAnimation.userData(i);
                var frameIndex = userData.frameIndex();
                // 既存のフレームデータを取得
                var frameData = frameDataMap[frameIndex];
                if (frameData == null) {
                    frameData = {};
                }
                // console.log('userData', frameIndex);
                var data = this.GetUserData(frameIndex);
                // console.log('userData.data', data);
                var frameUserDataMap = {};
                var dataLength = data.length;
                for (var dataIndex = 0; dataIndex < dataLength; dataIndex++) {
                    var dataArray = data[dataIndex];
                    // data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
                    var partsArrayIndex = dataArray[0]; // パーツと紐づく
                    var parts = this.curAnimePackData.parts(partsArrayIndex);
                    var partsName = parts.name();
                    dataArray[2];
                    dataArray[3];
                    dataArray[4];
                    dataArray[5];
                    dataArray[6];
                    dataArray[7];
                    dataArray[8];
                    dataArray[9];
                    var stringValue = dataArray[10];
                    // console.log('userData.data.dataArray.stringValue', partsName, stringValue);
                    frameUserDataMap[partsName] = {
                        string: stringValue
                    };
                }
                frameData['userData'] = frameUserDataMap;
                frameDataMap[frameIndex] = frameData;
            }
            this.currentAnimationFrameDataMap = frameDataMap;
        };
        AnimationContainer.prototype.Play = function () {
            _super.prototype.Play.call(this);
            if (this.onPlayStateChangeCallback !== null) {
                this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
            }
        };
        AnimationContainer.prototype.Pause = function () {
            _super.prototype.Pause.call(this);
            if (this.onPlayStateChangeCallback !== null) {
                this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
            }
        };
        AnimationContainer.prototype.Stop = function () {
            _super.prototype.Stop.call(this);
            if (this.onPlayStateChangeCallback !== null) {
                this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
            }
        };
        AnimationContainer.prototype.Update = function (delta) {
            _super.prototype.Update.call(this, delta);
            // 毎回実行されるコールバック
            if (this.isPlaying && !this.isPausing) {
                if (this.onUpdateCallback !== null) {
                    this.onUpdateCallback(this);
                }
            }
        };
        AnimationContainer.prototype.SetFrame = function (frame) {
            _super.prototype.SetFrame.call(this, frame);
            this.SetFrameAnimation(frame);
            if (this.onUpdateCallback !== null) {
                this.onUpdateCallback(this);
            }
        };
        return AnimationContainer;
    }(SS6Player));

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var jszip = createCommonjsModule(function (module, exports) {
    /*!

    JSZip v3.6.0 - A JavaScript class for generating and reading zip files
    <http://stuartk.com/jszip>

    (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
    Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

    JSZip uses the library pako released under the MIT license :
    https://github.com/nodeca/pako/blob/master/LICENSE
    */

    (function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    (function (global){
    /*!

    JSZip v3.5.0 - A JavaScript class for generating and reading zip files
    <http://stuartk.com/jszip>

    (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
    Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

    JSZip uses the library pako released under the MIT license :
    https://github.com/nodeca/pako/blob/master/LICENSE
    */

    !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else {("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=e();}}(function(){return function s(a,o,u){function h(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(f)return f(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return h(t||e)},i,i.exports,s,a,o,u);}return o[r].exports}for(var f="function"==typeof require&&require,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e();}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u);}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e();}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u);}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e();}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u);}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e();}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u);}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(e,t,r){var c=e("./utils"),l=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,u=[],h=0,f=e.length,l=f,d="string"!==c.getTypeOf(e);h<e.length;)l=f-h,n=d?(t=e[h++],r=h<f?e[h++]:0,h<f?e[h++]:0):(t=e.charCodeAt(h++),r=h<f?e.charCodeAt(h++):0,h<f?e.charCodeAt(h++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<l?(15&r)<<2|n>>6:64,o=2<l?63&n:64,u.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return u.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,u=0;if("data:"===e.substr(0,"data:".length))throw new Error("Invalid base64 input, it looks like a data url.");var h,f=3*(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(h=l.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),h[u++]=t,64!==s&&(h[u++]=r),64!==a&&(h[u++]=n);return h};},{"./support":30,"./utils":32}],2:[function(e,t,r){var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i;}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o;},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(e){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate");},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){var n=e("./utils"),a=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t[s])];return -1^e}(0|t,e,e.length):function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t.charCodeAt(s))];return -1^e}(0|t,e,e.length):0};},{"./utils":32}],5:[function(e,t,r){r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null;},{}],6:[function(e,t,r){var n;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n};},{lie:37}],7:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function u(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={};}r.magic="\b\0",s.inherits(u,a),u.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1);},u.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0);},u.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null;},u.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta});};},r.compressWorker=function(e){return new u("Deflate",e)},r.uncompressWorker=function(){return new u("Inflate",{})};},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){function I(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function i(e,t,r,n,i,s){var a,o,u=e.file,h=e.compression,f=s!==B.utf8encode,l=O.transformTo("string",s(u.name)),d=O.transformTo("string",B.utf8encode(u.name)),c=u.comment,p=O.transformTo("string",s(c)),m=O.transformTo("string",B.utf8encode(c)),_=d.length!==u.name.length,g=m.length!==c.length,v="",b="",w="",y=u.dir,k=u.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),f||!_&&!g||(S|=2048);var z,C=0,E=0;y&&(C|=16),"UNIX"===i?(E=798,C|=((z=u.unixPermissions)||(z=y?16893:33204),(65535&z)<<16)):(E=20,C|=63&(u.dosPermissions||0)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v+="up"+I((b=I(1,1)+I(R(l),4)+d).length,2)+b),g&&(v+="uc"+I((w=I(1,1)+I(R(p),4)+m).length,2)+w);var A="";return A+="\n\0",A+=I(S,2),A+=h.magic,A+=I(a,2),A+=I(o,2),A+=I(x.crc32,4),A+=I(x.compressedSize,4),A+=I(x.uncompressedSize,4),A+=I(l.length,2),A+=I(v.length,2),{fileRecord:T.LOCAL_FILE_HEADER+A+l+v,dirRecord:T.CENTRAL_FILE_HEADER+I(E,2)+A+I(p.length,2)+"\0\0\0\0"+I(C,4)+I(n,4)+l+v+p}}var O=e("../utils"),s=e("../stream/GenericWorker"),B=e("../utf8"),R=e("../crc32"),T=e("../signature");function n(e,t,r,n){s.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[];}O.inherits(n,s),n.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,s.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}));},n.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}});}else this.accumulate=!0;},n.prototype.closedSource=function(e){this.accumulate=!1;var t,r=this.streamFiles&&!e.file.dir,n=i(e,r,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),r)this.push({data:(t=e,T.DATA_DESCRIPTOR+I(t.crc32,4)+I(t.compressedSize,4)+I(t.uncompressedSize,4)),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null;},n.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r,n,i,s,a,o,u=this.bytesWritten-e,h=(r=this.dirRecords.length,n=u,i=e,s=this.zipComment,a=this.encodeFileName,o=O.transformTo("string",a(s)),T.CENTRAL_DIRECTORY_END+"\0\0\0\0"+I(r,2)+I(r,2)+I(n,4)+I(i,4)+I(o.length,2)+o);this.push({data:h,meta:{percent:100}});},n.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume();},n.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end();}),e.on("error",function(e){t.error(e);}),this},n.prototype.resume=function(){return !!s.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},n.prototype.error=function(e){var t=this._sources;if(!s.prototype.error.call(this,e))return !1;for(var r=0;r<t.length;r++)try{t[r].error(e);}catch(e){}return !0},n.prototype.lock=function(){s.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock();},t.exports=n;},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){var h=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),u=0;try{e.forEach(function(e,t){u++;var r=function(e,t){var r=e||t,n=h[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o);}),o.entriesCount=u;}catch(e){o.error(e);}return o};},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e};}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.5.0",n.loadAsync=function(e,t){return (new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n;},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){var n=e("./utils"),i=e("./external"),o=e("./utf8"),u=e("./zipEntries"),s=e("./stream/Crc32Probe"),h=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new s);r.on("error",function(e){t(e);}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e();}).resume();})}t.exports=function(e,s){var a=this;return s=n.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),h.isNode&&h.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",e,!0,s.optimizedBinaryString,s.base64).then(function(e){var t=new u(s);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(s.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n];a.file(i.fileNameStr,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:s.createFolders});}return t.zipComment.length&&(a.comment=t.zipComment),a})};},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t);}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}});}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e);}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end();});},s.prototype.pause=function(){return !!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s;},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t);}).on("error",function(e){n.emit("error",e);}).on("end",function(){n.push(null);});}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume();},t.exports=n;},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}};},{}],15:[function(e,t,r){function s(e,t,r){var n,i=f.getTypeOf(t),s=f.extend(r||{},d);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(n=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""}(e))&&g.call(this,n,!0);var a,o="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!o),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string"),a=t instanceof c||t instanceof l?t:m.isNode&&m.isStream(t)?new _(e,t):f.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var u=new p(e,a,s);this.files[e]=u;}function h(e){return "/"!==e.slice(-1)&&(e+="/"),e}var i=e("./utf8"),f=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),d=e("./defaults"),c=e("./compressedObject"),p=e("./zipObject"),o=e("./generate"),m=e("./nodejsUtils"),_=e("./nodejs/NodejsStreamInputAdapter"),g=function(e,t){return t=void 0!==t?t:d.createFolders,e=h(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function u(e){return "[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)this.files.hasOwnProperty(t)&&(n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n));},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t);}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(u(e)){var n=e;return this.filter(function(e,t){return !t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(u(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=g.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(e){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=f.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");f.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n);}catch(e){(t=new l("error")).error(e);}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return (e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n;},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream");},{stream:void 0}],17:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t];}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return -1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return [];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0;}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e);},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e;},skip:function(e){this.setIndex(this.index+e);},byteAt:function(e){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(e){},lastIndexOfSignature:function(e){},readAndCheckSignature:function(e){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i;},{"../utils":32}],19:[function(e,t,r){var n=e("./Uint8ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){var n=e("./DataReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){var n=e("./ArrayReader");function i(e){n.call(this,e);}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i;},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),u=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new u(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)};},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b";},{}],24:[function(e,t,r){var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e;}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta});},t.exports=s;},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0);}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e);},t.exports=s;},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0);}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length;}i.prototype.processChunk.call(this,e);},t.exports=s;},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat();},function(e){t.error(e);});}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null;},s.prototype.resume=function(){return !!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0));},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return !1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t);}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s;},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null;}n.prototype={push:function(e){this.emit("data",e);},end:function(){if(this.isFinished)return !1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0;}catch(e){this.emit("error",e);}return !0},error:function(e){return !this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[];},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t);},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e);}),e.on("end",function(){t.end();}),e.on("error",function(e){t.error(e);}),this},pause:function(){return !this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return !1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e);},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(e)&&(this.streamInfo[e]=this.extraStreamInfo[e]);},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock();},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n;},{}],29:[function(e,t,r){var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),f=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter");}catch(e){}function u(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string";}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock();}catch(e){this._worker=new s("error"),this._worker.error(e);}}u.prototype={accumulate:function(e){return o=this,u=e,new a.Promise(function(t,r){var n=[],i=o._internalType,s=o._outputType,a=o._mimeType;o.on("data",function(e,t){n.push(e),u&&u(t);}).on("error",function(e){n=[],r(e);}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return f.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e);}catch(e){r(e);}n=[];}).resume();});var o,u;},on:function(e,t){var r=this;return "data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta);}):this._worker.on(e,function(){h.delay(t,arguments,r);}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=u;},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else {var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size;}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size;}catch(e){r.blob=!1;}}}try{r.nodestream=!!e("readable-stream").Readable;}catch(e){r.nodestream=!1;}},{"readable-stream":16}],31:[function(e,t,s){for(var o=e("./utils"),u=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),h=new Array(256),i=0;i<256;i++)h[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null;}function f(){n.call(this,"utf-8 encode");}h[254]=h[254]=1,s.utf8encode=function(e){return u.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=u.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return u.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=h[n]))a[r++]=65533,t+=i-1;else {for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n);}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(u.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(u.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(u.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length);}else t=this.leftOver.concat(t);this.leftOver=null;}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t}(t),i=t;n!==t.length&&(u.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta});},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null);},s.Utf8DecodeWorker=a,o.inherits(f,n),f.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta});},s.Utf8EncodeWorker=f;},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,o){var u=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),n=e("set-immediate-shim"),f=e("./external");function i(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}o.newBlob=function(t,r){o.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return u.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return !1}}(),nodebuffer:function(){try{return u.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return !1}}()}};function a(e){var t=65536,r=o.getTypeOf(e),n=!0;if("uint8array"===r?n=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=s.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return s.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2);}return s.stringifyByChar(e)}function d(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}o.applyFromCharCode=a;var c={};c.string={string:i,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:a,array:i,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return a(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:i,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:i,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:i},o.transformTo=function(e,t){if(t=t||"",!e)return t;o.checkSupport(e);var r=o.getTypeOf(t);return c[r][e](t)},o.getTypeOf=function(e){return "string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":u.nodebuffer&&r.isBuffer(e)?"nodebuffer":u.uint8array&&e instanceof Uint8Array?"uint8array":u.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},o.checkSupport=function(e){if(!u[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},o.MAX_VALUE_16BITS=65535,o.MAX_VALUE_32BITS=-1,o.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},o.delay=function(e,t,r){n(function(){e.apply(r||null,t||[]);});},o.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r;},o.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])arguments[e].hasOwnProperty(t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},o.prepareContent=function(n,e,i,s,a){return f.Promise.resolve(e).then(function(n){return u.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new f.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result);},e.onerror=function(e){r(e.target.error);},e.readAsArrayBuffer(n);}):n}).then(function(e){var t,r=o.getTypeOf(e);return r?("arraybuffer"===r?e=o.transformTo("uint8array",e):"string"===r&&(a?e=h.decode(e):i&&!0!==s&&(e=l(t=e,u.uint8array?new Uint8Array(t.length):new Array(t.length)))),e):f.Promise.reject(new Error("Can't read the data of '"+n+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})};},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(e,t,r){var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=(e("./utf8"),e("./support"));function u(e){this.files=[],this.loadOptions=e;}u.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r);},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r};},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes();},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral();}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e);},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles();}},t.exports=u;},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),u=e("./compressions"),h=e("./support");function f(e,t){this.options=e,this.loadOptions=t;}f.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in u)if(u.hasOwnProperty(t)&&u[t].magic===e)return u[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize));},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength);},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0);},parseZIP64ExtraField:function(e){if(this.extraFields[1]){var t=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=t.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=t.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=t.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=t.readInt(4));}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i);},handleUTF8:function(){var e=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else {var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else {var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r);}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else {var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i);}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=f;},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions};}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),u=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker));}catch(e){(t=new u("error")).error(e);}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof u?this._data:new i(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<h.length;l++)n.prototype[h[l]]=f;t.exports=n;},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,f,t){(function(t){var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(h),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2;};}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){h(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null;},t.document.documentElement.appendChild(e);}:function(){setTimeout(h,0);};else {var o=new t.MessageChannel;o.port1.onmessage=h,r=function(){o.port2.postMessage(0);};}var u=[];function h(){var e,t;n=!0;for(var r=u.length;r;){for(t=u,u=[],e=-1;++e<r;)t[e]();r=u.length;}n=!1;}f.exports=function(e){1!==u.push(e)||n||r();};}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],37:[function(e,t,r){var i=e("immediate");function h(){}var f={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==h&&c(this,e);}function u(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected);}function l(t,r,n){i(function(){var e;try{e=r(n);}catch(e){return f.reject(t,e)}e===t?f.reject(t,new TypeError("Cannot resolve promise with itself")):f.resolve(t,e);});}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments);}}function c(t,e){var r=!1;function n(e){r||(r=!0,f.reject(t,e));}function i(e){r||(r=!0,f.resolve(t,e));}var s=p(function(){e(i,n);});"error"===s.status&&n(s.value);}function p(e,t){var r={};try{r.value=e(t),r.status="success";}catch(e){r.status="error",r.value=e;}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(h);return this.state!==n?l(r,this.state===a?e:t,this.outcome):this.queue.push(new u(r,e,t)),r},u.prototype.callFulfilled=function(e){f.resolve(this.promise,e);},u.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e);},u.prototype.callRejected=function(e){f.reject(this.promise,e);},u.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e);},f.resolve=function(e,t){var r=p(d,t);if("error"===r.status)return f.reject(e,r.value);var n=r.value;if(n)c(e,n);else {e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t);}return e},f.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){return e instanceof this?e:f.resolve(new this(h),e)},o.reject=function(e){var t=new this(h);return f.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);for(var s=new Array(n),a=0,t=-1,o=new this(h);++t<n;)u(e[t],t);return o;function u(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,f.resolve(o,s));},function(e){i||(i=!0,f.reject(o,e));});}},o.race=function(e){if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,r=!1;if(!t)return this.resolve([]);for(var n,i=-1,s=new this(h);++i<t;)n=e[i],this.resolve(n).then(function(e){r||(r=!0,f.resolve(s,e));},function(e){r||(r=!0,f.reject(s,e));});return s};},{immediate:36}],38:[function(e,t,r){var n={};(0, e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n;},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){var a=e("./zlib/deflate"),o=e("./utils/common"),u=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),h=Object.prototype.toString,f=0,l=-1,d=0,c=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:l,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==f)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?u.string2buf(t.dictionary):"[object ArrayBuffer]"===h.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==f)throw new Error(i[r]);this._dict_set=!0;}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return !1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=u.string2buf(e):"[object ArrayBuffer]"===h.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==f)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(u.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)));}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===f):2!==n||(this.onEnd(f),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e);},p.prototype.onEnd=function(e){e===f&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return (t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return (t=t||{}).gzip=!0,n(e,t)};},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){var d=e("./zlib/inflate"),c=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header);}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,u=this.strm,h=this.options.chunkSize,f=this.options.dictionary,l=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?u.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?u.input=new Uint8Array(e):u.input=e,u.next_in=0,u.avail_in=u.input.length;do{if(0===u.avail_out&&(u.output=new c.Buf8(h),u.next_out=0,u.avail_out=h),(r=d.inflate(u,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&f&&(o="string"==typeof f?p.string2buf(f):"[object ArrayBuffer]"===_.call(f)?new Uint8Array(f):f,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===l&&(r=m.Z_OK,l=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);u.next_out&&(0!==u.avail_out&&r!==m.Z_STREAM_END&&(0!==u.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(u.output,u.next_out),s=u.next_out-i,a=p.buf2string(u.output,i),u.next_out=s,u.avail_out=h-s,s&&c.arraySet(u.output,u.output,i,s,0),this.onData(a)):this.onData(c.shrinkBuf(u.output,u.next_out)))),0===u.avail_in&&0===u.avail_out&&(l=!0);}while((0<u.avail_in||0===u.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(u.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e);},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return (t=t||{}).raw=!0,o(e,t)},r.ungzip=o;},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n]);}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s];},flattenChunks:function(e){return [].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s));},r.setTyped(n);},{}],42:[function(e,t,r){var u=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){i=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){s=!1;}for(var h=new u.Buf8(256),n=0;n<256;n++)h[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function f(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,u.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}h[254]=h[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new u.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return f(e,e.length)},r.binstring2buf=function(e){for(var t=new u.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=h[i]))o[n++]=65533,r+=s-1;else {for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i);}return f(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t};},{"./common":41}],43:[function(e,t,r){t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521;}return i|s<<16|0};},{}],44:[function(e,t,r){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],45:[function(e,t,r){var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e;}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return -1^e};},{}],46:[function(e,t,r){var u,d=e("../utils/common"),h=e("./trees"),c=e("./adler32"),p=e("./crc32"),n=e("./messages"),f=0,l=0,m=-2,i=2,_=8,s=286,a=30,o=19,g=2*s+1,v=15,b=3,w=258,y=w+b+1,k=42,x=113;function S(e,t){return e.msg=n[t],t}function z(e){return (e<<1)-(4<e?9:0)}function C(e){for(var t=e.length;0<=--t;)e[t]=0;}function E(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(d.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0));}function A(e,t){h._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,E(e.strm);}function I(e,t){e.pending_buf[e.pending++]=t;}function O(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t;}function B(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,u=e.strstart>e.w_size-y?e.strstart-(e.w_size-y):0,h=e.window,f=e.w_mask,l=e.prev,d=e.strstart+w,c=h[s+a-1],p=h[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(h[(r=t)+a]===p&&h[r+a-1]===c&&h[r]===h[s]&&h[++r]===h[s+1]){s+=2,r++;do{}while(h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&s<d);if(n=w-(d-s),s=d-w,a<n){if(e.match_start=t,o<=(a=n))break;c=h[s+a-1],p=h[s+a];}}}while((t=l[t&f])>u&&0!=--i);return a<=e.lookahead?a:e.lookahead}function R(e){var t,r,n,i,s,a,o,u,h,f,l=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=l+(l-y)){for(d.arraySet(e.window,e.window,l,l,0),e.match_start-=l,e.strstart-=l,e.block_start-=l,t=r=e.hash_size;n=e.head[--t],e.head[t]=l<=n?n-l:0,--r;);for(t=r=l;n=e.prev[--t],e.prev[t]=l<=n?n-l:0,--r;);i+=l;}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,u=e.strstart+e.lookahead,f=void 0,(h=i)<(f=a.avail_in)&&(f=h),r=0===f?0:(a.avail_in-=f,d.arraySet(o,a.input,a.next_in,f,u),1===a.state.wrap?a.adler=c(a.adler,o,f,u):2===a.state.wrap&&(a.adler=p(a.adler,o,f,u)),a.next_in+=f,a.total_in+=f,f),e.lookahead+=r,e.lookahead+e.insert>=b)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+b-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<b)););}while(e.lookahead<y&&0!==e.strm.avail_in)}function T(e,t){for(var r,n;;){if(e.lookahead<y){if(R(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r)),e.match_length>=b)if(n=h._tr_tally(e,e.strstart-e.match_start,e.match_length-b),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=b){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++;}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function D(e,t){for(var r,n,i;;){if(e.lookahead<y){if(R(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=b-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===b&&4096<e.strstart-e.match_start)&&(e.match_length=b-1)),e.prev_length>=b&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-b,n=h._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-b),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=b-1,e.strstart++,n&&(A(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if((n=h._tr_tally(e,0,e.window[e.strstart-1]))&&A(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--;}return e.match_available&&(n=h._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function F(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i;}function N(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*g),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),C(this.dyn_ltree),C(this.dyn_dtree),C(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(v+1),this.heap=new d.Buf16(2*s+1),C(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),C(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0;}function U(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?k:x,e.adler=2===t.wrap?0:1,t.last_flush=f,h._tr_init(t),l):S(e,m)}function P(e){var t,r=U(e);return r===l&&((t=e.state).window_size=2*t.w_size,C(t.head),t.max_lazy_match=u[t.level].max_lazy,t.good_match=u[t.level].good_length,t.nice_match=u[t.level].nice_length,t.max_chain_length=u[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=b-1,t.match_available=0,t.ins_h=0),r}function L(e,t,r,n,i,s){if(!e)return m;var a=1;if(-1===t&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||9<i||r!==_||n<8||15<n||t<0||9<t||s<0||4<s)return S(e,m);8===n&&(n=9);var o=new N;return (e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+b-1)/b),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,P(e)}u=[new F(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(R(e),0===e.lookahead&&t===f)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,A(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-y&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(A(e,!1),e.strm.avail_out),1)}),new F(4,4,8,4,T),new F(4,5,16,8,T),new F(4,6,32,32,T),new F(4,4,16,16,D),new F(8,16,32,32,D),new F(8,16,128,128,D),new F(8,32,128,256,D),new F(32,128,258,1024,D),new F(32,258,258,4096,D)],r.deflateInit=function(e,t){return L(e,t,_,15,8,0)},r.deflateInit2=L,r.deflateReset=P,r.deflateResetKeep=U,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?m:(e.state.gzhead=t,l):m},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?S(e,m):m;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&4!==t)return S(e,0===e.avail_out?-5:m);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===k)if(2===n.wrap)e.adler=0,I(n,31),I(n,139),I(n,8),n.gzhead?(I(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),I(n,255&n.gzhead.time),I(n,n.gzhead.time>>8&255),I(n,n.gzhead.time>>16&255),I(n,n.gzhead.time>>24&255),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(I(n,255&n.gzhead.extra.length),I(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(I(n,0),I(n,0),I(n,0),I(n,0),I(n,0),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,3),n.status=x);else {var a=_+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=x,O(n,a),0!==n.strstart&&(O(n,e.adler>>>16),O(n,65535&e.adler)),e.adler=1;}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),E(e),i=n.pending,n.pending!==n.pending_buf_size));)I(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73);}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),E(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,I(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91);}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),E(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,I(n,s);}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103);}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&E(e),n.pending+2<=n.pending_buf_size&&(I(n,255&e.adler),I(n,e.adler>>8&255),e.adler=0,n.status=x)):n.status=x),0!==n.pending){if(E(e),0===e.avail_out)return n.last_flush=-1,l}else if(0===e.avail_in&&z(t)<=z(r)&&4!==t)return S(e,-5);if(666===n.status&&0!==e.avail_in)return S(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==f&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(R(e),0===e.lookahead)){if(t===f)return 1;break}if(e.match_length=0,r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=w){if(R(e),e.lookahead<=w&&t===f)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=b&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+w;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=w-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead);}if(e.match_length>=b?(r=h._tr_tally(e,1,e.match_length-b),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):u[n.level].func(n,t);if(3!==o&&4!==o||(n.status=666),1===o||3===o)return 0===e.avail_out&&(n.last_flush=-1),l;if(2===o&&(1===t?h._tr_align(n):5!==t&&(h._tr_stored_block(n,0,0,!1),3===t&&(C(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),E(e),0===e.avail_out))return n.last_flush=-1,l}return 4!==t?l:n.wrap<=0?1:(2===n.wrap?(I(n,255&e.adler),I(n,e.adler>>8&255),I(n,e.adler>>16&255),I(n,e.adler>>24&255),I(n,255&e.total_in),I(n,e.total_in>>8&255),I(n,e.total_in>>16&255),I(n,e.total_in>>24&255)):(O(n,e.adler>>>16),O(n,65535&e.adler)),E(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?l:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==k&&69!==t&&73!==t&&91!==t&&103!==t&&t!==x&&666!==t?S(e,m):(e.state=null,t===x?S(e,-3):l):m},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,u,h,f=t.length;if(!e||!e.state)return m;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==k||r.lookahead)return m;for(1===s&&(e.adler=c(e.adler,t,f,0)),r.wrap=0,f>=r.w_size&&(0===s&&(C(r.head),r.strstart=0,r.block_start=0,r.insert=0),h=new d.Buf8(r.w_size),d.arraySet(h,t,f-r.w_size,r.w_size,0),t=h,f=r.w_size),a=e.avail_in,o=e.next_in,u=e.input,e.avail_in=f,e.next_in=0,e.input=t,R(r);r.lookahead>=b;){for(n=r.strstart,i=r.lookahead-(b-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+b-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=b-1,R(r);}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=b-1,r.match_available=0,e.next_in=o,e.input=u,e.avail_in=a,r.wrap=s,l},r.deflateInfo="pako deflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],48:[function(e,t,r){t.exports=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),u=r.dmax,h=r.wsize,f=r.whave,l=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,v=(1<<r.distbits)-1;e:do{p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=m[c&g];t:for(;;){if(c>>>=w=b>>>24,p-=w,0==(w=b>>>16&255))C[s++]=65535&b;else {if(!(16&w)){if(0==(64&w)){b=m[(65535&b)+(c&(1<<w)-1)];continue t}if(32&w){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}y=65535&b,(w&=15)&&(p<w&&(c+=z[n++]<<p,p+=8),y+=c&(1<<w)-1,c>>>=w,p-=w),p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=_[c&v];r:for(;;){if(c>>>=w=b>>>24,p-=w,!(16&(w=b>>>16&255))){if(0==(64&w)){b=_[(65535&b)+(c&(1<<w)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&b,p<(w&=15)&&(c+=z[n++]<<p,(p+=8)<w&&(c+=z[n++]<<p,p+=8)),u<(k+=c&(1<<w)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(c>>>=w,p-=w,(w=s-a)<k){if(f<(w=k-w)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=d,(x=0)===l){if(x+=h-w,w<y){for(y-=w;C[s++]=d[x++],--w;);x=s-k,S=C;}}else if(l<w){if(x+=h+l-w,(w-=l)<y){for(y-=w;C[s++]=d[x++],--w;);if(x=0,l<y){for(y-=w=l;C[s++]=d[x++],--w;);x=s-k,S=C;}}}else if(x+=l-w,w<y){for(y-=w;C[s++]=d[x++],--w;);x=s-k,S=C;}for(;2<y;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],y-=3;y&&(C[s++]=S[x++],1<y&&(C[s++]=S[x++]));}else {for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(y-=3););y&&(C[s++]=C[x++],1<y&&(C[s++]=C[x++]));}break}}break}}while(n<i&&s<o);n-=y=p>>3,c&=(1<<(p-=y<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p;};},{}],49:[function(e,t,r){var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function u(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function h(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=u(e,t))!==N&&(e.state=null),r):U}var f,l,d=!0;function j(e){if(d){var t;for(f=new I.Buf32(512),l=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,f,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,l,0,e.work,{bits:5}),d=!1;}e.lencode=f,e.lenbits=9,e.distcode=l,e.distbits=5;}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=u,r.inflateResetKeep=a,r.inflateInit=function(e){return h(e,15)},r.inflateInit2=h,r.inflate=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,l=o,d=u,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(2&r.wrap&&35615===h){E[r.check=0]=255&h,E[1]=h>>>8&255,r.check=B(r.check,E,2,0),f=h=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&h)){e.msg="unknown compression method",r.mode=30;break}if(f-=4,k=8+(15&(h>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&h?10:12,f=h=0;break;case 2:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(r.flags=h,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=h>>8&1),512&r.flags&&(E[0]=255&h,E[1]=h>>>8&255,r.check=B(r.check,E,2,0)),f=h=0,r.mode=3;case 3:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.head&&(r.head.time=h),512&r.flags&&(E[0]=255&h,E[1]=h>>>8&255,E[2]=h>>>16&255,E[3]=h>>>24&255,r.check=B(r.check,E,4,0)),f=h=0,r.mode=4;case 4:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.head&&(r.head.xflags=255&h,r.head.os=h>>8),512&r.flags&&(E[0]=255&h,E[1]=h>>>8&255,r.check=B(r.check,E,2,0)),f=h=0,r.mode=5;case 5:if(1024&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.length=h,r.head&&(r.head.extra_len=h),512&r.flags&&(E[0]=255&h,E[1]=h>>>8&255,r.check=B(r.check,E,2,0)),f=h=0;}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,c,k)),512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,r.length-=c),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(h!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}f=h=0;}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}e.adler=r.check=L(h),f=h=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){h>>>=7&f,f-=7&f,r.mode=27;break}for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}switch(r.last=1&h,f-=1,3&(h>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;h>>>=2,f-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30;}h>>>=2,f-=2;break;case 14:for(h>>>=7&f,f-=7&f;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if((65535&h)!=(h>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&h,f=h=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),u<c&&(c=u),0===c)break e;I.arraySet(i,n,s,c,a),o-=c,s+=c,u-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;f<14;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(r.nlen=257+(31&h),h>>>=5,f-=5,r.ndist=1+(31&h),h>>>=5,f-=5,r.ncode=4+(15&h),h>>>=4,f-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.lens[A[r.have++]]=7&h,h>>>=3,f-=3;}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&C,!((_=C>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(v<16)h>>>=_,f-=_,r.lens[r.have++]=v;else {if(16===v){for(z=_+2;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(h>>>=_,f-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&h),h>>>=2,f-=2;}else if(17===v){for(z=_+3;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}f-=_,k=0,c=3+(7&(h>>>=_)),h>>>=3,f-=3;}else {for(z=_+7;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}f-=_,k=0,c=11+(127&(h>>>=_)),h>>>=7,f-=7;}if(r.have+c>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k;}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=u){e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,R(e,d),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&C,!((_=C>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(g&&0==(240&g)){for(b=_,w=g,y=v;g=(C=r.lencode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&C,!(b+(_=C>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}h>>>=b,f-=b,r.back+=b;}if(h>>>=_,f-=_,r.back+=_,r.length=v,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.length+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra;}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[h&(1<<r.distbits)-1])>>>16&255,v=65535&C,!((_=C>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(0==(240&g)){for(b=_,w=g,y=v;g=(C=r.distcode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&C,!(b+(_=C>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}h>>>=b,f-=b,r.back+=b;}if(h>>>=_,f-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=v,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}r.offset+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra;}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===u)break e;if(c=d-u,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window;}else m=i,p=a-r.offset,c=r.length;for(u<c&&(c=u),u-=c,r.length-=c;i[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===u)break e;i[a++]=r.length,u--,r.mode=21;break;case 27:if(r.wrap){for(;f<32;){if(0===o)break e;o--,h|=n[s++]<<f,f+=8;}if(d-=u,e.total_out+=d,r.total+=d,d&&(e.adler=r.check=r.flags?B(r.check,i,d,a-d):O(r.check,i,d,a-d)),d=u,(r.flags?h:L(h))!==r.check){e.msg="incorrect data check",r.mode=30;break}f=h=0;}r.mode=28;case 28:if(r.wrap&&r.flags){for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8;}if(h!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}f=h=0;}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,(r.wsize||d!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,d-e.avail_out)?(r.mode=31,-4):(l-=e.avail_in,d-=e.avail_out,e.total_in+=l,e.total_out+=d,r.total+=d,r.wrap&&d&&(e.adler=r.check=r.flags?B(r.check,i,d,e.next_out-d):O(r.check,i,d,e.next_out-d)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==l&&0===d||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var u,h,f,l,d,c,p,m,_,g=o.bits,v=0,b=0,w=0,y=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(v=0;v<=15;v++)O[v]=0;for(b=0;b<n;b++)O[t[r+b]]++;for(k=g,y=15;1<=y&&0===O[y];y--);if(y<k&&(k=y),0===y)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(w=1;w<y&&0===O[w];w++);for(k<w&&(k=w),v=z=1;v<=15;v++)if(z<<=1,(z-=O[v])<0)return -1;if(0<z&&(0===e||1!==y))return -1;for(B[1]=0,v=1;v<15;v++)B[v+1]=B[v]+O[v];for(b=0;b<n;b++)0!==t[r+b]&&(a[B[t[r+b]]++]=b);if(c=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),v=w,d=s,S=b=E=0,f=-1,l=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=v-S,_=a[b]<c?(m=0,a[b]):a[b]>c?(m=R[T+a[b]],A[I+a[b]]):(m=96,0),u=1<<v-S,w=h=1<<x;i[d+(E>>S)+(h-=u)]=p<<24|m<<16|_|0,0!==h;);for(u=1<<v-1;E&u;)u>>=1;if(0!==u?(E&=u-1,E+=u):E=0,b++,0==--O[v]){if(v===y)break;v=t[r+a[b]];}if(k<v&&(E&l)!==f){for(0===S&&(S=k),d+=w,z=1<<(x=v-S);x+S<y&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[f=E&l]=k<<24|x<<16|d-s|0;}}return 0!==E&&(i[d+E]=v-S<<24|64<<16|0),o.bits=k,0};},{"../utils/common":41}],51:[function(e,t,r){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],52:[function(e,t,r){var o=e("../utils/common");function n(e){for(var t=e.length;0<=--t;)e[t]=0;}var _=15,i=16,u=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],h=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],f=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],l=new Array(576);n(l);var d=new Array(60);n(d);var c=new Array(512);n(c);var p=new Array(256);n(p);var m=new Array(29);n(m);var g,v,b,w=new Array(30);function y(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length;}function s(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t;}function k(e){return e<256?c[e]:c[256+(e>>>7)]}function x(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255;}function S(e,t,r){e.bi_valid>i-r?(e.bi_buf|=t<<e.bi_valid&65535,x(e,e.bi_buf),e.bi_buf=t>>i-e.bi_valid,e.bi_valid+=r-i):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r);}function z(e,t,r){S(e,r[2*t],r[2*t+1]);}function C(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function E(e,t,r){var n,i,s=new Array(_+1),a=0;for(n=1;n<=_;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=C(s[o]++,o));}}function A(e){var t;for(t=0;t<286;t++)e.dyn_ltree[2*t]=0;for(t=0;t<30;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0;}function I(e){8<e.bi_valid?x(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0;}function O(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function B(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&O(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!O(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n;}function R(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?z(e,i,t):(z(e,(s=p[i])+256+1,t),0!==(a=u[s])&&S(e,i-=m[s],a),z(e,s=k(--n),r),0!==(a=h[s])&&S(e,n-=w[s],a)),o<e.last_lit;);z(e,256,t);}function T(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,u=t.stat_desc.elems,h=-1;for(e.heap_len=0,e.heap_max=573,r=0;r<u;r++)0!==s[2*r]?(e.heap[++e.heap_len]=h=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=h<2?++h:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=h,r=e.heap_len>>1;1<=r;r--)B(e,s,r);for(i=u;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],B(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,B(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,u=t.dyn_tree,h=t.max_code,f=t.stat_desc.static_tree,l=t.stat_desc.has_stree,d=t.stat_desc.extra_bits,c=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=_;s++)e.bl_count[s]=0;for(u[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<573;r++)p<(s=u[2*u[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),u[2*n+1]=s,h<n||(e.bl_count[s]++,a=0,c<=n&&(a=d[n-c]),o=u[2*n],e.opt_len+=o*(s+a),l&&(e.static_len+=o*(f[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2;}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)h<(i=e.heap[--r])||(u[2*i+1]!==s&&(e.opt_len+=(s-u[2*i+1])*u[2*i],u[2*i+1]=s),n--);}}(e,t),E(s,h,e.bl_count);}function D(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<u&&i===a||(o<h?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[32]++):o<=10?e.bl_tree[34]++:e.bl_tree[36]++,s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4));}function F(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<u&&i===a)){if(o<h)for(;z(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(z(e,i,e.bl_tree),o--),z(e,16,e.bl_tree),S(e,o-3,2)):o<=10?(z(e,17,e.bl_tree),S(e,o-3,3)):(z(e,18,e.bl_tree),S(e,o-11,7));s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4);}}n(w);var N=!1;function U(e,t,r,n){var i,s,a;S(e,0+(n?1:0),3),s=t,a=r,I(i=e),x(i,a),x(i,~a),o.arraySet(i.pending_buf,i.window,s,a,i.pending),i.pending+=a;}r._tr_init=function(e){N||(function(){var e,t,r,n,i,s=new Array(_+1);for(n=r=0;n<28;n++)for(m[n]=r,e=0;e<1<<u[n];e++)p[r++]=n;for(p[r-1]=n,n=i=0;n<16;n++)for(w[n]=i,e=0;e<1<<h[n];e++)c[i++]=n;for(i>>=7;n<30;n++)for(w[n]=i<<7,e=0;e<1<<h[n]-7;e++)c[256+i++]=n;for(t=0;t<=_;t++)s[t]=0;for(e=0;e<=143;)l[2*e+1]=8,e++,s[8]++;for(;e<=255;)l[2*e+1]=9,e++,s[9]++;for(;e<=279;)l[2*e+1]=7,e++,s[7]++;for(;e<=287;)l[2*e+1]=8,e++,s[8]++;for(E(l,287,s),e=0;e<30;e++)d[2*e+1]=5,d[2*e]=C(e,5);g=new y(l,u,257,286,_),v=new y(d,h,0,30,_),b=new y(new Array(0),a,0,19,7);}(),N=!0),e.l_desc=new s(e.dyn_ltree,g),e.d_desc=new s(e.dyn_dtree,v),e.bl_desc=new s(e.bl_tree,b),e.bi_buf=0,e.bi_valid=0,A(e);},r._tr_stored_block=U,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<256;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),T(e,e.l_desc),T(e,e.d_desc),a=function(e){var t;for(D(e,e.dyn_ltree,e.l_desc.max_code),D(e,e.dyn_dtree,e.d_desc.max_code),T(e,e.bl_desc),t=18;3<=t&&0===e.bl_tree[2*f[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?U(e,t,r,n):4===e.strategy||s===i?(S(e,2+(n?1:0),3),R(e,l,d)):(S(e,4+(n?1:0),3),function(e,t,r,n){var i;for(S(e,t-257,5),S(e,r-1,5),S(e,n-4,4),i=0;i<n;i++)S(e,e.bl_tree[2*f[i]+1],3);F(e,e.dyn_ltree,t-1),F(e,e.dyn_dtree,r-1);}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),R(e,e.dyn_ltree,e.dyn_dtree)),A(e),n&&I(e);},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(p[r]+256+1)]++,e.dyn_dtree[2*k(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){var t;S(e,2,3),z(e,256,l),16===(t=e).bi_valid?(x(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8);};},{"../utils/common":41}],53:[function(e,t,r){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],54:[function(e,t,r){t.exports="function"==typeof setImmediate?setImmediate:function(){var e=[].slice.apply(arguments);e.splice(1,0,0),setTimeout.apply(null,e);};},{}]},{},[10])(10)});}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[1])(1)});}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[1])(1)});}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[1])(1)});}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}]},{},[1])(1)});
    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{}]},{},[1])(1)
    });
    });

    var SspkgLoader = /** @class */ (function () {
        function SspkgLoader() {
        }
        SspkgLoader.prototype.load = function (url, onFinishCallback) {
            fetch(url)
                .then(function (response) {
                if (response.status === 200 || response.status === 0) {
                    return Promise.resolve(response.blob());
                }
                else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
                .then(jszip.loadAsync)
                .then(function (zipFile) {
                console.log(zipFile);
                var ssfbFilePath = null;
                var imageBinaryMap = {};
                var _loop_1 = function (fileName) {
                    var file = zipFile.files[fileName];
                    var fileExtension = fileName.split('.').pop();
                    console.log(fileName, file, fileExtension);
                    if (fileExtension === 'ssfb') {
                        if (ssfbFilePath !== null) {
                            // 既に ssfb が存在していた場合、エラー
                            onFinishCallback(null, null, new Error('already exist ssfb file'));
                            return { value: void 0 };
                        }
                        ssfbFilePath = fileName;
                    }
                    else if (fileExtension === 'png') {
                        var imageName_1 = fileName.split('.').slice(0, -1).join('.');
                        zipFile.file(fileName).async('uint8array').then(function (uint8Array) {
                            imageBinaryMap[imageName_1] = uint8Array;
                        });
                    }
                };
                for (var fileName in zipFile.files) {
                    var state_1 = _loop_1(fileName);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                // self.spriteStudioWebPlayer.setImageBinaryMap(imageBinaryMap);
                zipFile.file(ssfbFilePath).async('uint8array').then(function (uint8Array) {
                    onFinishCallback(uint8Array, imageBinaryMap, null);
                });
            }, function error(e) {
                console.log(e);
                onFinishCallback(null, null, e);
            });
        };
        return SspkgLoader;
    }());

    var SsfbDataUtil = /** @class */ (function () {
        function SsfbDataUtil() {
        }
        SsfbDataUtil.createAnimePackMap = function (ss6project) {
            var animePacksLength = ss6project.fbObj.animePacksLength();
            // console.log('animePacksLength', animePacksLength);
            var animePackMap = {};
            for (var packIndex = 0; packIndex < animePacksLength; packIndex++) {
                var animePack = ss6project.fbObj.animePacks(packIndex);
                var animePackName = animePack.name();
                // console.log(animePackName);
                var animationMap = [];
                var animationsLength = animePack.animationsLength();
                for (var animeIndex = 0; animeIndex < animationsLength; animeIndex++) {
                    var animation = animePack.animations(animeIndex);
                    var animationName = animation.name();
                    if (animationName === 'Setup') {
                        continue;
                    }
                    animationMap[animationName] = animation;
                }
                var partsCount = animePack.partsLength();
                animePackMap[animePackName] = {
                    animePack: animePack,
                    animationMap: animationMap,
                    parts_count: partsCount
                };
            }
            return animePackMap;
        };
        return SsfbDataUtil;
    }());

    var PREVIEW_POSITION_MARGIN = 30;
    var Player = /** @class */ (function () {
        function Player(canvasWrapperElement) {
            this.textureMap = null;
            this.animePackMap = null;
            this.pixiApplication = null;
            this.canvasWidth = null;
            this.canvasHeight = null;
            this.mainContainer = null;
            this.textureContainer = null;
            this.currentAnimePack = null;
            this.currentAnimation = null;
            this.onUserDataCallback = null;
            this.playEndCallback = null;
            this.onUpdateCallback = null;
            this.onPlayStateChangeCallback = null;
            this.frameDataMap = null;
            this.canvasWidth = canvasWrapperElement.clientWidth;
            this.canvasHeight = canvasWrapperElement.clientHeight;
            var pixiApplication = new PIXI.Application({ width: this.canvasWidth, height: this.canvasHeight, transparent: true });
            var canvasElement = pixiApplication.view;
            canvasWrapperElement.appendChild(canvasElement);
            var mainContainer = new MainContainer();
            pixiApplication.stage.addChild(mainContainer);
            this.mainContainer = mainContainer;
            this.pixiApplication = pixiApplication;
        }
        Player.prototype.getAnimePackMap = function () {
            return this.animePackMap;
        };
        Player.prototype.getCurrentAnimePack = function () {
            return this.currentAnimePack;
        };
        Player.prototype.getCurrentAnimation = function () {
            return this.currentAnimation;
        };
        Player.prototype.getFrameDataMap = function () {
            return this.frameDataMap;
        };
        Player.prototype.getTextureContainer = function () {
            // console.log('SpriteStudioWebPlayer.createPlayer');
            return this.textureContainer;
        };
        /**
         * Download ssfb file and dependencies image files, and load.
         * @param {string} url
         */
        Player.prototype.loadSsfb = function (url) {
            var self = this;
            var ss6Project = new SS6Project(url, function () {
                self.setupForLoadComplete(ss6Project);
            });
        };
        /**
         * Download sspkg file, decompress sspkg and load.
         * @param {string} url
         */
        Player.prototype.loadSspkg = function (url) {
            var self = this;
            var sspkgLoader = new SspkgLoader();
            sspkgLoader.load(url, function (ssfbFileData, imageBinaryMap, error) {
                if (error !== null) {
                    return;
                }
                var ss6Project = new SS6Project(ssfbFileData, imageBinaryMap, function () {
                    self.setupForLoadComplete(ss6Project);
                });
            });
        };
        Player.prototype.setupForLoadComplete = function (ss6Project) {
            this.projectData = ss6Project;
            this.textureMap = {};
            for (var imageName in ss6Project.resources) {
                var resource = ss6Project.resources[imageName];
                this.textureMap[imageName] = resource.texture;
            }
            this.animePackMap = SsfbDataUtil.createAnimePackMap(this.projectData);
            // console.log('setupForLoadComplete', this.animePackMap);
            if (this.onComplete !== null) {
                this.onComplete();
            }
        };
        /**
         * アニメーションを再生する
         * @param animePackName アニメパック名
         * @param animeName アニメーション名
         */
        Player.prototype.loadAnimation = function (animePackName, animeName) {
            var isSetupTextureContainer = false;
            if (this.textureContainer == null) {
                isSetupTextureContainer = true;
                this.textureContainer = new AnimationContainer(this);
            }
            // animePackMap から animation の情報を取得
            var animePackData = this.animePackMap[animePackName];
            var animePack = animePackData.animePack;
            var animationMap = animePackData.animationMap;
            var animation = animationMap[animeName];
            // currentAnimePack, currentAnimation を記録
            this.currentAnimation = animation;
            this.currentAnimePack = animePack;
            // textureContainer にて Animation を再生
            this.textureContainer.Setup(animePackName, animeName);
            // ラベルデータの取得
            var labelDataLength = animation.labelDataLength();
            // console.log('labelDataLength', labelDataLength);
            for (var i = 0; i < labelDataLength; i++) {
                animation.labelData(i);
            }
            if (isSetupTextureContainer) {
                this.mainContainer.addChild(this.textureContainer);
            }
            // 現状のアニメーションからポジション設定を取得し、 setPosition を行う
            // デフォルトのポジションを設定
            this.setupDefaultPosition();
            // 現状のアニメーションからサイズ設定を取得し、 setDefaultScaleRatio を行う
            // スケール値自動調整
            this.setupDefaultScaleRatio();
            // FrameDataの情報を取得
            this.frameDataMap = this.getCurrentAnimationFrameDataMap();
        };
        Player.prototype.play = function () {
            this.textureContainer.Play();
        };
        Player.prototype.pause = function () {
            this.textureContainer.Pause();
        };
        Player.prototype.stop = function () {
            this.textureContainer.Stop();
        };
        Player.prototype.resume = function () {
            this.textureContainer.Resume();
        };
        Player.prototype.movePosition = function (movementX, movementY) {
            this.mainContainer.movePosition(movementX, movementY);
        };
        Player.prototype.zoom = function (zoomPercent) {
            this.mainContainer.zoom(zoomPercent);
        };
        Player.prototype.zoomIn = function () {
            this.mainContainer.zoomIn();
        };
        Player.prototype.zoomOut = function () {
            this.mainContainer.zoomOut();
        };
        Player.prototype.switchGridDisplay = function () {
            this.mainContainer.switchGridDisplay();
        };
        Player.prototype.setFrame = function (frameNumber) {
            this.textureContainer.SetFrame(frameNumber);
        };
        Player.prototype.nextFrame = function () {
            // console.log('nextFrame');
            this.textureContainer.NextFrame();
        };
        Player.prototype.prevFrame = function () {
            this.textureContainer.PrevFrame();
        };
        Object.defineProperty(Player.prototype, "startFrame", {
            get: function () {
                return this.currentAnimation.startFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "endFrame", {
            get: function () {
                return this.currentAnimation.endFrames();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "totalFrame", {
            get: function () {
                return this.currentAnimation.totalFrames();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fps", {
            get: function () {
                return this.currentAnimation.fps();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "frameNo", {
            get: function () {
                return this.textureContainer.frameNo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isPlaying", {
            get: function () {
                return this.textureContainer.isPlaying;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isPausing", {
            get: function () {
                return this.textureContainer.isPausing;
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.setAnimationSpeed = function (value) {
            this.textureContainer.SetAnimationSpeed(value);
        };
        Player.prototype.switchLoop = function (isInfinity) {
            this.textureContainer.loop = (isInfinity) ? -1 : 1;
        };
        Player.prototype.setAnimationSection = function (_startframe, _endframe, _loops) {
            if (_startframe === void 0) { _startframe = -1; }
            if (_endframe === void 0) { _endframe = -1; }
            if (_loops === void 0) { _loops = -1; }
            this.textureContainer.SetAnimationSection(_startframe, _endframe, _loops);
        };
        /**
         * デフォルトのポジションを設定する
         */
        Player.prototype.setupDefaultPosition = function () {
            var currentAnimation = this.currentAnimation;
            // ポジション設定
            var canvasPvotX = currentAnimation.canvasPvotX();
            var canvasPvotY = currentAnimation.canvasPvotY();
            var positionX;
            switch (canvasPvotX) {
                case 0.5:
                    positionX = PREVIEW_POSITION_MARGIN;
                    break;
                case 0:
                    positionX = this.canvasWidth * 0.5;
                    break;
                case -0.5:
                    positionX = this.canvasWidth - PREVIEW_POSITION_MARGIN;
                    break;
            }
            var positionY;
            switch (canvasPvotY) {
                case 0.5:
                    positionY = PREVIEW_POSITION_MARGIN;
                    break;
                case 0:
                    positionY = this.canvasHeight * 0.5;
                    break;
                case -0.5:
                    positionY = this.canvasHeight - PREVIEW_POSITION_MARGIN;
            }
            this.mainContainer.setPosition(positionX, positionY);
        };
        /**
         * デフォルトのスケール率を設定
         */
        Player.prototype.setupDefaultScaleRatio = function () {
            var currentAnimation = this.currentAnimation;
            var playerHeight = currentAnimation.canvasSizeH();
            var playerWidth = currentAnimation.canvasSizeW();
            var widthRatio = this.canvasWidth / playerWidth;
            var heightRatio = this.canvasHeight / playerHeight;
            var scaleRatio = null;
            if (widthRatio < heightRatio) {
                scaleRatio = widthRatio;
            }
            else if (heightRatio < widthRatio) {
                scaleRatio = heightRatio;
            }
            // scaleRatio *= 0.5;
            // this.spriteStudioWebPlayer.defaultScaleRatio = scaleRatio;
            this.mainContainer.setDefaultScaleRatio(scaleRatio);
            this.mainContainer.zoom(100);
        };
        Player.prototype.getCurrentAnimationFrameDataMap = function () {
            return this.textureContainer.getCurrentAnimationFrameDataMap();
        };
        return Player;
    }());

    exports.Player = Player;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
