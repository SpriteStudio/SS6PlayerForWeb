#!/usr/bin/env ts-node

import * as Util from 'util'
import * as Path from 'path';
import * as FS from 'fs';
import { flatbuffers } from 'flatbuffers'
import { ss } from "../../src/ssfb_generated";

async function main()  {
  if(process.argv.length != 3) {
    const name = Path.basename(process.argv[1]);
    console.error('Usage: ' + name  + ' ssfbfile');
    return -1;
  }

  const ssfb_file = process.argv[2];
  const ssfb = await Util.promisify(FS.readFile)(ssfb_file, null);
  const bytes = new Uint8Array(ssfb);
  const buf = new flatbuffers.ByteBuffer(bytes);
  const fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
  for (let i = 0; i < fbObj.animePacksLength(); i++) {
    const animePackName = fbObj.animePacks(i).name();
    for (let j = 0; j < fbObj.animePacks(i).animationsLength(); j++) {
      const animationName = fbObj.animePacks(i).animations(j).name();
      console.log(animePackName + ': ' + animationName);
    }
  }
  return 0;
}

main();
