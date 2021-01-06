import { ss } from 'ssfblib';
import { SS6Project } from 'ss6player-pixi';

export class SspkgLoader extends SS6Project {
  public constructor(bytes: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array; }, onComplete: () => void) {
    super(bytes, imageBinaryMap, onComplete);
  }
}
