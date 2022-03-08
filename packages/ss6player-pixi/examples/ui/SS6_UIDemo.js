//-----------------------------------------------------------
// SS6Player for pixi.js - UI sample - buttons
//
// OPTPiX SpriteStudio で制作したボタンのアニメーションデータを利用し、
// マウス、タッチのイベントに応じて、アニメーションを変化させるデモプログラムです。
// SpriteStudio のアニメーション再生には SS6Player For pixi.js を利用しています。
//
// 詳細は下記のURLにアクセスしてください。
// https://github.com/SpriteStudio/SS6PlayerForWeb/tree/master/packages/ss6player-pixi
//
// Copyright (C) CRI Middleware Co., Ltd.
//-----------------------------------------------------------

// Say Hello
// （動作には関係ないPIXI.jsのバージョン表示）
const type = PIXI.utils.isWebGLSupported() ? "WebGL" : "Canvas";
PIXI.utils.sayHello(type);

// Initialize PIXI Application
// （通常のPIXI.jsアプリケーションの初期化手順）
const app = new PIXI.Application({ width: 1280, height: 760, backgroundColor: 0x606060 }); // 比較しやすいようにSSの初期設定と同じ色にしてみた
document.body.appendChild(app.view);
/*
const bg = new PIXI.Container(PIXI.Texture.WHITE);
bg.x = 100;
bg.y = 100;
bg.width = 100;
bg.height = 200;
app.stage.addChild(bg);
*/

const ssfbFiles = {
  "button": "assets/button/button.ssfb",
  "click": "assets/effect/click.ssfb"
};

let loadedSsfbs = {
  "button": false,
  "click": false
};
let mySS6Projects = {};
for (let ssfbName in ssfbFiles) {
  mySS6Projects[ssfbName] = new ss6PlayerPixi.SS6Project(ssfbFiles[ssfbName],
    () => {app.stage.emit('loadedssfb', ssfbName, true);}, // onComplete
    30, // timeout
    3, // retry
    (ssfbPath, timeout, retry, httpObj) => { app.stage.emit('loadedssfb', ssfbName, false);} // onError
  );
}

app.stage.on('loadedssfb', (ssfbName, success) => {
  loadedSsfbs[ssfbName] = success;
  if (success) {
    if (Object.values(loadedSsfbs).every(value => value)) {
      // completely loaded all ssfb files

      LoadButtonAnimation(mySS6Projects["button"]);
      // LoadButtonAnimation2(mySS6Projects["button"], mySS6Projects["click"]);
    }
  } else {
    // failed to load ssfbName file
    alert("failed to load ssfb files.");
    // TODO: show load error dialog
  }
});

function LoadButtonAnimation(ss6project) {

  const animePackNames = [
    "button_a01", "button_a02", "button_a03", "button_a04", "button_a05", "button_a06", "button_a07", "button_a08", "button_a09", "button_a10", "button_a11", "button_a12", "button_a13", "button_a14", "button_a15", "button_a16",
    "button_b01", "button_b02", "button_b03", "button_b04", "button_b05", "button_b06", "button_b07",
    "button_c01", "button_c02", "button_c03", "button_c04", "button_c05", "button_c06", "button_c07", "button_c08", "button_c09",
    "button_d01", "button_d02", "button_d03", "button_d04",
    "button_f01", "button_f02",
  ];

  const offset_x = 100;
  const offset_y = 100;
  const item_x = 150;
  const item_y = 100;
  const MAX_ROW_NUM = 6;

  const scale = new PIXI.Point(1.0, 1.0);

  let x_idx = 0;
  let y_idx = 0;
  for(let i=0; i<animePackNames.length; i++) {
    const animePackName = animePackNames[i];
    const x = offset_x + item_x * x_idx;
    const y = offset_y + item_y * y_idx;
    const position = new PIXI.Point(x, y);

    PlayButtonAnimation(ss6project, animePackName, position, scale);

    x_idx++;
    if (x_idx >= MAX_ROW_NUM) {
      x_idx = 0;
      y_idx++;
    }
  }
}

