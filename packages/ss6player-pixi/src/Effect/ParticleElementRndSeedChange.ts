import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementRndSeedChange extends EffectElementBase {
  Seed: number = 0;

  constructor() {
    super();
    super.setType(EffectFunctionType.RndSeedChange);
  }
}
