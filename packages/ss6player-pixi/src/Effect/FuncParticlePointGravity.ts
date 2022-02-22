import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticlePointGravity} from './ParticlePointGravity';
import {SsPoint2} from './SsPoint2';

/**
 * @internal
 */
export class FuncParticlePointGravity implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticlePointGravity = ele as ParticlePointGravity;
    e.particle.usePGravity = true;
    e.particle.gravityPos = source.Position;
    // e->particle.gravityPower = source->Power / 100.0f;
    e.particle.gravityPower = source.Power;
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticlePointGravity = ele as ParticlePointGravity;

    let Target: SsPoint2 = new SsPoint2();
		Target.x = source.Position.x + p.parentEmitter.position.x;
		Target.y = source.Position.y + p.parentEmitter.position.y;

		// 現在地点から指定された点に対してのベクトル*パワーを与える
		let v2: SsPoint2 = new SsPoint2();
    v2.x = Target.x - p._position.x;
    v2.y = Target.y - p._position.y;
		let v2_temp: SsPoint2 = v2;

    SsPoint2.normalizeStatic(v2, v2);

		v2.x = v2.x * source.Power;
    v2.y = v2.y * source.Power;

		p._gravity.x = p._gravity.x + v2.x;
    p._gravity.y = p._gravity.y + v2.y;
  }
}
