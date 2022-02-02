import {SsEffectNode} from './SsEffectNode';

export class EffectModel {
  root: SsEffectNode = null;
  nodeList: SsEffectNode[];
  lockRandSeed: number; 	 // ランダムシード固定値
  isLockRandSeed: boolean;  // ランダムシードを固定するか否か
  fps: number;             //
  bgcolor: string;
  effectName: string;
  layoutScaleX: number;
  layoutScaleY: number;

  getRoot(): SsEffectNode {
    return this.root;
  }

  getNodeList(): SsEffectNode[] {
    return this.nodeList;
  }
}
