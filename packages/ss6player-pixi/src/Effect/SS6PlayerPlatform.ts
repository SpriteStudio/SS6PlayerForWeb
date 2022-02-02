export class SS6PlayerPlatform {

  // 座標系設定
	static _direction: number;
	static _window_w: number;
	static _window_h: number;

  static SSPlatformInit() {
    // TODO: impl
  }

  static SSPlatformRelese() {
    // TODO: impl
  }

  static SSSetPlusDirection(direction: number, window_w: number, window_h: number) {
    // TODO: impl
  }

  static SSGetPlusDirection(): [number, number, number] /* direction, window_w, window_h */ {
    // TODO: impl
    return [0, 0, 0];
  }

  static SSRenderingBlendFuncEnable(flg: number) {
    // TODO: impl
  }

  /*
  // TODO: impl
  static SSFileOpen(pszFileName: string, pszMode: string, unsigned long * pSize, const char * pszZipFileName):  {

  }
  */

  static SSTextureLoad(pszFileName: string, wrapmode: number, filtermode: number, pszZipFileName: string): number {
    // TODO: impl
    return 0;
  }

  static SSTextureRelese(handle: number): boolean {
    // TODO: impl
    return false;
  }

  static SSGetTextureIndex(key: string, indexList: [number]): boolean {
    // TODO: impl
    return false;
  }

  static isAbsolutePath(strPath: string): boolean {
    // TODO: impl
    return false;
  }

  static SSRenderSetup() {
    // TODO: impl
  }

  static SSRenderEnd() {
    // TODO: impl
  }

  /*
  static SSDrawSprite(CustomSprite *sprite, State *overwrite_state = NULL) {
    // TODO: impl
  }
   */

  static SSGetTextureSize(handle: number): [boolean, number, number] /* boolean, w, h */ {
    // TODO: impl
    return [false, 0, 0];
  }
  static clearMask() {
    // TODO: impl
  }
  static enableMask(flag: boolean) {
    // TODO: impl
  }

  /*
  static execMask(sprite: CustomSprite) {
    // TODO: impl
  }
   */

}
