import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementBasic} from './ParticleElementBasic';
import {SsPoint3} from './SsPoint3';
import {EffectConstants} from './EffectConstants';
import {SsU8Color} from './SsU8Color';
import {SsPoint2} from './SsPoint2';
import {ParticleUtils} from './ParticleUtils';

export class FuncParticleElementBasic implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {

  }

  initalizeEmmiter(ele: EffectElementBase, e: SsEffectRenderEmitter) {
    let source: ParticleElementBasic = ele as ParticleElementBasic;

    e.maxParticle = source.maximumParticle;
    e.interval = source.interval;
    e._lifetime = source.lifetime;
    e._life = source.lifetime;
    e.burst = source.attimeCreate;

    e.undead = false;
    e.drawPriority = source.priority;

    if (e._lifetime == null) e.undead = true;
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
		let source: ParticleElementBasic = ele as ParticleElementBasic;
		let eVec: SsPoint3 = e.getPosition();
		let eAngle: number = 0.0;

		p._baseEmiterPosition.x = eVec.x;
		p._baseEmiterPosition.y = eVec.y;
		p._position.x = p._baseEmiterPosition.x;
		p._position.y = p._baseEmiterPosition.y;
		p._size = new SsPoint2(1.0, 1.0);

		p._color = new SsU8Color(255, 255, 255, 255);
		p._startcolor = new SsU8Color(255, 255, 255, 255);
		p._endcolor = p._startcolor;

    p._backposition = p._position;

    p._lifetime = ParticleUtils.VarianceCalc(e, source.lifespan.getMinValue(), source.lifespan.getMaxValue());
		p._life = source.lifetime;
		let temp_angle: number = ParticleUtils.VarianceCalcFin(e, source.angle + eAngle, source.angleVariance / 2.0);

		let angle_rad: number = EffectConstants.DegreeToRadian((temp_angle + 90.0));
		let lspeed: number = ParticleUtils.VarianceCalc(e, source.speed.getMinValue(), source.speed.getMaxValue());

		p.speed = lspeed;
		p.firstspeed = lspeed;
		p.vector.x = Math.cos(angle_rad);
		p.vector.y = Math.sin(angle_rad);

		p._force = new SsPoint2(0, 0); // p->vector * p->speed;
		p.direction = 0;
		p.isTurnDirection = false;

		p._rotation = 0;
		p._rotationAdd = 0;
		p._rotationAddDst = 0;
		p._rotationAddOrg = 0;

		p._rotation = 0;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
