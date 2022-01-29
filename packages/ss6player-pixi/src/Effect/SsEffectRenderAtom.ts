import {SsPoint2} from './SsPoint2';
import {SsPoint3} from './SsPoint3';
import {SsRenderType} from './SsRenderType';
import {SsEffectNode} from './SsEffectNode';
import {SsEffectRenderer} from './SsEffectRenderer';


export class SsEffectRenderAtom {
  position: SsPoint3;
  rotation: number = 0;
  scale: SsPoint2 = new SsPoint2(1.0, 1.0);

  parent: SsEffectRenderAtom = null;
  data: SsEffectNode;
  m_isLive: boolean = true;
  m_isInit: boolean = false;
  m_isCreateChild: boolean = false;

  _lifetime: number = 10.0;		// オブジェクトの最大生存時間
  _exsitTime: number;		// 存在した時間
  _life: number = 1.0;          // 寿命 = 0で死

  undead: boolean;

  alpha: number;

  constructor();
  constructor(refdata: SsEffectNode, _p: SsEffectRenderAtom);
  constructor(a1?: any, a2?: any) {
    if (a1 !== undefined && a2 !== undefined) {
      let refdata: SsEffectNode = a1;
      let _p: SsEffectRenderAtom = a2;

      this.data = refdata;
      this.setParent(_p);

      this._lifetime = 0;
      this.position = new SsPoint3(0, 0, 0);
      this.scale.set(0, 0);
      this.rotation = 0.0;
    }
  }

  setParent(_p: SsEffectRenderAtom) {
    this.parent = _p;
  }

  getMyType(): SsRenderType {
    return SsRenderType.BaseNode;
  }

  isInit(): boolean {
    return this.m_isInit;
  }

  Initialize() {
    this.parent = null;
    this.m_isInit = false;
    this.m_isLive = true;
    this._lifetime = 10.0;
    this._life = 1.0;
    this.rotation = 0;
    this.position = new SsPoint3(0, 0, 0);
    this.scale = new SsPoint2(1, 1);
    this.m_isCreateChild = false;
    this.m_isInit = false;
  }

  genarate(render: SsEffectRenderer): boolean {
    return true;
  }

  update(delta: number) {
    // do nothing
  }

  draw(render: SsEffectRenderer) {
    // do nothing
  }

  debugdraw() {
    // do nothing
  }

  getPosition(): SsPoint3 {
    return this.position;
  }

  setPosistion(x: number, y: number, z: number) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  setScale(x: number, y: number) {
    this.scale.x = x;
    this.scale.y = y;
  }

  setRotation(z: number) {
    // std::fmod
    this.rotation = Number((z - (Math.floor(z / 360) * 360)).toPrecision(8));
  }

  getRotation(): number {
    return this.rotation;
  }

  getScale(): SsPoint2 {
    return this.scale;
  }

  count() {
    // do nothing
  }

}
