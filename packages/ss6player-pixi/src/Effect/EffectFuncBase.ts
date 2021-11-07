import {EffectElementBase} from './EffectElementBase';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';

export interface EffectFuncBase {

  initalizeEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter);

  updateEmmiter(ele: EffectElementBase, emmiter: SsEffectRenderEmitter);

  initializeParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle);

  updateParticle(ele: EffectElementBase, e: SsEffectRenderEmitter, particle: SsEffectRenderParticle);

  initalizeEffect(ele: EffectElementBase, emmiter: EffectEmitter);

}
