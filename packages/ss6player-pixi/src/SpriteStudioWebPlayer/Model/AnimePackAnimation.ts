import { AnimePackAnimationUserData } from "./AnimePackAnimationUserData";
import { AnimePackAnimationFrame } from "./AnimePackAnimationFrame";
import { AnimePackAnimationMeshsDataUv } from "./AnimePackAnimationMeshsDataUv";
import { AnimePackAnimationMeshsDataIndices } from "./AnimePackAnimationMeshsDataIndices";
import { AnimePackAnimationDefaultData } from "./AnimePackAnimationDefaultData";
import { AnimePackAnimationFrameState } from "./AnimePackAnimationFrameState";
export class AnimePackAnimation {
    public name: string;
    // public isSetup: boolean;
    public fps: number;

    public startFrame: number;
    public endFrame: number;
    public totalFrame: number;

    public userDataMap: Map<number, AnimePackAnimationUserData>;

    public setupStateMap: Map<number, AnimePackAnimationFrameState>; // 利用しない

    public frameMap: Map<number, AnimePackAnimationFrame>;

    public meshsDataUvMap: Map<number, AnimePackAnimationMeshsDataUv>;
    public meshsDataIndicesMap: Map<number, AnimePackAnimationMeshsDataIndices>;

    private prio2index: Array<any>;
    public get prio2Index() {
        return this.prio2index;
    }
    //     const fd = this.ss6project.ssfbReader.GetFrameData(frameNumber);
    public getFrameData(frameNumber: number) {
        // if (this.currentCachedFrameNumber === frameNumber && this.frameDataCache) {
        //     return this.frameDataCache;
        // }
        const layers = Object.keys(this.setupStateMap).length;
        // const layers = this.curAnimation.defaultDataLength();
        let frameData = new Array(layers);
        this.prio2index = new Array(layers);
        const frame = this.frameMap[frameNumber];
        for (let i = 0; i < layers; i++) {
            const state = frame.stateMap[i];
            const index = state.index;
            // const index = curPartState.index();
            // let f1 = curPartState.flag1();
            // let f2 = state.flag2();
            // let blendType = -1;
            // let fd = this.GetDefaultDataByIndex(index);
            // データにフラグを追加する
            // fd.flag1 = f1;
            // fd.flag2 = f2;

            

            frameData[index] = state;
            this.prio2index[i] = index;

            // NULLパーツにダミーのセルIDを設定する
            
            // if (
            //     this.curAnimePack.parts(index).type() === 0
            // ) {
            //     frameData[index].cellIndex = -2;
            // }
        }
        // this.frameDataCache = frameData;
        // this.currentCachedFrameNumber = frameNumber;
        return frameData;
    }


    
    
}