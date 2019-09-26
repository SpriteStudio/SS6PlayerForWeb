import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';
import { Cell } from '../../../Model/Cell';
import { CellMap } from '../../../Model/CellMap';
import { Project } from '../../../Model/Project';
import { AnimePackReader } from './AnimePackReader';

export class Reader {

    public ssfbPath: string;
    private animePackReader: AnimePackReader;
    public requestRetryCount: number = 0;
    private requestRetryCurrentCount: number;


    public requestTimeout: number = 0;
    private onComplete: (project: Project) => void;
    private onError: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;
    private onTimeout: (ssfbPath: string, httpObj: XMLHttpRequest) => void;
    private onRetry: (ssfbPath: string, requestRetryCurrentCount: number, httpObj: XMLHttpRequest) => void;

    private projectData: ss.ssfb.ProjectData;



    public constructor(ssfbPath: string) {
        this.ssfbPath = ssfbPath;
        this.projectData = null;

        this.animePackReader = new AnimePackReader();
    }



    public load(onComplete: (project: Project) => void) {
        this.onComplete = onComplete;

        this.requestRetryCurrentCount = this.requestRetryCount;
        this.innerLoad();
    }

    public innerLoad() {
        const self = this;
        const ssfbPath = this.ssfbPath;

        const httpObj = new XMLHttpRequest();
        httpObj.open('GET', ssfbPath, true);
        httpObj.responseType = 'arraybuffer';
        httpObj.timeout = this.requestTimeout;
        httpObj.onload = function () {
            const arrayBuffer = this.response;
            const bytes = new Uint8Array(arrayBuffer);
            const buffer = new flatbuffers.ByteBuffer(bytes);

            const project = self.create(buffer);

            self.onComplete(project);
        };
        httpObj.ontimeout = function () {
            if (self.requestRetryCurrentCount > 0) {
                self.requestRetryCurrentCount--;
                if (self.onRetry !== null) {
                    self.onRetry(ssfbPath, self.requestRetryCurrentCount, httpObj);
                }
                // 再Httpリクエスト                
                self.innerLoad();

            } else {
                if (self.onTimeout !== null) {
                    self.onTimeout(ssfbPath, httpObj);
                }
            }
        };

        httpObj.onerror = function () {
            if (self.onTimeout !== null) {
                self.onError(ssfbPath, self.requestRetryCurrentCount, httpObj);
            }
        };

        httpObj.send(null);
    }



    private create(buffer: flatbuffers.ByteBuffer):  Project {
        const index = this.ssfbPath.lastIndexOf('/');
        const directoryPath = this.ssfbPath.substring(0, index) + '/';

        this.projectData = ss.ssfb.ProjectData.getRootAsProjectData(buffer);

        const project: Project = new Project();
        project.filePath = this.ssfbPath;
        project.directoryPath = directoryPath;

        // アニメーションパック情報読み込み
        project.animePackMap = this.animePackReader.createAnimePackMap(this.projectData);

        // セル情報読み込み
        project.cellMap = this.createCellMap();

        console.log(project);

        return project;
    }



    private createCellMap() {
        if (this.projectData == null) {
            return;
        }

        const cellModelMap: Map<number, Cell> = new Map<number, Cell>();
        const cellsLength = this.projectData.cellsLength();
        // let ids: any = [];
        for (let i = 0; i < cellsLength; i++) {
            const cell = this.projectData.cells(i);

            const cellModel = new Cell();
            cellModel.name = cell.name();
            cellModel.height = cell.height();
            cellModel.width = cell.width();
            cellModel.pivotX = cell.pivotX();
            cellModel.pivotY = cell.pivotY();
            cellModel.u1 = cell.u1();
            cellModel.u2 = cell.u2();
            cellModel.v1 = cell.v1();
            cellModel.v2 = cell.v2();

            const cellMap = cell.cellMap();
            const cellMapModel: CellMap = new CellMap();
            cellMapModel.name = cellMap.name();
            cellMapModel.imagePath = cellMap.imagePath();
            cellMapModel.index = cellMap.index();


            cellModel.cellMap = cellMapModel;

            cellModelMap[i] = cellModel;

            // const cellMapIndex = cellMap.index();
            // if (!ids.some(function (id: number) {
            //     return (id === cellMapIndex);
            // })) {
            //     ids.push(cellMapIndex);
            //     // loader.add(fbObj.cells(i).cellMap().name(), rootPath + fbObj.cells(i).cellMap().imagePath());
            // }
        }
        return cellModelMap;
    }


    public getFrameData(frameNumber: number): any {

    }


}


