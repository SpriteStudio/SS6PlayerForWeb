import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';
import {VarianceValue} from './VarianceValue';

export class ParticleElementSize extends EffectElementBase {
  SizeX: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);
  SizeY: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);
  ScaleFactor: VarianceValue<number> = new VarianceValue<number>(1.0, 1.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Size);
  }
}
