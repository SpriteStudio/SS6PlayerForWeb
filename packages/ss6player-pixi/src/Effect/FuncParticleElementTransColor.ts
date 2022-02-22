import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementTransColor} from './ParticleElementTransColor';
import {ParticleUtils} from './ParticleUtils';

/**
 * @internal
 */
export class FuncParticleElementTransColor implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, emmiter: EffectEmitter) {
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementTransColor = ele as ParticleElementTransColor;
    ParticleUtils.VarianceCalcColor(e, p._endcolor, source.Color.getMinValue(), source.Color.getMaxValue());
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    let per: number = (p._exsitTime / p._lifetime);

		if (per > 1.0) {
      per = 1.0;
    }

		p._color.a = EffectEmitter.blendNumber(p._startcolor.a, p._endcolor.a, per);
		p._color.r = EffectEmitter.blendNumber(p._startcolor.r, p._endcolor.r, per);
		p._color.g = EffectEmitter.blendNumber(p._startcolor.g, p._endcolor.g, per);
		p._color.b = EffectEmitter.blendNumber(p._startcolor.b, p._endcolor.b, per);
  }

}
