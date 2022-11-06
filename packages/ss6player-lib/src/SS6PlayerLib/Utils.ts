import {ProjectData, Utils as ssfblibUtils} from 'ssfblib';

export class Utils {
  public static getProjectData(bytes: Uint8Array): ProjectData {
    return ssfblibUtils.getProjectData(bytes);
  }
}
