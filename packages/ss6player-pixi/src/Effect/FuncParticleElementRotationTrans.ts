import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementRotationTrans} from './ParticleElementRotationTrans';

/**
 * @internal
 */
export class FuncParticleElementRotationTrans implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementRotationTrans = ele as ParticleElementRotationTrans;
    e.particle.useRotationTrans = true;
    e.particle.rotationFactor = source.RotationFactor;
    e.particle.endLifeTimePer = source.EndLifeTimePer / 100.0;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementRotationTrans = ele as ParticleElementRotationTrans;
    if (p._lifetime === 0) return;
    if (source.EndLifeTimePer === 0) {
      p._rotationAddDst = p._rotationAdd * source.RotationFactor;
      p._rotationAddOrg = p._rotationAdd;
      return;
    }
    p._rotationAddDst = p._rotationAdd * source.RotationFactor;
    p._rotationAddOrg = p._rotationAdd;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementRotationTrans = ele as ParticleElementRotationTrans;

    if ((p._lifetime * source.EndLifeTimePer) === 0) {
      p._rotationAdd = EffectEmitter.blendFloat(p._rotationAddOrg, p._rotationAddDst, 1.0);
      return;
    }
    let per: number = (p._exsitTime / (p._lifetime * (source.EndLifeTimePer / 100.0))); // * 100.0f;

    if (per > 1.0) {
      per = 1.0;
    }

    p._rotationAdd = EffectEmitter.blendFloat(p._rotationAddOrg, p._rotationAddDst, per);
  }
}
