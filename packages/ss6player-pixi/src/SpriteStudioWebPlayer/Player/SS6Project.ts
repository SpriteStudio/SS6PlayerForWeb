import * as Ss6Ssfb from '../Input/Ss6/Ssfb/Reader';
import { Project } from '../Model/Project';
import { SS6Player } from './SS6Player';
  
export class SS6Project {
  public rootPath: string;
  public project: Project;
  public player: SS6Player;

  private ssfbReader: Ss6Ssfb.Reader;

  public onErrorHttpRequest: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;
  public onTimeoutHttpRequest: (ssfbPath: string, httpObj: XMLHttpRequest) => void;
  public onRetryHttpRequest: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;
  public requestRetryCurrentCount: number = 0
  private requestTimeout: number = 0;

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
  public constructor(rootPath: string) {

    // const index = rootPath.lastIndexOf('/');
    // this.rootPath = rootPath.substring(0, index) + '/';

    // const self = this;

    this.ssfbReader = new Ss6Ssfb.Reader(rootPath);
    // const ssfbReader = new Ss6Ssfb.Reader(rootPath);
    // ssfbReader.load((project: Project) => {
    //   self.project = project;

    //   self.player = new SS6Player(self, onComplete);
    // });

  }

  public loadForBytes(arrayBuffer: any, onComplete: () => void) {
    // const bytes = new Uint8Array(arrayBuffer);
    // const buffer = new flatbuffers.ByteBuffer(bytes);

    const project = this.ssfbReader.create(arrayBuffer);
    this.project = project;
    this.player = new SS6Player(this, onComplete);

    // const project = self.create(buffer);

    // self.onComplete(project);

  }
  public loadForUrl(url: string, onComplete: () => void) {
    const self = this;

    const httpObj = new XMLHttpRequest();
    httpObj.open('GET', url, true);
    httpObj.responseType = 'arraybuffer';
    httpObj.timeout = this.requestTimeout;
    httpObj.onload = function () {
      const arrayBuffer = this.response;
      self.loadForBytes(arrayBuffer, onComplete);

    };
    httpObj.ontimeout = function () {
      if (self.requestRetryCurrentCount > 0) {
        self.requestRetryCurrentCount--;
        if (self.onRetryHttpRequest !== null) {
          self.onRetryHttpRequest(url, self.requestRetryCurrentCount, httpObj);
        }
        // 再Httpリクエスト                
        self.loadForUrl(url, onComplete);

      } else {
        if (self.onTimeoutHttpRequest !== null) {
          self.onTimeoutHttpRequest(url, httpObj);
        }
      }
    };

    httpObj.onerror = function () {
      if (self.onTimeoutHttpRequest !== null) {
        self.onErrorHttpRequest(url, self.requestRetryCurrentCount, httpObj);
      }
    };

    httpObj.send(null);
  }


}


