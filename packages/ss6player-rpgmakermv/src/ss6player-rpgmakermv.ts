/*:
 *
 * @plugindesc ss6player-rpgmakermv is a player plugin for an animation made by OPTPiX SpriteStudio 6.
 * This plug-in can be able to play animations made by OPTPiX SpriteStudio 6.
 * @author Web Technology Corp.
 *
 * @param Animation File Path
 * @desc A folder path to place animation data (ssfb/imagefile). Default value is "img/animations/ssfb".
 * @default img/animations/ssfb
 *
 *
 */

/*:ja
 *
 * @plugindesc ss6player-rpgmakermv は SpriteStudio 6 で作成されたアニメーションを再生するプレイヤープラグインです。
 * @author Web Technology Corp.
 *
 * @param アニメーションフォルダ
 * @desc アニメーションデータ (ssfb/imagefile) が設置されたフォルダのパスです。デフォルトは "img/animations/ssfb" です。
 * @default img/animations/ssfb
 */

/// <reference types="rpgmakermv_typescript_dts" />

import { SS6Player, SS6Project } from 'ss6player-pixi';

const SSDUMMY: string = '__ssdummy__';

const plugin_parameters = PluginManager.parameters('ss6player-rpgmakermv');

enum SCENE_MARK {
  all,
  map,
  battle
}

class SS6PlayerForRPGMakerMVArguments {

  // ss6player plugin parameters
  public ssfbFilePath: string = '';
  public animePackName: string = '';
  public animeName: string = '';

  // for rpg maker mv parameters
  public pictureId: string = '';
  public x = 0;
  public y = 0;
  public loop = 0;
  public scaleX = 100;
  public scaleY = 100;
  public opacity = 255;
  // public blendMode = 0;
  public speed = 1;
  public duration = 0;
  public waitForCompletion = false;
  public showInAllScene = false;

  public constructor() {
  }

  // プラグインコマンドパラメータの解釈と代入（forEachのコールバックとして使用）
  public processSsPlayerArgument(val: string) {
    let upperVal = val.toUpperCase();
    if (upperVal === '完了までウェイト' || upperVal === 'WAITFORCOMPLETION') {
      this.waitForCompletion = true;
      return;
    }
    if (upperVal === '全シーンで表示' || upperVal.toUpperCase() === 'SHOWINALLSCENES') {
      this.showInAllScene = true;
      return;
    }
    let param = val.split(':');

    switch (param[0].toUpperCase()) {
      case 'X':
        if ((/^v\[[0-9]+\]/i).test(param[1])) {
          let reg: RegExp = /^v\[([0-9]+)\]/i;
          let num: number = parseInt(reg.exec(param[1])[1], 10);
          this.x = $gameVariables.value(num);
        } else {
          this.x = Number(param[1] || 0);
        }
        break;
      case 'Y':
        if ((/^v\[[0-9]+\]/i).test(param[1])) {
          let reg: RegExp = /^v\[([0-9]+)\]/i;
          let num: number = parseInt(reg.exec(param[1])[1], 10);
          this.y = $gameVariables.value(num);
        } else {
          this.y = Number(param[1] || 0);
        }
        break;
      case 'ループ':
      case 'LOOP':
      case 'REPEAT':
        this.loop = param[1].match(/^[0-9]+/) !== null ? Number(param[1].match(/^[0-9]+/)[0]) : 0;
        break;
      case '拡大率X':
      case 'SCALEX':
        this.scaleX = Math.min(1000, Math.max(-1000, Number(param[1].match(/^-*[0-9]+/) !== null ? Number(param[1].match(/^-*[0-9]+/)[0]) : 100)));
        break;
      case '拡大率Y':
      case 'SCALEY':
        this.scaleY = Math.min(1000, Math.max(-1000, Number(param[1].match(/^-*[0-9]+/) !== null ? Number(param[1].match(/^-*[0-9]+/)[0]) : 100)));
        break;
      case '不透明度':
      case 'OPACITY':
        this.opacity = Math.min(255, Math.max(0, Number(param[1] || 255)));
        break;
/*
      case '合成方法':
      case 'BLENDTYPE':
        switch (param[1].toUpperCase()) {
          case '加算':
          case 'ADDITIVE':
          case 'ADD':
            this.blendMode = Graphics.BLEND_ADD;
            break;
          case '乗算':
          case 'SUBTRACTION':
          case 'MULTIPLY':
            this.blendMode = Graphics.BLEND_MULTIPLY;
            break;
          case 'スクリーン':
          case 'SCREEN':
            this.blendMode = Graphics.BLEND_SCREEN;
            break;
          default:
            this.blendMode = Graphics.BLEND_NORMAL;
            break;
        }
        break;
 */
      case '再生速度':
      case 'SPEED':
        this.speed = Math.min(10, Math.max(0.01, Number(param[1].match(/^[0-9]+/) !== null ? Number(param[1].match(/^[0-9]+/)[0]) : 100) / 100));
        break;
  /*
      case 'フレーム':
      case 'FRAME':
        this.duration = Math.floor(Math.max(0, Number(param[1] || 0)));
        break;
   */
    }
  }
}

