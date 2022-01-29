import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from "./VarianceValue";

export class ParticleElementTransSpeed extends EffectElementBase {
  Speed: VarianceValue<number>;

  constructor() {
    super();
    super.setType(EffectFunctionType.TransSpeed);
    this.Speed = new VarianceValue<number>(0.0, 0.0);
  }
}
