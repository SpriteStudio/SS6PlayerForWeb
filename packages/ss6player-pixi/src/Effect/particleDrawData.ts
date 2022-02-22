import {Point} from '@pixi/math';

/**
 * @internal
 */
export class particleDrawData {
  id: number;
  pid: number;
	stime: number;
  lifetime: number;

  x: number;
	y: number;
	rot: number;
	direc: number;

	// TODO: impl
  color: Array<number> = new Array(3); //
  scale: Point = new Point();
}
