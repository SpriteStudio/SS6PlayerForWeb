import {Cell} from 'ssfblib';
import {SSRect} from './SSRect';

/**
 * @internal
 */
export class SsCell {
  cell: Cell;
  get pivot_X(): number {
    return this.cell.pivotX();
  }
  get pivot_Y(): number {
    return this.cell.pivotY();
  }
  texture: any; // TODO: TextuerData
  rect: SSRect;
  texname: string; // TODO:

  get cellIndex(): number {
    return this.cell.indexInCellMap();
  }
  get cellName(): string {
    return this.cell.name();
  }
  get u1(): number {
    return this.cell.u1();
  }
  get v1(): number {
    return this.cell.v1();
  }
  get u2(): number {
    return this.cell.u2();
  }
  get v2(): number {
    return this.cell.v2();
  }

  constructor(cell: Cell) {
    this.cell = cell;
  }
}
