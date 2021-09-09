import {EffectElementBase} from './EffectElementBase';
import {Point} from '@pixi/math';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementBasic extends EffectElementBase {
  maximumParticle: number;
  speed: Point;
  lifespan: Point;
  angle: number;
  angleVariance: number;
  interval: number;
  lifetime: number;
  attimeCreate: number;
  priority: number;

  constructor() {
    super();
    this.maximumParticle = 50;
    this.speed = new Point(5.0, 5.0);
    this.lifespan = new Point(30, 30);
    this.angle = 0;
    this.angleVariance = 45.0;
    this.interval = 1;
    this.lifetime = 30;
    this.attimeCreate = 1;
    this.priority = 64;
    super.setType(EffectFunctionType.Basic);
  }
}
