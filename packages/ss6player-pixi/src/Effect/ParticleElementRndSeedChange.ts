import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

/**
 * @internal
 */
export class ParticleElementRndSeedChange extends EffectElementBase {
  Seed: number = 0;

  constructor() {
    super();
    super.setType(EffectFunctionType.RndSeedChange);
  }
}
