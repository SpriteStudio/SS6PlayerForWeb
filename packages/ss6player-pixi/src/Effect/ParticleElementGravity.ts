import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementGravity extends EffectElementBase {

  Gravity: Point = new Point(0.0, -3.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Gravity);
  }
}
