import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math'
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementRotation extends EffectElementBase {
  Rotation: Point = new Point(0, 0);
  RotationAdd: Point = new Point(0, 0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Rotation);
  }
}
