import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementPosition extends EffectElementBase {
  OffsetX: Point = new Point(0, 0);
  OffsetY: Point = new Point(0, 0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Position);
  }
}
