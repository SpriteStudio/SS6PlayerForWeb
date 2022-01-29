import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {SsPoint2} from './SsPoint2';

export class ParticleElementGravity extends EffectElementBase {
  Gravity: SsPoint2 = new SsPoint2(0.0, -3.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Gravity);
  }
}