/**
 * ss6player-pixi ラッパー
 */
class SS6PlayerForRPGMakerMV {

  animationDir: string = String(plugin_parameters['Animation File Path']
    || plugin_parameters['アニメーションフォルダ']
    || 'img/animations/ssas')
    + '/';

  private _project: SS6Project;
  private _ss6player: SS6Player;

  // parameter for rpgmakermv
  private _x: number = 0;
  get x(): number {
    return this._x;
  }
  private _y: number = 0;
  get y(): number {
    return this._y;
  }
  private _scaleX: number = 100;
  get scaleX(): number {
    return this._scaleX;
  }
  private _scaleY: number = 100;
  get scaleY(): number {
    return this._scaleY;
  }
  private _opacity: number = 255;
  get opacity(): number {
    return this._opacity;
  }
  private _blendMode: number = 0;
  get blendMode(): number {
    return this._blendMode;
  }
  private _loop: number = 0;
  get loop(): number {
    return this._loop;
  }
  private _step: number = 1;
  get step(): number {
    return this._step;
  }
  private _scene: SCENE_MARK = null;
  get scene(): SCENE_MARK {
    return this._scene;
  }

  private _targetX: number;
  private _targetY: number;
  private _targetScaleX: number;
  private _targetScaleY: number;
  private _targetOpacity: number;
  private _duration: number;

  private _pictureId: string;
  private _ssfbPath: string;
  private _animePackName: string;
  private _animeName: string;
  get pictureId(): string {
    return this._pictureId;
  }

  private _loadFinish: boolean = false;
  public loadFinish(): boolean {
    return this._loadFinish;
  }

  constructor(params: SS6PlayerForRPGMakerMVArguments) {
    this._pictureId = params.pictureId;
    this._ssfbPath = this.animationDir + params.ssfbFilePath;
    this._animePackName = params.animePackName;
    this._animeName = params.animeName;

    this._x = params.x;
    this._y = params.y;
    this._loop = params.loop;
    this._scaleX = params.scaleX;
    this._scaleY = params.scaleY;
    this._opacity = params.opacity;
    // this._blendMode = params.blendMode;
    this._step = params.speed;
  }

  public get ss6player(): SS6Player {
    return this._ss6player;
  }
  public set ss6player(_ss6player: SS6Player) {
    this._ss6player = _ss6player;
  }

  loadAnimation(cb: () => void, cBargs: any) {
    this._project = new SS6Project(this._ssfbPath, () => {
      this._ss6player = new SS6Player(this._project, this._animePackName, this._animeName);
      this._loadFinish = true;
      cb();
    });
  }

  initTarget() {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
  }

  // アニメーションデータを別ページに変更
  changeAnimation(params: string[]) {
  }

  // 移動パラメータの追加
  move(params: SS6PlayerForRPGMakerMVArguments) {
    this._targetX = params.x;
    this._targetY = params.y;
    this._targetScaleX = params.scaleX;
    this._targetScaleY = params.scaleY;
    this._targetOpacity = params.opacity;
    // this._blendMode = params.blendMode;
    this._duration = params.duration;
    this._loop = params.loop;
    this._step = params.speed;
  }

