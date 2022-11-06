import {ProjectData} from './ss/ssfb/project-data';
import {ByteBuffer} from 'flatbuffers';

export class Utils {
  public static getProjectData(bytes: Uint8Array): ProjectData {
    const buf = new ByteBuffer(bytes);
    return ProjectData.getRootAsProjectData(buf);
  }
}
