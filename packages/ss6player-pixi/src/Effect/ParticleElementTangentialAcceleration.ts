import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from './VarianceValue';

/**
 * @internal
 */
export class ParticleElementTangentialAcceleration extends EffectElementBase {
  Acceleration: VarianceValue<number> = new VarianceValue<number>(0.0, 0.0);

  ParticleElementTangentialAcceleration() {
    super.setType(EffectFunctionType.TangentialAcceleration);
  }
}
