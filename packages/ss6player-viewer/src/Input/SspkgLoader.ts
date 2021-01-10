import JSZip from "jszip/dist/jszip"; // for avoding rollup error (https://github.com/Stuk/jszip/issues/673)

export class SspkgLoader {
  load(url: string, onFinishCallback: (ssfbFileData: Uint8Array, imageBinaryMap: { [key:string]: Uint8Array; }, error: any) => void) {
    const self = this;

    fetch(url)
      .then(function (response: Response) {
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response.blob());
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then(JSZip.loadAsync)
      .then(function (zipFile: JSZip) {
        console.log(zipFile);

        let ssfbFilePath = null;
        const imageBinaryMap = {};

        for (let fileName in zipFile.files) {
          const file = zipFile.files[fileName];
          const fileExtension = fileName.split('.').pop();
          console.log(fileName, file, fileExtension);

          if (fileExtension === 'ssfb') {
            if (ssfbFilePath !== null) {
              // 既に ssfb が存在していた場合、エラー

            }
            ssfbFilePath = fileName;
          } else if (fileExtension === 'png') {
            const imageName = fileName.split('.').slice(0, -1).join('.');
            zipFile.file(fileName).async("uint8array").then((uint8Array) => {
              imageBinaryMap[imageName] = uint8Array;
            });
          }
        }

        // self.spriteStudioWebPlayer.setImageBinaryMap(imageBinaryMap);

        zipFile.file(ssfbFilePath).async("uint8array").then((uint8Array: Uint8Array) => {
          onFinishCallback(uint8Array, imageBinaryMap, null);
        });
      }, function error(e) {
        console.log(e);
        onFinishCallback(null, null, e);
      });
  }
}
