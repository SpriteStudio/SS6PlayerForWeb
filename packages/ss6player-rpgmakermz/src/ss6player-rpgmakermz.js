/*:
 * @target MZ
 * @plugindesc RPG ツクール MZ で動作する SS6Player プラグインです。
 * @author Web Technology Corp.
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb
 * @help SS6Player for RPG Maker MZ
 * (T.B.D)
 *
 * @param animationDir
 * @text ssfb アニメーションベースフォルダ
 * @desc ssfb のフォルダを格納するベースフォルダのパスです。
 * @type file
 * @default img/ssfb
 * @requiredAssets img/ssfb
 *
 * @command load
 * @text ssfbロード
 * @desc ssfbをと画像をロードし登録します。
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 登録する ID です。
 * @type number
 * @min 1
 *
 * @arg ssfbFile
 * @text ssfbファイルパス
 * @desc ssfb ファイルをアニメーションフォルダからの相対パスで指定してください。  (e.g. MeshBone/Knight.ssbp.ssfb )
 * @type string
 *
 *
 * @command play
 * @text ssfb再生
 * @desc アニメーションを表示し再生します。
 *
 * @arg playerId
 * @text player ID
 * @desc プレイヤーの ID を指定してください。
 * @type number
 * @min 1
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 利用する ssfb ID を指定してください。
 * @type number
 * @min 1
 *
 * @arg animePackName
 * @text アニメパック名
 * @desc 再生するアニメパック名を指定してください。 (e.g. Knight_bomb )
 * @type string
 *
 * @arg animeName
 * @text アニメ名
 * @desc 再生するアニメ名を指定してください。 (e.g. Balloon )
 * @type string
 *
 * @arg x
 * @text X座標
 * @desc X 座標を指定します。原点は中央になります。
 * @type number
 * @default 0
 *
 * @arg y
 * @text Y座標
 * @desc Y 座標を指定します。原点は中央になります。
 * @type number
 * @default 0
 *
 * @arg scale
 * @text スケール
 * @desc スケールを指定します
 * @type decimals
 * @default 1.0
 *
 * @arg waiting
 * @text 完了までウェイトする
 * @desc 再生が完了するまで待ちます。無限ループ再生の場合は false になりウェイトしません。
 * @type boolean
 * @default false
 *
 * @arg loop
 * @text 再生ループ回数
 * @desc 再生ループ回数を指定します。 -1 を指定すると無限ループで再生します。
 * @type number
 * @default 1
 * @min -1
 *
 *
 * @command stop
 * @text ssfb停止
 * @desc 再生中のアニメーションを停止し、非表示にします。
 *
 * @arg playerId
 * @text player ID
 * @desc プレイヤーの ID を指定してください。
 * @type number
 * @min 1
 *
 */

import { SS6Player, SS6Project } from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";
import {SS6ProjectManager} from './SS6ProjectManager';
import {SS6PlayerManager} from "./SS6PlayerManager";

const pluginName = "ss6player-rpgmakermz";
const ss6projectLoadWaitMode = "ss6projectLoadWait";
const ss6playerPlayWaitMode = "ss6playerPlayWaitMode";
let ss6playerPlayWaiting = false;

PluginManager.registerCommand(pluginName, "load", function(args) {
  const ssfbId = Number(args.ssfbId);
  const ssfbFile = args.ssfbFile;
  const ssfbPath = PluginParameters.getInstance().animationDir + ssfbFile;

  if (SS6ProjectManager.getInstance().isExist(ssfbId)) {
    const existProject= SS6ProjectManager.getInstance().get(ssfbId);
    if (ssfbPath === existProject.ssfbPath) {
      // already loaded same project.
      return;
    }
  }
  this.setWaitMode(ss6projectLoadWaitMode);
  SS6ProjectManager.getInstance().prepare(ssfbId);
  let project = new SS6Project(ssfbPath, () => {
    SS6ProjectManager.getInstance().set(ssfbId, project);
  },
    30, 0,
    (ssfbPath, timeout, retry, httpObj) => {
      this.setWaitMode('');
      throw httpObj;
    },
    (ssfbPath, timeout, retry, httpObj) => {
      this.setWaitMode('');
      throw httpObj;
    },
    null);
});

PluginManager.registerCommand(pluginName, "play", function(args) {
  const playerId = Number(args.playerId);
  const ssfbId = args.ssfbId;
  const animePackName = args.animePackName;
  const animeName = args.animeName;
  const x = Number(args.x) || 0;
  const y = Number(args.y) || 0;
  const scale = Number(args.scale) || 1.0;
  const waiting = Boolean(args.waiting) || false;
  const loop = Number(args.loop) || 1;

  let project = SS6ProjectManager.getInstance().get(ssfbId);
  if (project === null) {
    console.error("not found ssfbId: " + ssfbId);
    return;
  }

  // console.log("load animePackName: " + animePackName);
  // console.log("load animeName: " + animeName);
  let player = new SS6Player(project, animePackName, animeName);
  player.name = String(playerId);
  player.loop = loop;

  let sprite = new Sprite();
  sprite.addChild(player);
  sprite.position = new PIXI.Point(x, y);
  sprite.scale = new PIXI.Point(scale, scale);
  SceneManager._scene.addChild(sprite); // TODO:

  if(loop !== -1 && waiting === true) {
    this.setWaitMode(ss6playerPlayWaitMode);
    ss6playerPlayWaiting = true;
  }
  player.SetPlayEndCallback(() => {
    if(player.loop === 0) {
      ss6playerPlayWaiting = false;

      SceneManager._scene.removeChild(sprite); // TODO:
      SS6PlayerManager.getInstance().set(playerId, null);
    }
  });
  player.Play();

  if (!(loop !== -1 && waiting === true)) {
    SS6PlayerManager.getInstance().set(playerId, sprite);
  }
});

PluginManager.registerCommand(pluginName, "stop", function(args) {
  const playerId = Number(args.playerId);
  let sprite = SS6PlayerManager.getInstance().get(playerId);
  if (sprite === null) {
    console.error("not found player: " + playerId);
    return;
  }
  let player = sprite.getChildByName(String(playerId))
  SceneManager._scene.removeChild(sprite); // TODO:
  SS6PlayerManager.getInstance().set(playerId, null);
});

let _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  let waiting = false;
  if (this._waitMode === ss6projectLoadWaitMode) {
    // console.log("waiting " + ssfbLoadWaitMode);
    waiting = SS6ProjectManager.getInstance().isLoading();
  } else if (this._waitMode === ss6playerPlayWaitMode) {
    waiting = ss6playerPlayWaiting;
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
};

let _Game_Screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function () {
  SS6PlayerManager.getInstance().clear();
  SS6ProjectManager.getInstance().clear();
  _Game_Screen_clear.call(this);
};

let _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
Game_Screen.prototype.erasePicture = function(pictureId) {
  _Game_Screen_erasePicture.call(this, pictureId);
  // $gameScreen.removeSsPlayerByLabel(String(pictureId));
};



/*
let _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.call(this);
  var player = $gameScreen.getSsPlayerByLabel(String(this._ssfbId));
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
}
*/

