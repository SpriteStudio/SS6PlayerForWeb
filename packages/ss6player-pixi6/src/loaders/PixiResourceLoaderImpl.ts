import { LoaderResource, Loader } from '@pixi/loaders';
import {PixiResourceLoader} from '../../../ss6player-pixi/src/loaders/PixiResourceLoader';

export class PixiResourceLoaderImpl implements PixiResourceLoader {
  private loader: Loader;
  private resources: Partial<Record<string, LoaderResource>>;

  constructor() {
    this.loader = new Loader()
  }

  load(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void) {
    for (let key in sspjMap) {
      this.loader.add(key, sspjMap[key]);
    }

    const self = this;
    this.loader.load((loader: Loader, resources: Partial<Record<string, LoaderResource>>) => {
      self.resources = resources;
      if (onComplete !== null) {
        onComplete(null);
      }
    });
  }

  unload(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void) {
    this.resources = null;
    if (onComplete !== null) {
      onComplete(null)
    }
  }

  texture(key: string): any /* Texture */ {
    console.log(this.resources);
    return this.resources[key].texture;
  }
}
