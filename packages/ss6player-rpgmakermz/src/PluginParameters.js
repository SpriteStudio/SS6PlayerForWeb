export class PluginParameters {
  static instance;

  pluginParameters;
  animationDir;

  battleCharacterDir;

  constructor() {
    this.pluginParameters = PluginManager.parameters('ss6player-rpgmakermz');
    this.animationDir = String(this.pluginParameters['animationDir'] || 'img/ssfb') + '/';
    this.battleCharacterDir = String(this.pluginParameters['battleCharacterDir'] || 'img/ssfb/battleCharacterDir') + '/';
  }

  static getInstance() {
    if (PluginParameters.instance) {
      return PluginParameters.instance;
    }
    PluginParameters.instance = new PluginParameters();
    return PluginParameters.instance;
  }
}
