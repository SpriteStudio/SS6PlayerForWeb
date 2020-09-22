/*:
 * @target MZ
 * @plugindesc RPG ツクール MZ で動作する SS6Player プラグインです。
 * @author Web Technology Corp.
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb
 * @help SS6Player for RPG Maker MZ
 * (T.B.D)
 *
 * @param animationDir
 * @text ssfb アニメーションベースフォルダ
 * @desc ssfb のフォルダを格納するベースフォルダのパスです。
 * @type file
 * @default img/ssfb
 * @requiredAssets img/ssfb
 *
 * @command loadSsfb
 * @text ssfbロード
 * @desc ssfbを画像をロードし登録します。
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 登録する ID です。
 * @type number
 * @min 1
 *
 * @arg ssfbFile
 * @text ssfbファイルパス
 * @desc ssfb ファイルをアニメーションフォルダからの相対パスで指定してください。 (e.g. MeshBone/Knight.ssbp.ssfb)
 * @type string
 *
 *
 * @command setAsPicture
 * @text SS6Player ピクチャの設定
 * @desc ピクチャとして表示する SS6Player を設定します。
 *       この後、画像を指定せずに「ピクチャの表示」を実行してください。
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 利用する ssfb ID を指定してください。
 * @type number
 * @min 1
 *
 * @arg animePackName
 * @text アニメパック名
 * @desc 再生するアニメパック名を指定してください。
 *       e.g. Knight_bomb
 *
 * @type string
 *
 * @arg animeName
 * @text アニメ名
 * @desc 再生するアニメ名を指定してください。 (e.g. Balloon)
 * @type string
 *
 * @arg scaleX
 * @text スケールX
 * @desc X のスケールを指定します
 * @type decimals
 * @default 1.0
 *
 * @arg scaleY
 * @text スケールY
 * @desc Y のスケールを指定します
 * @type decimals
 * @default 1.0
 *
 * @arg loop
 * @text 再生ループ回数
 * @desc 再生ループ回数を指定します。 -1 を指定すると無限ループで再生します。
 * @type number
 * @default 1
 * @min -1
 *
 *
 * @command waitForPicture
 * @text ピクチャ再生待ち
 * @desc ピクチャとして表示している SS6Player が再生完了するまで待ちます。
 *       SS6Player がない場合、あるいは SS6Player がループ再生時には無視されます。
 *
 * @arg pictureId
 * @text Picture ID
 * @desc ピクチャの ID を指定してください。
 * @type number
 * @min 1
 *
 */

import {SS6Player, SS6Project} from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";
import {SS6ProjectManager} from './SS6ProjectManager';
import {SS6PlayerManager} from "./SS6PlayerManager";

const pluginName = "ss6player-rpgmakermz";
const ss6projectLoadWaitMode = "ss6projectLoadWait";
const ss6playerPlayWaitMode = "ss6playerPlayWaitMode";
let ss6playerPlayWaiting = false;
let pictureSS6Player = null;
let pictureSS6PlayerPrependCallback = null; // function (ss6player) {};
let pictureSS6PlayerAppendCallback = null; // function (ss6player) {};

PluginManager.registerCommand(pluginName, "loadSsfb", function(args) {
  const ssfbId = Number(args.ssfbId);
  const ssfbFile = args.ssfbFile;
  const ssfbPath = PluginParameters.getInstance().animationDir + ssfbFile;

  if (SS6ProjectManager.getInstance().isExist(ssfbId)) {
    const existProject= SS6ProjectManager.getInstance().get(ssfbId);
    if (ssfbPath === existProject.ssfbPath) {
      // already loaded same project.
      return;
    }
  }
  this.setWaitMode(ss6projectLoadWaitMode);
  SS6ProjectManager.getInstance().prepare(ssfbId);
  let project = new SS6Project(ssfbPath, () => {
    SS6ProjectManager.getInstance().set(ssfbId, project);
  },
    30, 0,
    (ssfbPath, timeout, retry, httpObj) => {
      this.setWaitMode('');
      throw httpObj;
    },
    (ssfbPath, timeout, retry, httpObj) => {
      this.setWaitMode('');
      throw httpObj;
    },
    null);
});

PluginManager.registerCommand(pluginName, "setAsPicture", function(args) {
  const ssfbId = Number(args.ssfbId);
  const animePackName = args.animePackName;
  const animeName = args.animeName;
  const scaleX = Number(args.scaleX) || 1.0;
  const scaleY = Number(args.scaleY) || 1.0;
  const loop = Number(args.loop) || 1;

  let project = SS6ProjectManager.getInstance().get(ssfbId);
  if (project === null) {
    const err = "not found ssfbId: " + ssfbId;
    console.error(err);
    throw err;
  }

  let player = new SS6Player(project, animePackName, animeName);
  player.scale = new PIXI.Point(scaleX, scaleY);
  player.loop = loop;

  pictureSS6Player = player;
});

