import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementSize} from './ParticleElementSize';

export class FuncParticleElementSize implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementSize = ele as ParticleElementSize;

    e.particle.useInitScale = true;

    e.particle.scale.x = source.SizeX.getMinValue();
    e.particle.scaleRange.x = source.SizeX.getMaxValue() - source.SizeX.getMinValue();

    e.particle.scale.y = source.SizeY.getMinValue();
    e.particle.scaleRange.y = source.SizeY.getMaxValue() - source.SizeY.getMinValue();

    e.particle.scaleFactor = source.ScaleFactor.getMinValue();
    e.particle.scaleFactor2 = source.ScaleFactor.getMaxValue() - source.ScaleFactor.getMinValue();
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementSize = ele as ParticleElementSize;

    p._size.x = VarianceCalc(e, source.SizeX.getMinValue(), source.SizeX.getMaxValue());
    p._size.y = VarianceCalc(e, source.SizeY.getMinValue(), source.SizeY.getMaxValue());
    let sf: number = VarianceCalc(e, source.ScaleFactor.getMinValue(), source.ScaleFactor.getMaxValue());

    p._size.x = p._size.x * sf;
    p._size.y = p._size.y * sf;
    p._startsize = p._size;
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
