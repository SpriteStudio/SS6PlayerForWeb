import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class  ParticleElementDelay extends EffectElementBase {
  DelayTime: number = 0;

  constructor() {
    super();
    this.setType(EffectFunctionType.Delay);
  }
}
