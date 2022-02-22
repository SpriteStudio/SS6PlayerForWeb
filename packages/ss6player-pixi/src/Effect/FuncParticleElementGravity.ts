import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementGravity} from './ParticleElementGravity';

/**
 * @internal
 */
export class FuncParticleElementGravity implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementGravity = ele as ParticleElementGravity;
    e.particle.useGravity = true;
    e.particle.gravity = source.Gravity;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementGravity = ele as ParticleElementGravity;
    p._gravity = source.Gravity;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
    const source: ParticleElementGravity = ele as ParticleElementGravity;
    particle._gravity.x = source.Gravity.x * particle._exsitTime;
    particle._gravity.y = source.Gravity.y * particle._exsitTime;
  }

}
