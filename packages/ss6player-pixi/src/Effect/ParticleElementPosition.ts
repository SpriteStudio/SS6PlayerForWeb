import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from './VarianceValue';

export class ParticleElementPosition extends EffectElementBase {
  OffsetX: VarianceValue<number>;
  OffsetY: VarianceValue<number>;

  constructor() {
    super();
    super.setType(EffectFunctionType.Position);
    this.OffsetX = new VarianceValue<number>(0, 0);
    this.OffsetY = new VarianceValue<number>(0, 0);
  }
}
