import * as Phaser from 'phaser';

export class SS6PlayerPlugin extends Phaser.Plugins.ScenePlugin {

	constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string) {
    super(scene, pluginManager, pluginKey);
    console.log("SS6PlayerPlugin.constructor()")
	}

  override boot() {
    console.log("SS6PlayerPlugin.boot()")
    var eventEmitter = this.systems!.events;
    eventEmitter.once('shutdown', this.shutdown, this);
    eventEmitter.once('destroy', this.destroy, this);
    this.game.events.once('destroy', this.gameDestroy, this);
  }

	override destroy() {
		console.log("SS6PlayerPlugin.destroy()")
		this.shutdown()
	}

  shutdown() {
    console.log("SS6PlayerPlugin.shutdown()")
	}

	gameDestroy() {
    console.log("SS6PlayerPlugin.gameDestroy()")
	}

}
