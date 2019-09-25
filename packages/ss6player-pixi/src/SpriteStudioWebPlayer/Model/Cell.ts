import { CellMap } from "./CellMap";

export class Cell {
    public name: string;

    public height: number;
    public width: number;

    public pivotX: number;
    public pivotY: number;

    public u1: number;
    public u2: number;
    public v1: number;
    public v2: number;

    public cellMap: CellMap;

}