import { AnimePackAnimation } from "./AnimePackAnimation";
import { AnimePackParts } from "./AnimePackParts";

export class AnimePack {
    public name;

    public animationMap: Map<string, AnimePackAnimation>;

    private _currentAnimePackAnimation: AnimePackAnimation;
    get currentAnimePackAnimation(): AnimePackAnimation {
        return this._currentAnimePackAnimation;
    }

    public setCurrentAnimePackAnimation(animationName: string) {
        const animation = this.animationMap[animationName];
        this._currentAnimePackAnimation = animation;
    }

    public partsModelMap: Map<string, AnimePackParts>;
    
}