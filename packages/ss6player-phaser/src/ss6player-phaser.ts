import {SS6PlayerPlugin} from './SS6PlayerPlugin';
import {SS6PlayerGameObject} from './SS6PlayerGameObject';
import {SS6PlayerGameObjectConfig} from './SS6PlayerGameObjectConfig';

export {SS6PlayerPlugin, SS6PlayerGameObject};

declare global {
  namespace Phaser {
    namespace Loader {
      export interface LoaderPlugin {
        ss6playerSsfb(key: string, url: string, xhrSettings?: Types.Loader.XHRSettingsObject): LoaderPlugin
      }
    }
  }

  namespace Phaser {
    namespace GameObjects {
      export interface GameObjectFactory {
        ss6player(x: number, y: number, ssfbKey: string, animePackName: string, animeName: string): SS6PlayerGameObject
      }

      export interface GameObjectCreator {
        ss6player(config: SS6PlayerGameObjectConfig, addToScene?: boolean): SS6PlayerGameObject
      }
    }
  }

  namespace Phaser {
    export interface Scene {
      ss6player: SS6PlayerPlugin
    }
  }
}
