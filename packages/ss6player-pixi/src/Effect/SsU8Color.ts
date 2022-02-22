/**
 * @internal
 */
export class SsU8Color {
  private _color = new Uint8Array([0, 0, 0, 0]);

  get r(): number {
    return this._color[0];
  }

  set r(value: number) {
    this._color[0] = value;
  }

  get g(): number {
    return this._color[1];
  }

  set g(value: number) {
    this._color[1] = value;
  }

  get b(): number {
    return this._color[2];
  }

  set b(value: number) {
    this._color[2] = value;
  }

  get a(): number {
    return this._color[3];
  }

  set a(value: number) {
    this._color[3] = value;
  }

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(s: SsU8Color);
  constructor(r: number, g: number, b: number, a: number);
  constructor(a1?: any, a2?: any, a3?: any, a4?: any) {
    if (typeof a1 === 'number') {
      this.r = a1;
      this.g = a2;
      this.b = a3;
      this.a = a4;
    } else if (a1 !== undefined) {
      const s: SsU8Color = a1;
      this.r = s.r;
      this.g = s.g;
      this.b = s.b;
      this.a = s.a;
    }
  }

  fromARGB(c: number) {
    this.a = (c >> 24);
    this.r = ((c >> 16) & 0xff);
    this.g = ((c >> 8) & 0xff);
    this.b = (c & 0xff);
  }

  fromBGRA(c: number) {
    this.b = (c >> 24) ;
    this.g = ((c >> 16) & 0xff) ;
    this.r = ((c >> 8) & 0xff) ;
    this.a = (c & 0xff) ;
  }

  toARGB(): number {
    return ((this.a) << 24 | (this.r) << 16 | (this.g) << 8 | (this.b));
  }
}
