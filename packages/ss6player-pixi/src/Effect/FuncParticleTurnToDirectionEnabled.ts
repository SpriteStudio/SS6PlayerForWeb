import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleTurnToDirectionEnabled} from './ParticleTurnToDirectionEnabled';

/**
 * @internal
 */
export class FuncParticleTurnToDirectionEnabled implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleTurnToDirectionEnabled = ele as ParticleTurnToDirectionEnabled;
    e.particle.useTurnDirec = true;
    e.particle.direcRotAdd = source.Rotation;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
    particle.isTurnDirection = true;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
