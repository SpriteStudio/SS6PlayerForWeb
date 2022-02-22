import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementRotation} from './ParticleElementRotation';
import {ParticleUtils} from './ParticleUtils';

/**
 * @internal
 */
export class FuncParticleElementRotation implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
		const source: ParticleElementRotation = ele as ParticleElementRotation;
		e.particle.useRotation = true;
		e.particle.rotation = source.Rotation.getMinValue();
		e.particle.rotation2 = source.Rotation.getMaxValue() - source.Rotation.getMinValue();

		e.particle.rotationAdd = source.RotationAdd.getMinValue();
		e.particle.rotationAdd2 = source.RotationAdd.getMaxValue() - source.RotationAdd.getMinValue();
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementRotation = ele as ParticleElementRotation;

		p._rotation = ParticleUtils.VarianceCalc(e, source.Rotation.getMinValue(), source.Rotation.getMaxValue());
		p._rotationAdd = ParticleUtils.VarianceCalc(e, source.RotationAdd.getMinValue(), source.RotationAdd.getMaxValue());
		p._rotationAddDst = p._rotationAdd;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }
}
