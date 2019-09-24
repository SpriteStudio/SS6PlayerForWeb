import { SS6SsfbReader } from './SS6SSfbReader';

export class SS6Project {
  public rootPath: string;
  public ssfbReader: SS6SsfbReader;

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
  public constructor(rootPath: string,
                     onComplete: () => void,
                     timeout: number = 0,
                     retry: number = 0,
                     onError: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onTimeout: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null,
                     onRetry: (ssfbPath: string, timeout: number, retry: number, httpObj: XMLHttpRequest) => void = null) {

    const index = rootPath.lastIndexOf('/');
    this.rootPath = rootPath.substring(0, index) + '/';

    this.ssfbReader = new SS6SsfbReader(rootPath, onComplete, timeout, retry, onError, onTimeout, onRetry);

  }



  
}
