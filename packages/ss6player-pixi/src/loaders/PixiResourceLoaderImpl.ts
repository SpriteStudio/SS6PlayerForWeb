import {Assets} from 'pixi.js';
import {PixiResourceLoader} from './PixiResourceLoader';

export class PixiResourceLoaderImpl implements PixiResourceLoader {
  constructor() {
  }

  load(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void) {
    Assets.addBundle(sspjfile, sspjMap);

    const self = this;
    Assets.loadBundle(sspjfile).then(() => {
      if (onComplete !== null) {
        onComplete(null);
      }
    }).catch((e: any) => {
      if (onComplete !== null) {
        onComplete(e);
      }
    });
  }

  unload(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void) {
    Assets.unloadBundle(sspjfile).then(() => {
      if (onComplete !== null) {
        onComplete(null);
      }
    }).catch((error: any) => {
      if (onComplete !== null) {
        onComplete(error);
      }
    });
  }

  texture(key: string): any {
    return Assets.get(key);
  }
}
