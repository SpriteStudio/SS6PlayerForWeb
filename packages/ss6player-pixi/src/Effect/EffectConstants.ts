/**
 * @internal
 */
export class EffectConstants {
  static readonly SEED_MAGIC: number = 7573;
  static readonly LIFE_EXTEND_SCALE: number = 8;
  static readonly LIFE_EXTEND_MIN: number = 64;

  static readonly __PI__: number = 3.14159265358979323846;

  static RadianToDegree(Radian: number): number {
    return Radian * (180.0 / EffectConstants.__PI__);
  }

  static DegreeToRadian(Degree: number): number {
    return Degree * (EffectConstants.__PI__ / 180.0);
  }
}
