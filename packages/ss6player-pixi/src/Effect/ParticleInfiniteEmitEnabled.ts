import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleInfiniteEmitEnabled extends EffectElementBase {
  constructor() {
    super();
    super.setType(EffectFunctionType.InfiniteEmitEnabled);
  }
}
