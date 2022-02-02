import {emitterParameter} from './emitterParameter';
import {XorShift32} from './XorShift32';
import {particleParameter} from './particleParameter';
import {EffectConstants} from './EffectConstants';
import {emitPattern} from './emitPattern';
import {particleExistSt} from './particleExistSt';
import {particleDrawData} from './particleDrawData';
import {Cell} from 'ssfblib';
import {SsEffectBehavior} from './SsEffectBehavior';
import {SsPoint2} from './SsPoint2';
import {SsCellValue} from './SsCellValue';

export class EffectEmitter {
  dispCell: SsCellValue;

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

  position: SsPoint2 = new SsPoint2();
  _parent: EffectEmitter;

  _parentIndex: number = -1;

  refCell: Cell;
  refData: SsEffectBehavior;

  globaltime: number = 0;
  seedTableLen: number = 0;

  uid: number;

  static blendNumber(a: number, b: number, rate: number): number {
    return (a + (b - a) * rate);
  }

  static blendFloat(a: number, b: number, rate: number): number {
    return (a + (b - a) * rate);
  }

  static OutQuad(t: number, totaltime: number, max: number, min: number): number {
    if (totaltime === 0.0) return 0.0;

    if (t > totaltime) t = totaltime;
    max -= min;
    t /= totaltime;
    return -max * t * (t - 2) + min;
  }

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

  updateEmitter(_time: number, slide: number): void {
    const onum: number = this._offsetPattern.length;
    const pnum: number = this._emitpattern.length;
    slide = slide * EffectConstants.SEED_MAGIC;

    for (let i = 0; i < onum; i++) {
      let slide_num: number = (i + slide) % pnum;

      let targetEP: emitPattern = this._emitpattern[slide_num];

      let t = (_time - this._offsetPattern[i]);

      this.particleExistList[i].exist = false;
      this.particleExistList[i].born = false;

      if (targetEP.cycle !== 0) {
        let loopnum = t / targetEP.cycle;
        let cycle_top = loopnum * targetEP.cycle;

        this.particleExistList[i].cycle = loopnum;

        this.particleExistList[i].stime = cycle_top + this._offsetPattern[i];
        this.particleExistList[i].endtime = this.particleExistList[i].stime + targetEP.life;// + _lifeExtend[slide_num];

        if (this.particleExistList[i].stime <= _time && this.particleExistList[i].endtime > _time) {
          this.particleExistList[i].exist = true;
          this.particleExistList[i].born = true;
        }

        if (!this.emitter.Infinite) {
          if (this.particleExistList[i].stime >= this.emitter.life) {
            this.particleExistList[i].exist = false;

            let t: number = this.emitter.life - this._offsetPattern[i];
            let loopnum = t / targetEP.cycle;

            let cycle_top: number = loopnum * targetEP.cycle;

            this.particleExistList[i].stime = cycle_top + this._offsetPattern[i];

            this.particleExistList[i].endtime = this.particleExistList[i].stime + targetEP.life;// + _lifeExtend[slide_num];
            this.particleExistList[i].born = false;
          } else {
            this.particleExistList[i].born = true;
          }
        }

        if (t < 0) {
          this.particleExistList[i].exist = false;
          this.particleExistList[i].born = false;
        }
      }
    }
  }

  getTimeLength(): number {
    return this.emitter.life + (this.emitter.particleLife + this.emitter.particleLife2);
  }

