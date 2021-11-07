import {EffectFuncBase} from './EffectFuncBase';
import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';
import {ParticleElementPosition} from './ParticleElementPosition';
import {Point} from '@pixi/math';

export class FuncParticleElementPosition implements EffectFuncBase {
  initalizeEffect(ele: EffectElementBase, e: EffectEmitter) {
    const source: ParticleElementPosition = ele as ParticleElementPosition;
    e.particle.useOffset = true;
    e.particle.offset = new Point(source.OffsetX.getMinValue(), source.OffsetY.getMinValue());
    e.particle.offset2 = new Point(source.OffsetX.getMaxValue() - source.OffsetX.getMinValue(), source.OffsetY.getMaxValue() - source.OffsetY.getMinValue());
  }

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, p: SsEffectRenderParticle) {
    const source: ParticleElementPosition = ele as ParticleElementPosition;
    p._position.x = p._baseEmiterPosition.x + VarianceCalc(e, source.OffsetX.getMinValue(), source.OffsetX.getMaxValue());
    p._position.y = p._baseEmiterPosition.y + VarianceCalc(e, source.OffsetY.getMinValue(), source.OffsetY.getMaxValue());
  }

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter) {
  }

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
  }

}
