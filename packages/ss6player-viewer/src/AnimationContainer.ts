import { SS6Player, SS6Project } from 'ss6player-pixi';

/**
 * PIXI のアニメーションを再生するコンテナ
 */
export class AnimationContainer extends SS6Player {
  public constructor(ss6project: SS6Project, animePackName: string = null, animeName: string = null) {
    super(ss6project, animePackName, animeName);
  }

  public getCurrentAnimationFrameDataMap() {
    // return this.currentAnimationFrameDataMap;
  }
}
