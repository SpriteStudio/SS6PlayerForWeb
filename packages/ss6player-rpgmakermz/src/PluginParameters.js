export class PluginParameters {
  static instance;

  pluginParameters;
  animationDir;

  replaceSVActorSpriteFlag; // boolean
  svActorDir; // string
  svActorAnimationPack; // string
  svActorHideWeaponGraphics; // boolean

  replaceSVEnemySpriteFlag; // boolean
  svEnemyDir; // string
  svEnemyAnimationPack; // string
  svEnemyAnimationName; // string

  constructor() {
    this.pluginParameters = PluginManager.parameters('ss6player-rpgmakermz');
    this.animationDir = String(this.pluginParameters['animationDir'] || 'img/ssfb') + '/';

    this.replaceSVActorSpriteFlag = (this.pluginParameters['replaceSVActorSpriteFlag'] === 'true') || false;
    this.svActorDir = String(this.pluginParameters['svActorDir'] || 'img/ssfb/sv_actors') + '/';
    this.svActorAnimationPack = String(this.pluginParameters['svActorAnimationPack'] || 'motions');
    this.svActorHideWeaponGraphics = (this.pluginParameters['svActorHideWeaponGraphics'] === 'true') || false;

    this.replaceSVEnemySpriteFlag = (this.pluginParameters['replaceSVEnemySpriteFlag'] === 'true') || false
    this.svEnemyDir = String(this.pluginParameters['svEnemyDir'] || 'img/ssfb/sv_enemies') + '/';
    this.svEnemyAnimationPack = String(this.pluginParameters['svEnemyAnimationPack'] || 'motions');
    this.svEnemyAnimationName = String(this.pluginParameters['svEnemyAnimationName'] || 'walk');
  }

  static getInstance() {
    if (PluginParameters.instance) {
      return PluginParameters.instance;
    }
    PluginParameters.instance = new PluginParameters();
    return PluginParameters.instance;
  }
}
