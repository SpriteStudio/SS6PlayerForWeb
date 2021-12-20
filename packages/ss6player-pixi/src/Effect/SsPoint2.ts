import {Point} from '@pixi/math';

export class SsPoint2 extends Point {
  constructor();
  constructor(x: number, y: number);
  constructor(a1?: any, a2?: any) {
    super();
    if (typeof a1 === 'number') {
      this.x = a1;
      this.y = a2;
    }
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getLengthSq(): number {
    return this.dot(this); // x*x + y*y;
  }

  getDistanceSq(other: SsPoint2): number {
    let tmp = new SsPoint2();
    tmp.x = this.x - other.x;
    tmp.y = this.y - other.y;
    return tmp.getLengthSq();
  }

  getDistance(other: SsPoint2): number {
    let tmp = new SsPoint2();
    tmp.x = this.x - other.x;
    tmp.y = this.y - other.y;

    return tmp.getLength();
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  dot(other: SsPoint2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: SsPoint2): number {
    return this.x * other.y - this.y * other.x;
  }

  getPerp(): SsPoint2 {
    return new SsPoint2(-this.y, this.x);
  }

  getRPerp(): SsPoint2 {
    return new SsPoint2(this.y, -this.x);
  }

  project(other: SsPoint2): SsPoint2 {
    let dot_num: number = (this.dot(other) / other.dot(other));
    return new SsPoint2(other.x * dot_num, other.y * dot_num);
  }

  rotate(other: SsPoint2): SsPoint2 {
    return new SsPoint2(this.x * other.x - this.y * other.y, this.x * other.y + this.y * other.x);
  }

  unrotate(other: SsPoint2): SsPoint2 {
    return new SsPoint2(this.x * other.x + this.y * other.y, this.y * other.x - this.x * other.y);
  }

  normalize(): SsPoint2 {
    let length: number = this.getLength();
    if (length === 0.0) return new SsPoint2(1.0, 0);
    let tmp: SsPoint2 = new SsPoint2(this.x, this.y);
    tmp.x = tmp.x / this.getLength();
    tmp.y = tmp.y / this.getLength();

    return tmp;
  }

  lerp(other: SsPoint2, alpha: number): SsPoint2 {

    let tmp: SsPoint2 = new SsPoint2(this.x, this.y);
    tmp.x = tmp.x * (1.0 - alpha) + other.x * alpha;
    tmp.y = tmp.y * (1.0 - alpha) + other.y * alpha;
    return tmp;
  }

  static forAngle(a: number): SsPoint2 {
    return new SsPoint2(Math.cos(a), Math.sin(a));
  }
}
