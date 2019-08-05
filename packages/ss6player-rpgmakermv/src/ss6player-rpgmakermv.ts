/// <reference types="rpgmakermv_typescript_dts" />

import { SS6Player, SS6Project } from 'ss6player-pixi';

(function() {

  class SS6PMV {
    project: SS6Project;
    player: SS6Player;
    constructor() {
      this.project = new SS6Project('test', function() {
        this.player = new SS6Player(this.project, 'test', 'test');
      });
    }
    public processCommands(command: string, args: string[]) {
      switch(command) {
        case 'play':
          break;
        case 'move':
          break;
        case 'wait':
          break;
        case 'stop':
          break;
      }
    }
  }
  let ss6pmv = new SS6PMV();

  let parameters = PluginManager.parameters('HelloWorld');
  let Message = String(parameters['Message'] || 'World');

  let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    ss6pmv.processCommands.call(this, command, args);
  };
})();
