// import * as PIXI from 'pixi.js';
import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';

export class SS6Project {
  public rootPath: string;
  public fbObj: ss.ssfb.ProjectData;
  public resources: Partial<Record<string, PIXI.LoaderResource>>;
  public status: string;
  private onComplete: () => void; // ()
  private onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
  private onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;
  private onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void;

  /**
   * SS6Project (used for several SS6Player(s))
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
                     timeout: number = 0,
                     retry: number = 0,
                     onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null) {
    const index = ssfbPath.lastIndexOf('/');
    this.rootPath = ssfbPath.substring(0, index) + '/';

    this.status = 'not ready'; // status

    this.onComplete = onComplete;
    this.onError = onError;
    this.onTimeout = onTimeout;
    this.onRetry = onRetry;
    this.LoadFlatBuffersProject(ssfbPath, timeout, retry);
  }

  /**
   * Load json and parse (then, load textures)
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
    httpObj.onload = function() {
      const arrayBuffer = this.response;
      const bytes = new Uint8Array(arrayBuffer);
      const buf = new flatbuffers.ByteBuffer(bytes);
      self.fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
      self.LoadCellResources();
    };
    httpObj.ontimeout = function() {
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

    httpObj.onerror = function() {
      if (self.onTimeout !== null) {
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
      if (!ids.some(function(id: number) {
        return (id === self.fbObj.cells(i).cellMap().index());
      })) {
        ids.push(self.fbObj.cells(i).cellMap().index());
        loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
      }
    }
    loader.load(function(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      // SS6Project is ready.
      self.resources = resources;
      self.status = 'ready';
      if (self.onComplete !== null) {
        self.onComplete();
      }
    });
  }
}
