// import * as Phaser from 'phaser';

export interface SS6PlayerGameObjectConfig extends Phaser.Types.GameObjects.GameObjectConfig {
	x?: number
	y?: number
  ssfbKey: string
  animePackName: string
  animeName: string
}
