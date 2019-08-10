/// <reference types="rpgmakermv_typescript_dts" />

import { SS6Player, SS6Project } from 'ss6player-pixi';

let parameters = PluginManager.parameters('HelloWorld');

const SSDUMMY: string = '__ssdummy__';

enum SCENE_MARK {
  all,
  map,
  battle
}

class SS6PlayerForRPGMakerMV {

  private _project: SS6Project;
  private _player: SS6Player;

  // parameter
  private _x: number = 0;
  private _y: number = 0;
  private _scaleX: number = 100;
  private _scaleY: number = 100;
  private _opacity: number = 255;
  private _blendMode: number = 0;
  private _loop: number = 0;
  private _step: number = 1;
  private _scene: SCENE_MARK = null;

  private _targetX: number;
  private _targetY: number;
  private _targetScaleX: number;
  private _targetScaleY: number;
  private _targetOpacity: number;
  private _duration: number;

  constructor() {
  }

  initTarget() {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
  }

  loadAnimation(fileName: string, animePack: string, animeName: string, ) {

  }

  // アニメーションデータを別ページに変更
  changeAnimation(params: string[]) {
  }

  // 移動パラメータの追加
  move(params: any) {
    this._targetX = params.x;
    this._targetY = params.y;
    this._targetScaleX = params.scaleX;
    this._targetScaleY = params.scaleY;
    this._targetOpacity = params.opacity;
    this._blendMode = params.blend;
    this._duration = params.duration;
    this._loop = params.loop;
    this._step = params.speed;
  }

  update() {
    this._player.Update(0 /* unused */);
  }

  // 現在のシーンをセット
  setScene(params: any[]) {
    /*
    if (params instanceof SSP4MV.SsPlayerArguments && params.showInAllScene) {
      this._scene = SsPlayer.SCENE_MARK.all;
    } else if ($gameParty.inBattle()) {
      this._scene = SsPlayer.SCENE_MARK.battle;
    } else {
      this._scene = SsPlayer.SCENE_MARK.map;
    }
     */
  }

  // 特定のシーンでアニメーションを表示できるか
  isShowableInMap() {
    return (this._scene === SCENE_MARK.all || this._scene === SCENE_MARK.map);
  }

  isShowableInBattle() {
    return (this._scene === SCENE_MARK.all || this._scene === SCENE_MARK.battle);
  }

}

class SS6PFMVManager {
  private _players: {[key: string]: SS6PlayerForRPGMakerMV} = {};
  constructor() {

  }

  getSsSprites(): SS6PlayerForRPGMakerMV[] {
    // TODO: impl
    let array: SS6PlayerForRPGMakerMV[] = [];
    array[0] = new SS6PlayerForRPGMakerMV();
    return array;
  }

  removeSsPlayerByLabel(s: string) {
    // TODO: impl
  }

  getSsPlayerByLabel(s: string): SS6PlayerForRPGMakerMV {
    // TODO: impl
    return new SS6PlayerForRPGMakerMV();
  }
}
let ss6pfmv = new SS6PFMVManager();

let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  _Game_Interpreter_pluginCommand.call(this, command, args);

};

// 再生完了までウェイト
let _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  // TODO:
  /*
  let waiting = false;
  if (this._waitMode === 'ssAnim') {
    waiting = true;
    let player = this._waitingSsPlayer;
    if (player.sprite) {
      if (player.sprite.getLoop() === 0) {
        waiting = false;
      } else {
        waiting = player.sprite.getAnimation() !== null;
      }
    }
    if (!waiting) {
      this._waitMode = '';
      this._waitingSsPlayer = null;
    }
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
   */
  return _Game_Interpreter_updateWaitMode.call(this);
};

let _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
Game_Screen.prototype.erasePicture = function(pictureId) {
  _Game_Screen_erasePicture.call(this, pictureId);
  ss6pfmv.removeSsPlayerByLabel(String(pictureId));
};

// SsPlayerのアップデート
let _Game_Screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
  _Game_Screen_update.call(this);
  this.checkSsPlayListDefined();
  Object.keys(this._ssPlayList).forEach(function(key) {
    // ピクチャ紐付きのアニメーションの座標は更新しない
    if (!isNaN(Number(key))) return;
    let player = this._ssPlayList[key];
    if (player instanceof SS6Player)
      player.Update(0);
  },this);
};

let _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.call(this);
  // TODO:
  /*
  let player = ss6pfmv.getSsPlayerByLabel(String(this._pictureId));
  if (!player && !this.picture()) {
    this.removeChildren();
    return;
  }
  if (player && player.sprite) {
    if (this.children.indexOf(player.sprite) < 0 && (
      ($gameParty.inBattle() && player.isShowableInBattle()) ||
      (!$gameParty.inBattle() && player.isShowableInMap())
    )) {
      this.addChild(player.sprite);
    }
  } else {
    this.removeChildren();
  }
   */
};

let _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
Sprite_Picture.prototype.loadBitmap = function() {
  if (this._pictureName === SSDUMMY) {
    this.bitmap = ImageManager.loadEmptyBitmap();
  } else {
    _Sprite_Picture_loadBitmap.call(this);
  }
};

// SpriteSet作成時にSsSpriteオブジェクトを作成
let _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
Spriteset_Base.prototype.createUpperLayer = function () {
  _Spriteset_Base_createUpperLayer.call(this);

  // SsSpriteを格納するSpriteを作成
  this._ssContainer = new Sprite();
  this.addChild(this._ssContainer);
};

// SpriteSetフレーム更新
let _Spriteset_Base_update = Spriteset_Base.prototype.update;
Spriteset_Base.prototype.update = function () {
  _Spriteset_Base_update.call(this);

  // SsPlayerの状態を監視し、SsSpriteオブジェクトを更新
  // let preparedSprites = $gameScreen.getSsSprites();
  let preparedSprites = ss6pfmv.getSsSprites();
  preparedSprites.forEach(function (sprite, index) {
    if (this._ssContainer.children.indexOf(sprite) < 0) {
      this._ssContainer.addChild(sprite);
    }
  }, this);

  this._ssContainer.children.forEach(function (sprite, index) {
    if (preparedSprites.indexOf(sprite) < 0) {
      this._ssContainer.removeChild(sprite);
    }
  }, this);
};
