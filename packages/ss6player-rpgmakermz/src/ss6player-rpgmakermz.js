/*:
 * @target MZ
 * @plugindesc RPG ツクール MZ で動作する SS6Player プラグインです。
 * @author Web Technology Corp.
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb
 * @help SS6Player for RPGMakerMZ
 * (T.B.D)
 *
 * @param animationDir
 * @text ssfb アニメーションベースフォルダ
 * @desc ssfb のフォルダを格納するベースフォルダのパスです。
 * @default img/ssfb
 * @type string
 *
 *
 * @command load
 * @text ssfbロード
 * @desc ssfbをロードし登録します。
 *
 * @arg pictureId
 * @text picture ID
 * @desc 登録する ID です。数値で指定してください。
 * @type number
 *
 * @arg ssfbFile
 * @text ssfbファイルパス
 * @desc ssfb ファイルをアニメーションフォルダからの相対パスで指定してください。  (e.g. MeshBone/Knight.ssbp.ssfb )
 * @type string
 *
 * @arg animePackName
 * @text anime Pack Name
 * @desc ロードするアニメパック名を指定してください。 (e.g. Knight_bomb )
 * @type string
 *
 * @arg animeName
 * @text アニメ名
 * @desc ロードするアニメ名を指定してください。 (e.g. Balloon )
 * @type string
  *
 * @command play
 * @text ssfb再生
 * @desc 登録した ssfb を再生します。
  *
 * @arg pictureId
 * @text picture ID
 * @desc picture ID、数値で指定してください。
 * @type number
 *
 */

import { SS6Player, SS6Project } from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";
import {SSPlayerManager} from './SSPlayerManager';

const pluginName = "ss6player-rpgmakermz";
const ssfbLoadWaitMode = "ssfbWait";

PluginManager.registerCommand(pluginName, "load", args => {
  console.log("this.setWaitMode: " + this.setWaitMode);
  //this.setWaitMode('ssfbWait');
  const ssfbPath = PluginParameters.getInstance().animationDir + args.ssfbFile;
  console.log("load ssfbPath: " + ssfbPath);

  let project = new SS6Project(ssfbPath, () => {
    console.log("load args.animePackName: " + args.animePackName);
    console.log("load args.animeName: " + args.animeName);
    let player = new SS6Player(project, args.animePackName, args.animeName);
    SSPlayerManager.getInstance().set(args.pictureId, player);

    SceneManager._scene.addChild(player);
    player.position = new PIXI.Point(240, 320);
    player.Play();
  });
});

PluginManager.registerCommand(pluginName, "play", args => {
  let player = SSPlayerManager.getInstance().get(args.pictureId);
  if (player === null) {
    console.error("not found pictureId: " + args.pictureId);
    return;
  }
  SceneManager._scene.addChild(player);
  player.play();
});

/*
let _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  console.log("Game_Interpreter.prototype.updateWaitMode: " + this._waitMode);
  let waiting = false;
  if (this._waitMode === ssfbLoadWaitMode) {
    console.log("waiting " + ssfbLoadWaitMode);
    waiting = SSPlayerManager.getInstance().isLoaded();
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
}
 */

/*
let _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.call(this);
  var player = $gameScreen.getSsPlayerByLabel(String(this._pictureId));
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

