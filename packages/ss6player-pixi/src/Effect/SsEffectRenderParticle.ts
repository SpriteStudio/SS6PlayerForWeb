import {SsEffectRenderAtom} from './SsEffectRenderAtom';

import {SsEffectFunctionExecuter} from './EffectFunctionExecuter';

import {SsCellValue} from './SsCellValue';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectBehavior} from './SsEffectBehavior';
import {EffectNode} from './EffectNode';
import {SsRenderType} from './SsRenderType';
import {SsEffectRenderer} from './SsEffectRenderer';
import {SsU8Color} from './SsU8Color';
import {SsPoint2} from './SsPoint2';
import {SsEffectNode} from './SsEffectNode';
import {PLUS, SS6PlayerPlatform} from './SS6PlayerPlatform';

// --------------------------------------------------------------------------
// パーティクルオブジェクト
// --------------------------------------------------------------------------
export class SsEffectRenderParticle extends SsEffectRenderAtom {
  dispCell: SsCellValue;

  size: number;
  parentEmitter: SsEffectRenderEmitter;
  refBehavior: SsEffectBehavior;

  _baseEmiterPosition: SsPoint2; // もしかしてもう使ってないかも
  _backposition: SsPoint2; // force計算前のポジション
  _position: SsPoint2; // 描画用ポジション

  _rotation: number;
  _rotationAdd: number;
  _rotationAddDst: number;
  _rotationAddOrg: number;

  _size: SsPoint2;
  _startsize: SsPoint2;
  _divsize: SsPoint2;

  _color: SsU8Color = new SsU8Color();
  _startcolor: SsU8Color = new SsU8Color();
  _endcolor: SsU8Color = new SsU8Color();

  speed: number;		// 現在持っている速度
  firstspeed: number;
  lastspeed: number;
  vector: SsPoint2 = new SsPoint2();

  _force: SsPoint2 = new SsPoint2();
  _gravity: SsPoint2 = new SsPoint2();
  _orggravity: SsPoint2 = new SsPoint2();

  _radialAccel: number;
  _tangentialAccel: number;
  direction: number;
  isTurnDirection: boolean;

  _execforce: SsPoint2 = new SsPoint2(); // 処理中の力 最終的には単位当たりの力に変換

  InitParameter() {

    super.Initialize();

    this._position = new SsPoint2(0, 0);
    this._baseEmiterPosition = new SsPoint2(0, 0);
    this._backposition = new SsPoint2(0, 0);
    this._rotation = 0;
    this._size = new SsPoint2(1.0, 1.0);
    this._startsize = new SsPoint2(1.0, 1.0);
    this._divsize = new SsPoint2(0.0, 0.0);
    this._force = new SsPoint2(0, 0);
    this._gravity = new SsPoint2(0, 0);
    this._radialAccel = 0;
    this._tangentialAccel = 0;
    this._color = new SsU8Color(255, 255, 255, 255);
    this._startcolor = this._color;
    this._exsitTime = 0;
    this._execforce = new SsPoint2(0, 0);
    this.parentEmitter = null;
    this.dispCell = null;
  }

  constructor()
  constructor(refdata: SsEffectNode, _p: SsEffectRenderAtom);
  constructor(a1?: any, a2?: any) {
    super();
    if (a1 === undefined) {
      this.parentEmitter = null;
    } else {
      let refdata: SsEffectNode = a1;
      let _p: SsEffectRenderAtom = a2;
      this.data = refdata;
      this.parent = _p;
      this.InitParameter();
    }
  }

  getMyType(): SsRenderType {
    return SsRenderType.ParticleNode;
  }

  // 生成フェーズ
  Initialize() {
    // TODO: impl
    if (!this.m_isInit) {
      let n: SsEffectNode = this.data.ctop as SsEffectNode;

      // 子要素を解析  基本的にエミッターのみの生成のはず　（Ｐではエラーでいい）
      // 処理を省いてエミッター生成のつもりで作成する
      // パーティクルに紐づいたエミッターが生成される
      this.parentEmitter = null;

      this.parentEmitter = this.parent as SsEffectRenderEmitter;

      this.dispCell = this.parentEmitter.dispCell;
      if (this.parentEmitter.data === null) {
        this._life = 0.0;
        this.m_isInit = false;
        return;
      }

      this.refBehavior = this.parentEmitter.data.GetMyBehavior();
      if (this.refBehavior) {
        SsEffectFunctionExecuter.initializeParticle(this.refBehavior, this.parentEmitter, this);
      }
    }

    this.m_isInit = true;

  }

  genarate(render: SsEffectRenderer): boolean {
    // TODO: impl
    let n: SsEffectNode = this.data.ctop as SsEffectNode;
    if (this.m_isInit && !this.m_isCreateChild) {
      if (this.parentEmitter !== null) {
        while (n) {
          if (this.parentEmitter === null) {
            return true;
          }
          let r: SsEffectRenderAtom = render.CreateAtom(this.parentEmitter.myseed, this, n);
          if (r) {
            n = n.next as SsEffectNode;
            r.Initialize();
            r.update(render.frameDelta);
            r.genarate(render);
          } else {
            return false;
          }
        }
      }

      this.m_isCreateChild = true;
    }

    return true;
  }

  update(delta: number) {
    // TODO: impl
          // _rotation = 0;
    if (!this.isInit()) {
      return;
    }
    this.position.x = this._position.x;
    this.position.y = this._position.y;
    this.scale = this.parent.scale;
    this.alpha = this.parent.alpha;

    // 初期値突っ込んでおく、パーティクルメソッドのアップデートに持ってく？
    this._color = this._startcolor;

    // this->parent
    if (this.parentEmitter) {
      this.updateDelta(delta);

      if (this.refBehavior) {
        SsEffectFunctionExecuter.updateParticle(this.refBehavior, this.parentEmitter, this);
      }

      this.updateForce(delta);

      if (this.parent._life <= 0.0) {
      } else {
        // 仮
        this.position.x = this._position.x;
        this.position.y = this._position.y;
      }
    }

  }

  draw(render: SsEffectRenderer) {
      // TODO: impl
      super.draw(render);
    }

  count() {
    if (this.parentEmitter !== null) {
      this.parentEmitter.particleCount++;
    }
	}

  updateDelta(delta: number) {
    let updir: number;
    let window_w: number;
    let window_h: number;
    [updir, window_w, window_h] = SS6PlayerPlatform.SSGetPlusDirection();

    if (updir === PLUS.PLUS_DOWN) {
      this._rotation -= (this._rotationAdd * delta);
    } else {
      this._rotation += (this._rotationAdd * delta);
    }

    this._exsitTime += delta;
    this._life = this._lifetime - this._exsitTime;

    let tangential: SsPoint2 = new SsPoint2(0, 0);

    // 接線加速度の計算
    let radial: SsPoint2 = new SsPoint2(this._position.x, this._position.y);

    SsPoint2.normalizeStatic(radial , radial);
    tangential = radial;

    radial.x = radial.x * this._radialAccel;
    radial.y = radial.y * this._radialAccel;

    let newY: number = tangential.x;
    tangential.x = -tangential.y;
    tangential.y = newY;

    tangential.x = tangential.x * this._tangentialAccel;
    tangential.y = tangential.y * this._tangentialAccel;

    this._execforce = new SsPoint2(radial.x + tangential.x, radial.y + tangential.y);
  }

  updateForce(delta: number) {
    // TODO: impl
  }
}
