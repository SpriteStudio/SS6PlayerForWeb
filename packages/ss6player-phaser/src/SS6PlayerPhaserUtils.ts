export class SS6PlayerPhaserUtils {
  static generateKeyOfSsfbImage(dataKey: string, image: string) {
    return dataKey + '!' + image;
  }

  static getRootPath(url: string): string {
    const index = url.lastIndexOf('/');
    return url.substring(0, index) + '/';
  }
}