  update() {
    this._ss6player.Update(0 /* unused */);
  }

  // 現在のシーンをセット
  setScene(params: SS6PlayerForRPGMakerMVArguments) {
    if (params.showInAllScene) {
      this._scene = SCENE_MARK.all;
    } else if ($gameParty.inBattle()) {
      this._scene = SCENE_MARK.battle;
    } else {
      this._scene = SCENE_MARK.map;
    }
  }

  // 特定のシーンでアニメーションを表示できるか
  isShowableInMap() {
    return (this._scene === SCENE_MARK.all || this._scene === SCENE_MARK.map);
  }

  isShowableInBattle() {
    return (this._scene === SCENE_MARK.all || this._scene === SCENE_MARK.battle);
  }

  makeParamsFromCurrent(): SS6PlayerForRPGMakerMVArguments {
    let params = new SS6PlayerForRPGMakerMVArguments();
    params.x = this._x;
    params.y = this._y;
    params.scaleX = this._scaleX;
    params.scaleY = this._scaleY;
    params.opacity = this._opacity;
    // params.blendMode = this._blendMode;
    params.loop = this._loop;
    params.speed = this._step;
    return params;
  }

  static makeParamsFromPicture(player: SS6PlayerForRPGMakerMV, pictureId: number) {
    let params = new SS6PlayerForRPGMakerMVArguments();
    let picture = $gameScreen.picture(pictureId);
    params.x = picture.x();
    params.y = picture.y();
    params.scaleX = picture.scaleX();
    params.scaleY = picture.scaleY();
    params.opacity = picture.opacity();
    // params.blendMode = picture.blendMode();
    params.loop = player._loop;
    params.speed = player._step;
    return params;
  }
}

class SS6PFMVManager {
  animationDir: string = String(plugin_parameters['Animation File Path']
    || plugin_parameters['アニメーションフォルダ']
    || 'img/animations/ssfb')
    + '/';
  private _playersMap: {[key: string]: SS6PlayerForRPGMakerMV} = {};
  private _ss6playersArray: SS6Player[] = [];
  private waitForCompletion: boolean = false;
  private showInAllScene: boolean = true;
  private x: number;
  private y: number;

  private static instance: SS6PFMVManager;
  private constructor() {
  }
  public static getInstance(): SS6PFMVManager {
    if (!SS6PFMVManager.instance) {
      SS6PFMVManager.instance = new SS6PFMVManager();
    }
    return SS6PFMVManager.instance;
  }

  loadPlayer(params: SS6PlayerForRPGMakerMVArguments) {
    let player = new SS6PlayerForRPGMakerMV(params);
    player.setScene(params);
    player.loadAnimation(() => {
      let key = this.wrapPictureId(params.pictureId);
      this._playersMap[key] = player;
      this._ss6playersArray.push(player.ss6player);
      if (this.isPictureLayer(params.pictureId)) {
        // showPicture(pictureId: number, name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): void;
        $gameScreen.showPicture(Number(params.pictureId), SSDUMMY, 0,
          player.x, player.y, player.scaleX, player.scaleY, player.opacity, player.blendMode);
      }
    }, this);
  }

  getSsSprites(): SS6PlayerForRPGMakerMV[] {
    // TODO: impl
    return null;
  }

  wrapPictureId(pictureId: string): string {
    return 'ss6player_' + pictureId;
  }

  unwrapPictureId(wrappedPictureId: string): string {
    return wrappedPictureId.replace('ss6player_', '');
  }

  removeSsPlayerByPictureId(pictureId: string) {
    let player = this._playersMap[this.wrapPictureId(pictureId)];
    console.log('removeSsPlayerByPictureId ' + pictureId + ' ' + player);
    if (player !== null && player !== undefined) {
      if (player.loadFinish()) {
        player.ss6player.Stop();
        this._ss6playersArray.splice(this._ss6playersArray.indexOf(player.ss6player), 1);
        this._playersMap[pictureId] = null;
      }
    }
  }

