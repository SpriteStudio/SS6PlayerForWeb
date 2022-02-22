import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {SsPoint2} from './SsPoint2';
import {VarianceValue} from './VarianceValue';

/**
 * @internal
 */
export class ParticleElementRotation extends EffectElementBase {
  Rotation: VarianceValue<number> = new VarianceValue<number>(0, 0);
  RotationAdd: VarianceValue<number> = new VarianceValue<number>(0, 0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Rotation);
  }
}
