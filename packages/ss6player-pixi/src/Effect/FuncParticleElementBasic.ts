import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementBasic} from './ParticleElementBasic';
import {SsPoint3} from './SsPoint3';
import {Point} from '@pixi/math';

import {EffectConstants} from './EffectConstants';
import {SsColor} from './SsColor';

// 二つの値の範囲から値をランダムで得る
class hoge {
  static GetRandamNumberRange(e: SsEffectRenderEmitter, a: number, b: number) {
    let min = a < b ? a : b;
    let max = a < b ? b : a;

    let diff = (max - min);

    if (diff === 0) return min;
    return min + (e.MT.random_int() % diff);
  }

  static VarianceCalcColor(e: SsEffectRenderEmitter, out: SsColor, color1: SsColor, color2: SsColor) {
    out.r = hoge.GetRandamNumberRange(e, color1.r, color2.r);
    out.g = hoge.GetRandamNumberRange(e, color1.g, color2.g);
    out.b = hoge.GetRandamNumberRange(e, color1.b, color2.b);
    out.a = hoge.GetRandamNumberRange(e, color1.a, color2.a);
  }

  static frand(v: number): number {
    let res: number = (v >> 9) | 0x3f800000;
    return res - 1.0;
  }

  static VarianceCalc(e: SsEffectRenderEmitter, base: number, variance: number) {

    let r: number = e.MT.random_int();

    let len: number = variance - base;

    return base + len * hoge.frand(r);
  }

  static VarianceCalcFin(e: SsEffectRenderEmitter, base: number, variance: number) {
    let r: number = e.MT.random_int();

    return base + (-variance + variance * (hoge.frand(r) * 2.0));
  }
}

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
		p._size = new Point(1.0, 1.0);

		p._color = new SsColor(255, 255, 255, 255);
		p._startcolor = new SsColor(255, 255, 255, 255);
		p._endcolor = p._startcolor;

    p._backposition = p._position;

    p._lifetime = hoge.VarianceCalc(e, source.lifespan.getMinValue(), source.lifespan.getMaxValue());
		p._life = source.lifetime;
		let temp_angle: number = hoge.VarianceCalcFin(e, source.angle + eAngle, source.angleVariance / 2.0);

		let angle_rad: number = EffectConstants.DegreeToRadian((temp_angle + 90.0));
		let lspeed: number = hoge.VarianceCalc(e, source.speed.getMinValue(), source.speed.getMaxValue());

		p._speed = lspeed;
		p.firstspeed = lspeed;
		p.vector.x = Math.cos(angle_rad);
		p.vector.y = Math.sin(angle_rad);

		p._force = new Point(0, 0); // p->vector * p->speed;
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
