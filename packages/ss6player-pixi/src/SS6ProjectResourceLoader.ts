import {PixiResourceLoader} from './loaders/PixiResourceLoader';
import {PixiResourceLoaderImpl} from '@resourceLoader/PixiResourceLoaderImpl';
import {Texture} from 'pixi.js';

export class SS6ProjectResourceLoader {

  private loader: PixiResourceLoader;

  constructor() {
    this.loader = new PixiResourceLoaderImpl();
  }

  load(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void) {
    return this.loader.load(sspjfile, sspjMap, onComplete);
  }

  unload(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void = null) {
    return this.loader.unload(sspjfile, sspjMap, onComplete);
  }

  texture(key: string): Texture {
    return this.loader.texture(key);
  }
}
