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

// Initialize PIXI Application
// （通常のPIXI.jsアプリケーションの初期化手順）
const app = new PIXI.Application({ width:1280, height:720, backgroundColor : 0x606060 }); // 比較しやすいようにSSの初期設定と同じ色にしてみた
document.body.appendChild(app.view);

const ssfbMap = {
  "sampleAnimation1": {
    "ssfbFile": "./character_sample1/character_sample1.ssfb",
    "func": Play_sampleAnimation1
  },

  "sampleAnimation2": {
    "ssfbFile": "./AnimeMaking/AnimeMaking.ssfb",
    "func": Play_sampleAnimation2
  },

  "sampleAnimation3": {
    "ssfbFile": "./MeshBone/Knight.ssfb",
    "func": Play_sampleAnimation3
  }
};

const mySS6Project = new ss6PlayerPixi.SS6Project(ssfbMap[testVersion]["ssfbFile"], function () {
  ssfbMap[testVersion]["func"]();
});

// プレイヤーの使用方法サンプル
function Play_sampleAnimation1() {
  {
    let mySS6Player = new ss6PlayerPixi.SS6Player(mySS6Project);
    mySS6Player.Setup("character_template_3head", "attack1");
    mySS6Player.position = new PIXI.Point(320, 480);
    mySS6Player.scale = new PIXI.Point(0.5, 0.5);
    app.stage.addChild(mySS6Player);

    // [任意]ユーザーデータコールバック
    // ※Play前に設定しないと開始フレームのデータが漏れるので注意
    mySS6Player.SetUserDataCalback(function (userDataArray) {
      // console.log(userDataArray);
    });

    // [任意]再生速度(SS設定値への乗率、負設定で逆再生)とフレームスキップの可否(初期値はfalse)を設定
    // フレームスキップ：trueで処理落ちでフレームスキップ、falseで処理落ちでもフレームスキップしない
    // mySS6Player.SetAnimationSpeed(-1, true);

    // [任意]始点フレーム番号、終点フレーム番号、ループ回数（0以下で無限ループ）
    // 同時に初期フレームを始点（再生速度がマイナスの場合は終点）フレーム番号に設定
    // mySS6Player.SetAnimationSection(0, 10, -1);

    // 再生開始
    mySS6Player.Play();
  }
}

// プレイヤーの使用方法サンプル
function Play_sampleAnimation2() {
  {
    let mySS6Player = new ss6PlayerPixi.SS6Player(mySS6Project);
    mySS6Player.Setup("AnimeMaking", "06_pose");
    mySS6Player.position = new PIXI.Point(240, 320);
    app.stage.addChild(mySS6Player);

    // 再生開始
    mySS6Player.Play();
  }
  /*
  {
    let mySS6Player = new SS6Player(mySS6Project, "AnimeMaking", "04_pose");
    mySS6Player.position = new PIXI.Point(480, 320);
    app.stage.addChild(mySS6Player);

    // 再生開始
    mySS6Player.Play();
  }
   */
}

// プレイヤーの使用方法サンプル
function Play_sampleAnimation3() {
  {
    var mySS6Player = new ss6PlayerPixi.SS6Player(mySS6Project);
    mySS6Player.Setup("Knight_bomb", "Balloon");
    mySS6Player.position = new PIXI.Point(320, 480);
    mySS6Player.scale = new PIXI.Point(0.5, 0.5);
    app.stage.addChild(mySS6Player);

    // 再生開始
    mySS6Player.Play();
  }
}