function LoadButtonAnimation2(buttonSS6Project, clickSS6Project) {
  /*
  //クリックアニメーション
  var ClickanimeFunc = GetClickAnimation(clickSS6Project,"click",animeNames_pattern2,new PIXI.Point(850,550),new PIXI.Point(0.5,0.5));
  PlayClickAnimation_Default(buttonSS6Project,"button_a01",animeNames_pattern1,new PIXI.Point(850,700),new PIXI.Point(1,1),ClickanimeFunc);

  //単発アニメーション
  var OneClickanimeFunc = GetOneClickAnimation(clickSS6Project,"click",animeNames_pattern2,new PIXI.Point(1000,550),new PIXI.Point(0.5,0.5));
  PlayOneClickAnimation(buttonSS6Project,"button_a01",animeNames_pattern1,new PIXI.Point(1000,700),new PIXI.Point(1,1),OneClickanimeFunc);
   */

  /*
  const bg = new PIXI.Sprite(PIXI.Texture.EMPTY);
  bg.width = app.view.width;
  bg.height = app.view.height;
  // bg.interactive = true;
  // bg.interactiveChildren = true;
  bg.on('click', (event) => {
    const position = event.data.global;

    let mySS6Player = new ss6PlayerPixi.SS6Player(clickSS6Project);

    mySS6Player.Setup('click', 'mouse');
    mySS6Player.SetPlayEndCallback(function (player){
      app.stage.removeChild(mySS6Player);
    });
    mySS6Player.position = position;
    mySS6Player.loop = 1;
    mySS6Player.Play();
    app.stage.addChild(mySS6Player);

  });
  app.stage.addChild(bg);
   */

  /*
  app.stage.interactive = true;
  const clickEvent = (PIXI.utils.isMobile.any) ? 'touchstart' : 'click';
  app.stage.on(clickEvent, (event) => {
    const position = event.data.getLocalPosition(event.currentTarget);

    let mySS6Player = new ss6PlayerPixi.SS6Player(clickSS6Project);

    mySS6Player.Setup('click', 'mouse');
    mySS6Player.SetPlayEndCallback(function (player){
      app.stage.removeChild(mySS6Player);
    });
    mySS6Player.position = position;
    // mySS6Player.scale = scale;
    //イベントを反応させる
    mySS6Player.loop = 1;
    mySS6Player.Play();

    app.stage.addChild(mySS6Player);
  });

   */
}

function PlayButtonAnimation(SS6Project, animePackName, position, scale) {
  let mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  // イベントを反応させる
  mySS6Player.interactive = true;

  // ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, "out");

  // マウスをボタンに乗せた時 or スマホでタップした時に呼ばれる関数
  const inEvent = (PIXI.utils.isMobile.any)? 'touchstart' : 'mouseover';
  mySS6Player.on(inEvent, function(event) {
    mySS6Player.Setup(animePackName, "in");
    mySS6Player.SetPlayEndCallback(function(play1) {
      mySS6Player.Setup(animePackName, "wait");
      if (PIXI.utils.isMobile.any) {
        mySS6Player.SetPlayEndCallback(function (play2) {
          mySS6Player.Setup(animePackName, "out");
          mySS6Player.loop = 1;
          mySS6Player.Play();
        });
      }
      mySS6Player.loop = 1;
      mySS6Player.Play();
    });
    mySS6Player.loop = 1;
    mySS6Player.Play();
  });

  // マウスをボタンから離した時に呼ばれる関数
  mySS6Player.on('mouseout', function (event) {
    mySS6Player.Setup(animePackName, "out");
    mySS6Player.loop = 1;
    mySS6Player.Play();
  });

  mySS6Player.position = position;
  mySS6Player.scale = scale;
  mySS6Player.loop = 1;
  mySS6Player.Play(mySS6Player.endFrame);
  app.stage.addChild(mySS6Player);
}
