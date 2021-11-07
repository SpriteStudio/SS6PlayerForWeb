import {SsEffectRenderAtom} from './SsEffectRenderAtom';
import {SsEffectRenderEmitter} from './SsEffectRenderEmitter';
import {SsEffectBehavior} from './EffectBehavior';

import {Point} from '@pixi/math';
import {SsCellValue} from './SsCellValue';
import {SsRenderType} from './SsRenderType';
import {SsEffectRenderer} from './SsEffectRenderer';
import {SsEffectFunctionExecuter} from './EffectFunctionExecuter';

export class SsEffectRenderParticle extends SsEffectRenderAtom {
  dispCell: SsCellValue;

  size: number;
  parentEmitter: SsEffectRenderEmitter;
  refBehavior: SsEffectBehavior;

  _baseEmiterPosition: Point; // もしかしてもう使ってないかも
  _backposition: Point; // force計算前のポジション
  _position: Point; // 描画用ポジション

  _rotation: number;
  _rotationAdd: number;
  _rotationAddDst: number;
  _rotationAddOrg: number;

  _size: Point;
  _startsize: Point;
  _divsize: Point;

  SsU8Color _color;
	SsU8Color	_startcolor;
	SsU8Color	_endcolor;

	speed: number;		// 現在持っている速度
  firstspeed: number;
  lastspeed: number;
	vector: Point;

	_force: Point;
  _gravity: Point;
  // _orggravity: Point;

  _radialAccel: number;
	_tangentialAccel: number;
	direction: number;
	isTurnDirection: boolean;

  _execforce: Point; // 処理中の力 最終的には単位当たりの力に変換

  InitParameter() {

		super.Initialize();

    this._position = new Point(0,0);
		this._baseEmiterPosition = new Point(0,0);
		this._backposition = new Point(0,0);
		this._rotation = 0;
		this._size = new Point(1.0, 1.0);
		this._startsize = new Point(1.0, 1.0);
		this._divsize = new Point(0.0, 0.0);
		this._force = new Point(0,0);
		this._gravity = new Point(0,0);
		this._radialAccel = 0;
		this._tangentialAccel = 0;
		this._color = SsU8Color(255,255,255,255) ;
    this._startcolor = this._color;
    this._exsitTime = 0;
		this._execforce = new Point(0,0);
    this.parentEmitter = null;
    this.dispCell = null;
	}

  constructor(refdata: SsEffectNode , _p: SsEffectRenderAtom) {
    super();

    this.data = refdata;
    this.parent = _p;
    this.InitParameter();
	}

  getMyType(): SsRenderType { return SsRenderType.ParticleNode; }

	// 生成フェーズ
  Initialize() {
    if (!this.m_isInit) {
      let n: SsEffectNode = this.data.ctop;

      // 子要素を解析  基本的にエミッターのみの生成のはず　（Ｐではエラーでいい）
      // 処理を省いてエミッター生成のつもりで作成する
      // パーティクルに紐づいたエミッターが生成される
      this.parentEmitter = null;

      this.parentEmitter = this.parent;

      this.dispCell = this.parentEmitter.dispCell;
      if (this.parentEmitter.data === null) {
        this._life = 0.0;
        this.m_isInit = false;
        return;
      }

      this.refBehavior = this.parentEmitter.data.getMyBehavior();
      if (this.refBehavior) {
        SsEffectFunctionExecuter.initializeParticle(refBehavior, parentEmitter, this);
      }
    }

    this.m_isInit = true;
  }

  genarate(render: SsEffectRenderer): boolean {
    let n: SsEffectNode = this.data.ctop;
    if (this.m_isInit && !this.m_isCreateChild) {
      if (this.parentEmitter !== null) {
        while (n) {
          if (this.parentEmitter === null) {
            return true;
          }
          let r: SsEffectRenderAtom = render.CreateAtom(this.parentEmitter.myseed, this, n);
          if (r) {
            n = n.next;
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
    super.draw(render);
    // TODO: impl
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
    SSGetPlusDirection(updir, window_w, window_h);

    if (updir === PLUS_DOWN) {
      this._rotation -= (this._rotationAdd * delta);
    } else {
      this._rotation += (this._rotationAdd * delta);
    }

    this._exsitTime += delta;
    this._life = this._lifetime - this._exsitTime;

    let tangential: Point = new Point(0, 0);

    // 接線加速度の計算
    let radial: Point = new Point(this._position.x, this._position.y);

    SsVector2.normalize( radial , &radial );
    tangential = radial;

    radial.x = radial.x * this._radialAccel;
    radial.y = radial.y * this._radialAccel;

    let newY: number = tangential.x;
    tangential.x = -tangential.y;
    tangential.y = newY;

    tangential.x = tangential.x * this._tangentialAccel;
    tangential.y = tangential.y * this._tangentialAccel;

    SsVector2 tmp = radial + tangential;

    this._execforce = tmp;

  }

  updateForce(delta: number) {

  }
}
