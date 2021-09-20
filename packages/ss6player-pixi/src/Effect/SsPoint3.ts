export class SsPoint3 {
  private data: Array<number> = new Array(3);
  get x() {
    return this.data[0];
  }
  set x(value: number) {
    this.data[0] = value;
  }

  get y() {
    return this.data[1];
  }
  set y(value: number) {
    this.data[1] = value;
  }

  get z() {
    return this.data[2];
  }
  set z(value: number) {
    this.data[2] = value;
  }

  constructor();
  constructor(x: number, y: number, z: number);
  constructor(a1?: any, a2?: any, a3?: any) {
    if (a1 === undefined) {
      this.x = this.y = this.z = 0;
    } else {
      this.x = a1;
      this.y = a2;
      this.z = a3;
    }
  }
}
