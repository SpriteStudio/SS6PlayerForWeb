
/*:
 * @target MZ
 * @plugindesc RPG ツクール MZ で動作する SS6Player プラグインです。
 * @author Web Technology
 * @help
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb
 */
import { SS6Player, SS6Project } from 'ss6player-pixi';

const pluginName = "SS6Player"

PluginManager.registerCommand(pluginName, "set", args => {
  let player = new SS6Project("", null);
});
