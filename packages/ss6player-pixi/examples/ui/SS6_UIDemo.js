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
var type = PIXI.utils.isWebGLSupported() ? "WebGL" : "Canvas";
PIXI.utils.sayHello(type);

// Initialize PIXI Application
// （通常のPIXI.jsアプリケーションの初期化手順）
var app = new PIXI.Application({ width:1280, height:760, backgroundColor : 0x606060 }); // 比較しやすいようにSSの初期設定と同じ色にしてみた
document.body.appendChild(app.view);


var canReadCompleates = [false,false];
var eventTarget = new EventTarget();
var completeEvent  = new Event('ReadSSPJ');
// 読込完了コールバック
eventTarget.addEventListener('ReadSSPJ', () => {
  for( var isCompleate of canReadCompleates ) {
    if(!isCompleate)return;
  }
  LoadButtonAnimation();
  LoadButtonAnimation2();
});

// Initialize SS6 Project (json file path)
// ssbpをコンバートしたjsonファイルを指定
var buttonSS6Project = new ss6PlayerPixi.SS6Project("assets/button/button.ssfb", () => {canReadCompleates[0] = true; eventTarget.dispatchEvent(completeEvent);});
var clickSS6Project = new ss6PlayerPixi.SS6Project("assets/effect/click.ssfb", () => {canReadCompleates[1] = true; eventTarget.dispatchEvent(completeEvent);});


animeNames_pattern1 = ["Setup","in","wait","out"];
var pattern1_Index = {
  Setup : 0,
  in : 1,
  wait : 2,
  out : 3
};

animeNames_pattern2 = ["Setup","in","wait","out","mouse"];
var pattern2_Index = {
  Setup : 0,
  in : 1,
  wait : 2,
  out : 3,
  mouse : 4,
};

class AnimeFunc{
  constructor(){
    this.pointerdown = null;
    this.pointerup = null;
    this.isPlay = false;
  }
}

