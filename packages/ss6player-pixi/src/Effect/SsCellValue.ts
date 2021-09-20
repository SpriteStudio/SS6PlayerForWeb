import {SsRenderBlendType} from './RenderBlendType';
import {Cell} from 'ssfblib';

/// パーツが使用するセルの情報
export class SsCellValue {
  blendType: SsRenderBlendType = SsRenderBlendType.Add;
  refCell: Cell;

  constructor() {
  }
}
