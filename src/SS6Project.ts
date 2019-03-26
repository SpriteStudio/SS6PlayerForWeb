import { ss } from './ssfb_generated';

export class SS6Project {
  public rootPath: string;
  public fbObj: ss.ssfb.ProjectData;
  public resources: PIXI.loaders.ResourceDictionary;
  public status: string;

  /**
   * SS6Project (used for several SS6Player(s))
   * @constructor
   * @param {string} ssfbPath - FlatBuffers file path
   */
  public constructor(ssfbPath: string) {
    const index = ssfbPath.lastIndexOf('/');
    this.rootPath = ssfbPath.substring(0, index) + '/';

    this.status = 'not ready'; // status

    this.LoadFlatBuffersProject(ssfbPath);
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
        self.OnRetry(ssfbPath, timeout, retry - 1, httpObj);
        self.LoadFlatBuffersProject(ssfbPath, timeout, retry - 1);
      } else {
        self.OnTimeout(ssfbPath, timeout, retry, httpObj);
      }
    };

    httpObj.onerror = function() {
      self.OnError(ssfbPath, timeout, retry, httpObj);
    };

    httpObj.send(null);
  }

  /**
   * Load textures
   */
  private LoadCellResources() {
    const self = this;
    // Load textures for all cell at once.
    const loader = new PIXI.loaders.Loader();
    let ids: any = [];
    for (let i = 0; i < self.fbObj.cellsLength(); i++) {
      if (!ids.some(function(id: number) {
        return (id === self.fbObj.cells(i).cellMap().index());
      })) {
        ids.push(self.fbObj.cells(i).cellMap().index());
        loader.add(self.fbObj.cells(i).cellMap().name(), self.rootPath + this.fbObj.cells(i).cellMap().imagePath());
      }
    }
    loader.load(function(loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) {
      // SS6Project is ready.
      self.resources = resources;
      self.status = 'ready';
      self.OnComplete();
    });
  }

  /**
   * Callback on complete
   */
  public OnComplete() {
    // console.log("on complete : " + this.rootPath);
  }

  /**
   * Callback on error
   *
   * @param {string} ssfbPath - FlatBuffers file path
   * @param {Number} timeout - timeout ms
   * @param {Number} retry - retry count
   * @param {XMLHttpRequest} httpObj - XMLHttpRequest instance
   */
  public OnError(ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) {}

  /**
   * Callback on timeout
   *
   * @param {string} ssfbPath - FlatBuffers file path
   * @param {Number} timeout - timeout ms
   * @param {Number} retry - retry count
   * @param {XMLHttpRequest} httpObj - XMLHttpRequest instance
   */
  public OnTimeout(ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) {}

  /**
   * Callback on retry
   *
   * @param {string} ssfbPath - FlatBuffers file path
   * @param {Number} timeout - timeout ms
   * @param {Number} retry - retry count
   * @param {XMLHttpRequest} httpObj - XMLHttpRequest instance
   */
  public OnRetry(ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) {}
}
