export class SsColor {
  private num: Array<number> = new Array<number>(4);
  get r(): number {
    return this.num[0];
  }
  set r(value: number) {
    this.num[0] = value;
  }

  get g(): number {
    return this.num[1];
  }
  set g(value: number) {
    this.num[1] = value;
  }
  get b(): number {
    return this.num[2];
  }
  set b(value: number) {
    this.num[2] = value;
  }
  get a(): number {
    return this.num[3];
  }
  set a(value: number) {
    this.num[3] = value;
  }

  constructor();
  // constructor(h: SsColor);
  constructor(r: number, g: number, b: number, a: number);
  constructor(a1?: any, a2?: any, a3?: any, a4?: any) {
    if (a1 === undefined) {
      this.r = this.g = this.b = this.a = 0;
    } else {
      this.r = a1;
      this.g = a2;
      this.b = a3;
      this.a = a4;
    }
  }
}
