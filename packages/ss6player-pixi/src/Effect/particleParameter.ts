import {Point} from '@pixi/math';

export class particleParameter {

  scale: Point = new Point();

  startcolor: Array<number> = new Array(4);
  endcolor: Array<number> = new Array(4);

  speed: number;
  speed2: number;

  angle: number;
  angleVariance: number;

  useGravity: boolean;
  gravity: Point = new Point();

  useOffset: boolean;
  offset: Point = new Point();
  offset2: Point = new Point();

  useRotation: boolean;
  rotation: number;
  rotation2: number;

  rotationAdd: number;
  rotationAdd2: number;

  useRotationTrans: boolean;
  rotationFactor: number;
  endLifeTimePer: number;

  useTanAccel: boolean;
  tangentialAccel: number;
  tangentialAccel2: number;

  useColor: boolean;
  initColor: Array<number> = new Array(4);
  initColor2: Array<number> = new Array(4);

  useTransColor: boolean;
  transColor: Array<number> = new Array(4);
  transColor2: Array<number> = new Array(4);

  useInitScale: boolean;
  scaleRange: Point = new Point();
  scaleFactor: number;
  scaleFactor2: number;

  useTransScale: boolean;
  transscale: Point = new Point();
  transscaleRange: Point = new Point();
  transscaleFactor: number;
  transscaleFactor2: number;

  delay: number;

  usePGravity: boolean;
  gravityPos: Point = new Point();
  gravityPower: number;

  useAlphaFade: boolean;
  alphaFade: number;
  alphaFade2: number;

  useTransSpeed: boolean;
  transSpeed: number;
  transSpeed2: number;

  useTurnDirec: boolean;
  direcRotAdd: number;

  userOverrideRSeed: boolean;
  overrideRSeed: number;

  public constructor() {

  }
}
