export class particleParameter {

  // SsVector2 	scale;

  // SsU8Color   startcolor; //�X�^�[�g���̃J���[
  // SsU8Color   endcolor;   //�I�����̃J���[

  speed: number;
  speed2: number;

  angle: number;
  angleVariance: number;

  useGravity: boolean;
  // SsVector2	gravity;

  useOffset: boolean;
  // SsVector2   offset;
  // SsVector2   offset2;

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
  // SsU8Color   initColor;
  // SsU8Color   initColor2;

  useTransColor: boolean;
  // SsU8Color   transColor;
  // SsU8Color   transColor2;

  useInitScale: boolean;
  // SsVector2   scaleRange;
  scaleFactor: number;
  scaleFactor2: number;

  useTransScale: boolean;
  // SsVector2   transscale;
  // SsVector2   transscaleRange;
  transscaleFactor: number;
  transscaleFactor2: number;

  delay: number;

  usePGravity: boolean;
  // SsVector2	gravityPos;
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

