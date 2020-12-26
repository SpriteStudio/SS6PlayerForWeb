import { ss } from 'ssfblib';
import { Texture } from 'pixi.js';
import {SS6Project} from 'ss6player-pixi';

export class SspkgLoader extends SS6Project {
  public constructor(ssfbPath: string,
                     onComplete: () => void,
                     timeout: number = 0,
                     retry: number = 0,
                     onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null) {
    super(ssfbPath, onComplete, timeout, retry, onError, onTimeout, onRetry);
  }

  private onComplete: (ssfbProjectData: ss.ssfb.ProjectData, textureMap: { [key: string]: Texture; }) => void;

  private ssfbProjectData: ss.ssfb.ProjectData;
  private textureMap: { [key: string]: Texture; };

  private imageBinaryMap: { [key: string]: Uint8Array; };

  /**
   * Bytes を渡して ssfb を読み込む
   * @param bytes
   * @param imageBinaryMap
   * @param onComplete
   */
  public load(bytes: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array; }, onComplete: (ssfbProjectData: ss.ssfb.ProjectData, textureMap: { [key: string]: Texture; }) => void) {
    console.log('SspkgLoader.load', bytes);
    this.imageBinaryMap = imageBinaryMap;
    this.onComplete = onComplete;

    const buffer = new flatbuffers.ByteBuffer(bytes);
    this.ssfbProjectData = ss.ssfb.ProjectData.getRootAsProjectData(buffer);
    // this.setupTexureMap();

    this.textureMap = {};
    const loader = new PIXI.Loader();
    for (let imageName in this.imageBinaryMap) {
      const binary = this.imageBinaryMap[imageName];

      // const base64 = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, binary));

      var b = '';
      var len = binary.byteLength;
      for (var i = 0; i < len; i++) {
        b += String.fromCharCode(binary[i]);
      }
      const base64 = "data:image/png;base64," + window.btoa(b);
      // const blob = new Blob(binary, "image/png");
      // const url = window.URL.createObjectURL(blob);
      loader.add(imageName, base64);
      // let texture = PIXI.Texture.fromBuffer(binary, 100, 100);
    }

    const self = this;
    loader.load(function (loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) {
      // SS6Project is ready.
      console.log('resources', resources);
      // self.resources = resources;

      for (let imageName in resources) {
        const resource = resources[imageName];
        self.textureMap[imageName] = resource.texture;

      }

      self.onFinish();
    });

  }

  private onFinish() {
    if (this.onComplete != null) {
      this.onComplete(this.ssfbProjectData, this.textureMap);
    }

  }
}
