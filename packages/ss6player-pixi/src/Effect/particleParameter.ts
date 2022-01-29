import {Point} from '@pixi/math';
import {SsU8Color} from './SsU8Color';
import {SsPoint2} from './SsPoint2';

export class particleParameter {

  scale: Point = new Point();

  startcolor: SsU8Color = new SsU8Color();
  endcolor: SsU8Color = new SsU8Color();

  speed: number;
  speed2: number;

  angle: number;
  angleVariance: number;

  useGravity: boolean;
  gravity: SsPoint2 = new SsPoint2();

  useOffset: boolean;
  offset: SsPoint2 = new SsPoint2();
  offset2: SsPoint2 = new SsPoint2();

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
  initColor: SsU8Color = new SsU8Color();
  initColor2: SsU8Color = new SsU8Color();

  useTransColor: boolean;
  transColor: SsU8Color = new SsU8Color();
  transColor2: SsU8Color = new SsU8Color();

  useInitScale: boolean;
  scaleRange: SsPoint2 = new SsPoint2();
  scaleFactor: number;
  scaleFactor2: number;

  useTransScale: boolean;
  transscale: SsPoint2 = new SsPoint2();
  transscaleRange: SsPoint2 = new SsPoint2();
  transscaleFactor: number;
  transscaleFactor2: number;

  delay: number;

  usePGravity: boolean;
  gravityPos: SsPoint2 = new SsPoint2();
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
