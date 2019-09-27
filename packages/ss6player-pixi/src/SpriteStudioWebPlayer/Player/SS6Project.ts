import * as Ss6Ssfb from '../Input/Ss6/Ssfb/Reader';
import { Project } from '../Model/Project';
import { SS6Player } from './SS6Player';
  
export class SS6Project {
  public rootPath: string;
  public project: Project;
  public player: SS6Player;

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

    const self = this;


    const ssfbReader = new Ss6Ssfb.Reader(rootPath);
    ssfbReader.load((project: Project) => {
      self.project = project;

      self.player = new SS6Player(self, onComplete);
    });

  }




}