  updateParticle(time: number, p: particleDrawData, recalc: boolean = false): void {
    const _t = time - p.stime;
    const _tm = (_t - 1.0);
    const _t2 = _t * _t;
    const _life = p.lifetime - p.stime;

    if (_life === 0) return;
    let _lifeper = _t / _life;

    let pseed = this.seedList[p.id % this.seedTableLen];

    this.rand.initGenrand((pseed + this.emitterSeed + p.pid + this.seedOffset));

    let rad = this.particle.angle + (this.rand.genrandFloat32() * (this.particle.angleVariance) - this.particle.angleVariance / 2.0);
    // float speed = rand.genrand_float32() * particle.speed;
    let speed = this.particle.speed + (this.particle.speed2 * this.rand.genrandFloat32());

    let addr = 0;
    if (this.particle.useTanAccel) {
      let accel = this.particle.tangentialAccel + (this.rand.genrandFloat32() * this.particle.tangentialAccel2);

      let _speed = speed;
      if (_speed <= 0) _speed = 0.1;

      let l = _life * _speed * 0.2;
      let c = 3.14 * l;

      addr = (accel / c) * _t;
    }

    let x = Math.cos(rad + addr) * speed * _t;
    let y = Math.sin(rad + addr) * speed * _t;

    if (this.particle.useTransSpeed) {
      const transspeed = this.particle.transSpeed + (this.particle.transSpeed2 * this.rand.genrandFloat32());
      const speedadd = transspeed / _life;

      const addtx = Math.cos(rad + addr) * speed;
      const addtx_trans = Math.cos(rad + addr) * speedadd;

      const addx = ((addtx_trans * _t) + addtx) * (_t + 1.0) / 2.0;

      const addty = Math.sin(rad + addr) * speed;
      const addty_trans = Math.sin(rad + addr) * speedadd;

      const addy = ((addty_trans * _t) + addty) * (_t + 1.0) / 2.0;

      x = addx;
      y = addy;
    }

    if (this.particle.useGravity) {
      x += (0.5 * this.particle.gravity.x * (_t2));
      y += (0.5 * this.particle.gravity.y * (_t2));
    }

    let ox: number;
    let oy: number;
    ox = oy = 0;
    if (this.particle.useOffset) {
      ox = (this.particle.offset.x + (this.particle.offset2.x * this.rand.genrandFloat32()));
      oy = (this.particle.offset.y + (this.particle.offset2.y * this.rand.genrandFloat32()));
    }

    p.rot = 0;
    if (this.particle.useRotation) {
      p.rot = this.particle.rotation + (this.rand.genrandFloat32() * this.particle.rotation2);
      let add = this.particle.rotationAdd + (this.rand.genrandFloat32() * this.particle.rotationAdd2);

      if (this.particle.useRotationTrans) {
        let lastt = _life * this.particle.endLifeTimePer;

        let addf = 0;
        if (lastt === 0) {
          let addrf = (add * this.particle.rotationFactor) * _t;
          p.rot += addrf;
        } else {
          addf = (add * this.particle.rotationFactor - add) / lastt;

          let mod_t = _t - lastt;
          if (mod_t < 0) mod_t = 0;

          let nowt = _t;
          if (nowt > lastt) nowt = lastt;

          let final_soul = add + addf * nowt;
          let addrf = (final_soul + add) * (nowt + 1.0) / 2.0;
          addrf -= add;
          addrf += (mod_t * (final_soul));
          p.rot += addrf;
        }
      } else {
        p.rot += ((add * _t));
      }
    }

    p.color[0] = 0xff; // a
    p.color[1] = 0xff; // r
    p.color[2] = 0xff; // g
    p.color[3] = 0xff; // b

    if (this.particle.useColor) {
      p.color[0] = this.particle.initColor[0] + (this.rand.genrandFloat32() * this.particle.initColor2[0]);
      p.color[1] = this.particle.initColor[1] + (this.rand.genrandFloat32() * this.particle.initColor2[1]);
      p.color[2] = this.particle.initColor[2] + (this.rand.genrandFloat32() * this.particle.initColor2[2]);
      p.color[3] = this.particle.initColor[3] + (this.rand.genrandFloat32() * this.particle.initColor2[3]);
    }

    if (this.particle.useTransColor) {
      let ecolor = new Array(4);
      ecolor[0] = this.particle.transColor[0] + (this.rand.genrandFloat32() * this.particle.transColor2[0]);
      ecolor[1] = this.particle.transColor[1] + (this.rand.genrandFloat32() * this.particle.transColor2[1]);
      ecolor[2] = this.particle.transColor[2] + (this.rand.genrandFloat32() * this.particle.transColor2[2]);
      ecolor[3] = this.particle.transColor[3] + (this.rand.genrandFloat32() * this.particle.transColor2[3]);

      p.color[0] = EffectEmitter.blendNumber(p.color[0], ecolor[0], _lifeper);
      p.color[1] = EffectEmitter.blendNumber(p.color[1], ecolor[1], _lifeper);
      p.color[2] = EffectEmitter.blendNumber(p.color[2], ecolor[2], _lifeper);
      p.color[3] = EffectEmitter.blendNumber(p.color[3], ecolor[3], _lifeper);
    }

    if (this.particle.useAlphaFade) {

      const start = this.particle.alphaFade;
      const end = this.particle.alphaFade2;
      const per = _lifeper * 100.0;

      if ((per < start) && (start > 0.0)) {
        let alpha = (start - per) / start;
        p.color[0] *= 1.0 - alpha;
      } else {

        if (per > end) {

          if (end >= 100.0) {
            p.color[0] = 0;
          } else {
            let alpha = (per - end) / (100.0 - end);
            if (alpha >= 1.0) alpha = 1.0;

            p.color[0] *= 1.0 - alpha;
          }
        }
      }
    }

    p.scale.x = 1.0;
    p.scale.y = 1.0;
    let scalefactor = 1.0;

    if (this.particle.useInitScale) {
      p.scale.x = this.particle.scale.x + (this.rand.genrandFloat32() * this.particle.scaleRange.x);
      p.scale.y = this.particle.scale.y + (this.rand.genrandFloat32() * this.particle.scaleRange.y);

      scalefactor = this.particle.scaleFactor + (this.rand.genrandFloat32() * this.particle.scaleFactor2);
    }

    if (this.particle.useTransScale) {
      let s2: SsPoint2 = new SsPoint2();
      let sf2: number;
      s2.x = this.particle.transscale.x + (this.rand.genrandFloat32() * this.particle.transscaleRange.x);
      s2.y = this.particle.transscale.y + (this.rand.genrandFloat32() * this.particle.transscaleRange.y);

      sf2 = this.particle.transscaleFactor + (this.rand.genrandFloat32() * this.particle.transscaleFactor2);

      p.scale.x = EffectEmitter.blendFloat(p.scale.x, s2.x, _lifeper);
      p.scale.y = EffectEmitter.blendFloat(p.scale.y, s2.y, _lifeper);
      scalefactor = EffectEmitter.blendFloat(scalefactor, sf2, _lifeper);
    }

    p.scale.x *= scalefactor;
    p.scale.y *= scalefactor;

    p.x = x + ox + this.position.x;
    p.y = y + oy + this.position.y;

    if (this.particle.usePGravity) {
      let v: SsPoint2 = new SsPoint2(this.particle.gravityPos.x - (ox + this.position.x), this.particle.gravityPos.y - (oy + this.position.y));

      // normalize
      let nv: SsPoint2 = new SsPoint2();
      const len: number = Math.sqrt((v.x * v.x) + (v.y * v.y));
      let div = (len === 0) ? 0 : (1 / len);
      nv.x = v.x * div;
      nv.y = v.y * div;

      const gp = this.particle.gravityPower;
      if (gp > 0) {
        let v2: SsPoint2 = new SsPoint2(p.x, p.y);

        let len = Math.sqrt((v.x * v.x) + (v.y * v.y));
        if (len === 0.0) {
          len = 0.1;
          nv.x = 1;
          nv.y = 0;
        }

        let et = (len / gp) * 0.90;

        let _gt = _t;
        if (_gt >= et) {
          _gt = et * 0.90;// + (_t / _life *0.1f);
        }

        nv.x = nv.x * gp * _gt;
        nv.y = nv.y * gp * _gt;
        p.x += nv.x;
        p.y += nv.y;

        let blend: number = EffectEmitter.OutQuad(_gt, et, 0.9, 0.0);
        blend = blend; // *gp;
        blend += (_t / _life * 0.1);

        p.x = EffectEmitter.blendFloat(p.x, this.particle.gravityPos.x, blend);
        p.y = EffectEmitter.blendFloat(p.y, this.particle.gravityPos.y, blend);
      } else {
        nv.x = nv.x * gp * _t;
        nv.y = nv.y * gp * _t;
        p.x += nv.x;
        p.y += nv.y;
      }
    }

    p.direc = 0.0;
    if (this.particle.useTurnDirec && recalc === false) {
      let dp: particleDrawData = new particleDrawData();
      dp = p;

      // if ( time > 0.0f )
      {
        this.updateParticle(time + 1.0, dp, true);

        let uv0: SsPoint2 = new SsPoint2(1, 0);
        let uv1: SsPoint2 = new SsPoint2(p.x - dp.x, p.y - dp.y);

        // normalized
        let len: number = Math.sqrt((uv0.x * uv0.x) + (uv0.y * uv0.y));
        let div = (len === 0) ? 0 : (1 / len);
        uv0.x = uv0.x * div;
        uv0.y = uv0.y * div;

        len = Math.sqrt((uv1.x * uv1.x) + (uv1.y * uv1.y));
        div = (len === 0) ? 0 : (1 / len);
        uv1.x = uv1.x * div;
        uv1.y = uv1.y * div;

        // get_angle_360
        let ip: number = (uv0.x * uv1.x) + (uv0.y * uv1.y);
        if (ip > 1.0) ip = 1.0;
        if (ip < -1.0) ip = -1.0;
        let ang: number = Math.acos(ip);

        let c = (uv0.x * uv1.y) - (uv0.y * uv1.x);

        if (c < 0) {
          ang = (3.1415926535897932385) * 2.0 - ang;
        }

        p.direc = ang + EffectConstants.DegreeToRadian(90) + EffectConstants.DegreeToRadian(this.particle.direcRotAdd);
      }
    }
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
