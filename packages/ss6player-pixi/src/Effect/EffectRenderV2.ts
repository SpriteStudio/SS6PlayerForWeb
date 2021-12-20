import {EffectModel} from './EffectModel';
import {EffectEmitter} from './EffectEmitter';
import {particleDrawData} from './particleDrawData';
import {EffectNode} from './EffectNode';
import {EffectConstants} from './EffectConstants';
import {Point} from '@pixi/math';
import {particleExistSt} from './particleExistSt';
import {SsRenderBlendType} from './RenderBlendType';
import {Cell} from 'ssfblib';
import {SsEffectFunctionExecuter} from './EffectFunctionExecuter';

export class EffectRenderV2 {
  effectData: EffectModel;

  emmiterList: EffectEmitter[];
  updateList: EffectEmitter[];

  mySeed: number = 0;

  /* layoutPosition: SsVector3; */
  layoutScale: Point = new Point();

  nowFrame: number;
  targetFrame: number;
  secondNowFrame: number;

  effectTimeLength: number = 0;

  Infinite: boolean;

  /* parentState: SsPartState; */

  isIntFrame: boolean = true;

  m_isPlay: boolean;
  m_isPause: boolean;
  m_isLoop: boolean;

  seedOffset: number = 0;

  _isWarningData: boolean;

  _isContentScaleFactorAuto: boolean = false;
  /* CustomSprite						*_parentSprite = null; */

  _drawSpritecount: number;

  protected particleDraw(e: EffectEmitter, time: number, parent: EffectEmitter = null, plp: particleDrawData = null) {
    let t: number = time;

    if (e == null) return;

    let pnum: number = e.getParticleIDMax();

    let slide: number = (parent == null) ? 0 : plp.id;
    e.updateEmitter(time, slide);

    for (let id = 0; id < pnum; id++) {
      const drawe: particleExistSt = e.getParticleDataFromID(id);

      if (!drawe.born) {
        continue;
      }

      let targettime = t;
      let lp: particleDrawData = new particleDrawData();
      let pp: particleDrawData = new particleDrawData();
      pp.x = 0;
      pp.y = 0;

      lp.id = id + drawe.cycle;
      lp.stime = drawe.stime;
      lp.lifetime = drawe.endtime;
      lp.pid = 0;

      if (parent !== null) {
        lp.pid = plp.id;
      }

      // if ( lp.stime == lp.lifetime ) continue;

      // if ( lp.stime <= targettime && lp.lifetime >= targettime)
      if (drawe.exist) {

        if (parent !== null) {
          pp.id = plp.id;
          pp.stime = plp.stime;
          pp.lifetime = plp.lifetime;
          pp.pid = plp.pid;

          let ptime: number = lp.stime + pp.stime;
          if (ptime > lp.lifetime) {
            ptime = lp.lifetime;
          }

          parent.updateParticle(lp.stime + pp.stime, pp);
          e.position.x = pp.x;
          e.position.y = pp.y;
        }

        e.updateParticle(targettime, lp);

        this.drawSprite(e.dispCell,
          new Point(lp.x, lp.y),
          lp.scale,
          lp.rot,
          lp.direc,
          lp.color,
          e.refData.blendType);
      }
    }
  }

  protected initEmitter(e: EffectEmitter, node: EffectNode) {
    e.refData = node.getMyBehavior();

    e.dispCell.refCell = e.refData.refCell;
    e.dispCell.blendType = e.refData.blendType;

    SsEffectFunctionExecuter.initializeEffect(e.refData, e);

    e.emitterSeed = this.mySeed;

    if (e.particle.userOverrideRSeed) {
      e.emitterSeed = e.particle.overrideRSeed;
    } else {
      if (this.effectData.isLockRandSeed) {
        e.emitterSeed = (this.effectData.lockRandSeed + 1) * EffectConstants.SEED_MAGIC;
      }
    }

    e.emitter.life += e.particle.delay;
  }

  protected clearEmitterList() {
    // TODO: impl
  }

  play() {
    this.m_isPause = false;
    this.m_isPlay = true;
  }

  stop() {
    this.m_isPlay = false;
  }

  pause() {
    this.m_isPause = true;
    this.m_isPlay = false;
  }

  setLoop(flag: boolean) {
    this.m_isLoop = flag;
  }

  isplay(): boolean {
    return this.m_isPlay;
  }

  ispause(): boolean {
    return this.m_isPause;
  }

  isloop(): boolean {
    return this.m_isLoop;
  }

  setEffectData(data: EffectModel) {
    // TODO: impl
  }

  setSeed(seed: number) {
    this.mySeed = seed * EffectConstants.SEED_MAGIC;
  }

  setFrame(frame: number) {
    this.nowFrame = frame;
  }

  getFrame(): number {
    return this.nowFrame;
  }

  update() {
    // TODO: impl
  }

  draw() {
    // TODO: impl
  }

  reload() {
    // TODO: impl
  }

  getEffectTimeLength(): number {
    // TODO: impl
    return 0;
  }

  // TODO: impl
  /* setParentAnimeState( SsPartState* state ){ this.parentState = state; } */

  getCurrentFPS(): number {
    // TODO: impl
    return 0;
  }

  getPlayStatus(): boolean {
    return this.m_isPlay;
  }

  drawSprite(
			dispCell: Cell,
      _position: Point,
			_size: Point,
      _rotation: number,
			direction: number,
      _color: Array<number>,
      blendType: SsRenderBlendType
		) {
      // TODO: impl
    }

  setSeedOffset(offset: number) {
    if (this.effectData.isLockRandSeed) {
      this.seedOffset = 0;
    } else {
      this.seedOffset = offset;
    }
  }

  isInfinity(): boolean {
    return this.Infinite;
  }

  isWarning(): boolean {
    return this._isWarningData;
  }

  setContentScaleEneble(eneble: boolean) {
    this._isContentScaleFactorAuto = eneble;
  }

  // TODO: impl
  /* setParentSprite(CustomSprite* sprite) { this._parentSprite = sprite; } */

  getDrawSpriteCount(): number {
    return this._drawSpritecount;
  }
}
