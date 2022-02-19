import {SsEffectBehavior} from './SsEffectBehavior';
import {EffectFuncBase} from './EffectFuncBase';
import {FuncParticleElementBasic} from './FuncParticleElementBasic';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {FuncParticleElementRndSeedChange} from './FuncParticleElementRndSeedChange';
import {FuncParticleElementDelay} from './FuncParticleElementDelay';
import {FuncParticleElementGravity} from './FuncParticleElementGravity';
import {FuncParticleElementPosition} from './FuncParticleElementPosition';
import {FuncParticleElementRotation} from './FuncParticleElementRotation';
import {FuncParticleElementRotationTrans} from './FuncParticleElementRotationTrans';
import {FuncParticleElementTransSpeed} from './FuncParticleElementTransSpeed';
import {FuncParticleElementTangentialAcceleration} from './FuncParticleElementTangentialAcceleration';
import {FuncParticleElementInitColor} from './FuncParticleElementInitColor';
import {FuncParticleElementTransColor} from './FuncParticleElementTransColor';
import {FuncParticleElementAlphaFade} from './FuncParticleElementAlphaFade';
import {FuncParticleElementSize} from './FuncParticleElementSize';
import {FuncParticleElementTransSize} from './FuncParticleElementTransSize';
import {FuncParticlePointGravity} from './FuncParticlePointGravity';
import {FuncParticleTurnToDirectionEnabled} from './FuncParticleTurnToDirectionEnabled';
import {FuncParticleInfiniteEmitEnabled} from './FuncParticleInfiniteEmitEnabled';
import {EffectEmitter} from './EffectEmitter';
import {SsEffectRenderParticle} from './SsEffectRenderParticle';

export class SsEffectFunctionExecuter {

  static funcBasic: FuncParticleElementBasic = new FuncParticleElementBasic();
  static funcRndSeedChange: FuncParticleElementRndSeedChange = new FuncParticleElementRndSeedChange();
  static funcDelay: FuncParticleElementDelay = new FuncParticleElementDelay();
  static funcGravity: FuncParticleElementGravity = new FuncParticleElementGravity();
  static funcPosition: FuncParticleElementPosition = new FuncParticleElementPosition();
  static funcRotation: FuncParticleElementRotation = new FuncParticleElementRotation();
  static funcRotationTrans: FuncParticleElementRotationTrans = new FuncParticleElementRotationTrans();
  static funcTransSpeed: FuncParticleElementTransSpeed = new FuncParticleElementTransSpeed();
  static funcTangentialAcceleration: FuncParticleElementTangentialAcceleration = new FuncParticleElementTangentialAcceleration();
  static funcInitColor: FuncParticleElementInitColor = new FuncParticleElementInitColor();
  static funcTransColor: FuncParticleElementTransColor = new FuncParticleElementTransColor();
  static funcAlphaFade: FuncParticleElementAlphaFade = new FuncParticleElementAlphaFade();
  static funcSize: FuncParticleElementSize = new FuncParticleElementSize();
  static funcTransSize: FuncParticleElementTransSize = new FuncParticleElementTransSize();
  static funcPointGravity: FuncParticlePointGravity = new FuncParticlePointGravity();
  static funcTurnToDirectionEnabled: FuncParticleTurnToDirectionEnabled = new FuncParticleTurnToDirectionEnabled();
  static funcParticleInfiniteEmitEnabled: FuncParticleInfiniteEmitEnabled = new FuncParticleInfiniteEmitEnabled();

  // -------------------------------------------------------------------
  // 挙動反映クラスの呼び出しテーブル
  // SsEffectFunctionTypeの順に並べること
  // -------------------------------------------------------------------
  private static callTable: Array<EffectFuncBase> = [
    null,
    SsEffectFunctionExecuter.funcBasic,
    SsEffectFunctionExecuter.funcRndSeedChange,
    SsEffectFunctionExecuter.funcDelay,
    SsEffectFunctionExecuter.funcGravity,
    SsEffectFunctionExecuter.funcPosition,
    // &funcTransPosition,
    SsEffectFunctionExecuter.funcRotation,
    SsEffectFunctionExecuter.funcRotationTrans,
    SsEffectFunctionExecuter.funcTransSpeed,
    SsEffectFunctionExecuter.funcTangentialAcceleration,
    SsEffectFunctionExecuter.funcInitColor,
    SsEffectFunctionExecuter.funcTransColor,
    SsEffectFunctionExecuter.funcAlphaFade,
    SsEffectFunctionExecuter.funcSize,
    SsEffectFunctionExecuter.funcTransSize,
    SsEffectFunctionExecuter.funcPointGravity,
    SsEffectFunctionExecuter.funcTurnToDirectionEnabled,
    SsEffectFunctionExecuter.funcParticleInfiniteEmitEnabled
  ];

  static initalize(beh: SsEffectBehavior, emmiter: SsEffectRenderEmitter) {
    for (let e of beh.plist) {
      let cf: EffectFuncBase = SsEffectFunctionExecuter.callTable[e.myType];
      cf.initalizeEmmiter(e, emmiter);
    }
  }

	static updateEmmiter(beh: SsEffectBehavior, emmiter: SsEffectRenderEmitter) {
    for (let e of beh.plist) {
      const cf: EffectFuncBase = SsEffectFunctionExecuter.callTable[e.myType];
      cf.updateEmmiter(e, emmiter);
    }
  }

	static initializeParticle(beh: SsEffectBehavior, emmiter: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
    for (let e of beh.plist) {
      const cf: EffectFuncBase = SsEffectFunctionExecuter.callTable[e.myType];
      cf.initializeParticle(e, emmiter, particle);
    }
  }

  static updateParticle(beh: SsEffectBehavior, emmiter: SsEffectRenderEmitter, particle: SsEffectRenderParticle) {
    for (let e of beh.plist) {
      const cf: EffectFuncBase = SsEffectFunctionExecuter.callTable[e.myType];
      cf.updateParticle(e, emmiter, particle);
    }
  }

  static initializeEffect(beh: SsEffectBehavior, emmiter: EffectEmitter) {
    for (let e of beh.plist) {
      const cf: EffectFuncBase = SsEffectFunctionExecuter.callTable[e.myType];
      cf.initalizeEffect(e, emmiter);
    }
  }
}
