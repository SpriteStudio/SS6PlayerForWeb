export class PluginParameters {
  static instance;

  pluginParameters;
  animationDir;

  constructor() {
    this.pluginParameters = PluginManager.parameters('ss6player-rpgmakermz');
    this.animationDir = String(this.pluginParameters['animationDir'] || 'img/ssfb') + '/';
  }

  static getInstance() {
    if (PluginParameters.instance) {
      return PluginParameters.instance;
    }
    PluginParameters.instance = new PluginParameters();
    return PluginParameters.instance;
  }
}
