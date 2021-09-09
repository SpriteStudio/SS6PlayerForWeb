import {EffectNode} from './EffectNode';

export class EffectModel {
  root: EffectNode = null;
  nodeList: EffectNode[];
  lockRandSeed: number; 	 // ランダムシード固定値
  isLockRandSeed: boolean;  // ランダムシードを固定するか否か
  fps: number;             //
  bgcolor: string;
  effectName: string;
  layoutScaleX: number;
  layoutScaleY: number;

  getRoot(): EffectNode {
    return this.root;
  }

  getNodeList(): EffectNode[] {
    return this.nodeList;
  }
}
