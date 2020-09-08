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
 * @type dir
 *
 *
 * @command load
 * @text ssfbロード
 * @desc ssfbをと画像をロードし登録します。
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 登録する ID です。
 * @type number
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
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 利用する ssfb ID を指定してください。
 * @type number
 *
 * @arg animePackName
 * @text anime Pack Name
 * @desc 再生するアニメパック名を指定してください。 (e.g. Knight_bomb )
 * @type string
 *
 * @arg animeName
 * @text アニメ名
 * @desc 再生するアニメ名を指定してください。 (e.g. Balloon )
 * @type string
 *
 * @arg loop
 * @text 無限ループ
 * @desc 無限ループします。
 * @type boolean
 * @default false
 *
 *
 * @command wait
 * @text 再生終了待ち
 * @desc 再生中のアニメーションの再生が終わるまで待ちます。無限ループの場合は無視します。
 *
 * @arg playerId
 * @text player ID
 * @desc 停止するプレイヤー ID を指定してください。
 * @type number
 *
 *
 */

import { SS6Player, SS6Project } from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";
import {SS6ProjectManager} from './SS6ProjectManager';
import {SS6PlayerManager} from "./SS6PlayerManager";

const pluginName = "ss6player-rpgmakermz";
const ss6projectLoadWaitMode = "ss6projectLoadWait";

PluginManager.registerCommand(pluginName, "load", function(args) {
  const ssfbPath = PluginParameters.getInstance().animationDir + args.ssfbFile;

  if (SS6ProjectManager.getInstance().isExist(args.ssfbId)) {
    const existProject= SS6ProjectManager.getInstance().get(args.ssfbId);
    if (ssfbPath === existProject.ssfbPath) {
      // already loaded same project.
      return;
    }
  }
  this.setWaitMode(ss6projectLoadWaitMode);
  SS6ProjectManager.getInstance().prepare(args.ssfbId);
  let project = new SS6Project(ssfbPath, () => {
    SS6ProjectManager.getInstance().set(args.ssfbId, project);
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
  let project = SS6ProjectManager.getInstance().get(args.ssfbId);
  if (project === null) {
    console.error("not found ssfbId: " + args.ssfbId);
    return;
  }
  // console.log("load args.animePackName: " + args.animePackName);
  // console.log("load args.animeName: " + args.animeName);
  let player = new SS6Player(project, args.animePackName, args.animeName);

  SS6PlayerManager.getInstance().set(args.playerId, player);

  SceneManager._scene.addChild(player); // TODO:
  player.loop = (args.loop === "true")? -1 : 1;
/*
  player.SetPlayEndCallback(() => {
    SceneManager._scene.removeChild(player); // TODO:
  });
 */
  player.position = new PIXI.Point(240, 320); // TODO;
  player.Play();
});

PluginManager.registerCommand(pluginName, "wait", function(args) {

});

let _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  let waiting = false;
  if (this._waitMode === ss6projectLoadWaitMode) {
    // console.log("waiting " + ssfbLoadWaitMode);
    waiting = SS6ProjectManager.getInstance().isLoading();
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
}

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

