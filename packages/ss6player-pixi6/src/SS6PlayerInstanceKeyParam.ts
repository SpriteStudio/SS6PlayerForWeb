/**
 * インスタンス差し替え用のキーパラメーター
 */
export class SS6PlayerInstanceKeyParam {
  public refStartframe: number = 0;
  public refEndframe: number = 0;
  public refSpeed: number = 1.0;
  public refloopNum: number = 0;
  public infinity: boolean = false;
  public reverse: boolean = false;
  public pingpong: boolean = false;
  public independent: boolean = false;

  constructor() {
  }
}
