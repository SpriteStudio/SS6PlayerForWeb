import { AnimePack } from "./AnimePack";
import { Cell } from "./Cell";
import { AnimePackAnimation } from "./AnimePackAnimation";

export class Project {
    public directoryPath: string;
    public filePath: string;

    private _currentAnimePack: AnimePack;
    get currentAnimePack(): AnimePack {
        return this._currentAnimePack;
    }


    public animePackMap: Map<string, AnimePack>;
    public cellMap: Map<number, Cell>;


    public setActiveAnimation(animePackName: string, animationName: string){
        const currentAnimePack = this.animePackMap[animePackName];

        // アニメーションパックにActiveなアニメーションを設定
        currentAnimePack.setCurrentAnimePackAnimation(animationName);

        this._currentAnimePack = currentAnimePack;

    }

    public getCell(cellId: number): Cell {
        const cell = this.cellMap[cellId];
        return cell;
    }
}