import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleElementRotationTrans extends EffectElementBase {
  RotationFactor: number = 0.0;
  EndLifeTimePer: number = 75.0;

  constructor() {
    super();
    super.setType(EffectFunctionType.TransRotation);
  }
}
