import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticlePointGravity extends EffectElementBase {
  Position: Point = new Point(0, 0);
  Power: number = 0.0;

  constructor() {
    super();
    super.setType(EffectFunctionType.PointGravity);
  }
}
