import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementRndSeedChange} from './ParticleElementRndSeedChange';
import {EffectConstants} from './EffectConstants';

/**
 * @internal
 */
export class FuncParticleElementRndSeedChange implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementRndSeedChange = ele as ParticleElementRndSeedChange;
    e.particle.userOverrideRSeed = true;

    e.particle.overrideRSeed = source.Seed + EffectConstants.SEED_MAGIC;
    e.emitterSeed = source.Seed + EffectConstants.SEED_MAGIC;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
    const source: ParticleElementRndSeedChange = ele as ParticleElementRndSeedChange;
    emmiter.setMySeed(source.Seed);
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
