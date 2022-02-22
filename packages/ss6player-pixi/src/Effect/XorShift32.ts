/**
 * @internal
 */
export class XorShift32 {
  private seedNow: Uint32Array = new Uint32Array(1);
  private int32Now: Int32Array = new Int32Array(1);

  initGenrand(seed: number) {
    this.seedNow[0] = seed;
  }

  genrandUint32(): number {
    this.seedNow[0] = this.seedNow[0] ^ (this.seedNow[0] << 13);
    this.seedNow[0] = this.seedNow[0] ^ (this.seedNow[0] >> 17);
    this.seedNow[0] = this.seedNow[0] ^ (this.seedNow[0] << 15);

    return this.seedNow[0];
  }

  genrandFloat32(): number {
    const v = this.genrandUint32();
    const res = (v >> 9) | 0x3f800000;
    const r = res - 1.0;

    return r;
  }

}
