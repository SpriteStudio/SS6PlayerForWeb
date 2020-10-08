export class PluginParameters {
  static instance;

  pluginParameters;
  animationDir;

  replaceSVActorSpriteFlag; // boolean
  svActorDir; // string
  svActorAnimationPack; // string
  svActorHideWeaponGraphics; // boolean

  constructor() {
    this.pluginParameters = PluginManager.parameters('ss6player-rpgmakermz');
    this.animationDir = String(this.pluginParameters['animationDir'] || 'img/ssfb') + '/';

    this.replaceSVActorSpriteFlag = (this.pluginParameters['replaceSVActorSpriteFlag'] === 'true') || false;
    this.svActorDir = String(this.pluginParameters['svActorDir'] || 'img/ssfb/sv_actors') + '/';
    this.svActorAnimationPack = String(this.pluginParameters['svActorAnimationPack'] || 'motions');
    this.svActorHideWeaponGraphics = (this.pluginParameters['svActorHideWeaponGraphics'] === 'true') || false;
  }

  static getInstance() {
    if (PluginParameters.instance) {
      return PluginParameters.instance;
    }
    PluginParameters.instance = new PluginParameters();
    return PluginParameters.instance;
  }
}
