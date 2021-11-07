import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementAlphaFade} from './ParticleElementAlphaFade';

export class FuncParticleElementAlphaFade implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementAlphaFade = ele as ParticleElementAlphaFade;
    e.particle.useAlphaFade = true;
    e.particle.alphaFade = source.disprange.getMinValue();
    e.particle.alphaFade2 = source.disprange.getMaxValue();
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
    const source: ParticleElementAlphaFade = ele as ParticleElementAlphaFade;

    if (particle._lifetime === 0) {
      return;
    }

    let per: number = (particle._exsitTime / particle._lifetime) * 100.0;

    let start: number = source.disprange.getMinValue();
    let end: number = source.disprange.getMaxValue();

    if (per < start) {
      let alpha: number = (start - per) / start;
      particle._color.a *= 1.0 - alpha;
      return;
    }

    if (per > end) {

      if (end >= 100.0) {
        particle._color.a = 0;
        return;
      }
      let alpha: number = (per - end) / (100.0 - end);
      particle._color.a *= 1.0 - alpha;
      return;
    }
  }

}
