import {EffectNodeBehavior} from 'ssfblib';

/**
 * @internal
 */
export enum EffectNodeType {
  invalid = -1,
  root,
  emmiter,
  particle
}

/**
 * @internal
 */
export class EffectNode {
  arrayIndex: number = 0;
  parentIndex: number = 0;
  type: EffectNodeType = EffectNodeType.invalid;
  visible: boolean;

  behavior: EffectNodeBehavior;

  getType() {
    return this.type;
  }

  getMyBehavior(): EffectNodeBehavior {
    return this.behavior;
  }
}
