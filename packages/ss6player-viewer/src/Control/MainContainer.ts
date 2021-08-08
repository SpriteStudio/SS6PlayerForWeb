import * as PIXI from 'pixi.js';

const ZOOM_ARRAY: number[] = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 300, 400, 800];

/**
 *
 */
export class MainContainer extends PIXI.Container {
  private rootLineGraphics = null;
  private gridGraphics = null;
  private defaultScaleRatio = null;
  private zoomPercent = null;
  private isDisplayGrid = false;

  public constructor() {
    super();

    const rootLineGraphics = new PIXI.Graphics();
    const gridGraphics = new PIXI.Graphics();

    // コンテナに追加する
    this.addChild(rootLineGraphics);
    this.addChild(gridGraphics);

    this.rootLineGraphics = rootLineGraphics;
    this.gridGraphics = gridGraphics;
  }

  public setDefaultScaleRatio(defaultScaleRatio: number) {
    this.defaultScaleRatio = defaultScaleRatio;
  }

  public setPosition(positionX: number, positionY: number) {
    this.position.set(positionX, positionY);
  }

  public movePosition(movementX: number, movementY: number) {
    const position = this.position;
    position.x += movementX;
    position.y += movementY;
    this.position = position;
  }

  public zoom(zoomPercent: number) {
    let scaleRatio = this.defaultScaleRatio;
    if (zoomPercent !== 100) {
      scaleRatio = this.defaultScaleRatio * (zoomPercent * 0.01);
    }
    this.zoomPercent = zoomPercent;
    this.scale.set(scaleRatio, scaleRatio);
  }

  public zoomIn() {
    const zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
    const nextZoomArrayIndex = zoomArrayIndex + 1;
    if (nextZoomArrayIndex >= ZOOM_ARRAY.length) {
      // 拡大するズーム率が存在しない場合は処理しない
      return;
    }
    const nextZoomPercent = ZOOM_ARRAY[nextZoomArrayIndex];
    this.zoom(nextZoomPercent);
  }

  public zoomOut() {
    const zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
    const prevZoomArrayIndex = zoomArrayIndex - 1;
    if (prevZoomArrayIndex < 0) {
      // 縮小するズーム率が存在しない場合は処理しない
      return;
    }
    const prevZoomPercent = ZOOM_ARRAY[prevZoomArrayIndex];
    this.zoom(prevZoomPercent);

  }

  public switchGridDisplay() {
    // console.log('switchGridDisplay');
    const rootLineGraphics = this.rootLineGraphics;
    const gridGraphics = this.gridGraphics;
    if (rootLineGraphics == null || gridGraphics == null) {
      return;
    }
    rootLineGraphics.clear();
    gridGraphics.clear();

    this.isDisplayGrid = !this.isDisplayGrid;

    if (this.isDisplayGrid) {
      const min = -5000;
      const max = (min * -1) + 1;

      // 基準点の描画
      rootLineGraphics.lineStyle(1, 0x000000);
      rootLineGraphics.alpha = 0.3;
      rootLineGraphics.moveTo(min, 0).lineTo(max, 0);
      rootLineGraphics.moveTo(0, min).lineTo(0, max);

      // グリッドの描画
      gridGraphics.lineStyle(1, 0x000000);
      gridGraphics.alpha = 0.1;

      let gridSize = 100;
      for (let x = min; x < max; x += gridSize) {
        gridGraphics.moveTo(x, min).lineTo(x, max);

      }
      for (let y = min; y < max; y += gridSize) {
        gridGraphics.moveTo(min, -y).lineTo(max, -y);

      }
    }
  }
}
