import {EffectElementBase} from './EffectElementBase';
import {EffectFunctionType} from './EffectFunctionType';

export class ParticleTurnToDirectionEnabled extends EffectElementBase {
  Rotation: number = 0.0;

  constructor() {
    super();
    super.setType(EffectFunctionType.TurnToDirectionEnabled);
  }
}
