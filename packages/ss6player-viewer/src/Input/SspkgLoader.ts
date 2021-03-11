import JSZip from 'jszip/dist/jszip'; // for avoding rollup error (https://github.com/Stuk/jszip/issues/673)

export class SspkgLoader {
  load(url: string, onFinishCallback: (ssfbFileData: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array; }, error: any) => void) {
    const self = this;

    const httpObj = new XMLHttpRequest();
    const method = 'GET';
    httpObj.open(method, url, true);
    httpObj.responseType = 'arraybuffer';
    httpObj.onload = function () {
      if (!(httpObj.status === 200 || httpObj.status === 0)) {
        // failed
        onFinishCallback(null, null, new Error(this.statusText));
      }
      const arrayBuffer = this.response;
      const bytes = new Uint8Array(arrayBuffer);

      let zip = new JSZip();
      zip.loadAsync(bytes, {
        checkCRC32: true
      }).then(function (zipFile: JSZip) {
        // console.log(zipFile);

        let ssfbFilePath = null;
        const imageBinaryMap = {};

        for (let fileName in zipFile.files) {
          const file = zipFile.files[fileName];
          const fileExtension = fileName.split('.').pop();
          // console.log(fileName, file, fileExtension);

          if (fileExtension === 'ssfb') {
            if (ssfbFilePath !== null) {
              // 既に ssfb が存在していた場合、エラー
              onFinishCallback(null, null, new Error("already exist ssfb file"));
              return;
            }
            ssfbFilePath = fileName;
          } else if (fileExtension === 'png') {
            const imageName = fileName.split('.').slice(0, -1).join('.');
            zipFile.file(fileName).async('uint8array').then((uint8Array) => {
              imageBinaryMap[imageName] = uint8Array;
            });
          }
        }

        // self.spriteStudioWebPlayer.setImageBinaryMap(imageBinaryMap);

        zipFile.file(ssfbFilePath).async('uint8array').then((uint8Array: Uint8Array) => {
          onFinishCallback(uint8Array, imageBinaryMap, null);
        });
      }, function (e) {
        // Error: Corrupted zip : CRC32 mismatch
        onFinishCallback(null, null, e);
      });
    };

    httpObj.ontimeout = function () {
      // timeout
      onFinishCallback(null, null, new Error("timeout"));
    };
    httpObj.onerror = function () {
      // error
      onFinishCallback(null, null, new Error("error"));
    };
    httpObj.send(null);
  }
}
