import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

/**
 * @internal
 */
export class ParticleInfiniteEmitEnabled extends EffectElementBase {
  constructor() {
    super();
    super.setType(EffectFunctionType.InfiniteEmitEnabled);
  }
}
