import {SsEffectBehavior} from './EffectBehavior';
import {EffectFuncBase} from './EffectFuncBase';

export class	SsEffectFunctionExecuter {

  static funcBasic: FuncParticleElementBasic;
  static funcRndSeedChange: FuncParticleElementRndSeedChange;
  static funcDelay: FuncParticleElementDelay;
  static funcGravity: FuncParticleElementGravity;
  static funcPosition: FuncParticleElementPosition;
  static funcRotation: FuncParticleElementRotation;
  static funcRotationTrans: FuncParticleElementRotationTrans;
  static funcTransSpeed: FuncParticleElementTransSpeed;
  static funcTangentialAcceleration: FuncParticleElementTangentialAcceleration;
  static funcInitColor: FuncParticleElementInitColor;
  static funcTransColor: FuncParticleElementTransColor;
  static funcAlphaFade: FuncParticleElementAlphaFade;
  static funcSize: FuncParticleElementSize;
  static funcTransSize: FuncParticleElementTransSize;
  static funcPointGravity: FuncParticlePointGravity;
  static funcTurnToDirectionEnabled: FuncParticleTurnToDirectionEnabled;
  static funcParticleInfiniteEmitEnabled: FuncParticleInfiniteEmitEnabled;

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
    SsEffectFunctionExecuter.funcParticleInfiniteEmitEnabled,
  ];

	static initalize(beh: SsEffectBehavior , emmiter: SsEffectRenderEmitter) {
    for (let e of beh.plist) {
      let cf: EffectFuncBase = this.callTable[e.myType];
      cf.initalizeEmmiter(e, emmiter);
    }
  }
  /*
	static updateEmmiter( SsEffectBehavior* beh , SsEffectRenderEmitter* emmiter);
	static initializeParticle( SsEffectBehavior* beh , SsEffectRenderEmitter* e , SsEffectRenderParticle* particle );
	static updateParticle( SsEffectBehavior* beh , SsEffectRenderEmitter* e , SsEffectRenderParticle* particle );

	static initializeEffect(SsEffectBehavior* beh, SsEffectEmitter* emmiter);
   */
}
