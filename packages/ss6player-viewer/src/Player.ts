import { Texture } from '@pixi/core';
import { Application } from '@pixi/app';
import { MainContainer } from './Control/MainContainer';
import { AnimationContainer } from './AnimationContainer';
import { SS6Project } from 'ss6player-pixi';
import { SspkgLoader } from './Input/SspkgLoader';
import { SsfbDataUtil } from './SsfbDataUtil';

const PREVIEW_POSITION_MARGIN: number = 30;

export class Player {
  public projectData: SS6Project;

  public onComplete: () => void;

  public textureMap: { [key: string]: Texture; } = null;

  private animePackMap: { [key: string]: any; } = null;

  public infinityFlag: boolean = true;

  public getAnimePackMap() {
    return this.animePackMap;
  }

  public pixiApplication: Application = null;

  public canvasWidth: number = null;
  public canvasHeight: number = null;

  public mainContainer: MainContainer = null;
  public textureContainer: AnimationContainer = null;

  private currentAnimePack = null;

  public getCurrentAnimePack() {
    return this.currentAnimePack;
  }

  private currentAnimation = null;

  public getCurrentAnimation() {
    return this.currentAnimation;
  }

  public onUserDataCallback: (data: any) => void = null;
  public playEndCallback: (player: AnimationContainer) => void = null;
  public onUpdateCallback: (player: AnimationContainer) => void = null;
  public onPlayStateChangeCallback: (isPlaying: boolean, isPausing: boolean) => void = null;

  private frameDataMap = null;

  public getFrameDataMap() {
    return this.frameDataMap;
  }

  public constructor(canvasWrapperElement: any) {
    this.canvasWidth = canvasWrapperElement.clientWidth;
    this.canvasHeight = canvasWrapperElement.clientHeight;
    const pixiApplication = new Application({ width: this.canvasWidth, height: this.canvasHeight, transparent: true });

    const canvasElement = pixiApplication.view;
    canvasWrapperElement.appendChild(canvasElement);

    const mainContainer = new MainContainer();
    pixiApplication.stage.addChild(mainContainer);
    this.mainContainer = mainContainer;

    this.pixiApplication = pixiApplication;
  }

  public getTextureContainer() {
    // console.log('SpriteStudioWebPlayer.createPlayer');
    return this.textureContainer;
  }

  /**
   * Download ssfb file and dependencies image files, and load.
   * @param {string} url
   */
  public loadSsfb(url: string) {
    const self = this;
    let ss6Project = new SS6Project(url, () => {
      self.setupForLoadComplete(ss6Project);
    });
  }

  /**
   * Download sspkg file, decompress sspkg and load.
   * @param {string} url
   */
  public loadSspkg(url: string) {
    const self = this;
    let sspkgLoader = new SspkgLoader();
    sspkgLoader.load(url, (ssfbFileData: Uint8Array, imageBinaryMap: { [key: string]: Uint8Array; }, error: any) => {
      if (error !== null) {
        return;
      }
      let ss6Project = new SS6Project(ssfbFileData, imageBinaryMap, () => {
        self.setupForLoadComplete(ss6Project);
      });
    });
  }

  private setupForLoadComplete(ss6Project: SS6Project) {
    this.projectData = ss6Project;
    this.textureMap = {};
    for (let imageName in ss6Project.resources) {
      const resource = ss6Project.resources[imageName];
      this.textureMap[imageName] = resource.texture;
    }

    this.animePackMap = SsfbDataUtil.createAnimePackMap(this.projectData);
    // console.log('setupForLoadComplete', this.animePackMap);

    if (this.onComplete !== null) {
      this.onComplete();
    }
  }

  /**
   * アニメーションを再生する
   * @param animePackName アニメパック名
   * @param animeName アニメーション名
   */
  public loadAnimation(animePackName: string, animeName: string) {
    let isSetupTextureContainer = false;
    if (this.textureContainer == null) {
      isSetupTextureContainer = true;
      this.textureContainer = new AnimationContainer(this);
    }

    // animePackMap から animation の情報を取得
    const animePackData = this.animePackMap[animePackName];
    const animePack = animePackData.animePack;
    const animationMap = animePackData.animationMap;
    const animation = animationMap[animeName];

    // currentAnimePack, currentAnimation を記録
    this.currentAnimation = animation;
    this.currentAnimePack = animePack;

    // textureContainer にて Animation を再生
    this.textureContainer.Setup(animePackName, animeName);

    // ラベルデータの取得
    const labelDataLength = animation.labelDataLength();
    // console.log('labelDataLength', labelDataLength);
    for (let i = 0; i < labelDataLength; i++) {
      const labelData = animation.labelData(i);
    }

    if (isSetupTextureContainer) {
      this.mainContainer.addChild(this.textureContainer);

    }

    // 現状のアニメーションからポジション設定を取得し、 setPosition を行う

    // デフォルトのポジションを設定
    this.setupDefaultPosition();

    // 現状のアニメーションからサイズ設定を取得し、 setDefaultScaleRatio を行う
    // スケール値自動調整
    this.setupDefaultScaleRatio();

    // FrameDataの情報を取得
    this.frameDataMap = this.getCurrentAnimationFrameDataMap();

  }

