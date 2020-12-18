/**
 * -----------------------------------------------------------
 * SS6Player For pixi.js v1.4.0
 *
 * Copyright(C) Web Technology Corp.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ss6PlayerPixi = {}));
}(this, (function (exports) { 'use strict';

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
  var flatbuffers = {};

  /**
   * @type {number}
   * @const
   */
  flatbuffers.SIZEOF_SHORT = 2;

  /**
   * @type {number}
   * @const
   */
  flatbuffers.SIZEOF_INT = 4;

  /**
   * @type {number}
   * @const
   */
  flatbuffers.FILE_IDENTIFIER_LENGTH = 4;

  /**
   * @type {number}
   * @const
   */
  flatbuffers.SIZE_PREFIX_LENGTH = 4;

  /**
   * @enum {number}
   */
  flatbuffers.Encoding = {
    UTF8_BYTES: 1,
    UTF16_STRING: 2
  };

  /**
   * @type {Int32Array}
   * @const
   */
  flatbuffers.int32 = new Int32Array(2);

  /**
   * @type {Float32Array}
   * @const
   */
  flatbuffers.float32 = new Float32Array(flatbuffers.int32.buffer);

  /**
   * @type {Float64Array}
   * @const
   */
  flatbuffers.float64 = new Float64Array(flatbuffers.int32.buffer);

  /**
   * @type {boolean}
   * @const
   */
  flatbuffers.isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

  ////////////////////////////////////////////////////////////////////////////////

  /**
   * @constructor
   * @param {number} low
   * @param {number} high
   */
  flatbuffers.Long = function(low, high) {
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
  flatbuffers.Long.create = function(low, high) {
    // Special-case zero to avoid GC overhead for default values
    return low == 0 && high == 0 ? flatbuffers.Long.ZERO : new flatbuffers.Long(low, high);
  };

  /**
   * @returns {number}
   */
  flatbuffers.Long.prototype.toFloat64 = function() {
    return (this.low >>> 0) + this.high * 0x100000000;
  };

  /**
   * @param {flatbuffers.Long} other
   * @returns {boolean}
   */
  flatbuffers.Long.prototype.equals = function(other) {
    return this.low == other.low && this.high == other.high;
  };

  /**
   * @type {!flatbuffers.Long}
   * @const
   */
  flatbuffers.Long.ZERO = new flatbuffers.Long(0, 0);

  /// @endcond
  ////////////////////////////////////////////////////////////////////////////////
  /**
   * Create a FlatBufferBuilder.
   *
   * @constructor
   * @param {number=} opt_initial_size
   */
  flatbuffers.Builder = function(opt_initial_size) {
    if (!opt_initial_size) {
      var initial_size = 1024;
    } else {
      var initial_size = opt_initial_size;
    }

    /**
     * @type {flatbuffers.ByteBuffer}
     * @private
     */
    this.bb = flatbuffers.ByteBuffer.allocate(initial_size);

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

  flatbuffers.Builder.prototype.clear = function() {
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
  flatbuffers.Builder.prototype.forceDefaults = function(forceDefaults) {
    this.force_defaults = forceDefaults;
  };

  /**
   * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
   * called finish(). The actual data starts at the ByteBuffer's current position,
   * not necessarily at 0.
   *
   * @returns {flatbuffers.ByteBuffer}
   */
  flatbuffers.Builder.prototype.dataBuffer = function() {
    return this.bb;
  };

  /**
   * Get the bytes representing the FlatBuffer. Only call this after you've
   * called finish().
   *
   * @returns {!Uint8Array}
   */
  flatbuffers.Builder.prototype.asUint8Array = function() {
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
  flatbuffers.Builder.prototype.prep = function(size, additional_bytes) {
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
      this.bb = flatbuffers.Builder.growByteBuffer(this.bb);
      this.space += this.bb.capacity() - old_buf_size;
    }

    this.pad(align_size);
  };

  /**
   * @param {number} byte_size
   */
  flatbuffers.Builder.prototype.pad = function(byte_size) {
    for (var i = 0; i < byte_size; i++) {
      this.bb.writeInt8(--this.space, 0);
    }
  };

  /**
   * @param {number} value
   */
  flatbuffers.Builder.prototype.writeInt8 = function(value) {
    this.bb.writeInt8(this.space -= 1, value);
  };

  /**
   * @param {number} value
   */
  flatbuffers.Builder.prototype.writeInt16 = function(value) {
    this.bb.writeInt16(this.space -= 2, value);
  };

  /**
   * @param {number} value
   */
  flatbuffers.Builder.prototype.writeInt32 = function(value) {
    this.bb.writeInt32(this.space -= 4, value);
  };

  /**
   * @param {flatbuffers.Long} value
   */
  flatbuffers.Builder.prototype.writeInt64 = function(value) {
    this.bb.writeInt64(this.space -= 8, value);
  };

  /**
   * @param {number} value
   */
  flatbuffers.Builder.prototype.writeFloat32 = function(value) {
    this.bb.writeFloat32(this.space -= 4, value);
  };

  /**
   * @param {number} value
   */
  flatbuffers.Builder.prototype.writeFloat64 = function(value) {
    this.bb.writeFloat64(this.space -= 8, value);
  };
  /// @endcond

  /**
   * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {number} value The `int8` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addInt8 = function(value) {
    this.prep(1, 0);
    this.writeInt8(value);
  };

  /**
   * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {number} value The `int16` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addInt16 = function(value) {
    this.prep(2, 0);
    this.writeInt16(value);
  };

  /**
   * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {number} value The `int32` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addInt32 = function(value) {
    this.prep(4, 0);
    this.writeInt32(value);
  };

  /**
   * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {flatbuffers.Long} value The `int64` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addInt64 = function(value) {
    this.prep(8, 0);
    this.writeInt64(value);
  };

  /**
   * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {number} value The `float32` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addFloat32 = function(value) {
    this.prep(4, 0);
    this.writeFloat32(value);
  };

  /**
   * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param {number} value The `float64` to add the the buffer.
   */
  flatbuffers.Builder.prototype.addFloat64 = function(value) {
    this.prep(8, 0);
    this.writeFloat64(value);
  };

  /// @cond FLATBUFFERS_INTERNAL
  /**
   * @param {number} voffset
   * @param {number} value
   * @param {number} defaultValue
   */
  flatbuffers.Builder.prototype.addFieldInt8 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldInt16 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldInt32 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldInt64 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldFloat32 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldFloat64 = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldOffset = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.addFieldStruct = function(voffset, value, defaultValue) {
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
  flatbuffers.Builder.prototype.nested = function(obj) {
    if (obj != this.offset()) {
      throw new Error('FlatBuffers: struct must be serialized inline.');
    }
  };

  /**
   * Should not be creating any other object, string or vector
   * while an object is being constructed
   */
  flatbuffers.Builder.prototype.notNested = function() {
    if (this.isNested) {
      throw new Error('FlatBuffers: object serialization must not be nested.');
    }
  };

  /**
   * Set the current vtable at `voffset` to the current location in the buffer.
   *
   * @param {number} voffset
   */
  flatbuffers.Builder.prototype.slot = function(voffset) {
    this.vtable[voffset] = this.offset();
  };

  /**
   * @returns {flatbuffers.Offset} Offset relative to the end of the buffer.
   */
  flatbuffers.Builder.prototype.offset = function() {
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
  flatbuffers.Builder.growByteBuffer = function(bb) {
    var old_buf_size = bb.capacity();

    // Ensure we don't grow beyond what fits in an int.
    if (old_buf_size & 0xC0000000) {
      throw new Error('FlatBuffers: cannot grow buffer beyond 2 gigabytes.');
    }

    var new_buf_size = old_buf_size << 1;
    var nbb = flatbuffers.ByteBuffer.allocate(new_buf_size);
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
  flatbuffers.Builder.prototype.addOffset = function(offset) {
    this.prep(flatbuffers.SIZEOF_INT, 0); // Ensure alignment is already done.
    this.writeInt32(this.offset() - offset + flatbuffers.SIZEOF_INT);
  };

  /// @cond FLATBUFFERS_INTERNAL
  /**
   * Start encoding a new object in the buffer.  Users will not usually need to
   * call this directly. The FlatBuffers compiler will generate helper methods
   * that call this method internally.
   *
   * @param {number} numfields
   */
  flatbuffers.Builder.prototype.startObject = function(numfields) {
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
  flatbuffers.Builder.prototype.endObject = function() {
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
    var len = (trimmed_size + standard_fields) * flatbuffers.SIZEOF_SHORT;
    this.addInt16(len);

    // Search for an existing vtable that matches the current one.
    var existing_vtable = 0;
    var vt1 = this.space;
  outer_loop:
    for (i = 0; i < this.vtables.length; i++) {
      var vt2 = this.bb.capacity() - this.vtables[i];
      if (len == this.bb.readInt16(vt2)) {
        for (var j = flatbuffers.SIZEOF_SHORT; j < len; j += flatbuffers.SIZEOF_SHORT) {
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
  flatbuffers.Builder.prototype.finish = function(root_table, opt_file_identifier, opt_size_prefix) {
    var size_prefix = opt_size_prefix ? flatbuffers.SIZE_PREFIX_LENGTH : 0;
    if (opt_file_identifier) {
      var file_identifier = opt_file_identifier;
      this.prep(this.minalign, flatbuffers.SIZEOF_INT +
        flatbuffers.FILE_IDENTIFIER_LENGTH + size_prefix);
      if (file_identifier.length != flatbuffers.FILE_IDENTIFIER_LENGTH) {
        throw new Error('FlatBuffers: file identifier must be length ' +
          flatbuffers.FILE_IDENTIFIER_LENGTH);
      }
      for (var i = flatbuffers.FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
        this.writeInt8(file_identifier.charCodeAt(i));
      }
    }
    this.prep(this.minalign, flatbuffers.SIZEOF_INT + size_prefix);
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
  flatbuffers.Builder.prototype.finishSizePrefixed = function (root_table, opt_file_identifier) {
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
  flatbuffers.Builder.prototype.requiredField = function(table, field) {
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
  flatbuffers.Builder.prototype.startVector = function(elem_size, num_elems, alignment) {
    this.notNested();
    this.vector_num_elems = num_elems;
    this.prep(flatbuffers.SIZEOF_INT, elem_size * num_elems);
    this.prep(alignment, elem_size * num_elems); // Just in case alignment > int.
  };

  /**
   * Finish off the creation of an array and all its elements. The array must be
   * created with `startVector`.
   *
   * @returns {flatbuffers.Offset} The offset at which the newly created array
   * starts.
   */
  flatbuffers.Builder.prototype.endVector = function() {
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
  flatbuffers.Builder.prototype.createString = function(s) {
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
  flatbuffers.Builder.prototype.createLong = function(low, high) {
    return flatbuffers.Long.create(low, high);
  };
  ////////////////////////////////////////////////////////////////////////////////
  /// @cond FLATBUFFERS_INTERNAL
  /**
   * Create a new ByteBuffer with a given array of bytes (`Uint8Array`).
   *
   * @constructor
   * @param {Uint8Array} bytes
   */
  flatbuffers.ByteBuffer = function(bytes) {
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
  flatbuffers.ByteBuffer.allocate = function(byte_size) {
    return new flatbuffers.ByteBuffer(new Uint8Array(byte_size));
  };

  flatbuffers.ByteBuffer.prototype.clear = function() {
    this.position_ = 0;
  };

  /**
   * Get the underlying `Uint8Array`.
   *
   * @returns {Uint8Array}
   */
  flatbuffers.ByteBuffer.prototype.bytes = function() {
    return this.bytes_;
  };

  /**
   * Get the buffer's position.
   *
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.position = function() {
    return this.position_;
  };

  /**
   * Set the buffer's position.
   *
   * @param {number} position
   */
  flatbuffers.ByteBuffer.prototype.setPosition = function(position) {
    this.position_ = position;
  };

  /**
   * Get the buffer's capacity.
   *
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.capacity = function() {
    return this.bytes_.length;
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readInt8 = function(offset) {
    return this.readUint8(offset) << 24 >> 24;
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readUint8 = function(offset) {
    return this.bytes_[offset];
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readInt16 = function(offset) {
    return this.readUint16(offset) << 16 >> 16;
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readUint16 = function(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readInt32 = function(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readUint32 = function(offset) {
    return this.readInt32(offset) >>> 0;
  };

  /**
   * @param {number} offset
   * @returns {!flatbuffers.Long}
   */
  flatbuffers.ByteBuffer.prototype.readInt64 = function(offset) {
    return new flatbuffers.Long(this.readInt32(offset), this.readInt32(offset + 4));
  };

  /**
   * @param {number} offset
   * @returns {!flatbuffers.Long}
   */
  flatbuffers.ByteBuffer.prototype.readUint64 = function(offset) {
    return new flatbuffers.Long(this.readUint32(offset), this.readUint32(offset + 4));
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readFloat32 = function(offset) {
    flatbuffers.int32[0] = this.readInt32(offset);
    return flatbuffers.float32[0];
  };

  /**
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.readFloat64 = function(offset) {
    flatbuffers.int32[flatbuffers.isLittleEndian ? 0 : 1] = this.readInt32(offset);
    flatbuffers.int32[flatbuffers.isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
    return flatbuffers.float64[0];
  };

  /**
   * @param {number} offset
   * @param {number|boolean} value
   */
  flatbuffers.ByteBuffer.prototype.writeInt8 = function(offset, value) {
    this.bytes_[offset] = /** @type {number} */(value);
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeUint8 = function(offset, value) {
    this.bytes_[offset] = value;
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeInt16 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeUint16 = function(offset, value) {
      this.bytes_[offset] = value;
      this.bytes_[offset + 1] = value >> 8;
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeInt32 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeUint32 = function(offset, value) {
      this.bytes_[offset] = value;
      this.bytes_[offset + 1] = value >> 8;
      this.bytes_[offset + 2] = value >> 16;
      this.bytes_[offset + 3] = value >> 24;
  };

  /**
   * @param {number} offset
   * @param {flatbuffers.Long} value
   */
  flatbuffers.ByteBuffer.prototype.writeInt64 = function(offset, value) {
    this.writeInt32(offset, value.low);
    this.writeInt32(offset + 4, value.high);
  };

  /**
   * @param {number} offset
   * @param {flatbuffers.Long} value
   */
  flatbuffers.ByteBuffer.prototype.writeUint64 = function(offset, value) {
      this.writeUint32(offset, value.low);
      this.writeUint32(offset + 4, value.high);
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeFloat32 = function(offset, value) {
    flatbuffers.float32[0] = value;
    this.writeInt32(offset, flatbuffers.int32[0]);
  };

  /**
   * @param {number} offset
   * @param {number} value
   */
  flatbuffers.ByteBuffer.prototype.writeFloat64 = function(offset, value) {
    flatbuffers.float64[0] = value;
    this.writeInt32(offset, flatbuffers.int32[flatbuffers.isLittleEndian ? 0 : 1]);
    this.writeInt32(offset + 4, flatbuffers.int32[flatbuffers.isLittleEndian ? 1 : 0]);
  };

  /**
   * Return the file identifier.   Behavior is undefined for FlatBuffers whose
   * schema does not include a file_identifier (likely points at padding or the
   * start of a the root vtable).
   * @returns {string}
   */
  flatbuffers.ByteBuffer.prototype.getBufferIdentifier = function() {
    if (this.bytes_.length < this.position_ + flatbuffers.SIZEOF_INT +
        flatbuffers.FILE_IDENTIFIER_LENGTH) {
      throw new Error(
          'FlatBuffers: ByteBuffer is too short to contain an identifier.');
    }
    var result = "";
    for (var i = 0; i < flatbuffers.FILE_IDENTIFIER_LENGTH; i++) {
      result += String.fromCharCode(
          this.readInt8(this.position_ + flatbuffers.SIZEOF_INT + i));
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
  flatbuffers.ByteBuffer.prototype.__offset = function(bb_pos, vtable_offset) {
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
  flatbuffers.ByteBuffer.prototype.__union = function(t, offset) {
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
  flatbuffers.ByteBuffer.prototype.__string = function(offset, opt_encoding) {
    offset += this.readInt32(offset);

    var length = this.readInt32(offset);
    var result = '';
    var i = 0;

    offset += flatbuffers.SIZEOF_INT;

    if (opt_encoding === flatbuffers.Encoding.UTF8_BYTES) {
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
  flatbuffers.ByteBuffer.prototype.__indirect = function(offset) {
    return offset + this.readInt32(offset);
  };

  /**
   * Get the start of data of a vector whose offset is stored at "offset" in this object.
   *
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.__vector = function(offset) {
    return offset + this.readInt32(offset) + flatbuffers.SIZEOF_INT; // data starts after the length
  };

  /**
   * Get the length of a vector whose offset is stored at "offset" in this object.
   *
   * @param {number} offset
   * @returns {number}
   */
  flatbuffers.ByteBuffer.prototype.__vector_len = function(offset) {
    return this.readInt32(offset + this.readInt32(offset));
  };

  /**
   * @param {string} ident
   * @returns {boolean}
   */
  flatbuffers.ByteBuffer.prototype.__has_identifier = function(ident) {
    if (ident.length != flatbuffers.FILE_IDENTIFIER_LENGTH) {
      throw new Error('FlatBuffers: file identifier must be length ' +
                      flatbuffers.FILE_IDENTIFIER_LENGTH);
    }
    for (var i = 0; i < flatbuffers.FILE_IDENTIFIER_LENGTH; i++) {
      if (ident.charCodeAt(i) != this.readInt8(this.position_ + flatbuffers.SIZEOF_INT + i)) {
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
  flatbuffers.ByteBuffer.prototype.createLong = function(low, high) {
    return flatbuffers.Long.create(low, high);
  };

  /// @endcond
  /// @}

  /**
   * -----------------------------------------------------------
   * ssfblib v1.0.0
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
      var ssfb;
      (function (ssfb) {
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
          })(SsPartType = ssfb.SsPartType || (ssfb.SsPartType = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @enum {number}
   */
  (function (ss) {
      var ssfb;
      (function (ssfb) {
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
          })(PART_FLAG = ssfb.PART_FLAG || (ssfb.PART_FLAG = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @enum {number}
   */
  (function (ss) {
      var ssfb;
      (function (ssfb) {
          var PART_FLAG2;
          (function (PART_FLAG2) {
              PART_FLAG2[PART_FLAG2["MESHDATA"] = 1] = "MESHDATA";
          })(PART_FLAG2 = ssfb.PART_FLAG2 || (ssfb.PART_FLAG2 = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @enum {number}
   */
  (function (ss) {
      var ssfb;
      (function (ssfb) {
          var VERTEX_FLAG;
          (function (VERTEX_FLAG) {
              VERTEX_FLAG[VERTEX_FLAG["LT"] = 1] = "LT";
              VERTEX_FLAG[VERTEX_FLAG["RT"] = 2] = "RT";
              VERTEX_FLAG[VERTEX_FLAG["LB"] = 4] = "LB";
              VERTEX_FLAG[VERTEX_FLAG["RB"] = 8] = "RB";
              VERTEX_FLAG[VERTEX_FLAG["ONE"] = 16] = "ONE";
          })(VERTEX_FLAG = ssfb.VERTEX_FLAG || (ssfb.VERTEX_FLAG = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @enum {number}
   */
  (function (ss) {
      var ssfb;
      (function (ssfb) {
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
          })(EffectNodeBehavior = ssfb.EffectNodeBehavior || (ssfb.EffectNodeBehavior = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @enum {number}
   */
  (function (ss) {
      var ssfb;
      (function (ssfb) {
          var userDataValue;
          (function (userDataValue) {
              userDataValue[userDataValue["NONE"] = 0] = "NONE";
              userDataValue[userDataValue["userDataInteger"] = 1] = "userDataInteger";
              userDataValue[userDataValue["userDataRect"] = 2] = "userDataRect";
              userDataValue[userDataValue["userDataPoint"] = 3] = "userDataPoint";
              userDataValue[userDataValue["userDataString"] = 4] = "userDataString";
          })(userDataValue = ssfb.userDataValue || (ssfb.userDataValue = {}));
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new EffectNode).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new EffectFile).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.EffectNode).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new CellMap).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new Cell).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.CellMap).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new meshDataUV).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new meshDataIndices).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new partState).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new frameDataIndex).__init(bb.readInt32(bb.position()) + bb.position(), bb);
              };
              /**
               * @param number index
               * @param ss.ssfb.partState= obj
               * @returns ss.ssfb.partState
               */
              frameDataIndex.prototype.states = function (index, obj) {
                  var offset = this.bb.__offset(this.bb_pos, 4);
                  return offset ? (obj || new ss.ssfb.partState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new userDataString).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new userDataItem).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new userDataPerFrame).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.userDataItem).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new labelDataItem).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new AnimationData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.AnimationInitialData).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.frameDataIndex).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.userDataPerFrame).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.labelDataItem).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.meshDataUV).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.meshDataIndices).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new AnimationInitialData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new PartData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new AnimePackData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.PartData).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.AnimationData).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));
  /**
   * @constructor
   */
  (function (ss) {
      var ssfb;
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
                  return (obj || new ProjectData).__init(bb.readInt32(bb.position()) + bb.position(), bb);
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
                  return offset ? (obj || new ss.ssfb.Cell).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.AnimePackData).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
                  return offset ? (obj || new ss.ssfb.EffectFile).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
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
      })(ssfb = ss.ssfb || (ss.ssfb = {}));
  })(ss || (ss = {}));

  // import * as PIXI from 'pixi.js';
  var SS6Project = /** @class */ (function () {
      /**
       * SS6Project (used for several SS6Player(s))
       * @constructor
       * @param {string} ssfbPath - FlatBuffers file path
       * @param onComplete - callback on complete
       * @param timeout
       * @param retry
       * @param onError - callback on error
       * @param onTimeout - callback on timeout
       * @param onRetry - callback on retry
       */
      function SS6Project(ssfbPath, onComplete, timeout, retry, onError, onTimeout, onRetry) {
          if (timeout === void 0) { timeout = 0; }
          if (retry === void 0) { retry = 0; }
          if (onError === void 0) { onError = null; }
          if (onTimeout === void 0) { onTimeout = null; }
          if (onRetry === void 0) { onRetry = null; }
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
              var buf = new flatbuffers.ByteBuffer(bytes);
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
          this.isPausing = true;
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
          var toNextFrame = this._isPlaying && !this.isPausing;
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
      /**
       * アニメーション再生を開始する
       */
      SS6Player.prototype.Play = function () {
          this._isPlaying = true;
          this.isPausing = false;
          this._currentFrame = this.playDirection > 0 ? this._startFrame : this._endFrame;
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
          this.isPausing = true;
      };
      /**
       * アニメーション再生を再開する
       */
      SS6Player.prototype.Resume = function () {
          this.isPausing = false;
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
          if (this.HaveUserData(this._currentFrame) === false) {
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
                      mesh.Pause();
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

  exports.SS6Player = SS6Player;
  exports.SS6PlayerInstanceKeyParam = SS6PlayerInstanceKeyParam;
  exports.SS6Project = SS6Project;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ss6player-pixi.umd.js.map
