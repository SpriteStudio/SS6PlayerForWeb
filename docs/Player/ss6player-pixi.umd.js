/**
 * -----------------------------------------------------------
 * SS6Player For Web v1.0.0
 *
 * Copyright(C) Web Technology Corp.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ssfblib')) :
  typeof define === 'function' && define.amd ? define(['ssfblib'], factory) :
  (global = global || self, global.ss6PlayerPixi = factory(global.ssfblib));
}(this, function (ssfblib) { 'use strict';

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
              var arrayBuffer = this.response;
              var bytes = new Uint8Array(arrayBuffer);
              var buf = new flatbuffers.ByteBuffer(bytes);
              self.fbObj = ssfblib.ss.ssfb.ProjectData.getRootAsProjectData(buf);
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
              if (self.onTimeout !== null) {
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
          var loader = new PIXI.loaders.Loader();
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
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

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
          var _this = _super.call(this) || this;
          _this.animation = [];
          _this.curAnimation = null;
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
          _this.alphaBlendType = [];
          _this._uint32 = new Uint32Array(1);
          _this._float32 = new Float32Array(_this._uint32.buffer);
          _this.defaultColorFilter = new PIXI.filters.ColorMatrixFilter();
          // extends PIXI.Container
          PIXI.Container.call(_this);
          _this.ss6project = ss6project;
          _this.fbObj = _this.ss6project.fbObj;
          _this.resources = _this.ss6project.resources;
          _this.parentAlpha = 1.0;
          _this.Setup(animePackName, animeName);
          _this.alphaBlendType = _this.GetPartsBlendMode();
          _this.isPlaying = false;
          _this.isPausing = true;
          _this._startFrame = _this.curAnimation.startFrames();
          _this._endFrame = _this.curAnimation.endFrames();
          _this._currentFrame = _this.curAnimation.startFrames();
          _this.nextFrameTime = 0;
          _this._loops = -1;
          _this.skipEnabled = false;
          _this.updateInterval = 1000 / _this.curAnimation.fps();
          _this.playDirection = 1; // forward
          _this.onUserDataCallback = null;
          _this.playEndCallback = null;
          // Ticker
          _this.pastTime = 0;
          PIXI.ticker.shared.add(_this.Update, _this);
          return _this;
      }
      Object.defineProperty(SS6Player.prototype, "startFrame", {
          get: function () {
              return this._startFrame;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SS6Player.prototype, "endFrame", {
          get: function () {
              return this.curAnimation.endFrames();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SS6Player.prototype, "totalFrame", {
          get: function () {
              return this.curAnimation.totalFrames();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SS6Player.prototype, "fps", {
          get: function () {
              return this.curAnimation.fps();
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SS6Player.prototype, "frameNo", {
          get: function () {
              return this._currentFrame;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(SS6Player.prototype, "loop", {
          get: function () {
              return this._loops;
          },
          set: function (loop) {
              this._loops = loop;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * Setup
       * @param {string} animePackName - The name of animePack(SSAE).
       * @param {string} animeName - The name of animation.
       */
      SS6Player.prototype.Setup = function (animePackName, animeName) {
          var animePacksLength = this.fbObj.animePacksLength();
          for (var i = 0; i < animePacksLength; i++) {
              if (this.fbObj.animePacks(i).name() === animePackName) {
                  var j = void 0;
                  var animationsLength = this.fbObj.animePacks(i).animationsLength();
                  for (j = 0; j < animationsLength; j++) {
                      if (this.fbObj.animePacks(i).animations(j).name() === animeName) {
                          this.animation = [i, j];
                          this.curAnimation = this.fbObj.animePacks(this.animation[0]).animations(this.animation[1]);
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
                  for (j = 0; j < partsLength; j++) {
                      var index = this.fbObj.animePacks(this.parts).parts(j).index();
                      this.parentIndex[index] = this.fbObj.animePacks(i).parts(j).parentIndex();
                      // cell再利用
                      this.prevCellID[index] = -1; // 初期値（最初は必ず設定が必要）
                      this.prevMesh[index] = null;
                  }
              }
          }
      };
      /**
       * Update is called PIXI.ticker
       * @param {number} delta - expected 1
       */
      SS6Player.prototype.Update = function (delta) {
          var currentTime = Date.now();
          var elapsedTime = currentTime - this.pastTime;
          var toNextFrame = this.isPlaying && !this.isPausing;
          this.pastTime = currentTime;
          if (toNextFrame && this.updateInterval !== 0) {
              this.nextFrameTime += elapsedTime; // もっとうまいやり方がありそうなんだけど…
              if (this.nextFrameTime >= this.updateInterval) {
                  // 処理落ち対応
                  var step = Math.floor(this.nextFrameTime / this.updateInterval);
                  this.nextFrameTime -= this.updateInterval * step;
                  this._currentFrame += this.skipEnabled ? step * this.playDirection : this.playDirection;
                  // speed +
                  if (this._currentFrame > this._endFrame) {
                      this._currentFrame = this._startFrame + ((this._currentFrame - this._endFrame - 1) % (this._endFrame - this._startFrame + 1));
                      if (this._loops === -1) ;
                      else {
                          this._loops--;
                          if (this.playEndCallback !== null) {
                              this.playEndCallback(this);
                          }
                          if (this._loops === 0)
                              this.isPlaying = false;
                      }
                  }
                  // speed -
                  if (this._currentFrame < this._startFrame) {
                      this._currentFrame = this._endFrame - ((this._startFrame - this._currentFrame - 1) % (this._endFrame - this._startFrame + 1));
                      if (this._loops === -1) ;
                      else {
                          this._loops--;
                          if (this.playEndCallback !== null) {
                              this.playEndCallback(this);
                          }
                          if (this._loops === 0)
                              this.isPlaying = false;
                      }
                  }
                  this.SetFrameAnimation(this._currentFrame);
                  if (this.isPlaying) {
                      if (this.HaveUserData(this._currentFrame)) {
                          if (this.onUserDataCallback !== null) {
                              this.onUserDataCallback(this.GetUserData(this._currentFrame));
                          }
                      }
                  }
              }
          }
          else {
              this.SetFrameAnimation(this._currentFrame);
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
          this.isPlaying = true;
          this.isPausing = false;
          this._currentFrame = this._startFrame;
          this.pastTime = Date.now();
          this.SetFrameAnimation(this._currentFrame);
          if (this.HaveUserData(this._currentFrame)) {
              if (this.onUserDataCallback !== null) {
                  this.onUserDataCallback(this.GetUserData(this._currentFrame));
              }
          }
          var layers = this.curAnimation.defaultDataLength();
          for (var i = 0; i < layers; i++) {
              this.liveFrame[i] = 0;
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
          this.isPlaying = false;
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
                  d_int = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataInteger()).integer();
                  id++;
              }
              if (bit & 2) {
                  // rect
                  d_rect_x = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataRect()).x();
                  d_rect_y = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataRect()).y();
                  d_rect_w = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataRect()).w();
                  d_rect_h = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataRect()).h();
                  id++;
              }
              if (bit & 4) {
                  // pos
                  d_pos_x = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataPoint()).x();
                  d_pos_y = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataPoint()).y();
                  id++;
              }
              if (bit & 8) {
                  // string
                  d_string_length = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataString()).length();
                  d_string = framedata.data(i).data(id, new ssfblib.ss.ssfb.userDataString()).data();
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
              fd.flag1L = f1 & 0x0000ffff;
              fd.flag1H = f1 >>> 16;
              fd.flag2L = f2 & 0x0000ffff;
              fd.flag2H = f2 >>> 16;
              // フラグによってid（バイナリ内の参照位置を）をインクリメントしていくので、
              // 途中でデータがおかしい（ずれるとindexの値が巨大になる）場合はおかしくなる前のフラグを見て
              // そのアトリビュートの解析でidが正しく消費されているかを確認する
              //        console.log("[flag1L:%d, i=%d", fd.flag1L, i);
              //        console.log("[flag1H:%d, i=%d", fd.flag1H, i);
              //        console.log("[flag2L:%d, i=%d", fd.flag2L, i);
              //        console.log("[flag2H:%d, i=%d", fd.flag2H, i);
              var id = 0;
              if (f1 & 1)
                  fd.f_hide = true;
              if (f1 & 2)
                  fd.f_flipH = true;
              if (f1 & 4)
                  fd.f_flipV = true;
              if (f1 & 8)
                  fd.cellIndex = curPartState.data(id++); // 8 Cell ID
              if (f1 & 16)
                  fd.positionX = this.I2F(curPartState.data(id++));
              if (f1 & 32)
                  fd.positionY = this.I2F(curPartState.data(id++));
              if (f1 & 64)
                  id++; // 64
              if (f1 & 128)
                  fd.pivotX = this.I2F(curPartState.data(id++)); // 128 Pivot Offset X
              if (f1 & 256)
                  fd.pivotY = this.I2F(curPartState.data(id++)); // 256 Pivot Offset Y
              if (f1 & 512)
                  id++; // 512
              if (f1 & 1024)
                  id++; // 1024
              if (f1 & 2048)
                  fd.rotationZ = this.I2F(curPartState.data(id++)); // 2048
              if (f1 & 4096)
                  fd.scaleX = this.I2F(curPartState.data(id++)); // 4096
              if (f1 & 8192)
                  fd.scaleY = this.I2F(curPartState.data(id++)); // 8192
              if (f1 & 16384)
                  fd.localscaleX = this.I2F(curPartState.data(id++)); // 16384
              if (f1 & 32768)
                  fd.localscaleY = this.I2F(curPartState.data(id++)); // 32768
              f1 = f1 >>> 16;
              if (f1 & 1)
                  fd.opacity = curPartState.data(id++); // 65536
              if (f1 & 2)
                  fd.localopacity = curPartState.data(id++); // 131072
              //
              if (f1 & 16)
                  fd.size_X = this.I2F(curPartState.data(id++)); // 1048576 Size X [1]
              if (f1 & 32)
                  fd.size_Y = this.I2F(curPartState.data(id++)); // 2097152 Size Y [1]
              if (f1 & 64)
                  fd.uv_move_X = this.I2F(curPartState.data(id++)); // 4194304 UV Move X
              if (f1 & 128)
                  fd.uv_move_Y = this.I2F(curPartState.data(id++)); // 8388608 UV Move Y
              if (f1 & 256)
                  fd.uv_rotation = this.I2F(curPartState.data(id++)); // 16777216 UV Rotation
              if (f1 & 512)
                  fd.uv_scale_X = this.I2F(curPartState.data(id++)); // 33554432 ? UV Scale X
              if (f1 & 1024)
                  fd.uv_scale_Y = this.I2F(curPartState.data(id++)); // 67108864 ? UV Scale Y
              if (f1 & 2048)
                  id++; // 134217728 boundingRadius
              if (f1 & 4096)
                  fd.masklimen = curPartState.data(id++); // 268435456 masklimen
              if (f1 & 8192)
                  fd.priority = curPartState.data(id++); // 536870912 priority
              //
              if (f1 & 16384) {
                  // 1073741824 instance keyframe
                  fd.instanceValue_curKeyframe = curPartState.data(id++);
                  fd.instanceValue_startFrame = curPartState.data(id++);
                  fd.instanceValue_endFrame = curPartState.data(id++);
                  fd.instanceValue_loopNum = curPartState.data(id++);
                  fd.instanceValue_speed = this.I2F(curPartState.data(id++));
                  fd.instanceValue_loopflag = curPartState.data(id++);
              }
              if (f1 & 32768) {
                  // 2147483648 effect keyframe
                  fd.effectValue_curKeyframe = curPartState.data(id++);
                  fd.effectValue_startTime = curPartState.data(id++);
                  fd.effectValue_speed = this.I2F(curPartState.data(id++));
                  fd.effectValue_loopflag = curPartState.data(id++);
              }
              if (f1 & 8) {
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
              if (f1 & 4) {
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
              if (f2 & 1) {
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
              flag1L: 0,
              flag1H: 0,
              flag2L: 0,
              flag2H: 0,
              partsColorARGB: 0
          };
          return data;
      };
      /**
       * １フレーム分のアニメーション描画
       * @param {number} frameNumber - フレーム番号
       */
      SS6Player.prototype.SetFrameAnimation = function (frameNumber) {
          var fd = this.GetFrameData(frameNumber);
          this.removeChildren();
          var TYPE_NORMAL = 1; // パーツ種別: 通常
          var TYPE_NULL = 0; // パーツ種別: NULL
          var TYPE_MASK = 9; // パーツ種別: マスク
          var TYPE_INSTANCE = 3; // パーツ種別: インスタンス
          var TYPE_MESH = 6; // パーツ種別: MESH
          var TYPE_JOINT = 10; // パーツ種別: JOINT
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
              // 処理分岐処理
              switch (partType) {
                  case TYPE_INSTANCE:
                      if (mesh == null) {
                          mesh = this.MakeCellPlayer(part.refname());
                      }
                      break;
                  case TYPE_NORMAL:
                  case TYPE_MASK:
                      if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                          if (mesh != null)
                              mesh.destroy();
                          mesh = this.MakeCellMesh(cellID); // (cellID, i)?
                      }
                      break;
                  case TYPE_MESH:
                      if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                          if (mesh != null)
                              mesh.destroy();
                          mesh = this.MakeMeshCellMesh(i, cellID); // (cellID, i)?
                      }
                      break;
                  case TYPE_NULL:
                  case TYPE_JOINT:
                      if (this.prevCellID[i] !== cellID) {
                          if (mesh != null)
                              mesh.destroy();
                          mesh = new PIXI.Container();
                      }
                      break;
                  default:
                      if (cellID >= 0 && this.prevCellID[i] !== cellID) {
                          // 小西 - デストロイ処理
                          if (mesh != null)
                              mesh.destroy();
                          mesh = this.MakeCellMesh(cellID); // (cellID, i)?
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
                  case TYPE_INSTANCE: {
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
                      // タイムライン上の時間 （絶対時間）
                      var time = frameNumber;
                      // 独立動作の場合
                      if (independent === true) {
                          var delta = this.updateInterval * 0.1;
                          this.liveFrame[ii] += delta;
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
                      continue;
                  }
                  //  Instance以外の通常のMeshと空のContainerで処理分岐
                  case TYPE_NORMAL:
                  case TYPE_MESH:
                  case TYPE_JOINT:
                  case TYPE_MASK: {
                      var verts = void 0;
                      if (partType === TYPE_MESH) {
                          // ボーンとのバインドの有無によって、TRSの継承行うかが決まる。
                          if (data.meshIsBind === 0) {
                              // バインドがない場合は親からのTRSを継承する
                              verts = this.TransformMeshVertsLocal(SS6Player.GetMeshVerts(cellID, data), data.index, frameNumber);
                          }
                          else {
                              // バインドがある場合は変形後の結果が出力されているので、そのままの値を使用する
                              verts = SS6Player.GetMeshVerts(cellID, data);
                          }
                      }
                      else {
                          verts = this.TransformVertsLocal(SS6Player.GetVerts(cellID, data), data.index, frameNumber);
                      }
                      // 頂点変形、パーツカラーのアトリビュートがある場合のみ行うようにしたい
                      if (data.flag1H & 8) {
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
                      if (data.flag1H & 64 || data.flag1H & 128 || (data.flag1H & 512 || data.flag1H & 1024) || data.flag1H & 256) {
                          // uv X/Y移動
                          var u1 = this.fbObj.cells(cellID).u1() + data.uv_move_X;
                          var u2 = this.fbObj.cells(cellID).u2() + data.uv_move_X;
                          var v1 = this.fbObj.cells(cellID).v1() + data.uv_move_Y;
                          var v2 = this.fbObj.cells(cellID).v2() + data.uv_move_Y;
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
                          if (data.flag1H & 256) {
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
                      var pivot = this.GetPivot(verts, cellID);
                      //
                      mesh.position.set(px + pivot.x * data.localscaleX, py + pivot.y * data.localscaleY);
                      mesh.scale.set(data.localscaleX, data.localscaleY);
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
                      if (partType !== TYPE_MASK)
                          this.addChild(mesh);
                      break;
                  }
                  case TYPE_NULL: {
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
       * 矩形セルの中心(0,1)から、X軸方向：右下(4,5)-左下(2,3)、Y軸方向：左上（6,7）-左下(2,3)の座標系でpivot分ずらした座標
       * @param {array} verts - 頂点情報配列
       * @param {number} cellID - セルID
       * @return {PIXI.Point} - 座標
       */
      SS6Player.prototype.GetPivot = function (verts, cellID) {
          var cell = this.fbObj.cells(cellID);
          var px = cell.pivotX();
          var py = cell.pivotY();
          // const dx = new PIXI.Point(verts[4] - verts[2], verts[5] - verts[3]);
          var dxX = verts[4] - verts[2];
          var dxY = verts[5] - verts[3];
          // const dy = new PIXI.Point(verts[6] - verts[2], verts[7] - verts[3]);
          var dyX = verts[6] - verts[2];
          var dyY = verts[7] - verts[3];
          var p = new PIXI.Point(verts[0] - dxX * px + dyX * py, verts[1] - dxY * px + dyY * py);
          return p;
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
              x *= data.scaleX;
              y *= data.scaleY;
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
          pos[2] *= data.scaleX;
          pos[3] *= data.scaleY;
          pos[0] += data.positionX;
          pos[1] -= data.positionY;
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
          var rz = (pos[4] * Math.PI) / 180;
          pos[2] *= data.scaleX;
          pos[3] *= data.scaleY;
          pos[0] += data.positionX;
          pos[1] -= data.positionY;
          if (this.parentIndex[id] >= 0) {
              pos = this.TransformPosition(pos, this.parentIndex[id], frameNumber);
          }
          return pos;
      };
      /**
       * 矩形セルをメッシュ（5verts4Tri）で作成
       * @param {number} id - セルID
       * @return {PIXI.mesh.Mesh} - メッシュ
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
          var mesh = new PIXI.mesh.Mesh(this.resources[cell.cellMap().name()].texture, verts, uvs, indices);
          mesh.drawMode = 1; // drawMode=0は四角ポリゴン、drawMode=1は三角ポリゴン
          return mesh;
      };
      /**
       * メッシュセルからメッシュを作成
       * @param {number} partID - パーツID
       * @param {number} cellID - セルID
       * @return {PIXI.mesh.Mesh} - メッシュ
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
              var mesh = new PIXI.mesh.Mesh(this.resources[this.fbObj.cells(cellID).cellMap().name()].texture, verts, uvs, indices);
              mesh.drawMode = 1; // drawMode=0は四角ポリゴン、drawMode=1は三角ポリゴン
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
          var ssp = new SS6Player(this.ss6project, split[0], split[1]);
          ssp.Play();
          return ssp;
      };
      /**
       * 矩形セルメッシュの頂点情報のみ取得
       * @param {number} id - セルID
       * @param {array} data - アニメーションフレームデータ
       * @return {array} - 頂点情報配列
       */
      SS6Player.GetVerts = function (id, data) {
          var w = data.size_X / 2;
          var h = data.size_Y / 2;
          var px = -w * data.pivotX * 2;
          var py = h * data.pivotY * 2;
          var verts = new Float32Array([px, py, px - w, py - h, px + w, py - h, px - w, py + h, px + w, py + h]);
          return verts;
      };
      /**
       * 矩形セルメッシュの頂点情報のみ取得
       * @param {number} id - セルID
       * @param {array} data - アニメーションフレームデータ
       * @return {array} - 頂点情報配列
       */
      SS6Player.GetMeshVerts = function (id, data) {
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
      return SS6Player;
  }(PIXI.Container));

  var SpriteStudio = {
      SS6Project: SS6Project,
      SS6Player: SS6Player
  };

  return SpriteStudio;

}));
//# sourceMappingURL=ss6player-pixi.umd.js.map
