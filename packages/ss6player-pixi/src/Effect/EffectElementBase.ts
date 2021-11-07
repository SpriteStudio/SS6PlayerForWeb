import {EffectFunctionType} from './EffectFunctionType';

export class EffectElementBase {
  myType: EffectFunctionType = EffectFunctionType.Base;

  setType(type: EffectFunctionType) {
    this.myType = type;
  }

}