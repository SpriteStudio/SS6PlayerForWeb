import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementInitColor} from './ParticleElementInitColor';
import {SsU8Color} from './SsU8Color';

function getRange(a: number, b: number): [number, number] {
	const min: number = a < b ? a : b;
	const max: number = a < b ? b : a;
	const diff = (max - min);
  return [min, diff];
}

// 二つの値の範囲から値をランダムで得る
function GetRandamNumberRange(e: SsEffectRenderEmitter, a: number, b: number): number {
	const min: number = a < b ? a : b;
	const max: number = a < b ? b : a;

  const diff: number = (max - min);

	if (diff === 0) return min;
	return min + (e.MT.random_int() % diff); // genrand_uint32
}

function VarianceCalcColor(e: SsEffectRenderEmitter, out: SsU8Color, color1: SsU8Color, color2: SsU8Color) {
	out.r = GetRandamNumberRange(e, color1.r, color2.r);
	out.g = GetRandamNumberRange(e, color1.g, color2.g);
	out.b = GetRandamNumberRange(e, color1.b, color2.b);
	out.a = GetRandamNumberRange(e, color1.a, color2.a);
}

/**
 * @internal
 */
export class FuncParticleElementInitColor implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementInitColor = ele as ParticleElementInitColor;
    e.particle.useColor = true;

    const color1: SsU8Color = source.Color.getMinValue();
    const color2: SsU8Color = source.Color.getMaxValue();

    [e.particle.initColor.a, e.particle.initColor2.a] = getRange(color1.a, color2.a);
    [e.particle.initColor.r, e.particle.initColor2.r] = getRange(color1.r, color2.r);
    [e.particle.initColor.g, e.particle.initColor2.g] = getRange(color1.g, color2.g);
    [e.particle.initColor.b, e.particle.initColor2.b] = getRange(color1.b, color2.b);
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementInitColor = ele as ParticleElementInitColor;
    VarianceCalcColor(e, p._startcolor, source.Color.getMinValue(), source.Color.getMaxValue());
    p._color = p._startcolor;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
