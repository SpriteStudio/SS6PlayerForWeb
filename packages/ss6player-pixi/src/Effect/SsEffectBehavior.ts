import {EffectElementBase} from './EffectElementBase';
import {SsRenderBlendType} from './RenderBlendType';
import {SsCell} from './SsCell';

/**
 * @internal
 */
export class SsEffectBehavior {
  plist: Array<EffectElementBase>;

  CellIndex: number;
  refCell: SsCell;
  CellName: string;
  CellMapName: string;
  blendType: SsRenderBlendType = SsRenderBlendType.invalid;

  derBlendType;

  constructor() {

  }
}
