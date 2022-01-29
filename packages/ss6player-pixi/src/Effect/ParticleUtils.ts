import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsU8Color} from './SsU8Color';

export class ParticleUtils {
  // 二つの値の範囲から値をランダムで得る
  static GetRandamNumberRange(e: SsEffectRenderEmitter, a: number, b: number) {
    const min = a < b ? a : b;
    const max = a < b ? b : a;

    const diff = (max - min);

    if (diff === 0) return min;
    return min + (e.MT.random_int() % diff);
  }

  static VarianceCalcColor(e: SsEffectRenderEmitter, out: SsU8Color, color1: SsU8Color, color2: SsU8Color) {
    out.r = ParticleUtils.GetRandamNumberRange(e, color1.r, color2.r);
    out.g = ParticleUtils.GetRandamNumberRange(e, color1.g, color2.g);
    out.b = ParticleUtils.GetRandamNumberRange(e, color1.b, color2.b);
    out.a = ParticleUtils.GetRandamNumberRange(e, color1.a, color2.a);
  }

  static frand(v: number): number {
    let res: number = (v >> 9) | 0x3f800000;
    return res - 1.0;
  }

  static VarianceCalc(e: SsEffectRenderEmitter, base: number, variance: number) {

    let r: number = e.MT.random_int();

    let len: number = variance - base;

    return base + len * ParticleUtils.frand(r);
  }

  static VarianceCalcFin(e: SsEffectRenderEmitter, base: number, variance: number) {
    let r: number = e.MT.random_int();

    return base + (-variance + variance * (ParticleUtils.frand(r) * 2.0));
  }
}
