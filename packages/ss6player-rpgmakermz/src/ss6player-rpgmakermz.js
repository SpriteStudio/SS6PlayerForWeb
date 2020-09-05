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
 * @command play
 * @text ssfb再生
 * @desc ssfbを再生します。
 *
 * @arg ssfbFile
 * @text ssfbファイルパス
 * @desc アニメーションフォルダからの相対パスで指定してください。  img/ssfb/MeshBone/Knight.ssbp.ssfb にある場合は MeshBone/Knight.ssbp.ssfb と指定してください。
 *
 * @arg animePackName
 * @text animePackName
 * @desc anime pack name
 *
 * @arg animeName
 * @text animeName
 * @desc anime name
 *
 */

import { SS6Player, SS6Project } from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";

const pluginName = "ss6player-rpgmakermz";
console.log("animationDir: " + PluginParameters.getInstance().animationDir);

PluginManager.registerCommand(pluginName, "play", args => {
  let ssfbPath = PluginParameters.getInstance().animationDir + args.ssfbFile;
  console.log("load ssfbPath: " + ssfbPath);
  let project = new SS6Project(ssfbPath, () => {
    console.log("load args.animePackName: " + args.animePackName);
    console.log("load args.animeName: " + args.animeName);
    let player = new SS6Player(project, args.animePackName, args.animeName);
  });
});

const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.apply(this, arguments);
};
