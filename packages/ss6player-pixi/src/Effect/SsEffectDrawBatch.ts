import {EffectNode} from './EffectNode';
import {SsRenderBlendType} from './RenderBlendType';
import {SsEffectRenderAtom} from './SsEffectRenderAtom';
import {Cell} from 'ssfblib';

export class SsEffectDrawBatch {
  priority: number = 0;
  dispCell: Cell;
	targetNode: EffectNode = null;

	blendType: SsRenderBlendType;

	drawlist = new Array<SsEffectRenderAtom>();

	constructor() {
  }

  // TODO: impl not use?
  // drawSetting() {}
}
