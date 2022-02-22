import {EffectFunctionType} from './EffectFunctionType';

/**
 * @internal
 */
export class EffectElementBase {
  myType: EffectFunctionType = EffectFunctionType.Base;

  setType(type: EffectFunctionType) {
    this.myType = type;
  }

}
