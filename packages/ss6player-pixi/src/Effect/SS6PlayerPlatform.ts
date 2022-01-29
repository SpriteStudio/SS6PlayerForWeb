export class SS6PlayerPlatform {
  SSPlatformInit() {
    // TODO: impl
  }

  SSPlatformRelese() {
    // TODO: impl
  }

  SSSetPlusDirection(direction: number, window_w: number, window_h: number) {
    // TODO: impl
  }

  SSGetPlusDirection(): [number, number, number] /* direction, window_w, window_h */ {
    // TODO: impl
    return [0, 0, 0];
  }

  SSRenderingBlendFuncEnable(flg: number) {
    // TODO: impl
  }

  /*
  // TODO: impl
  SSFileOpen(pszFileName: string, pszMode: string, unsigned long * pSize, const char * pszZipFileName):  {

  }
  */

  SSTextureLoad(pszFileName: string, wrapmode: number, filtermode: number, pszZipFileName: string): number {
    // TODO: impl
    return 0;
  }

  SSTextureRelese(handle: number): boolean {
    // TODO: impl
    return false;
  }

  SSGetTextureIndex(key: string, indexList: [number]): boolean {
    // TODO: impl
    return false;
  }

  isAbsolutePath(strPath: string): boolean {
    // TODO: impl
    return false;
  }

  SSRenderSetup() {
    // TODO: impl
  }

  SSRenderEnd() {
    // TODO: impl
  }

  /*
  SSDrawSprite(CustomSprite *sprite, State *overwrite_state = NULL) {
    // TODO: impl
  }
   */

  SSGetTextureSize(handle: number): [boolean, number, number] /* boolean, w, h */ {
    // TODO: impl
    return [false, 0, 0];
  }
  clearMask() {
    // TODO: impl
  }
  enableMask(flag: boolean) {
    // TODO: impl
  }

  /*
  execMask(sprite: CustomSprite) {
    // TODO: impl
  }
   */

}
