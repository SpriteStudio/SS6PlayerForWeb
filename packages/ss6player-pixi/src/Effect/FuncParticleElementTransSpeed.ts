import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementTransSpeed} from './ParticleElementTransSpeed';
import {ParticleUtils} from './ParticleUtils';

/**
 * @internal
 */
export class FuncParticleElementTransSpeed implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementTransSpeed = ele as ParticleElementTransSpeed;
    e.particle.useTransSpeed = true;
    e.particle.transSpeed = source.Speed.getMinValue();
    e.particle.transSpeed2 = source.Speed.getMaxValue() - source.Speed.getMinValue();
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementTransSpeed = ele as ParticleElementTransSpeed;
    p.lastspeed = ParticleUtils.VarianceCalc(e, source.Speed.getMinValue(), source.Speed.getMaxValue());
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    // ParticleElementTransSpeed* source = static_cast<ParticleElementTransSpeed*>(ele);
    let per: number = (p._exsitTime / p._lifetime);
    p.speed = (p.firstspeed + (p.lastspeed - p.firstspeed) * per);
  }
}
