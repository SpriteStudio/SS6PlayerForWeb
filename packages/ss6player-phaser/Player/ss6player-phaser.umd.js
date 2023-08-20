/**
 * -----------------------------------------------------------
 * SS6Player For Phaser v1.0.0
 *
 * Copyright(C) CRI Middleware Co., Ltd.
 * https://www.webtech.co.jp/
 * -----------------------------------------------------------
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('phaser')) :
  typeof define === 'function' && define.amd ? define(['exports', 'phaser'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ss6PlayerPhaser = {}, global.Phaser));
})(this, (function (exports, Phaser) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var Phaser__namespace = /*#__PURE__*/_interopNamespaceDefault(Phaser);

  class SS6PlayerPlugin extends Phaser__namespace.Plugins.ScenePlugin {
    constructor(scene, pluginManager, pluginKey) {
      super(scene, pluginManager, pluginKey);
      console.log("SS6PlayerPlugin.constructor()");
    }
    boot() {
      console.log("SS6PlayerPlugin.boot()");
      var eventEmitter = this.systems.events;
      eventEmitter.once("shutdown", this.shutdown, this);
      eventEmitter.once("destroy", this.destroy, this);
      this.game.events.once("destroy", this.gameDestroy, this);
    }
    destroy() {
      console.log("SS6PlayerPlugin.destroy()");
      this.shutdown();
    }
    shutdown() {
      console.log("SS6PlayerPlugin.shutdown()");
    }
    gameDestroy() {
      console.log("SS6PlayerPlugin.gameDestroy()");
    }
  }

  class SS6PlayerGameObject extends Phaser__namespace.GameObjects.GameObject {
    constructor(scene, type) {
      super(scene, type);
    }
  }

  exports.SS6PlayerGameObject = SS6PlayerGameObject;
  exports.SS6PlayerPlugin = SS6PlayerPlugin;

}));
//# sourceMappingURL=ss6player-phaser.umd.js.map
