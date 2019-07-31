import { flatbuffers } from 'flatbuffers';
import { ss } from 'ssfblib';

export function displaySsfb(ssfbPath: string) {
  const index = ssfbPath.lastIndexOf('/');
  const rootPath = ssfbPath.substring(0, index) + '/';

  let fbObj: ss.ssfb.ProjectData; // flatbuffer builder
  let httpObj: XMLHttpRequest = new XMLHttpRequest();
  httpObj.open('GET', ssfbPath, true);
  httpObj.responseType = 'arraybuffer';
  httpObj.onload = function () {
    let arrayBuffer = this.response;
    let bytes = new Uint8Array(arrayBuffer);
    let buf = new flatbuffers.ByteBuffer(bytes);
    fbObj = ss.ssfb.ProjectData.getRootAsProjectData(buf);
    document.open();
    document.writeln('ProjectData:{' + '<br><div style=\'padding: 0px 10px;\'>');
    document.writeln('dataId(uint):' + fbObj.dataId() + '<br>');
    document.writeln('version(uint):' + fbObj.version() + '<br>');
    document.writeln('imageBaseDir(string):' + fbObj.imageBaseDir() + '<br>');
    document.writeln('numCells(short):' + fbObj.numCells() + '<br>');
    document.writeln('numAnimePacks(short):' + fbObj.numAnimePacks() + '<br>');
    document.writeln('numEffectFileList(short):' + fbObj.numEffectFileList() + '<br>');
    document.writeln('cells(Cell)[' + fbObj.cellsLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
    for (let i = 0; i < fbObj.cellsLength(); i++) {
      document.writeln(i + ':{<br><div style=\'padding: 0px 10px;\'>');
      document.writeln('name(string):' + fbObj.cells(i).name() + '<br>');
      document.writeln('indexInCellMap(short):' + fbObj.cells(i).indexInCellMap() + '<br>');

      document.writeln('cellMap(CellMap):{<br><div style=\'padding: 0px 10px;\'>');
      document.writeln('name(string):' + fbObj.cells(i).cellMap().name() + '<br>');
      document.writeln('imagePath(string):' + fbObj.cells(i).cellMap().imagePath() + '<br>');
      document.writeln('index(short):' + fbObj.cells(i).cellMap().index() + '<br>');
      document.writeln('wrapmode(short):' + fbObj.cells(i).cellMap().wrapMode() + '<br>');
      document.writeln('filtermode(short):' + fbObj.cells(i).cellMap().filterMode() + '<br>');
      document.writeln('</div>}<br>');

      document.writeln('x(short):' + fbObj.cells(i).x() + '<br>');
      document.writeln('y(short):' + fbObj.cells(i).y() + '<br>');
      document.writeln('width(short):' + fbObj.cells(i).width() + '<br>');
      document.writeln('height(short):' + fbObj.cells(i).height() + '<br>');
      document.writeln('pivot_x(short):' + fbObj.cells(i).pivotX() + '<br>');
      document.writeln('pivot_y(short):' + fbObj.cells(i).pivotY() + '<br>');
      document.writeln('u1(float):' + fbObj.cells(i).u1() + '<br>');
      document.writeln('v1(float):' + fbObj.cells(i).v1() + '<br>');
      document.writeln('u2(float):' + fbObj.cells(i).u2() + '<br>');
      document.writeln('v2(float):' + fbObj.cells(i).v2() + '<br>');
      document.writeln('</div>}<br>');
    }
    document.writeln('</div>}<br>');
    document.writeln('animePacks(AnimePackData)[' + fbObj.animePacksLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
    for (let i = 0; i < fbObj.animePacksLength(); i++) {
      document.writeln(i + ':{<br><div style=\'padding: 0px 10px;\'>');
      document.writeln('name(string):' + fbObj.animePacks(i).name() + '<br>');
      document.writeln('parts(PartData)[' + fbObj.animePacks(i).partsLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
      for (let j = 0; j < fbObj.animePacks(i).partsLength(); j++) {
        document.writeln(j + ':{<br><div style=\'padding: 0px 10px;\'>');
        document.writeln('name(string):' + fbObj.animePacks(i).parts(j).name() + '<br>');
        document.writeln('index(short):' + fbObj.animePacks(i).parts(j).index() + '<br>');
        document.writeln('parentIndex(short):' + fbObj.animePacks(i).parts(j).parentIndex() + '<br>');
        document.writeln('type(SsPartType):' + fbObj.animePacks(i).parts(j).type() + '<br>');
        document.writeln('boundsType(short):' + fbObj.animePacks(i).parts(j).boundsType() + '<br>');
        document.writeln('alphaBlendType(short):' + fbObj.animePacks(i).parts(j).alphaBlendType() + '<br>');
        document.writeln('effectfilename(string):' + fbObj.animePacks(i).parts(j).effectfilename() + '<br>');
        document.writeln('colorLabel(string):' + fbObj.animePacks(i).parts(j).colorLabel() + '<br>');
        document.writeln('maskInfluence(short):' + fbObj.animePacks(i).parts(j).maskInfluence() + '<br>');
        document.writeln('</div>}<br>');
      }
      document.writeln('</div>}<br>');
      document.writeln('animations(AnimationData)[' + fbObj.animePacks(i).animationsLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
      for (let j = 0; j < fbObj.animePacks(i).animationsLength(); j++) {
        document.writeln(j + ':{<br><div style=\'padding: 0px 10px;\'>');
        document.writeln('name(string):' + fbObj.animePacks(i).animations(j).name() + '<br>');
        document.writeln('startFrames(short):' + fbObj.animePacks(i).animations(j).startFrames() + '<br>');
        document.writeln('endFrames(short):' + fbObj.animePacks(i).animations(j).endFrames() + '<br>');
        document.writeln('totalFrames(short):' + fbObj.animePacks(i).animations(j).totalFrames() + '<br>');
        document.writeln('fps(short):' + fbObj.animePacks(i).animations(j).fps() + '<br>');
        document.writeln('labelNum(short):' + fbObj.animePacks(i).animations(j).labelNum() + '<br>');
        document.writeln('canvasSizeW(short):' + fbObj.animePacks(i).animations(j).name() + '<br>');
        document.writeln('canvasSizeH(short):' + fbObj.animePacks(i).animations(j).name() + '<br>');
        document.writeln('canvasPivotX(float):' + fbObj.animePacks(i).animations(j).name() + '<br>');
        document.writeln('canvasPivotX(float):' + fbObj.animePacks(i).animations(j).name() + '<br>');
        document.writeln('defaultData(AnimationInitialData)[' + fbObj.animePacks(i).animations(j).defaultDataLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        for (let k = 0; k < fbObj.animePacks(i).animations(j).defaultDataLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          document.writeln('index(short):' + fbObj.animePacks(i).animations(j).defaultData(k).index() + '<br>');
          document.writeln('lowflag(int):' + fbObj.animePacks(i).animations(j).defaultData(k).lowflag() + '<br>');
          document.writeln('highflag(int):' + fbObj.animePacks(i).animations(j).defaultData(k).highflag() + '<br>');
          document.writeln('priority(short):' + fbObj.animePacks(i).animations(j).defaultData(k).priority() + '<br>');
          document.writeln('cellIndex(short):' + fbObj.animePacks(i).animations(j).defaultData(k).cellIndex() + '<br>');
          document.writeln('opacity(short):' + fbObj.animePacks(i).animations(j).defaultData(k).opacity() + '<br>');
          document.writeln('localopacity(short):' + fbObj.animePacks(i).animations(j).defaultData(k).localOpacity() + '<br>');
          document.writeln('masklimen(short):' + fbObj.animePacks(i).animations(j).defaultData(k).masklimen() + '<br>');
          document.writeln('positonX(float):' + fbObj.animePacks(i).animations(j).defaultData(k).positionX() + '<br>');
          document.writeln('positonY(float):' + fbObj.animePacks(i).animations(j).defaultData(k).positionY() + '<br>');
          document.writeln('positonZ(float):' + fbObj.animePacks(i).animations(j).defaultData(k).positionZ() + '<br>');
          document.writeln('pivotX(float):' + fbObj.animePacks(i).animations(j).defaultData(k).pivotX() + '<br>');
          document.writeln('pivotY(float):' + fbObj.animePacks(i).animations(j).defaultData(k).pivotY() + '<br>');
          document.writeln('rotationX(float):' + fbObj.animePacks(i).animations(j).defaultData(k).rotationX() + '<br>');
          document.writeln('rotationY(float):' + fbObj.animePacks(i).animations(j).defaultData(k).rotationY() + '<br>');
          document.writeln('rotationZ(float):' + fbObj.animePacks(i).animations(j).defaultData(k).rotationZ() + '<br>');
          document.writeln('scaleX(float):' + fbObj.animePacks(i).animations(j).defaultData(k).scaleX() + '<br>');
          document.writeln('scaleY(float):' + fbObj.animePacks(i).animations(j).defaultData(k).scaleY() + '<br>');
          document.writeln('localscaleX(float):' + fbObj.animePacks(i).animations(j).defaultData(k).localScaleX() + '<br>');
          document.writeln('localscaleY(float):' + fbObj.animePacks(i).animations(j).defaultData(k).localScaleY() + '<br>');
          document.writeln('size_X(float):' + fbObj.animePacks(i).animations(j).defaultData(k).sizeX() + '<br>');
          document.writeln('size_Y(float):' + fbObj.animePacks(i).animations(j).defaultData(k).sizeY() + '<br>');
          document.writeln('uv_move_X(float):' + fbObj.animePacks(i).animations(j).defaultData(k).uvMoveX() + '<br>');
          document.writeln('uv_move_Y(float):' + fbObj.animePacks(i).animations(j).defaultData(k).uvMoveY() + '<br>');
          document.writeln('uv_rotation(float):' + fbObj.animePacks(i).animations(j).defaultData(k).uvRotation() + '<br>');
          document.writeln('uv_scale_X(float):' + fbObj.animePacks(i).animations(j).defaultData(k).uvScaleX() + '<br>');
          document.writeln('uv_scale_Y(float):' + fbObj.animePacks(i).animations(j).defaultData(k).uvScaleY() + '<br>');
          document.writeln('boundingRadius(float):' + fbObj.animePacks(i).animations(j).defaultData(k).boundingRadius() + '<br>');
          document.writeln('instanceValue_curKeyframe(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueCurKeyframe() + '<br>');
          document.writeln('instanceValue_startFrame(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueStartFrame() + '<br>');
          document.writeln('instanceValue_endFrame(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueEndFrame() + '<br>');
          document.writeln('instanceValue_loopNum(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueLoopNum() + '<br>');
          document.writeln('instanceValue_speed(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueSpeed() + '<br>');
          document.writeln('instanceValue_loopflag(int):' + fbObj.animePacks(i).animations(j).defaultData(k).instanceValueLoopFlag() + '<br>');
          document.writeln('effectValue_curKeyframe(int):' + fbObj.animePacks(i).animations(j).defaultData(k).effectValueCurKeyframe() + '<br>');
          document.writeln('effectValue_startTime(int):' + fbObj.animePacks(i).animations(j).defaultData(k).effectValueStartTime() + '<br>');
          document.writeln('effectValue_speed(float):' + fbObj.animePacks(i).animations(j).defaultData(k).effectValueSpeed() + '<br>');
          document.writeln('effectValue_loopflag(int):' + fbObj.animePacks(i).animations(j).defaultData(k).effectValueLoopFlag() + '<br>');
          document.writeln('</div>}<br>');
        }
        document.writeln('</div>}<br>');
        document.writeln('frameData(frameDataIndex)[' + fbObj.animePacks(i).animations(j).frameDataLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        /* TODO: FIXME
        for (let k = 0; k < fbObj.animePacks(i).animations(j).frameDataLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          document.write('data(int)[' + fbObj.animePacks(i).animations(j).frameData(k).dataLength() + ']:[');
          for (let l = 0; l < fbObj.animePacks(i).animations(j).frameData(k).dataLength(); l++) {
            document.writeln(fbObj.animePacks(i).animations(j).frameData(k).data(l) + ',<br>');
          }
          document.writeln(']<br>');
          document.writeln('</div>}<br>');
        }
         */
        document.writeln('</div>}<br>');
        /*
        document.writeln('userData(userDataPerFrame)[' + fbObj.animePacks(i).animations(j).userDataLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        for (let k = 0; k < fbObj.animePacks(i).animations(j).userDataLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          document.writeln('frameIndex(short):' + fbObj.animePacks(i).animations(j).userData(k).frameIndex() + '<br>');
          document.writeln('data(userDataItem)[' + fbObj.animePacks(i).animations(j).userData(k).dataLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
          for (let l = 0; l < fbObj.animePacks(i).animations(j).userData(k).dataLength(); l++) {
            document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
            document.writeln('flags(short):' + fbObj.animePacks(i).animations(j).userData(k).data(l).flags() + '<br>');
            document.writeln('arrayIndex(short):' + fbObj.animePacks(i).animations(j).userData(k).data(l).arrayIndex() + '<br>');
            document.write('data((union)userDataValue)[' + fbObj.animePacks(i).animations(j).userData(k).data(l).dataLength() + ']:[');
            for (let m = 0; m < fbObj.animePacks(i).animations(j).userData(k).data(l).dataLength(); m++) {
              let type = fbObj.animePacks(i).animations(j).userData(k).data(l).dataType(m);
              if (type === ss.ssfb.userDataValue.userDataInteger) {
                document.writeln('(userDataInteger)[integer(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataInteger()).integer() + '],<br>');
              }
              if (type === ss.ssfb.userDataValue.userDataRect) {
                document.writeln('(userDataRect)[x(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataRect()).x() + ',');
                document.writeln('y(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataRect()).y() + ',');
                document.writeln('w(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataRect()).w() + ',');
                document.writeln('h(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataRect()).h() + '],<br>');
              }
              if (type === ss.ssfb.userDataValue.userDataPoint) {
                document.writeln('(userDataPoint)[x(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataPoint()).x() + ',');
                document.writeln('y(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataPoint()).y() + '],<br>');
              }
              if (type === ss.ssfb.userDataValue.userDataString) {
                document.writeln('(userDataString)[length(int):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataString()).length() + ',');
                document.writeln('data(string):' + fbObj.animePacks(i).animations(j).userData(k).data(l).data(m, new ss.ssfb.userDataString()).data() + '],<br>');
              }
            }
            document.writeln(']<br>');
            document.writeln('</div>}<br>');
          }
          document.writeln('</div>}<br>');
          document.writeln('</div>}<br>');
        }
        document.writeln('</div>}<br>');
        */
        document.writeln('labelData(labelDataItem)[' + fbObj.animePacks(i).animations(j).labelDataLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        for (let k = 0; k < fbObj.animePacks(i).animations(j).labelDataLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          document.writeln('label(string):' + fbObj.animePacks(i).animations(j).labelData(k).label() + '<br>');
          document.writeln('frameIndex(short):' + fbObj.animePacks(i).animations(j).labelData(k).frameIndex() + '<br>');
          document.writeln('</div>}<br>');
        }
        document.writeln('</div>}<br>');
        document.writeln('meshsDataUV(meshDataUV)[' + fbObj.animePacks(i).animations(j).meshsDataUVLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        for (let k = 0; k < fbObj.animePacks(i).animations(j).meshsDataUVLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          document.write('data(float)[' + fbObj.animePacks(i).animations(j).meshsDataUV(k).uvLength() + ']:[');
          for (let l = 0; l < fbObj.animePacks(i).animations(j).meshsDataUV(k).uvLength(); l++) {
            document.writeln(fbObj.animePacks(i).animations(j).meshsDataUV(k).uv(l) + ',<br>');
          }
          document.writeln(']<br>');
          document.writeln('</div>}<br>');
        }
        document.writeln('</div>}<br>');
        document.writeln('meshsDataIndices(meshDataIndices)[' + fbObj.animePacks(i).animations(j).meshsDataIndicesLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
        for (let k = 0; k < fbObj.animePacks(i).animations(j).meshsDataIndicesLength(); k++) {
          document.writeln(k + ':{<br><div style=\'padding: 0px 10px;\'>');
          // indices : [float];
          document.write('data(float)[' + fbObj.animePacks(i).animations(j).meshsDataIndices(k).indicesLength() + ']:[');
          for (let l = 0; l < fbObj.animePacks(i).animations(j).meshsDataIndices(k).indicesLength(); l++) {
            document.writeln(fbObj.animePacks(i).animations(j).meshsDataIndices(k).indices(l) + ',<br>');
          }
          document.writeln(']<br>');
          document.writeln('</div>}<br>');
        }
        document.writeln('</div>}<br>');
        document.writeln('</div>}<br>');
      }
      document.writeln('</div>}<br>');
      document.writeln('</div>}<br>');
    }
    document.writeln('</div>}<br>');
    /*
    document.writeln('effectFileList(EffectFile)[' + fbObj.effectFileListLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
    for (let i = 0; i < fbObj.effectFileListLength(); i++) {
      document.writeln(i + ':{<br><div style=\'padding: 0px 10px;\'>');
      document.writeln('name(string):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('fps(string):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('isLockRandSeed(short):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('lockRandSeed(short):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('layoutScaleX(short):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('layoutScaleY(short):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('numNodeList(short):' + fbObj.effectFileList(i).name() + '<br>');
      document.writeln('effectNode(EffectNode)[' + fbObj.effectFileList(i).effectNodeLength() + ']{<br><div style=\'padding: 0px 10px;\'>');
      for (let j = 0; j < fbObj.effectFileList(i).effectNodeLength(); j++) {
        document.writeln(j + ':{<br><div style=\'padding: 0px 10px;\'>');
        document.writeln('arrayIndex(short):' + fbObj.effectFileList(i).effectNode(j).arrayIndex() + '<br>');
        document.writeln('parentIndex(short):' + fbObj.effectFileList(i).effectNode(j).parentIndex() + '<br>');
        document.writeln('type(short):' + fbObj.effectFileList(i).effectNode(j).type() + '<br>');
        document.writeln('cellIndex(short):' + fbObj.effectFileList(i).effectNode(j).cellIndex() + '<br>');
        document.writeln('blendType(short):' + fbObj.effectFileList(i).effectNode(j).blendType() + '<br>');
        document.writeln('numBehavior(short):' + fbObj.effectFileList(i).effectNode(j).numBehavior() + '<br>');
        //            Behavior : [EffectNodeBehavior];
        document.write('Behavior((union)EffectNodeBehavior)[' + fbObj.effectFileList(i).effectNode(j).BehaviorLength() + ']:[');
        for (let k = 0; k < fbObj.effectFileList(i).effectNode(j).BehaviorLength(); k++) {
          let type = fbObj.effectFileList(i).effectNode(j).BehaviorType(k);
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementBasic) {
            // document.writeln('(EffectParticleElementBasic)[SsEffectFunctionType(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).SsEffectFuncitonType() + ',');
            document.writeln('priority(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).priority() + ',');
            document.writeln('maximumParticle(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).maximumParticle() + ',');
            document.writeln('interval(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).interval() + ',');
            document.writeln('lifetime(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).lifetime() + ',');
            document.writeln('speedMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).speedMinValue() + ',');
            document.writeln('speedMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).speedMaxValue() + ',');
            document.writeln('lifespanMinValue(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).lifespanMinValue() + ',');
            document.writeln('lifespanMaxValue(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).lifespanMaxValue() + ',');
            document.writeln('angle(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).angle() + ',');
            document.writeln('angleVariance(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementBasic()).angleVariance() + '],<br>');
          }

          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementRndSeedChange) {
            document.writeln('(EffectParticleElementRndSpeedChange)[Seed(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRndSeedChange()).Seed() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementDelay) {
            document.writeln('(EffectParticleElementDelay)[DelayTime(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementDelay()).DelayTime() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementGravity) {
            document.writeln('(EffectParticleElementGravity)[Gravity_x(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementGravity()).GravityX() + ',');
            document.writeln('Gravity_y(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementGravity()).GravityY() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementPosition) {
            document.writeln('(EffectParticleElementPosition)[OffsetXMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementPosition()).OffsetXMinValue() + ',');
            document.writeln('OffsetXMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementPosition()).OffsetXMaxValue() + ',');
            document.writeln('OffsetYMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementPosition()).OffsetYMinValue() + ',');
            document.writeln('OffsetYMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementPosition()).OffsetYMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementRotation) {
            document.writeln('(EffectParticleElementRotation)[RotationMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotation()).RotationMinValue() + ',');
            document.writeln('RotationMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotation()).RotationMaxValue() + ',');
            document.writeln('RotationAddMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotation()).RotationAddMinValue() + ',');
            document.writeln('RotationAddMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotation()).RotationAddMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementGravity) {
            document.writeln('(EffectParticleElementRotationTrans)[RotationFactor(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotationTrans()).RotationFactor() + ',');
            document.writeln('EndLifeTimePer(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementRotationTrans()).EndLifeTimePer() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementTransSpeed) {
            document.writeln('(EffectParticleElementTransSpeed)[SpeedMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSpeed()).SpeedMinValue() + ',');
            document.writeln('SpeedMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSpeed()).SpeedMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementTangentialAcceleration) {
            document.writeln('(EffectParticleElementTangentialAcceleration)[AccelerationMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTangentialAcceleration()).AccelerationMinValue() + ',');
            document.writeln('AccelerationMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTangentialAcceleration()).AccelerationMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementInitColor) {
            document.writeln('(EffectParticleElementInitColor)[ColorMinValue(uint):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementInitColor()).ColorMinValue() + ',');
            document.writeln('ColorMaxValue(uint):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementInitColor()).ColorMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementTransColor) {
            document.writeln('(EffectParticleElementTransColor)[ColorMinValue(uint):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransColor()).ColorMinValue() + ',');
            document.writeln('ColorMaxValue(uint):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransColor()).ColorMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementAlphaFade) {
            document.writeln('(EffectParticleElementAlphaFade)[disprangeMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementAlphaFade()).disprangeMinValue() + ',');
            document.writeln('disprangeMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementAlphaFade()).disprangeMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementSize) {
            document.writeln('(EffectParticleElementSize)[SizeXMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).SizeXMinValue() + ',');
            document.writeln('SizeXMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).SizeXMaxValue() + ',');
            document.writeln('SizeYMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).SizeYMinValue() + ',');
            document.writeln('SizeYMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).SizeYMaxValue() + ',');
            document.writeln('ScaleFactorMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).ScaleFactorMinValue() + ',');
            document.writeln('ScaleFactorMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementSize()).ScaleFactorMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleElementTransSize) {
            document.writeln('(EffectParticleElementTransSize)[SizeXMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).SizeXMinValue() + ',');
            document.writeln('SizeXMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).SizeXMaxValue() + ',');
            document.writeln('SizeYMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).SizeYMinValue() + ',');
            document.writeln('SizeYMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).SizeYMaxValue() + ',');
            document.writeln('ScaleFactorMinValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).ScaleFactorMinValue() + ',');
            document.writeln('ScaleFactorMaxValue(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleElementTransSize()).ScaleFactorMaxValue() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticlePointGravity) {
            document.writeln('(EffectParticlePointGravity)[Position_x(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticlePointGravity()).PositionX() + ',');
            document.writeln('Position_y(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticlePointGravity()).PositionY() + ',');
            document.writeln('Power(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticlePointGravity()).Power() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleTurnToDirectionEnabled) {
            document.writeln('(EffectParticleTurnToDirectionEnabled)[Rotation(float):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleTurnToDirectionEnabled()).Rotation() + '],<br>');
          }
          if (type === ss.ssfb.EffectNodeBehavior.EffectParticleInfiniteEmitEnabled) {
            document.writeln('(EffectParticleInfiniteEmitEnabled)[flag(int):' + fbObj.effectFileList(i).effectNode(j).Behavior(k, new ss.ssfb.EffectParticleInfiniteEmitEnabled()).flag() + '],<br>');
          }
        }

        document.writeln(']<br>');
        document.writeln('</div>}<br>');
        document.writeln('</div>}<br>');
      }
      document.writeln('</div>}<br>');
      document.writeln('</div>}<br>');
    }
    document.writeln('</div>}<br>');
    */
    document.writeln('</div>}<br>');
    document.close();
  };
  httpObj.send(null);
}

// 読み込むファイルはここを変更する
const ssfbPath = '../../../TestData/character_sample1/ss6ptest.ssbp.ssfb';
displaySsfb(ssfbPath);
