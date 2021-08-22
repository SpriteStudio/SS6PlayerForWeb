import {emitterParameter} from './emitterParameter';
import {XorShift32} from './XorShift32';
import {particleParameter} from './particleParameter';
import {EffectConstants} from './EffectConstants';
import {emitPattern} from './emitPattern';
import {particleExistSt} from './particleExistSt';
import {particleDrawData} from './particleDrawData';

export class SsEffectEmitter {
  // SsCellValue		 dispCell;

  priority: number;

  emitter: emitterParameter;
  particle: particleParameter;
  rand: XorShift32;

  emitterSeed: number = EffectConstants.SEED_MAGIC;
  seedOffset: number;

  _emitpattern: emitPattern[] = null;
  _offsetPattern: number[];

  particleExistList: particleExistSt[] = null;

  particleIdMax: number;

  particleListBufferSize: number = 180 * 100;
  seedList: number[] = null;

  // SsVector2   				position;
  _parent: SsEffectEmitter;

  _parentIndex: number = -1;

  // SsCell*						refCell;    //�`��p�Z��
  // SsEffectBehavior*           refData;	//�f�[�^�X�V�p

  globaltime: number = 0;
  seedTableLen: number = 0;

  uid: number;

  constructor() {
  }

  setSeedOffset(offset: number): void {
    this.seedOffset = offset;
  }

  getParticleIDMax(): number {
    return this._offsetPattern.length;
  }

  getParticleDataFromID(id: number): particleExistSt {
    return this.particleExistList[id];
  }

  updateEmitter(time: number, slide: number): void {
    // TODO: impl
  }

  getTimeLength(): number {
    return this.emitter.life + (this.emitter.particleLife + this.emitter.particleLife2);
  }

  updateParticle(time: number, p: particleDrawData, recalc: boolean = false): void {
    // TODO: impl
  }

  precalculate2() {
    this.rand.initGenrand(this.emitterSeed);

    this._emitpattern = [];
    this._offsetPattern = [];

    if (this.particleExistList === null) {
      this.particleExistList = new Array(this.emitter.emitmax);
    }

    if (this.emitter.emitnum < 1) this.emitter.emitnum = 1;

    let cycle = Math.floor(((this.emitter.emitmax * this.emitter.interval) / this.emitter.emitnum) + 0.5);
    let group = this.emitter.emitmax / this.emitter.emitnum;

    let extendsize = this.emitter.emitmax * EffectConstants.LIFE_EXTEND_SCALE;
    if (extendsize < EffectConstants.LIFE_EXTEND_MIN) extendsize = EffectConstants.LIFE_EXTEND_MIN;

    let shot = 0;
    let offset = this.particle.delay;
    for (let i = 0; i < this.emitter.emitmax; i++) {
      if (shot >= this.emitter.emitnum) {
        shot = 0;
        offset += this.emitter.interval;
      }
      this._offsetPattern.push(offset);
      shot++;
    }

    for (let i = 0; i < extendsize; i++) {
      let e: emitPattern = new emitPattern();
      e.uid = i;
      e.life = this.emitter.particleLife + this.emitter.particleLife2 * this.rand.genrandFloat32();
      e.cycle = cycle;
      if (e.life > cycle) {
        e.cycle = e.life;
      }

      this._emitpattern.push(e);
    }

    if (this.seedList !== null) {
      this.seedList = null;
    }

    this.particleListBufferSize = this.emitter.emitmax;

    this.rand.initGenrand((this.emitterSeed));

    this.seedTableLen = this.particleListBufferSize * 3;
    this.seedList = new Array(this.seedTableLen);

    for (let i = 0; i < this.seedTableLen; i++) {
      this.seedList[i] = this.rand.genrandUint32();
    }
  }
}
