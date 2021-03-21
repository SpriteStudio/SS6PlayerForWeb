import { SS6Player, SS6Project } from 'ss6player-pixi';
import { Player } from './Player';

/**
 * PIXI のアニメーションを再生するコンテナ
 */
export class AnimationContainer extends SS6Player {
  private readonly ssWebPlayer: Player;

  private get onUpdateCallback() {
    return this.ssWebPlayer.onUpdateCallback;
  }

  private get onPlayStateChangeCallback() {
    return this.ssWebPlayer.onPlayStateChangeCallback;
  }

  public constructor(ssWebPlayer: Player) {
    super(ssWebPlayer.projectData);
    this.ssWebPlayer = ssWebPlayer;
    this.skipEnabled = false;
  }

  public Setup(animePackName: string, animeName: string) {
    super.Setup(animePackName, animeName);

    let self: AnimationContainer = this;
    this.playEndCallback = (player: SS6Player) => {
      if (self.ssWebPlayer && self.ssWebPlayer.playEndCallback) {
        self.ssWebPlayer.playEndCallback(self);
      }
    };

    this.onUserDataCallback = (data: any) => {
      if (self.ssWebPlayer && self.ssWebPlayer.onUpdateCallback) {
        self.ssWebPlayer.onUpdateCallback(self);
      }
    };

    // アニメーションの FrameDataMap を準備する
    this.setupCurrentAnimationFrameDataMap();
  }

  private currentAnimationFrameDataMap: any = null;
  public getCurrentAnimationFrameDataMap(): any {
    return this.currentAnimationFrameDataMap;
  }
  private setupCurrentAnimationFrameDataMap() {
    const currentAnimation = this.curAnimation;
    let frameDataMap = {};
    // ユーザーデータ
    const userDataLength = currentAnimation.userDataLength();
    // console.log('userDataLength', userDataLength);
    for (let i = 0; i < userDataLength; i++) {
      const userData = currentAnimation.userData(i);
      const frameIndex = userData.frameIndex();

      // 既存のフレームデータを取得
      let frameData = frameDataMap[frameIndex];
      if (frameData == null) {
        frameData = {};
      }

      // console.log('userData', frameIndex);
      const data = this.GetUserData(frameIndex);
      // console.log('userData.data', data);

      let frameUserDataMap = {};
      const dataLength = data.length;
      for (let dataIndex = 0; dataIndex < dataLength; dataIndex++) {
        const dataArray = data[dataIndex];

        // data.push([partsID, bit, d_int, d_rect_x, d_rect_y, d_rect_w, d_rect_h, d_pos_x, d_pos_y, d_string_length, d_string]);
        const partsArrayIndex = dataArray[0]; // パーツと紐づく
        const parts = this.curAnimePackData.parts(partsArrayIndex);
        const partsName = parts.name();

        const intValue = dataArray[2];
        const rectXValue = dataArray[3];
        const rectYValue = dataArray[4];
        const rectWidthValue = dataArray[5];
        const rectHeightValue = dataArray[6];
        const posXValue = dataArray[7];
        const posYValue = dataArray[8];
        const stringLengthValue = dataArray[9];
        const stringValue = dataArray[10];

        // console.log('userData.data.dataArray.stringValue', partsName, stringValue);
        frameUserDataMap[partsName] = {
          string: stringValue
        };
      }
      frameData['userData'] = frameUserDataMap;
      frameDataMap[frameIndex] = frameData;
    }
    this.currentAnimationFrameDataMap = frameDataMap;
  }

  public Play() {
    super.Play();
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  public Pause() {
    super.Pause();
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  public Stop() {
    super.Stop();
    if (this.onPlayStateChangeCallback !== null) {
      this.onPlayStateChangeCallback(this.isPlaying, this.isPausing);
    }
  }

  protected Update(delta: number) {
    this.UPdateInternal(delta);
    // 毎回実行されるコールバック
    if (this.isPlaying && !this.isPausing) {
      if (this.onUpdateCallback !== null) {
        this.onUpdateCallback(this);
      }
    }
  }

  public SetFrame(frame: number) {
    super.SetFrame(frame);

    this.SetFrameAnimation(frame);
    if (this.onUpdateCallback !== null) {
      this.onUpdateCallback(this);
    }
  }
}
