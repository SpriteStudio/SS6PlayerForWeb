// import * as PIXI from 'pixi.js';
import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';

export class SS6Project {
  public ssfbPath: string;
  public rootPath: string;
  public fbObj: ss.ssfb.ProjectData;
  public resources: Partial<Record<string, PIXI.LoaderResource>>;
  public status: string;
  protected onComplete: () => void; // ()
  protected onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
  protected onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
  protected onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;

  /**
   * SS6Project (used for several SS6Player(s))
   *
   * @param bytes - FlatBuffers file data
   * @param imageBinaryMap - Image file data
   * @param onComplete - callback result
   */
  public constructor(bytes: Uint8Array,
                     imageBinaryMap: { [key: string]: Uint8Array },
                     onComplete: () => void);
  /**
   * SS6Project (used for several SS6Player(s))
   *
   * @constructor
   * @param {string} ssfbPath - FlatBuffers file path
   * @param onComplete - callback on complete
   * @param timeout
   * @param retry
   * @param onError - callback on error
   * @param onTimeout - callback on timeout
   * @param onRetry - callback on retry
   */
  public constructor(ssfbPath: string,
                     onComplete: () => void,
                     timeout: number,
                     retry: number,
                     onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void,
                     onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void,
                     onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void);
  public constructor(ssfbPath: string,
                     onComplete: () => void);
  public constructor(arg1?: any,
                     arg2?: any,
                     arg3?: any,
                     arg4?: any,
                     arg5?: any,
                     arg6?: any,
                     arg7?: any) {
    if (typeof arg1 === 'string') {  // get ssfb data via http protocol
      let ssfbPath: string = arg1;
      let onComplete: () => void = arg2;
      let timeout: number = (arg3 !== undefined) ? arg3 : 0;
      let retry: number = (arg4 !== undefined) ? arg4 : 0;
      let onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = (arg5 !== undefined) ? arg5 : null;
      let onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = (arg6 !== undefined) ? arg6 : null;
      let onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = (arg7 !== undefined) ? arg7 : null;

      // ssfb path
      this.ssfbPath = ssfbPath;
      const index = ssfbPath.lastIndexOf('/');
      this.rootPath = ssfbPath.substring(0, index) + '/';

      this.status = 'not ready'; // status

      this.onComplete = onComplete;
      this.onError = onError;
      this.onTimeout = onTimeout;
      this.onRetry = onRetry;

      this.LoadFlatBuffersProject(ssfbPath, timeout, retry);
    } else if (typeof arg1 === 'object' && arg1.constructor === Uint8Array) { // get ssfb data from argument
      let ssfbByte: Uint8Array = arg1;
      let imageBinaryMap: { [key: string]: Uint8Array } = arg2;
      this.onComplete = (arg3 !== undefined) ? arg3 : null;

      this.load(ssfbByte, imageBinaryMap);
    }
  }

  /**
   * Load json and parse (then, load textures)
   *
   * @param {string} ssfbPath - FlatBuffers file path
   * @param timeout
   * @param retry
   */
  private LoadFlatBuffersProject(ssfbPath: string, timeout: number = 0, retry: number = 0) {
    const self = this;
    const httpObj = new XMLHttpRequest();
    const method = 'GET';
    httpObj.open(method, ssfbPath, true);
    httpObj.responseType = 'arraybuffer';
    httpObj.timeout = timeout;
    httpObj.onload = function () {
      if (!(httpObj.status >= 200 && httpObj.status < 400)) {
        if (self.onError !== null) {
          self.onError(ssfbPath, timeout, retry, httpObj);
        }
        return;
      }
      const arrayBuffer = this.response;
      const bytes = new Uint8Array(arrayBuffer);
      const buf = new flatbuffers.ByteBuffer(bytes);
      self.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
      self.LoadCellResources();
    };
    httpObj.ontimeout = function () {
      if (retry > 0) {
        if (self.onRetry !== null) {
          self.onRetry(ssfbPath, timeout, retry - 1, httpObj);
        }
        self.LoadFlatBuffersProject(ssfbPath, timeout, retry - 1);
      } else {
        if (self.onTimeout !== null) {
          self.onTimeout(ssfbPath, timeout, retry, httpObj);
        }
      }
    };

    httpObj.onerror = function () {
      if (self.onError !== null) {
        self.onError(ssfbPath, timeout, retry, httpObj);
      }
    };

    httpObj.send(null);
  }

  /**
   * Load textures
   */
  private LoadCellResources() {
    const self = this;
    // Load textures for all cell at once.
    let loader = new PIXI.Loader();
    let ids: any = [];

    for (let i = 0; i < self.fbObj.cellsLength(); i++) {
      if (!ids.some(function (id: number) {
        return (id === self.fbObj.cells(i).cellMap().index());
      })) {
        ids.push(self.fbObj.cells(i).cellMap().index());
        loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
      }
    }
    loader.load(function (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      // SS6Project is ready.
      self.resources = resources;
      self.status = 'ready';
      if (self.onComplete !== null) {
        self.onComplete();
      }
    });
  }

  private load(bytes: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array }) {
    const buffer = new flatbuffers.ByteBuffer(bytes);
    this.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buffer);

    const loader = new PIXI.Loader();
    for (let imageName in imageBinaryMap) {
      const binary = imageBinaryMap[imageName];

      // const base64 = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, binary));

      let b = '';
      const len = binary.byteLength;
      for (let i = 0; i < len; i++) {
        b += String.fromCharCode(binary[i]);
      }
      const base64 = 'data:image/png;base64,' + window.btoa(b);
      // const blob = new Blob(binary, "image/png");
      // const url = window.URL.createObjectURL(blob);
      loader.add(imageName, base64);
      // let texture = PIXI.Texture.fromBuffer(binary, 100, 100);
    }

    const self = this;
    loader.load((loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {
      // SS6Project is ready.
      self.resources = resources;
      self.status = 'ready';

      if (self.onComplete !== null) {
        self.onComplete();
      }
    });
  }
}