function LoadButtonAnimation(){
  PlayButtonAnimation(buttonSS6Project,"button_a01",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a02",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a03",animeNames_pattern1,new PIXI.Point(100 + 150 * 2,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a04",animeNames_pattern1,new PIXI.Point(100 + 150 * 3,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a05",animeNames_pattern1,new PIXI.Point(100 + 150 * 4,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a06",animeNames_pattern1,new PIXI.Point(100 + 150 * 5,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a07",animeNames_pattern1,new PIXI.Point(100 + 150 * 6,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a08",animeNames_pattern1,new PIXI.Point(100 + 150 * 7,100),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a09",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a10",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a11",animeNames_pattern1,new PIXI.Point(100 + 150 * 2,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a12",animeNames_pattern1,new PIXI.Point(100 + 150 * 3,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a13",animeNames_pattern1,new PIXI.Point(100 + 150 * 4,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a14",animeNames_pattern1,new PIXI.Point(100 + 150 * 5,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a15",animeNames_pattern1,new PIXI.Point(100 + 150 * 6,200),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_a16",animeNames_pattern1,new PIXI.Point(100 + 150 * 7,200),new PIXI.Point(1,1));

  PlayButtonAnimation(buttonSS6Project,"button_b01",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b02",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b03",animeNames_pattern1,new PIXI.Point(100 + 150 * 2,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b04",animeNames_pattern1,new PIXI.Point(100 + 150 * 3,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b05",animeNames_pattern1,new PIXI.Point(100 + 150 * 4,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b06",animeNames_pattern1,new PIXI.Point(100 + 150 * 5,300),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_b07",animeNames_pattern1,new PIXI.Point(100 + 150 * 6,300),new PIXI.Point(1,1));

  PlayButtonAnimation(buttonSS6Project,"button_c01",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c02",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c03",animeNames_pattern1,new PIXI.Point(100 + 150 * 2,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c04",animeNames_pattern1,new PIXI.Point(100 + 150 * 3,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c05",animeNames_pattern1,new PIXI.Point(100 + 150 * 4,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c06",animeNames_pattern1,new PIXI.Point(100 + 150 * 5,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c07",animeNames_pattern1,new PIXI.Point(100 + 150 * 6,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c08",animeNames_pattern1,new PIXI.Point(100 + 150 * 7,400),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_c09",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,500),new PIXI.Point(1,1));

  PlayButtonAnimation(buttonSS6Project,"button_d01",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,600),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_d02",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,600),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_d03",animeNames_pattern1,new PIXI.Point(100 + 150 * 2,600),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_d04",animeNames_pattern1,new PIXI.Point(100 + 150 * 3,600),new PIXI.Point(1,1));

  PlayButtonAnimation(buttonSS6Project,"button_f01",animeNames_pattern1,new PIXI.Point(100 + 150 * 0,700),new PIXI.Point(1,1));
  PlayButtonAnimation(buttonSS6Project,"button_f02",animeNames_pattern1,new PIXI.Point(100 + 150 * 1,700),new PIXI.Point(1,1));
}

function LoadButtonAnimation2(){
  //クリックアニメーション
  var ClickanimeFunc = GetClickAnimation(clickSS6Project,"click",animeNames_pattern2,new PIXI.Point(850,550),new PIXI.Point(0.5,0.5));
  PlayClickAnimation_Default(buttonSS6Project,"button_a01",animeNames_pattern1,new PIXI.Point(850,700),new PIXI.Point(1,1),ClickanimeFunc);

  //単発アニメーション
  var OneClickanimeFunc = GetOneClickAnimation(clickSS6Project,"click",animeNames_pattern2,new PIXI.Point(1000,550),new PIXI.Point(0.5,0.5));
  PlayOneClickAnimation(buttonSS6Project,"button_a01",animeNames_pattern1,new PIXI.Point(1000,700),new PIXI.Point(1,1),OneClickanimeFunc);
}


function PlayButtonAnimation(SS6Project,animePackName,animeNames,position,scale){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern1_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;
  //イベントを反応させる
  mySS6Player.interactive = true;

  var playFunc = function(index){
    mySS6Player.Setup(animePackName, animeNames[index]);
    mySS6Player.Play();
  };

  //マウスをボタンに乗せた時に呼ばれる関数
  mySS6Player.mouseover = function() {
    //マウスをボタンに乗せ続けた時に呼ばれる関数
    mySS6Player.SetPlayEndCallback(function() {playFunc(pattern1_Index.wait);})
    playFunc(pattern1_Index.in);
    mySS6Player.loop = 1;
  }

  //マウスをボタンから離した時に呼ばれる関数
  mySS6Player.mouseout = function() {
    playFunc(pattern1_Index.out);
    mySS6Player.loop = 1;
  }

  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
}


//=========================================

//ボタンを押されたときに反応するやつ

function GetOneClickAnimation(SS6Project,animePackName,animeNames,position,scale){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);
  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern2_Index.mouse]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;
  //イベントを反応させる
  mySS6Player.interactive = true;

  var animeFunc = new AnimeFunc();
  animeFunc.pointerdown = function(){
    mySS6Player.Setup(animePackName, animeNames[pattern2_Index.mouse]);
    mySS6Player.Play();
    mySS6Player.loop = 1;
  };
  app.stage.addChild(mySS6Player);
  
  return animeFunc;
}

//ボタンを押した時に反応してもらうためのやつ
function PlayOneClickAnimation(SS6Project,animePackName,animeNames,position,scale,animeFunc){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);
  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern1_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;
  //イベントを反応させる
  mySS6Player.interactive = true;

  var playFunc = function(index){
    mySS6Player.Setup(animePackName, animeNames[index]);
    mySS6Player.Play();
  };

  //マウスをボタンに乗せた時に呼ばれる関数
  mySS6Player.mouseover = function() {
    //マウスをボタンに乗せ続けた時に呼ばれる関数
    mySS6Player.SetPlayEndCallback(function() {playFunc(pattern1_Index.wait);})
    playFunc(pattern1_Index.in);
    mySS6Player.loop = 1;
  }

  //マウスをボタンから離した時に呼ばれる関数
  mySS6Player.mouseout = function() {
    playFunc(pattern1_Index.out);
    mySS6Player.loop = 1;
  }

    //クリック関連 
  mySS6Player.on('mousedown', function(){
    animeFunc.pointerdown();
  });

  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
}


//=======================================

function GetClickAnimation(SS6Project,animePackName,animeNames,position,scale){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern2_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;
  
  //イベントを反応させる
  mySS6Player.interactive = true;

  var animeFunc = new AnimeFunc();
  
  animeFunc.pointerdown = function(){
    mySS6Player.Setup(animePackName, animeNames[pattern2_Index.in]);
    mySS6Player.loop = 1;
    mySS6Player.SetPlayEndCallback(function() {
      mySS6Player.Setup(animePackName, animeNames[pattern2_Index.wait]);
      mySS6Player.SetPlayEndCallback(animeFunc.pointerup);
      //mySS6Player.loop = 1; //PlayClickAnimation_OneClickを使う場合
      mySS6Player.Play();
    })
    mySS6Player.Play();
  };

  animeFunc.pointerup = function(){
    mySS6Player.Setup(animePackName, animeNames[pattern2_Index.out]);
    mySS6Player.loop = 1;
    mySS6Player.Play();
  };
  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
  
  return animeFunc;
}

function PlayClickAnimation_Default(SS6Project,animePackName,animeNames,position,scale,animeFunc){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern1_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;

  //イベントを反応させる
  mySS6Player.interactive = true;

  var playFunc = function(index){
    mySS6Player.Setup(animePackName, animeNames[index]);
    mySS6Player.Play();
  };

  //クリック関連 
  mySS6Player.on('mousedown', function(){
    animeFunc.pointerdown();
    animeFunc.isPlay = true;
  }); 

  mySS6Player.on('mouseup', function(){
    if(animeFunc.isPlay){
      playFunc(pattern1_Index.wait);
      animeFunc.pointerup();
      animeFunc.isPlay = false;
    }
  });

  //マウスをボタンに乗せた時に呼ばれる関数
  mySS6Player.mouseover = function() {
    //マウスをボタンに乗せ続けた時に呼ばれる関数
    mySS6Player.SetPlayEndCallback(function() {playFunc(pattern1_Index.wait);})
    playFunc(pattern1_Index.in);
    mySS6Player.loop = 1;
  }

  //マウスをボタンから離した時に呼ばれる関数
  mySS6Player.mouseout = function() {
    playFunc(pattern1_Index.out);
    mySS6Player.loop = 1;
    if(animeFunc.isPlay){
      animeFunc.pointerup();
      animeFunc.isPlay = false;
    }
  }

  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
}

//ワンクリックアニメーション
function PlayClickAnimation_OneClick(SS6Project,animePackName,animeNames,position,scale,animeFunc){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern1_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;

  //イベントを反応させる
  mySS6Player.interactive = true;

  var playFunc = function(index){
    mySS6Player.Setup(animePackName, animeNames[index]);
    mySS6Player.Play();
  };

  //クリック関連 
  mySS6Player.on('mousedown', function(){
    animeFunc.pointerdown();
  });  

  //マウスをボタンに乗せた時に呼ばれる関数
  mySS6Player.mouseover = function() {
    //マウスをボタンに乗せ続けた時に呼ばれる関数
    mySS6Player.SetPlayEndCallback(function() {playFunc(pattern1_Index.wait);})
    playFunc(pattern1_Index.in);
    mySS6Player.loop = 1;
  }

  //マウスをボタンから離した時に呼ばれる関数
  mySS6Player.mouseout = function() {
    playFunc(pattern1_Index.out);
    mySS6Player.loop = 1;
  }

  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
}


function PlayClickAnimation_touch(SS6Project,animePackName,animeNames,position,scale,animeFunc){
  var mySS6Player = new ss6PlayerPixi.SS6Player(SS6Project);

  //ボタンを表示するために必要な初期設定
  mySS6Player.Setup(animePackName, animeNames[pattern1_Index.out]);
  mySS6Player.position = position;
  mySS6Player.scale = scale;

  //イベントを反応させる
  mySS6Player.interactive = true;

  var playFunc = function(index){
    mySS6Player.Setup(animePackName, animeNames[index]);
    mySS6Player.Play();
  };

  //クリック関連 
  mySS6Player.on('touchstart', function(){
    animeFunc.pointerdown();
    animeFunc.isPlay = true;
  }); 

  mySS6Player.on('touchendoutside', function(){
    if(animeFunc.isPlay){
      playFunc(pattern1_Index.wait);
      animeFunc.pointerup();
      animeFunc.isPlay = false;
    }
  });

  //マウスをボタンに乗せた時に呼ばれる関数
  mySS6Player.mouseover = function() {
    //マウスをボタンに乗せ続けた時に呼ばれる関数
    mySS6Player.SetPlayEndCallback(function() {playFunc(pattern1_Index.wait);})
    playFunc(pattern1_Index.in);
    mySS6Player.loop = 1;
  }

  //マウスをボタンから離した時に呼ばれる関数
  mySS6Player.mouseout = function() {
    playFunc(pattern1_Index.out);
    mySS6Player.loop = 1;
    if(animeFunc.isPlay){
      animeFunc.pointerup();
      animeFunc.isPlay = false;
    }
  }

  mySS6Player.loop = 1;
  app.stage.addChild(mySS6Player);
  mySS6Player.Play(mySS6Player.endFrame);
}