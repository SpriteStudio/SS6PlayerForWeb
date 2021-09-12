import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementAlphaFade extends EffectElementBase {
  disprange: Float32Array = new Float32Array(2);

  constructor() {
    super();
    super.setType(EffectFunctionType.AlphaFade);
    this.disprange[0] = 25.0;
    this.disprange[1] = 75.0;
  }
}
