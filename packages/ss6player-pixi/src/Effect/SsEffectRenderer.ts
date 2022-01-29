import {EffectModel} from './EffectModel';
import {SsPoint3} from './SsPoint3';
import {SsEffectRenderAtom} from './SsEffectRenderAtom';
import {EffectNode} from './EffectNode';
import {SsEffectDrawBatch} from './SsEffectDrawBatch';
import {SsEffectNode} from './SsEffectNode';

export class SsEffectRenderer {
  private effectData: EffectModel = null;

  private m_isPlay: boolean;
  private m_isPause: boolean;
  private m_isLoop: boolean = false;
  private mySeed: number = 0;

  private layoutPosition: SsPoint3 = new SsPoint3();

  // アップデート物のリスト
  render_root: SsEffectRenderAtom = null;

  usePreMultiTexture: boolean;
  parentAnimeStartFrame: number = 0;
  renderTexture: number;
  frameDelta: number;

  // TODO: impl SsPartState をどう適応するか考える
  // parentState: SsPartState = null;

  updatelist: Array<SsEffectRenderAtom>;
  createlist: Array<SsEffectRenderAtom>;

  drawBatchList: Array<SsEffectDrawBatch>;

  // TODO: impl cocos2d-x用エフェクトスプライトをどう適応するか考える
  // cocos2d-x用エフェクトスプライト
  _isContentScaleFactorAuto: boolean;

  // CustomSprite						*_parentSprite;

  constructor() {
  }

  clearUpdateList() {
    let s: number = this.createlist.length;
    let s2: number = this.updatelist.length;

    for (let i = 0; i < this.createlist.length; i++) {
      delete this.createlist[i];
      this.createlist[i] = null;
    }

    this.updatelist = new Array<SsEffectRenderAtom>();
    this.createlist = new Array<SsEffectRenderAtom>();

    for (let e of this.drawBatchList) {
      e.drawlist = new Array<SsEffectRenderAtom>();
    }

    this.drawBatchList = new Array<SsEffectDrawBatch>();
  }

  setSeed(seed: number) {
    this.mySeed = seed;
  }

  update(delta: number) {
    if (this.m_isPause) return;
    if (!this.m_isPlay) return;
    if (this.render_root == null) return;

    this.frameDelta = delta;

    // TODO: impl SsPartState をどう適応するか考える
    /*
	if (this.parentState) {

		let pos: SsPoint3 = new SsPoint3( parentState->matrix[3*4] ,
								   parentState->matrix[3*4+1] ,
								   parentState->matrix[3*4+2] );

		this.layoutPosition = pos;

		this.render_root.setPosistion( 0 , 0 , 0 );

		this.render_root.rotation = 0;
		this.render_root.scale.set(1.0,1.0);
		this.render_root.alpha = parentState.alpha;
	}
     */

    let loopnum: number = this.updatelist.length;
    for (let i = 0; i < loopnum; i++) {
      let re: SsEffectRenderAtom = this.updatelist[i];
      re.Initialize();
      re.count();
    }

    loopnum = this.updatelist.length;
    let updatecount: number = 0;
    for (let i = 0; i < loopnum; i++) {
      let re: SsEffectRenderAtom = this.updatelist[i];

      if (re.m_isLive === false) continue;

      if (re.parent && re.parent._life <= 0.0 || re._life <= 0.0) {
        re.update(delta);
      } else {
        re.update(delta);
        re.genarate(this);
      }
      updatecount++;
    }

    // 後処理  寿命で削除
    // 死亡検出、削除の2段階
    /* TODO: impl
    std::vector<SsEffectRenderAtom*>::iterator endi = remove_if( updatelist.begin(), updatelist.end(), particleDelete );
    updatelist.erase( endi, updatelist.end() );
     */

    this.drawBatchList.sort((a: SsEffectDrawBatch, b: SsEffectDrawBatch): number => {
      // TODO: impl 多分、プライオリティが高い順にしたい？
      return a.priority - b.priority;
    });

    if (this.m_isLoop) {
      if (updatecount === 0) {
        this.reload();
      }
    }
  }

  draw() {
    for (let e of this.drawBatchList) {
      for (let e2 of e.drawlist) {
        if (e2) {
          if (!e2.m_isLive) continue;
          if (e2._life <= 0.0) continue;
          e2.draw(this);
        }
      }
    }
  }

  reload() {
    this.clearUpdateList();

    // 座標操作のためのルートノードを作成する
    if (this.render_root == null) {
      this.render_root = new SsEffectRenderAtom();
    }

    // ルートの子要素を調査して作成する
    let root: SsEffectNode = this.effectData.getRoot();

    // シード値の決定
    let seed: number = 0;

    if (this.effectData.isLockRandSeed) {
      seed = this.effectData.lockRandSeed;
    } else {
      seed = this.mySeed;
    }

    // TODO: impl EffectNode をツリーとして持つ必要あり。
    /*
    SimpleTree * n = root->ctop;
    // 子要素だけつくってこれを種にする
    while (n) {
      SsEffectNode * enode = static_cast < SsEffectNode * > (n);
      SsEffectRenderAtom * effectr = CreateAtom(seed, render_root, enode);

      n = n->next;
    }
     */
  }

  // 操作
  play() {
    this.m_isPlay = true;
    this.m_isPause = false;
  }

  stop() {
    this.m_isPlay = false;
  }

  pause() {
    this.m_isPause = true;
  }

  setLoop(flag: boolean) {
    this.m_isLoop = flag;
  }

  getPlayStatus(): boolean {
    return this.m_isPlay;
  }

  getCurrentFPS(): number {
    if (this.effectData !== null) {
      if (this.effectData.fps === 0) return 30;

      return this.effectData.fps;
    }
    return 30;
  }

  getEffectData(): EffectModel {
    return this.effectData;
  }

  // データセット
  setEffectData(data: EffectModel) {
    this.stop();
    this.clearUpdateList();
    this.effectData = data;
  }

  // TODO: impl SsPartState をどう適応するか考える
  // setParentAnimeState(state: SsPartState){ this.parentState = state; }

  CreateAtom(seed: number, parent: SsEffectRenderAtom, node: SsEffectNode): SsEffectRenderAtom {
    // TODO: impl
    return null;
  }

  findBatchList(n: EffectNode): SsEffectDrawBatch {
    // TODO: impl
  }

  findBatchListSub(n: EffectNode): SsEffectDrawBatch {
    // TODO: impl
  }

  // TODO: impl cocos2d-x用エフェクトスプライトをどう適応するか考える
  // cocos側のエフェクトスプライトを設定する
  // void setContentScaleEneble(bool eneble){ _isContentScaleFactorAuto = eneble; }
  // void setParentSprite(CustomSprite* sprite){ _parentSprite = sprite; }

}