  public play() {
    this.textureContainer.Play();
  }

  public pause() {
    this.textureContainer.Pause();
  }

  public stop() {
    this.textureContainer.Stop();
  }

  public resume() {
    this.textureContainer.Resume();
  }

  public movePosition(movementX: number, movementY: number) {
    this.mainContainer.movePosition(movementX, movementY);
  }

  public zoom(zoomPercent: number) {
    this.mainContainer.zoom(zoomPercent);
  }

  public zoomIn() {
    this.mainContainer.zoomIn();
  }

  public zoomOut() {
    this.mainContainer.zoomOut();
  }

  public switchGridDisplay() {
    this.mainContainer.switchGridDisplay();

  }

  public setFrame(frameNumber) {
    this.textureContainer.SetFrame(frameNumber);
  }

  public nextFrame() {
    // console.log('nextFrame');
    this.textureContainer.NextFrame();
  }

  public prevFrame() {
    this.textureContainer.PrevFrame();
  }

  public get startFrame(): number {
    return this.currentAnimation.startFrame;
  }

  public get endFrame(): number {
    return this.currentAnimation.endFrames();
  }

  public get totalFrame(): number {
    return this.currentAnimation.totalFrames();
  }

  public get fps(): number {
    return this.currentAnimation.fps();
  }

  public get frameNo(): number {
    return this.textureContainer.frameNo;
  }

  public get isPlaying(): boolean {
    return this.textureContainer.isPlaying;
  }

  public get isPausing(): boolean {
    return this.textureContainer.isPausing;
  }

  public setAnimationSpeed(value: number) {
    this.textureContainer.SetAnimationSpeed(value);
  }

  public switchLoop(isInfinity: boolean) {
    this.textureContainer.loop = (isInfinity) ? -1 : 1; // Changing loop status at being playing an animation.
    this.infinityFlag = isInfinity;
  }

  public setAnimationSection(_startframe: number = -1, _endframe: number = -1, _loops: number = -1) {
    this.textureContainer.SetAnimationSection(_startframe, _endframe, _loops);
  }

  /**
   * デフォルトのポジションを設定する
   */
  public setupDefaultPosition() {
    const currentAnimation = this.currentAnimation;

    // ポジション設定
    const canvasPvotX = currentAnimation.canvasPvotX();
    const canvasPvotY = currentAnimation.canvasPvotY();

    let positionX;
    switch (canvasPvotX) {
      case 0.5:
        positionX = PREVIEW_POSITION_MARGIN;
        break;
      case 0:
        positionX = this.canvasWidth * 0.5;
        break;
      case -0.5:
        positionX = this.canvasWidth - PREVIEW_POSITION_MARGIN;
        break;
    }
    let positionY;
    switch (canvasPvotY) {
      case 0.5:
        positionY = PREVIEW_POSITION_MARGIN;
        break;
      case 0:
        positionY = this.canvasHeight * 0.5;
        break;
      case -0.5:
        positionY = this.canvasHeight - PREVIEW_POSITION_MARGIN;
    }

    this.mainContainer.setPosition(positionX, positionY);
  }

  /**
   * デフォルトのスケール率を設定
   */
  public setupDefaultScaleRatio() {
    const currentAnimation = this.currentAnimation;

    const playerHeight = currentAnimation.canvasSizeH();
    const playerWidth = currentAnimation.canvasSizeW();

    const widthRatio = this.canvasWidth / playerWidth;
    const heightRatio = this.canvasHeight / playerHeight;
    let scaleRatio = null;
    if (widthRatio < heightRatio) {
      scaleRatio = widthRatio;
    } else if (heightRatio < widthRatio) {
      scaleRatio = heightRatio;
    }
    // scaleRatio *= 0.5;
    // this.spriteStudioWebPlayer.defaultScaleRatio = scaleRatio;
    this.mainContainer.setDefaultScaleRatio(scaleRatio);
    this.mainContainer.zoom(100);

  }

  public getCurrentAnimationFrameDataMap() {
    return this.textureContainer.getCurrentAnimationFrameDataMap();
  }
}
