import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {hex2rgb} from '@pixi/utils';
import {VarianceValue} from './VarianceValue';
import {SsU8Color} from './SsU8Color';

export class ParticleElementTransColor extends EffectElementBase {
  Color: VarianceValue<SsU8Color> = new VarianceValue<SsU8Color>(new SsU8Color(255, 255, 255, 255), new SsU8Color(255, 255, 255, 255));

  constructor() {
    super();
    super.setType(EffectFunctionType.TransColor);
    hex2rgb(0xffffff, this.Color[0]);
    hex2rgb(0xffffff, this.Color[1]);
  }
}
