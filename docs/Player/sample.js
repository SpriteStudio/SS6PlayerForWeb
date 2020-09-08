//-----------------------------------------------------------
// SS6Player For Web
//
// Copyright(C) Web Technology Corp.
// http://www.webtech.co.jp/
//-----------------------------------------------------------

//SpriteStudioのアニメーションを再生するサンプルです。
//アニメーションデータ(.ssfb)はSptiteStudioSDKに含まれる
//Ss6Converterで作成します。詳細は以下のURLを参照してください。
//https://github.com/SpriteStudio/SpriteStudio6-SDK

// Test data switcher
//var testVersion = "sampleAnimation1";
//var testVersion = "sampleAnimation2";
var testVersion = "sampleAnimation3";

// Say Hello
// （動作には関係ないPIXI.jsのバージョン表示）
var type = PIXI.utils.isWebGLSupported() ? "WebGL" : "Canvas";
PIXI.utils.sayHello(type);

// Initialize PIXI Application
// （通常のPIXI.jsアプリケーションの初期化手順）
var app = new PIXI.Application({
  width: 640, 
  height: 640, 
  backgroundColor : 0x606060
}); // 比較しやすいようにSSの初期設定と同じ色にしてみた
document.body.appendChild(app.view);

// 読込完了コールバック
var onComplete = function() {
  switch (testVersion) {
    case "sampleAnimation1":
      Play_sampleAnimation1();
      break;
    case "sampleAnimation2":
      Play_sampleAnimation2();
      break;
    case "sampleAnimation3":
      Play_sampleAnimation3();
      break;
    default:
      break;
  }
};

// Initialize SS6 Project (json file path)
// ssbpをコンバートしたjsonファイルを指定
var ssfbFile;
switch (testVersion) {
  case "sampleAnimation1":
    ssfbFile = "./character_sample1/character_sample1.ssbp.ssfb";
    break;
  case "sampleAnimation2":
    ssfbFile = "./AnimeMaking/AnimeMaking.ssbp.ssfb";
    break;
  case "sampleAnimation3":
    ssfbFile = "./MeshBone/Knight.ssbp.ssfb";
    break;
  default:
    ssfbFile = "";
    break;
}
var mySS6Project = new ss6PlayerPixi.SS6Project(ssfbFile, onComplete);

// プレイヤーの使用方法サンプル
function Play_sampleAnimation1() {
  {
    var mySS6Player = new ss6PlayerPixi.SS6Player(mySS6Project);
    mySS6Player.Setup("character_template_3head", "attack1");
    mySS6Player.position = new PIXI.Point(320, 480);
    mySS6Player.scale = new PIXI.Point(0.5, 0.5);
    app.stage.addChild(mySS6Player);

    // [任意]ユーザーデータコールバック
    // ※Play前に設定しないと開始フレームのデータが漏れるので注意
    mySS6Player.SetUserDataCalback(function(userDataArray) {
      // console.log(userDataArray);
    });

    // [任意]再生速度(SS設定値への乗率、負設定で逆再生)とフレームスキップの可否(初期値はfalse)を設定
    // フレームスキップ：trueで処理落ちでフレームスキップ、falseで処理落ちでもフレームスキップしない
//        mySS6Player.SetAnimationSpeed(-1, true);

    // [任意]始点フレーム番号、終点フレーム番号、ループ回数（0以下で無限ループ）
    // 同時に初期フレームを始点（再生速度がマイナスの場合は終点）フレーム番号に設定
//        mySS6Player.SetAnimationSection(0, 10, -1);

    // 再生開始
    mySS6Player.Play();
  }
}

// プレイヤーの使用方法サンプル
function Play_sampleAnimation2() {
  {
    var mySS6Player = new ss6PlayerPixi.SS6Player(mySS6Project);
    mySS6Player.Setup("AnimeMaking", "06_pose");
    mySS6Player.position = new PIXI.Point(240, 320);
    app.stage.addChild(mySS6Player);

    // 再生開始
    mySS6Player.Play();
  }
  /*
      {
          var mySS6Player = new SS6Player(mySS6Project, "AnimeMaking", "04_pose");
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

