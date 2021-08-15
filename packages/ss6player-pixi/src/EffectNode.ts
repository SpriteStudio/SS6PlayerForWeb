import {EffectNodeBehavior} from 'ssfblib';

export enum EffectNodeType {
  invalid = -1,
  root,
  emmiter,
  particle,
}

export class EffectNode {
  arrayIndex: number = 0;
  parentIndex: number = 0;
  type: EffectNodeType = EffectNodeType.invalid;
  visible: boolean;

  behavior: EffectNodeBehavior;

  getType() {
    return this.type;
  }

  getMyBehavior() {
    return this.behavior;
  }
}
