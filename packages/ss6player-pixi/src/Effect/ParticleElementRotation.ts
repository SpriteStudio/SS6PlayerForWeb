import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {SsPoint2} from './SsPoint2';

export class ParticleElementRotation extends EffectElementBase {
  Rotation: SsPoint2 = new SsPoint2(0, 0);
  RotationAdd: SsPoint2 = new SsPoint2(0, 0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Rotation);
  }
}
