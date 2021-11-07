import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementInitColor} from './ParticleElementInitColor';

export class FuncParticleElementInitColor implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, emmiter: EffectEmitter) {
    const source: ParticleElementInitColor = ele as ParticleElementInitColor;
		e.particle.useColor = true;

		SsU8Color color1 = source.Color.getMinValue();
		SsU8Color color2 = source.Color.getMaxValue();

		getRange(color1.a, color2.a, e->particle.initColor.a, e->particle.initColor2.a);
		getRange(color1.r, color2.r, e->particle.initColor.r, e->particle.initColor2.r);
		getRange(color1.g, color2.g, e->particle.initColor.g, e->particle.initColor2.g);
		getRange(color1.b, color2.b, e->particle.initColor.b, e->particle.initColor2.b);
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
