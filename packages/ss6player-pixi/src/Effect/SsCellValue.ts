import {SsRenderBlendType} from './RenderBlendType';
import {SsCell} from './SsCell';

/**
 * @internal
 */
export class SsCellValue {
  blendType: SsRenderBlendType = SsRenderBlendType.Add;
  refCell: SsCell;

  constructor() {
  }
}
