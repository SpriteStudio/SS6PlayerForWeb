import {SS6Player} from './ss6player';
import {Asset} from 'playcanvas';

export class SS6playerComponentData {
  // serialized
  enabled: boolean = true;
  ssfbAsset: number | Asset = null;
  textureAssets: (number | Asset)[] = [];
  animePackName: string = null;
  animeName: string = null;

  // non-serialized
  ss6player: SS6Player = null;
  ssfbData: Uint8Array = null;
  textures: any[] = [];
}
