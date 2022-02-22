import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

/**
 * @internal
 */
export class ParticleElementDelay extends EffectElementBase {
  DelayTime: number = 0;

  constructor() {
    super();
    this.setType(EffectFunctionType.Delay);
  }
}
