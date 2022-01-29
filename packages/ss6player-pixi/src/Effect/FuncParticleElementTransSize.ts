import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementTransSize} from './ParticleElementTransSize';
import {ParticleUtils} from './ParticleUtils';
import {SsPoint2} from './SsPoint2';

export class FuncParticleElementTransSize implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementTransSize = ele as ParticleElementTransSize;
    e.particle.useTransScale = true;

    e.particle.transscale.x = source.SizeX.getMinValue();
    e.particle.transscaleRange.x = source.SizeX.getMaxValue() - source.SizeX.getMinValue();

    e.particle.transscale.y = source.SizeY.getMinValue();
    e.particle.transscaleRange.y = source.SizeY.getMaxValue() - source.SizeY.getMinValue();

    e.particle.transscaleFactor = source.ScaleFactor.getMinValue();
    e.particle.transscaleFactor2 = source.ScaleFactor.getMaxValue() - source.ScaleFactor.getMinValue();
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementTransSize = ele as ParticleElementTransSize;
    let endsize: SsPoint2 = new SsPoint2();
    endsize.x = ParticleUtils.VarianceCalc(e, source.SizeX.getMinValue(), source.SizeX.getMaxValue());
    endsize.y = ParticleUtils.VarianceCalc(e, source.SizeY.getMinValue(), source.SizeY.getMaxValue());

    let sf: number = ParticleUtils.VarianceCalc(e, source.ScaleFactor.getMinValue(), source.ScaleFactor.getMaxValue());

    endsize.x = endsize.x * sf;
    endsize.y = endsize.y * sf;

    p._divsize.x = (endsize.x - p._startsize.x) / p._lifetime;
    p._divsize.y = (endsize.y - p._startsize.y) / p._lifetime;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    p._size.x = p._startsize.x + (p._divsize.x * (p._exsitTime));
    p._size.y = p._startsize.y + (p._divsize.y * (p._exsitTime));
  }
}
