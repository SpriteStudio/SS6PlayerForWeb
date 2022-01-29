import {SsEffectBehavior} from './EffectBehavior';
import {EffectNode} from 'ssfblib/dist/types/ss/ssfb/effect-node';
import {EffectNodeBehavior} from 'ssfblib/dist/types/ss/ssfb/effect-node-behavior';

export enum SsEffectNodeType {
  invalid = -1,
  root,
  emmiter,
  particle,
  num
}

export class SimpleTree {
  parent: SimpleTree = null;
  ctop: SimpleTree = null;
  prev: SimpleTree = null;
  next: SimpleTree = null;

  addChildEnd(c: SimpleTree) {
    if (this.ctop === null) {
      this.ctop = c;
    } else {
      this.ctop.addSiblingEnd(c);
    }
    c.parent = this;
  }

  addSiblingEnd(c: SimpleTree) {
    if (this.next === null) {
      c.prev = this;
      this.next = c;
    } else {
      this.next.addSiblingEnd(c);
    }

    c.parent = this.parent;
  }

  destroysub(t: SimpleTree) {
    if (t.ctop) {
      this.destroysub(t.ctop);
    }
    if (t.next) {
      this.destroysub(t.next);
    }

    t.ctop = null;
    t.next = null;
    t.prev = null;
    t = null;
  }

  destroy() {
    if (this.ctop) {
      this.destroysub(this.ctop);
    }
  }
}

export class SsEffectNode extends SimpleTree {
  d: EffectNode;
  get arrayIndex(): number {
    return this.d.arrayIndex();
  }
  get parentIndex(): number {
    return this.d.parentIndex();
  }
  get type(): SsEffectNodeType {
    return this.d.type();
  }
  visible: boolean;

  behavior: EffectNodeBehavior;

  constructor(node: EffectNode) {
    super();
    this.d = node;
  }

  GetType(): SsEffectNodeType {
    return this.type;
  }

  GetMyBehavior(): EffectNodeBehavior {
    return this.behavior;
  }
}
