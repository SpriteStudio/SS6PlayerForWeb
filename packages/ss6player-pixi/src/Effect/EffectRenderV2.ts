import {EffectModel} from './EffectModel';
import {EffectEmitter} from './EffectEmitter';
import {particleDrawData} from './particleDrawData';
import {EffectNode} from './EffectNode';
import {EffectConstants} from './EffectConstants';
import {Point} from '@pixi/math';

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

  protected particleDraw(e: EffectEmitter, t: number, parent: EffectEmitter = null, plp: particleDrawData = null) {
    // TODO: impl
  }

  protected initEmitter(e: EffectEmitter, node: EffectNode) {
    // TODO: impl
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

  // TODO: impl
  /*
  drawSprite(
			SsCellValue*		dispCell,
			SsVector2	_position,
			SsVector2 _size,
      _rotation: number,
			direction: number,
			SsFColor	_color,
			SsRenderBlendType::_enum blendType
		);
   */

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
