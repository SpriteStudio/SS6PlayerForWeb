import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementTransSize extends EffectElementBase {
  SizeX: Point = new Point(1.0, 1.0);
  SizeY: Point = new Point(1.0, 1.0);
  ScaleFactor: Point = new Point(1.0, 1.0);

  constructor() {
    super();
    super.setType(EffectFunctionType.Size);
  }
}

