import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';
import { Cell } from '../../../Model/Cell';
import { CellMap } from '../../../Model/CellMap';
import { Project } from '../../../Model/Project';
import { AnimePackReader } from './AnimePackReader';

export class Reader {
    private animePackReader: AnimePackReader;
    private projectData: ss.ssfb.ProjectData;

    private directoryPath: string;

    public constructor(ssfbPath: string) {
        const index = ssfbPath.lastIndexOf('/');
        this.directoryPath = ssfbPath.substring(0, index) + '/';

        this.animePackReader = new AnimePackReader();
    }
    

    public create(arrayBuffer: any):  Project {
        const bytes = new Uint8Array(arrayBuffer);
        const buffer = new flatbuffers.ByteBuffer(bytes);


        this.projectData = ss.ssfb.ProjectData.getRootAsProjectData(buffer);

        const project: Project = new Project();
        project.directoryPath = this.directoryPath;

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


