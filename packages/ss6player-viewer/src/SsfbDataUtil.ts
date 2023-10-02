import { SS6Project } from 'ss6player-pixi';

export class SsfbDataUtil {

  static createAnimePackMap(ss6project: SS6Project): { [key: string]: any } {
    const animePacksLength = ss6project.fbObj.animePacksLength();
    // console.log('animePacksLength', animePacksLength);
    const animePackMap = {};
    for (let packIndex = 0; packIndex < animePacksLength; packIndex++) {
      const animePack = ss6project.fbObj.animePacks(packIndex);
      const animePackName = animePack.name();
      // console.log(animePackName);
      const animationMap = [];
      const animationsLength = animePack.animationsLength();
      for (let animeIndex = 0; animeIndex < animationsLength; animeIndex++) {
        const animation = animePack.animations(animeIndex);
        const animationName = animation.name();
        if (animationName === 'Setup') {
          continue;
        }

        animationMap[animationName] = animation;
      }
      const partsCount = animePack.partsLength();
      animePackMap[animePackName] = {
        animePack: animePack,
        animationMap: animationMap,
        parts_count: partsCount
      };
    }

    return animePackMap;
  }
}