PluginManager.registerCommand(pluginName, "waitForPicture", function(args) {
  const pictureId = Number(args.pictureId) || 1;
  const picture = $gameScreen.picture(pictureId);
  if (picture && picture.mzkpSS6player) {
    if (picture.mzkpSS6player instanceof SS6Player) {
      const ss6player = picture.mzkpSS6player;
      if (ss6player.loop !== -1) {
        // not infinity loop
        this.setWaitMode(ss6playerPlayWaitMode);
        ss6playerPlayWaiting = true;
        pictureSS6PlayerPrependCallback = function (ss6player) {
          if (ss6player.loop === 0) {
            ss6playerPlayWaiting = false;
          }
        }
      }
    }
  }
});

const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  let waiting = false;
  if (this._waitMode === ss6projectLoadWaitMode) {
    // console.log("waiting " + ssfbLoadWaitMode);
    waiting = SS6ProjectManager.getInstance().isLoading();
  } else if (this._waitMode === ss6playerPlayWaitMode) {
    waiting = ss6playerPlayWaiting;
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
};

const _Game_Picture_show = Game_Picture.prototype.show;
Game_Picture.prototype.show = function() {
  _Game_Picture_show.apply(this, arguments);
  if (this._name === "" && pictureSS6Player !== null) {
    this.mzkpSS6player = pictureSS6Player;
    this.mzkpSS6playerChanged = true;
    pictureSS6Player = null;
  }
};

const _Sprite_Picture_destroy = Sprite_Picture.prototype.destroy;
Sprite_Picture.prototype.destroy = function(options) {
  if (this.mzkpSS6player !== null && this.mzkpSS6player instanceof SS6Player) {
    let SS6player = this.mzkpSS6player;
    console.log(SS6player);
    this.mzkpSS6player.Stop();
    this.removeChild(SS6player);
    this.mzkpSS6player = null;
  }
  _Sprite_Picture_destroy.call(this, options);
};

const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.apply(this, arguments);
  if (this.visible && this._pictureName === "") {
    const picture = this.picture();
    const ss6player = picture ? picture.mzkpSS6player || null : null;
    const ss6playerChanged = picture && picture.mzkpSS6playerChanged;

    if (this.mzkpSS6player !== ss6player || ss6playerChanged) {
      if (this.mzkpSS6player !== null && this.mzkpSS6player instanceof SS6Player) {
        // stop and remove previous ss6player instance
        this.mzkpSS6player.Stop();
        this.removeChild(this.mzkpSS6player);
      }
      const prependCallback = pictureSS6PlayerPrependCallback;
      const appendCallback = pictureSS6PlayerAppendCallback;
      const spritePicture = this;
      ss6player.SetPlayEndCallback(() => {
        if (prependCallback !== null) {
          prependCallback(ss6player);
        }

        if(ss6player.loop === 0) {
          ss6player.Stop();
          spritePicture.removeChild(ss6player);
        }

        if (appendCallback !== null) {
          appendCallback(ss6player);
        }
      });
      this.mzkpSS6player = ss6player;
      this.addChild(this.mzkpSS6player);
      this.mzkpSS6player.Play();
      picture.mzkpSS6playerChanged = false;
      pictureSS6PlayerPrependCallback = null;
      pictureSS6PlayerAppendCallback = null;
    }
  } else {
    this.mzkpSS6player = null;
  }
};

const _Game_Screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function () {
  SS6PlayerManager.getInstance().clear();
  SS6ProjectManager.getInstance().clear();
  _Game_Screen_clear.call(this);
};

let supending = false;
const _SceneManager_updateScene = SceneManager.updateScene;
SceneManager.updateScene = function() {
  _SceneManager_updateScene.apply(this, arguments);
  if (this._scene) {
    if (this.isGameActive()) {
      if(supending) {
        // execute to resume all SS6Player instance
        $gameScreen._pictures.forEach((picture, index, pictures) => {
          if(picture && picture.mzkpSS6player) {
            picture.mzkpSS6player.Resume();
          }
        });
        supending = false;
      }
    } else {
      // execute to suspend all SS6Player instance
      $gameScreen._pictures.forEach((picture, index, pictures) => {
        if (picture && picture.mzkpSS6player) {
          picture.mzkpSS6player.Pause();
        }
      });
      supending = true;
    }
  }
};
