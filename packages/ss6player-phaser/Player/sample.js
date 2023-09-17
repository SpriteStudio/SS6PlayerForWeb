//-----------------------------------------------------------
// SS6Player For Web
//
// Copyright(C) CRI Middleware Co., Ltd.
// http://www.webtech.co.jp/
//-----------------------------------------------------------

//SpriteStudioのアニメーションを再生するサンプルです。
//アニメーションデータ(.ssfb)はSptiteStudioSDKに含まれる
//Ss6Converterで作成します。詳細は以下のURLを参照してください。
//https://github.com/SpriteStudio/SpriteStudio6-SDK

// Test data switcher
//const testVersion = "sampleAnimation1";
//const testVersion = "sampleAnimation2";
const testVersion = "sampleAnimation3";

class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')
  }

  preload() {
    this.load.ss6playerSsfb(testVersion, "../../../TestData/MeshBone/Knight.ssfb");
    // this.load.ss6playerSsfb("B", "http://localhost:8090/TestData/MeshBone/Knight.ssfb");
  }

  create() {
    const ssAnime = this.add.ss6player(200, 500, testVersion, "Knight_bomb", "Balloon");
  }

  update(time, delta) {
    // console.log("update: " + time + " " + delta)
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1270,
  height: 740,
  backgroundColor: "#606060",
  plugins: {
    scene: [
      {
        key: "ss6PlayerPhaser.SS6PlayerPlugin",
        plugin: ss6PlayerPhaser.SS6PlayerPlugin,
        mapping: "ss6player"
      }
    ]
  },
  scene: [GameScene]
});