  getSsPlayerByPictureId(pictureId: string): SS6PlayerForRPGMakerMV {
    return this._playersMap[this.wrapPictureId(pictureId)];
  }

  // SS6Player を格納する Sprite(container)
  private _container: PIXI.Sprite = new PIXI.Sprite();
  getSS6PlayerContainer() {
    return this._container;
  }

  Spriteset_Base_update(): void {
    for (let key in this._playersMap) {
      let player = this._playersMap[key];
      if (player !== null && player.ss6player !== null && player.loadFinish() === true) {
        if (player.ss6player.parent === null) {
          let child = this._container.addChild(player.ss6player);
          console.log('parent is this._container ' + (child.parent !== this._container));
          player.ss6player = child;
        }
      }
    }

    this._container.children.forEach(function (sprite, index) {
      if (this._ss6playersArray.indexOf(sprite) < 0) {
        this._container.removeChild(sprite);
      }
    }, this);

  }

  pluginCommand(command: string, args: string[]) {
    let upperCommand: string = command.toUpperCase();
    switch (upperCommand) {
      case 'SS6アニメーション再生':
      case 'PLAYSS6ANIMATION':
        this.processSsPlay(args);
        break;
      case 'SS6アニメーション移動':
      case 'MOVESS6ANIMATION':
        this.processSsMove(args);
        break;
      case 'SS6アニメーション完了までウェイト':
      case 'WAITFORCOMPLETESS6ANIMATION':
        this.processWaitForCompletion(args);
        break;
      case 'SS6アニメーション停止':
      case 'STOPSS6ANIMATION':
        this.processSsStop(args);
        break;
    }
  }

  // 全角英数字記号を半角へ変換
  // http://jquery.nj-clucker.com/change-double-byte-to-half-width/
  private toHalfWidth(strVal: string) {
    let halfVal = strVal.replace(/[！-～]/g,
      function(tmpStr) {
        return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
      }
    );
    // tslint:disable-next-line
    return halfVal.replace(/”/g, '\"').replace(/’/g, "'").replace(/‘/g, '`').replace(/￥/g, '\\').replace(/　/g, ' ').replace(/〜/g, '~');
  }

  private processSsPlay(args: string[]) {
    console.log('processSsPlay args: ' + args);
    let params = new SS6PlayerForRPGMakerMVArguments();
    if (!args[0] || !args[1] || !args[2]) {
      return;
    }

    params.ssfbFilePath = args[0];
    if (!/\.ssbp.ssfb$/i.test(params.ssfbFilePath)) {
      params.ssfbFilePath += '.ssbp.ssfb';
    }
    params.animePackName = args[1];
    params.animeName = args[2];
    params.pictureId = args[3];

    args.slice(4, args.length).forEach(params.processSsPlayerArgument, params);
    this.loadPlayer(params);
  }

  private processSsMove(args: string[]) {

  }

  private processWaitForCompletion(args: string[]) {

  }

  private processSsStop(args: string[]) {

  }

  // ピクチャレイヤー上に描画するかどうか
  private isPictureLayer(pictureId: string) {
    // ラベル名が整数かつピクチャIDの範囲内に収まっているか
    return !isNaN(Number(pictureId)) && Number(pictureId) > 0 && Number(pictureId) < $gameScreen.maxPictures();
  }
}

let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  _Game_Interpreter_pluginCommand.call(this, command, args);
  SS6PFMVManager.getInstance().pluginCommand(command, args);
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

  console.log('Game_Screen.prototype.erasePicture: pictureId: ' + pictureId);
  SS6PFMVManager.getInstance().removeSsPlayerByPictureId(String(pictureId));
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
    if (player instanceof SS6Player) {
      player.Update(0);
    }
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

  let container = SS6PFMVManager.getInstance().getSS6PlayerContainer();
  this.addChild(container);
};

// SpriteSetフレーム更新
let _Spriteset_Base_update = Spriteset_Base.prototype.update;
Spriteset_Base.prototype.update = function () {
  _Spriteset_Base_update.call(this);

  SS6PFMVManager.getInstance().Spriteset_Base_update();
};
