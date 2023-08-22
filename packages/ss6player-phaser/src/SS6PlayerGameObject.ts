import * as Phaser from 'phaser';
import {SS6PlayerPlugin} from './SS6PlayerPlugin';
import {SS6PLAYER_GAME_OBJECT_TYPE} from './keys';

export class SS6PlayerGameObject extends Phaser.GameObjects.GameObject {
  constructor (scene: Phaser.Scene, private plugin: SS6PlayerPlugin, x: number, y: number, ssfbKey: string, animePackName: string, animeName: string) {
    super(scene, SS6PLAYER_GAME_OBJECT_TYPE);

    console.log('SS6PlayerGameObject.constructor()');
  }
}
