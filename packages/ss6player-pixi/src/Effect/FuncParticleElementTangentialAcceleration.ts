import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementTangentialAcceleration} from './ParticleElementTangentialAcceleration';

export class FuncParticleElementTangentialAcceleration implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementTangentialAcceleration = ele as ParticleElementTangentialAcceleration;
    e.particle.useTanAccel = true;
    e.particle.tangentialAccel = source.Acceleration.getMinValue();
    e.particle.tangentialAccel2 = (source.Acceleration.getMaxValue() - source.Acceleration.getMinValue());
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementTangentialAcceleration = ele as ParticleElementTangentialAcceleration;
    p._tangentialAccel = VarianceCalc(e, source.Acceleration.getMinValue(), source.Acceleration.getMaxValue());
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }
}
