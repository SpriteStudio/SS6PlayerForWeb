import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from "./VarianceValue";

export class ParticleElementAlphaFade extends EffectElementBase {
  disprange: VarianceValue<number>;

  constructor() {
    super();
    super.setType(EffectFunctionType.AlphaFade);
    this.disprange = new VarianceValue<number>(25.0, 75.0);
  }
}
