import * as Ss6Ssfb from '../Input/Ss6/Ssfb/Reader';
import * as Ss6Json from '../Input/Ss6/Json/Reader';
import { Project } from '../Model/Project';
import { SS6Player } from './SS6Player';
  
export class SS6Project {
  public rootPath: string;
  public project: Project;
  public player: SS6Player;


  public onErrorHttpRequest: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;
  public onTimeoutHttpRequest: (ssfbPath: string, httpObj: XMLHttpRequest) => void;
  public onRetryHttpRequest: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;
  public requestRetryCurrentCount: number = 0
  private requestTimeout: number = 0;

  /**
   * SS6Project (used for several SS6Player(s))
   * @constructor
   */
  public constructor() {
    
  }

  public loadForJson(url: string, onComplete: () => void) {
    this.requestHttp(url, 'text', (text: string) => {
      const reader = new Ss6Json.Reader();
      const project = reader.create(text);
      this.project = project;
      
      this.player = new SS6Player(this, onComplete);
    });

  }

  public loadForSsfb(url: string, onComplete: () => void) {
    this.requestHttp(url, 'arraybuffer', (arrayBuffer: ArrayBuffer) => {
      const reader = new Ss6Ssfb.Reader();
      reader.setDirectoryPath(url);
      const project = reader.create(arrayBuffer);
      this.project = project;
      this.player = new SS6Player(this, onComplete);

    });
  }

  
  private requestHttp(url: string, responseType: XMLHttpRequestResponseType, onComplete: (response: any) => void) {
    const self = this;

    const httpObj = new XMLHttpRequest();
    httpObj.open('GET', url, true);
    httpObj.responseType = responseType;
    httpObj.timeout = this.requestTimeout;
    httpObj.onload = function () {
      onComplete(this.response);


    };
    httpObj.ontimeout = function () {
      if (self.requestRetryCurrentCount > 0) {
        self.requestRetryCurrentCount--;
        if (self.onRetryHttpRequest !== null) {
          self.onRetryHttpRequest(url, self.requestRetryCurrentCount, httpObj);
        }
        // 再Httpリクエスト                
        self.requestHttp(url, responseType, onComplete);

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


