import * as Phaser from 'phaser';
import { Utils as playerLibUtils, ProjectData } from 'ss6player-lib';
import {SS6PlayerGameObjectConfig} from './SS6PlayerGameObjectConfig';
import {SS6PlayerGameObject} from './SS6PlayerGameObject';
import {SS6PLAYER_GAME_OBJECT_TYPE, SS6PLAYER_SSFB_DATA_FILE_TYPE} from './keys';

export class SS6PlayerPlugin extends Phaser.Plugins.ScenePlugin {

  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string) {
    super(scene, pluginManager, pluginKey);
    console.log('SS6PlayerPlugin.constructor()')

    let ss6playerSsfbFileCallback = function (this: any, key: string,
                                              url: string,
                                              xhrSettings: Phaser.Types.Loader.XHRSettingsObject) {
      const file = new SS6PlayerSsfbDataFile(this /*as any*/, key, url, xhrSettings);
      this.addFile(file.files);
      return this;
    };
    pluginManager.registerFileType('ss6playerSsfb', ss6playerSsfbFileCallback, scene);

    let self = this;
    let addSS6PlayerGameObject = function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, ssfbKey: string, animePackName: string, animeName: string) {
      let gameObject = new SS6PlayerGameObject(scene, self, x, y, ssfbKey, animePackName, animeName);
      this.displayList.add(gameObject);
      this.updateList.add(gameObject);
      return gameObject;
    };

    let makeSS6PlayerGameObject = function (this: Phaser.GameObjects.GameObjectFactory, config: SS6PlayerGameObjectConfig, addToScene: boolean = false) {
      let x = config.x ? config.x : 0;
      let y = config.y ? config.y : 0;
      let gameObject = new SS6PlayerGameObject(this.scene, self, x, y, config.ssfbKey, config.animePackName, config.animeName);
      if (addToScene !== undefined) {
        config.add = addToScene;
      }
      return Phaser.GameObjects.BuildGameObject(this.scene, gameObject, config);
    }
    pluginManager.registerGameObject(SS6PLAYER_GAME_OBJECT_TYPE, addSS6PlayerGameObject, makeSS6PlayerGameObject);
  }

  override boot() {
    console.log('SS6PlayerPlugin.boot()');
    const eventEmitter = this.systems.events;
    eventEmitter.once('shutdown', this.shutdown, this);
    eventEmitter.once('destroy', this.destroy, this);
    this.game.events.once('destroy', this.gameDestroy, this);
  }

  override destroy() {
    console.log('SS6PlayerPlugin.destroy()');
    this.shutdown()
  }

  shutdown() {
    console.log('SS6PlayerPlugin.shutdown()');
  }

  gameDestroy() {
    console.log('SS6PlayerPlugin.gameDestroy()');
  }
}

class SS6PlayerSsfbDataFile extends Phaser.Loader.MultiFile {
  constructor(loader: Phaser.Loader.LoaderPlugin, key: string, url: string, xhrSettings: Phaser.Types.Loader.XHRSettingsObject) {
    super(loader, SS6PLAYER_SSFB_DATA_FILE_TYPE, key, [
      new Phaser.Loader.FileTypes.BinaryFile(loader, {
        key: key,
        url: url,
        xhrSettings: xhrSettings,
        extension: 'ssfb'
      })
    ]);
  }

  override onFileComplete(file: Phaser.Loader.File) {
    if (this.files.indexOf(file) !== -1) {
      this.pending--;

      if (file.type === 'binary') {
        const urlString = file.url.toString()
        const index = urlString.lastIndexOf('/');
        const rootPath = urlString.substring(0, index) + '/';

        // console.log(file.data);
        let fbObj: ProjectData = playerLibUtils.getProjectData(new Uint8Array(file.data));

        let ids: any = [];
        let sspjMap = {};
        for (let i = 0; i < fbObj.cellsLength(); i++) {
          const cellMap = fbObj.cells(i).cellMap();
          const cellMapIndex = cellMap.index();
          // console.log("id: " + cellMap.index() + " imagePath: " + cellMap.imagePath());

          if (!ids.some(function (id: number) {
            return (id === cellMapIndex);
          })) {
            ids.push(cellMapIndex);
            const name = cellMap.name();
            sspjMap[name] = rootPath + cellMap.imagePath();
          }
        }

        for (let sspjKey in sspjMap) {
          const url = sspjMap[sspjKey];
          const key = file.key + '!' + sspjMap[sspjKey];
          const image = new Phaser.Loader.FileTypes.ImageFile(this.loader, key, url);
          console.log(image);

          if (!this.loader.keyExists(image)) {
            this.addToMultiFile(image);
            this.loader.addFile(image);
          }
        }
      }
    }
  }

  addToCache() {
    if (this.isReadyToProcess()) {
      let textureManager = this.loader.textureManager;
      for (let file of this.files) {
        if (file.type === 'image') {
          if (!textureManager.exists(file.key)) {
            textureManager.addImage(file.key, file.data);
          }
        } else {
          // ssfb
          file.addToCache();
        }
      }
    }
  }
}
