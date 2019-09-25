import { AnimePackAnimationUserData } from "./AnimePackAnimationUserData";
import { AnimePackAnimationFrame } from "./AnimePackAnimationFrame";
import { AnimePackAnimationMeshsDataUv } from "./AnimePackAnimationMeshsDataUv";
import { AnimePackAnimationMeshsDataIndices } from "./AnimePackAnimationMeshsDataIndices";
import { AnimePackAnimationDefaultData } from "./AnimePackAnimationDefaultData";
export class AnimePackAnimation {
    public name: string;
    public fps: number;

    public startFrame: number;
    public endFrame: number;
    public totalFrame: number;

    public userDataMap: Map<number, AnimePackAnimationUserData>;
    public defaultDataMap: Map<number, AnimePackAnimationDefaultData>;
    public frameMap: Map<number, AnimePackAnimationFrame>;

    public meshsDataUvMap: Map<number, AnimePackAnimationMeshsDataUv>;
    public meshsDataIndicesMap: Map<number, AnimePackAnimationMeshsDataIndices>;

    //     const fd = this.ss6project.ssfbReader.GetFrameData(frameNumber);
    public getFrameData(frameNumber: number) {
        const frame = this.frameMap[frameNumber];
        return frame;
    }
    
}