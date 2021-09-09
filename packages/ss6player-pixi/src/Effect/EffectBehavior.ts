import {EffectElementBase} from './EffectElementBase';
import { Cell } from 'ssfblib';
import {SsRenderBlendType} from './RenderBlendType';

export class SsEffectBehavior {
  plist: Array<EffectElementBase>;

  CellIndex: number;
  refCell: Cell;
  CellName: string;
  CellMapName: string;
  blendType: SsRenderBlendType = SsRenderBlendType.invalid;

  derBlendType;

  constructor() {

  }
}
