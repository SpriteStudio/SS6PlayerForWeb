import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementDelay} from './ParticleElementDelay';

export class FuncParticleElementDelay implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementDelay = ele as ParticleElementDelay;
    e.particle.delay = source.DelayTime;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
    const source: ParticleElementDelay = ele as ParticleElementDelay;
    emmiter.delay = source.DelayTime;
    emmiter._lifetime = emmiter._lifetime + source.DelayTime;
    emmiter._life = emmiter._lifetime;
    emmiter.generate_ok = false;
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
    const source: ParticleElementDelay = ele as ParticleElementDelay;
    // 既定の時間までストップ？
    if (emmiter._exsitTime >= source.DelayTime) {
      emmiter.generate_ok = true;
    }
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
