import {SsRenderBlendType} from './RenderBlendType';
import {SsCell} from './SsCell';

/// パーツが使用するセルの情報
export class SsCellValue {
  blendType: SsRenderBlendType = SsRenderBlendType.Add;
  refCell: SsCell;

  constructor() {
  }
}
