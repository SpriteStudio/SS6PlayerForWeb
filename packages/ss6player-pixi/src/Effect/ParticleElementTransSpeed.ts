import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementTransSpeed extends EffectElementBase {
  Speed: Point = new Point(0.0, 0.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.TransSpeed);
  }
}
