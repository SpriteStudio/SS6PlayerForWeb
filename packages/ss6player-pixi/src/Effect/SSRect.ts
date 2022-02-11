
import {Rectangle} from 'pixi.js';

export class SSRect extends Rectangle {

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(other: SSRect);
  constructor(x: number, y: number, width: number, height: number);
  constructor(a1?: any, a2?: any, a3?: any, a4?: any) {
    super();

    if (a1 === undefined) {
      this.setRect(0.0, 0.0, 0.0, 0.0);
    } else if (a1 instanceof SSRect) {
      const other: SSRect = a1;
      this.setRect(other.x, other.y, other.width, other.height);
    } else {
      const x: number = a1;
      const y: number = a2;
      const width: number = a3;
      const height: number = a4;

      this.setRect(x, y, width, height);
    }
  }

  setRect(x: number, y: number, width: number, height: number) {
    // CGRect can support width<0 or height<0
    // SS_ASSERT2(width >= 0.0 && height >= 0.0, 'width and height of Rect must not less than 0.');

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;
  }

  getMaxX(): number {
    return (this.x + this.width);
  }

  getMidX(): number {
    return (this.x + this.width / 2.0);
  }

  getMinX(): number {
    return this.x;
  }

  getMaxY(): number {
    return this.y + this.height;
  }

  getMidY(): number {
    return (this.y + this.height / 2.0);
  }

  getMinY(): number {
    return this.y;
  }

  containsPoint(point: SSRect): boolean {
    let bRet: boolean = false;

    if (point.x >= this.getMinX() && point.x <= this.getMaxX()
      && point.y >= this.getMinY() && point.y <= this.getMaxY()) {
      bRet = true;
    }

    return bRet;
  }

  intersectsRect(rect: SSRect): boolean {
    return !(this.getMaxX() < rect.getMinX() ||
      rect.getMaxX() < this.getMinX() ||
      this.getMaxY() < rect.getMinY() ||
      rect.getMaxY() < this.getMinY());
  }

}
