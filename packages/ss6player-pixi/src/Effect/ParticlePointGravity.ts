import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';
import {SsPoint2} from './SsPoint2';

/**
 * @internal
 */
export class ParticlePointGravity extends EffectElementBase {
  Position: SsPoint2 = new SsPoint2(0, 0);
  Power: number = 0.0;

  constructor() {
    super();
    super.setType(EffectFunctionType.PointGravity);
  }
}
