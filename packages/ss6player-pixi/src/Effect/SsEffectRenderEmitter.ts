import {SsEffectRenderAtom} from './SsEffectRenderAtom';
import {Cell} from 'ssfblib';
import {EffectNode} from './EffectNode';
import MersenneTwister from 'mersenne-twister';
import {EmmiterType} from './EmmiterType';
import {SsEffectDrawBatch} from './SsEffectDrawBatch';
import {SsRenderType} from './SsRenderType';
import {SsEffectRenderer} from './SsEffectRenderer';
import {SsEffectNode} from './SsEffectNode';

// --------------------------------------------------------------------------
// パーティクル生成能力を持つオブジェクト
// --------------------------------------------------------------------------
export class SsEffectRenderEmitter extends SsEffectRenderAtom {
  myseed: number;
  dispCell: Cell;
  // エミッターパラメータ

  // パーティクルパラメータ
  param_particle: EffectNode;

  MT: MersenneTwister = null;

  // 以前からの移植
  maxParticle: number;    //
  delay: number;
  interval: number;
  intervalleft: number;
  frame: number;
  frameDelta: number;
  burst: number;

  type: EmmiterType;

  MyName: string;
  particleCount: number;

  generate_ok: boolean;
  drawPriority: number;

  myBatchList: SsEffectDrawBatch;

  InitParameter() {
    if (this.MT == null) this.MT = new MersenneTwister();
    super.Initialize();
    this.delay = 0;
    this.interval = 0;
    this.intervalleft = 0;
    this.frame = 0;
    this.frameDelta = 0;
    this.particleCount = 0;
    this._exsitTime = 0;

    this.generate_ok = true;

    this.param_particle = null;
    this.type = EmmiterType.EmmiterTypeNormal;
  }

  constructor();
  constructor(refdata: SsEffectNode, _p: SsEffectRenderAtom);
  constructor(a1?: any, a2?: any) {
    super();
    if (a1 !== undefined) {
      let refdata: SsEffectNode = a1;
      let _p: SsEffectRenderAtom = a2;

      this.data = refdata;
      this.parent = _p;
      this.InitParameter();
    }
  }

  getMyType(): SsRenderType {
    return SsRenderType.EmmiterNode;
  }

  setMySeed(seed: number) {
    // TODO: impl
  }

  TrushRandom(loop: number) {
    for (let i = 0; i < loop; i++) {
      this.MT.random_int();
    }
  }

  Initialize() {
    // TODO: impl
  }

  genarate(render: SsEffectRenderer): boolean {
    // TODO: impl
    return false;
  }

  update(delta: number) {
    // TODO: impl
  }

  count() {
    this.particleCount = 0;
  }
}
