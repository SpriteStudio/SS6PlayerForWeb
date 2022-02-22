import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from './VarianceValue';

/**
 * @internal
 */
export class ParticleElementTransSize extends EffectElementBase {
  SizeX: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);
  SizeY: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);
  ScaleFactor: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Size);
  }
}
