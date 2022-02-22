import {SsU8Color} from './SsU8Color';

/**
 * @internal
 */
enum RangeType { None, MinMax, PlusMinus}

/**
 * @internal
 */
export class VarianceValue<mytype> {
  private type: RangeType;
  private value: mytype;
  private subvalue: mytype;

  constructor(v: mytype);
  // tslint:disable-next-line:unified-signatures
  constructor(v: mytype, v2: mytype);
  constructor(v: mytype, a2?: mytype) {
    this.value = v;
    this.subvalue = (a2 === undefined) ? v : a2;
    this.type = (a2 === undefined) ? RangeType.None : RangeType.MinMax;
  }

  setPlusMinus(v1: mytype) {
    // this.value = -v1; // TODO:
    this.subvalue = v1;
    this.type = RangeType.PlusMinus;
  }

  setMinMax(min: mytype, max: mytype) {
    this.value = min;
    this.subvalue = max;
    this.type = RangeType.PlusMinus;
  }

  getValue(): mytype {
    return this.value;
  }

  getMinValue(): mytype {
    return this.value;
  }

  getMaxValue(): mytype {
    return this.subvalue;
  }

  isTypeNone(): boolean {
    return this.type === RangeType.None;
  }

  isTypeMinMax(): boolean {
    return this.type === RangeType.MinMax;
  }

  isTypePlusMinus(): boolean {
    return this.type === RangeType.PlusMinus;
  }

  getlpValue(): mytype {
    return this.value;
  }

  getlpSubValue(): mytype {
    return this.subvalue;
  }
}

/**
 * @internal
 */
export type SsU8cVValue = VarianceValue<SsU8Color>;
