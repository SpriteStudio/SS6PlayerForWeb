import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {hex2rgb} from '@pixi/utils';

export class ParticleElementInitColor extends EffectElementBase {
  Color: Array< Array<number> > = new Array(2);

  constructor() {
    super();
    super.setType(EffectFunctionType.InitColor);
    hex2rgb(0xffffff, this.Color[0]);
    hex2rgb(0xffffff, this.Color[1]);
  }
}