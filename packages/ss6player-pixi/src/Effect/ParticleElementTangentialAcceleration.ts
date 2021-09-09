import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementTangentialAcceleration extends EffectElementBase {
  Acceleration: Point = new Point(0.0, 0.0);

  ParticleElementTangentialAcceleration() {
    super.setType(EffectFunctionType.TangentialAcceleration);
  }
}
