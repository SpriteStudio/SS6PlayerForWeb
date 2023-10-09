export interface PixiResourceLoader {
  load(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void)
  unload(sspjfile: string, sspjMap: { [key: string]: string }, onComplete: (error: any) => void)
  texture(key: string): any
}
