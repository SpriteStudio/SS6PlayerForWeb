import {XorShift32} from './XorShift32';
import {EffectConstants} from './EffectConstants';

export class Effect {
  time: number;
  value: number;
}

export class particleExistSt {
  id: number;
  cycle: number;
  exist: number;
  born: number;
  stime: number;
  endtime: number;
}

export class emitPattern {
  uid: number;
  life: number;
  cycle: number;
}

export class particleDrawData {
  id: number;
	pid: number;
	stime: number;
  lifetime: number;

  x: number;
	y: number;
	rot: number;
	direc: number;

	// TODO: impl
  // SsU8Color color;
  // SsVector2 scale;
}

export class emitterParameter {
	life: number = 15;
	interval: number = 1;
	emitnum: number = 2;
	emitmax: number = 32;
	particleLife: number = 15;
	particleLife2: number = 15;
  Infinite: boolean = false;

  loopStart: number;
  loopEnd: number;
	loopLen: number;
	loopGen: number;

  public constructor() {
  }
}

export class particleParameter {

  // SsVector2 	scale;

  // SsU8Color   startcolor; //�X�^�[�g���̃J���[
  // SsU8Color   endcolor;   //�I�����̃J���[

  speed: number;
  speed2: number;

  angle: number;
  angleVariance: number;

  useGravity: boolean;
  // SsVector2	gravity;

  useOffset: boolean;
  // SsVector2   offset;
  // SsVector2   offset2;

  useRotation: boolean;
  rotation: number;
  rotation2: number;

  rotationAdd: number;
  rotationAdd2: number;

  useRotationTrans: boolean;
  rotationFactor: number;
  endLifeTimePer: number;

  useTanAccel: boolean;
  tangentialAccel: number;
  tangentialAccel2: number;

  useColor: boolean;
  // SsU8Color   initColor;
  // SsU8Color   initColor2;

  useTransColor: boolean;
  // SsU8Color   transColor;
  // SsU8Color   transColor2;

  useInitScale: boolean;
  // SsVector2   scaleRange;
  scaleFactor: number;
  scaleFactor2: number;

  useTransScale: boolean;
  // SsVector2   transscale;
  // SsVector2   transscaleRange;
  transscaleFactor: number;
  transscaleFactor2: number;

  delay: number;

  usePGravity: boolean;
  // SsVector2	gravityPos;
  gravityPower: number;

  useAlphaFade: boolean;
  alphaFade: number;
  alphaFade2: number;

  useTransSpeed: boolean;
  transSpeed: number;
  transSpeed2: number;

  useTurnDirec: boolean;
  direcRotAdd: number;

  userOverrideRSeed: boolean;
  overrideRSeed: number;

  public constructor() {

  }
}

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
