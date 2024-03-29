import { Utils as playerLibUtils, ProjectData } from 'ss6player-lib';
import {SS6ProjectResourceLoader} from './SS6ProjectResourceLoader';
import {Texture} from '@pixi/core';

export enum RESOURCE_PROGRESS {
  NOT_READY,
  READY
}

export declare type onCompleteCallback = (ss6project: SS6Project, error: any) => void;

export class SS6Project {
  public ssfbPath: string;
  public rootPath: string;
  public ssfbFile: string;
  public fbObj: ProjectData;
  public status: RESOURCE_PROGRESS;
  public onComplete: onCompleteCallback;

  private sspjMap: { [key: string]: string } = {};
  private resourceLoader: SS6ProjectResourceLoader;

  public getBundle(): string {
    return this.ssfbFile;
  }

  public getTexture(key: string): Texture {
    return this.resourceLoader.texture(key);
  }

  /**
   * SS6Project (used for several SS6Player(s))
   * @param ssfbPath - ssfb file path
   * @param onComplete - result callback
   */
  public constructor(ssfbPath: string,
                     onComplete?: onCompleteCallback)
  /**
   * SS6Project (used for several SS6Player(s))
   * @param ssfbName - ssfb file name
   * @param bytes - ssfb file data
   * @param imageBinaryMap - Image file data
   * @param onComplete - result callback
   */
  public constructor(ssfbName: string,
                     bytes: Uint8Array,
                     imageBinaryMap: { [key: string]: Uint8Array },
                     onComplete?: onCompleteCallback);
  public constructor(arg1: any,
                     arg2: any,
                     arg3?: any,
                     arg4?: any) {
    this.resourceLoader = new SS6ProjectResourceLoader();
    if (typeof arg1 === 'string' && arg3 === undefined) {  // get ssfb data via http protocol
      let ssfbPath: string = arg1;

      // ssfb path
      this.ssfbPath = ssfbPath;
      const index = ssfbPath.lastIndexOf('/');
      this.rootPath = ssfbPath.substring(0, index) + '/';
      this.ssfbFile = ssfbPath.substring(index + 1);

      this.onComplete = (arg2 === undefined) ? null : arg2;

      this.status = RESOURCE_PROGRESS.NOT_READY;
      this.LoadFlatBuffersProject();
    } else if (typeof arg2 === 'object' && arg2.constructor === Uint8Array) { // get ssfb data from argument
      this.ssfbPath = null;
      this.rootPath = null;
      this.ssfbFile = arg1;

      let ssfbByte: Uint8Array = arg2;
      let imageBinaryMap: { [key: string]: Uint8Array } = arg3;
      this.onComplete = (arg4 === undefined) ? null : arg4;
      this.load(ssfbByte, imageBinaryMap);
    }
  }

  dispose(callback: () => void = null) {
    this.resourceLoader.unload(this.getBundle(), this.sspjMap, (error: any) => {
      if (callback !== null) {
        callback();
      }
    });
  }

  /**
   * Load json and parse (then, load textures)
   */
  private LoadFlatBuffersProject() {
    const self = this;

    fetch(this.ssfbPath, {method: 'get'}).then((response: Response) => {
      if (response.ok) {
        return Promise.resolve(response.arrayBuffer());
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }).then((a: ArrayBuffer) => {
      self.fbObj = playerLibUtils.getProjectData(new Uint8Array(a));
      self.LoadCellResources();
    }).catch((error) => {
      if (this.onComplete !== null) {
        this.onComplete(null, error);
      }
    });
  }

  /**
   * Load textures
   */
  private LoadCellResources() {
    // Load textures for all cell at once.
    let ids: any = [];

    this.sspjMap = {};
    for (let i = 0; i < this.fbObj.cellsLength(); i++) {
      const cellMap = this.fbObj.cells(i).cellMap();
      const cellMapIndex = cellMap.index();
      if (!ids.some(function (id: number) {
        return (id === cellMapIndex);
      })) {
        ids.push(cellMapIndex);
        const name = cellMap.name();
        this.sspjMap[name] = this.rootPath + cellMap.imagePath();
      }
    }

    const self = this;
    this.resourceLoader.load(this.getBundle(), this.sspjMap, (error: any) => {
      if (error === null) {
        self.status = RESOURCE_PROGRESS.READY;
        if (self.onComplete !== null) {
          self.onComplete(this, null);
        }
      } else {
        if (this.onComplete !== null) {
          this.onComplete(null, error);
        }
      }
    });
  }

  private load(bytes: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array }) {
    this.fbObj = playerLibUtils.getProjectData(bytes);

    let assetMap = {};
    for (let imageName in imageBinaryMap) {
      const binary: Uint8Array = imageBinaryMap[imageName];

      let b: string = '';
      const len = binary.byteLength;
      for (let i = 0; i < len; i++) {
        b += String.fromCharCode(binary[i]);
      }

      assetMap[imageName] = 'data:image/png;base64,' + btoa(b);
    }

    const self = this;
    this.resourceLoader.load(this.getBundle(), assetMap, (error: any) => {
      if (error === null) {
        self.status = RESOURCE_PROGRESS.READY;

        if (self.onComplete !== null) {
          self.onComplete(this, null);
        }
      } else {
        if (this.onComplete !== null) {
          this.onComplete(null, error);
        }
      }
    });
  }
}
