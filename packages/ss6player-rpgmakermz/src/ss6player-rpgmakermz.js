/*:
 * @target MZ
 * @plugindesc SpriteStudio 6 アニメーション再生プラグイン
 * @author Web Technology Corp.
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb/tree/master/packages/ss6player-rpgmakermz
 * @version __VERSION__
 * @help SS6Player for RPG Maker MZ
 *
 * 詳しい使い方は、GitHub リポジトリの README.md をお読みください。
 * https://github.com/SpriteStudio/SS6PlayerForWeb/tree/master/packages/ss6player-rpgmakermz/README.md
 *
 * デプロイメント時に「未使用ファイルを削除」オプションを使用した場合、
 * アニメーションを含むフォルダは削除されてしまいます。
 * 必ず、デプロイメント後にプラグインパラメータで指定したディレクトリを、
 * 出力先の同じ位置にコピーしてください。
 *
 * @param animationDir
 * @text ssfb アニメーションベースディレクトリ
 * @desc ssfb のフォルダを格納するベースディレクトリのパスです。
 * @type file
 * @default img/ssfb
 * @requiredAssets img/ssfb
 *
 * @param replaceSVActorSpriteFlag
 * @text SV アクター置き換え
 * @desc SV アクターを Sprite Studio アニメーションに置き換える機能の ON/OFF です。
 * @type boolean
 * @default false
 *
 * @param svActorDir
 * @text SV アクターディレクトリ
 * @desc SV アクターの SpriteStudio データを格納するディレクトリのパスです
 * @type file
 * @default img/ssfb/sv_actors
 * @requiredAssets img/ssfb/sv_actors
 *
 * @param svActorAnimationPack
 * @text SV アクターアニメーションパック名
 * @desc SV アクターが利用する Sprite Studio の共通アニメーションパック(ssae)名です
 * @type string
 * @default motions
 *
 * @param svActorHideWeaponGraphics
 * @text SV アクター武器非表示
 * @desc SV アクターの攻撃中の武器アニメーションを非表示にする機能の ON/OFF です。
 * @type boolean
 * @default true
 *
 * @param replaceSVEnemySpriteFlag
 * @text SV エネミー置き換え
 * @desc SV エネミーを Sprite Studio アニメーションに置き換える機能の ON/OFF です。
 * @type boolean
 * @default false
 *
 * @param svEnemyDir
 * @text SV エネミーディレクトリ
 * @desc SV アクターの SpriteStudio データを格納するディレクトリのパスです
 * @type file
 * @default img/ssfb/sv_enemies
 * @requiredAssets img/ssfb/sv_enemies
 *
 * @param svEnemyAnimationPack
 * @text SV エネミーアニメーションパック名
 * @desc SV エネミーが利用する Sprite Studio の共通アニメーションパック(ssae)名です
 * @type string
 * @default motions
 *
 * @param svEnemyAnimationName
 * @text SV エネミーアニメーション名
 * @desc SV エネミーが利用する Sprite Studio の共通アニメーション名です。
 * @type string
 * @default walk
 *
 *
 * @command loadSsfb
 * @text ssfbロード
 * @desc ssfb ファイルと関連画像をダウンロードしロードします。
 *
 * @arg ssfbId
 * @text ssfb ID
 * @desc 登録する ssfb ID です。他のコマンドから参照するのに利用します。
 * @type number
 * @min 1
 *
 * @arg ssfbFile
 * @text ssfbファイルパス
 * @desc ssfb ファイルをアニメーションディレクトリからの相対パスで指定してください。 (e.g. MeshBone/Knight.ssbp.ssfb)
 * @type string
 *
 *
 * @command setAsPicture
 * @text アニメーションピクチャの設定
 * @desc ピクチャとして表示するアニメーションを設定します。
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
 * @desc 再生するアニメパック名(ssae)を指定してください。
 *       e.g. Knight_bomb
 * @type string
 *
 * @arg animeName
 * @text アニメ名
 * @desc 再生するアニメ名を指定してください。
 *       e.g. Balloon
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
 * @desc アニメーションが再生完了するまでウエイトします。ピクチャにアニメーションがない場合とループ再生時は無視されます。
 *
 * @arg pictureId
 * @text Picture ID
 * @desc アニメーション再生中のピクチャの ID を指定してください。
 * @type number
 * @min 1
 *
 */

import {SS6Player, SS6Project} from 'ss6player-pixi';
import {PluginParameters} from "./PluginParameters";
import {SS6ProjectManager} from './SS6ProjectManager';

const PLUGIN_NAME = "ss6player-rpgmakermz";
const SS6PROJECT_LOAD_WAIT_MODE = "ss6projectLoadWait";
const SS6PLAYER_WAIT_MODE = "ss6playerPlayWaitMode";
let g_ss6playerPlayWaitingStatus = false; // boolean
let g_passSS6PlayerToSpritePicture = null; // SS6Player
let g_pictureSS6PlayerPrependCallback = null; // function (ss6player) {};
let g_pictureSS6PlayerAppendCallback = null; // function (ss6player) {};

PluginManager.registerCommand(PLUGIN_NAME, "loadSsfb", function(args) {
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
  this.setWaitMode(SS6PROJECT_LOAD_WAIT_MODE);
  SS6ProjectManager.getInstance().prepare(ssfbId);
  let project = new SS6Project(ssfbPath, () => {
    SS6ProjectManager.getInstance().set(ssfbId, project);
  },
    180 * 1000, 3,
    (ssfbPath, timeout, retry, httpObj) => {
      this.setWaitMode('');
      throw httpObj;
    },
    (ssfbPath, timeout, retry, httpObj) => {
      console.log("timeout download ssfb file: " + ssfbPath);
      this.setWaitMode('');
      throw httpObj;
    },
    null);
});

PluginManager.registerCommand(PLUGIN_NAME, "setAsPicture", function(args) {
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

  g_passSS6PlayerToSpritePicture = player;
});

PluginManager.registerCommand(PLUGIN_NAME, "waitForPicture", function(args) {
  const pictureId = Number(args.pictureId) || 1;
  const picture = $gameScreen.picture(pictureId);
  if (picture && picture.mzkpSS6Player) {
    if (picture.mzkpSS6Player instanceof SS6Player) {
      const player = picture.mzkpSS6Player;
      if (player.loop !== -1) {
        // not infinity loop
        this.setWaitMode(SS6PLAYER_WAIT_MODE);
        g_ss6playerPlayWaitingStatus = true;
        g_pictureSS6PlayerPrependCallback = function (ss6player) {
          if (ss6player.loop === 0) {
            g_ss6playerPlayWaitingStatus = false;
          }
        }
      } else {
        console.warn("pictureId: " + pictureId + " can not wait SS6Player because setting infinity loop.");
      }
    }
  } else {
    console.warn("pictureId: " + pictureId + " not have SS6Player");
  }
});

const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
  let waiting = false;
  if (this._waitMode === SS6PROJECT_LOAD_WAIT_MODE) {
    // console.log("waiting " + ssfbLoadWaitMode);
    waiting = SS6ProjectManager.getInstance().isLoading();
  } else if (this._waitMode === SS6PLAYER_WAIT_MODE) {
    waiting = g_ss6playerPlayWaitingStatus;
  } else {
    waiting = _Game_Interpreter_updateWaitMode.call(this);
  }
  return waiting;
};

const _Game_Picture_show = Game_Picture.prototype.show;
Game_Picture.prototype.show = function() {
  _Game_Picture_show.apply(this, arguments);
  if (this._name === "" && g_passSS6PlayerToSpritePicture !== null) {
    this.mzkpSS6Player = g_passSS6PlayerToSpritePicture;
    this.mzkpSS6PlayerChanged = true;
    g_passSS6PlayerToSpritePicture = null;
  }
};

const _Sprite_Picture_destroy = Sprite_Picture.prototype.destroy;
Sprite_Picture.prototype.destroy = function(options) {
  if (this.mzkpSS6Player !== null && this.mzkpSS6Player instanceof SS6Player) {
    this.mzkpSS6Player.Stop();
    this.removeChild(this.mzkpSS6Player);
    this.mzkpSS6Player = null;
  }
  _Sprite_Picture_destroy.call(this, options);
};

const _Scene_Base_terminate = Scene_Base.prototype.terminate;
Scene_Base.prototype.terminate = function() {

  // delete all SS6Play instance of Picture at terminating the Scene
  $gameScreen._pictures.forEach((picture, index, pictures) => {
    if(picture && picture.mzkpSS6Player) {
      picture.mzkpSS6Player.Stop();

      picture.mzkpSS6Player = null;
    }
  });

  // delete all sv actor SS6Play instance at terminating the Scene
  $gameActors._data.forEach((actor, index, actors) => {
    if (actor && actor._svActorSS6Player) {
      actor._svActorSS6Player.Stop();
      actor._svActorSS6PlayerParent.removeChild(actor._svActorSS6Player);

      actor._svActorSS6Player = null;
      actor._svActorSS6PlayerParent = null;
    }
  });

  // delete all sv enemy SS6Play instance at terminating the Scene
  $gameTroop.members().forEach((enemy, index, enemies) => {
    if (enemy && enemy._svEnemySS6Player) {
      enemy._svEnemySS6Player.Stop();
      enemy._svEnemySS6PlayerParent.removeChild(enemy._svEnemySS6Player);

      enemy._svEnemySS6ProjectLoaded = false;
      enemy._svEnemySS6Player = null;
      enemy._svEnemySS6PlayerParent = null;
    }
  });

  _Scene_Base_terminate.apply(this, arguments);
};

const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
  _Sprite_Picture_updateBitmap.apply(this, arguments);
  if (this.visible && this._pictureName === "") {
    const picture = this.picture();
    const player = picture ? picture.mzkpSS6Player || null : null;
    const playerChanged = picture && picture.mzkpSS6PlayerChanged;

    if (this.mzkpSS6Player !== player || playerChanged) {

      if (this.mzkpSS6Player !== null && this.mzkpSS6Player instanceof SS6Player) {
        // stop and remove previous ss6player instance
        this.mzkpSS6Player.Stop();
        this.removeChild(this.mzkpSS6Player);
        this.mzkpSS6Player = null;
      }

      if(player !== null) {
        const prependCallback = g_pictureSS6PlayerPrependCallback;
        const appendCallback = g_pictureSS6PlayerAppendCallback;
        const spritePicture = this;
        player.SetPlayEndCallback(() => {
          if (prependCallback !== null) {
            prependCallback(player);
          }

          if (player.loop === 0) {
            player.Stop();
            spritePicture.removeChild(player);
          }

          if (appendCallback !== null) {
            appendCallback(player);
          }
        });
        this.mzkpSS6Player = player;
        this.addChild(this.mzkpSS6Player);
        this.mzkpSS6Player.Play();
        picture.mzkpSS6PlayerChanged = false;
        g_pictureSS6PlayerPrependCallback = null;
        g_pictureSS6PlayerAppendCallback = null;
      } else {
        this.mzkpSS6Player = null;
      }
    }
  } else {
    this.mzkpSS6Player = null;
  }
};

const _Game_Screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function () {
  SS6ProjectManager.getInstance().clear();
  _Game_Screen_clear.call(this);
};

let g_suspendPlayingSS6Player = false;
const _SceneManager_updateScene = SceneManager.updateScene;
SceneManager.updateScene = function() {
  _SceneManager_updateScene.apply(this, arguments);
  if (this._scene) {
    if (this.isGameActive()) {
      if(g_suspendPlayingSS6Player) {
        // execute to resume all SS6Player instance of Picture
        $gameScreen._pictures.forEach((picture, index, pictures) => {
          if(picture && picture.mzkpSS6Player) {
            picture.mzkpSS6Player.Resume();
          }
        });
        // execute to resume SS6Player instance of SV Actor
        $gameActors._data.forEach((actor, index, actors) => {
          if (actor && actor._svActorSS6Player) {
            actor._svActorSS6Player.Resume();
          }
        });
        // execute to resume SS6Player instance of SV Enemy
        $gameTroop.members().forEach((enemy, index, enemies) => {
          if (enemy && enemy._svEnemySS6Player) {
            enemy._svEnemySS6Player.Resume();
          }
        });
        g_suspendPlayingSS6Player = false;
      }
    } else {
      // execute to suspend all SS6Player instance of Picture
      if ($gameScreen && $gameScreen._pictures) {
        $gameScreen._pictures.forEach((picture, index, pictures) => {
          if (picture && picture.mzkpSS6Player) {
            picture.mzkpSS6Player.Pause();
          }
        });
      }

      // execute to suspend all SS6Player instance of SV Actor
      if ($gameActors && $gameActors._data) {
        $gameActors._data.forEach((actor, index, actors) => {
          if (actor && actor._svActorSS6Player) {
            actor._svActorSS6Player.Pause();
          }
        });
      }

      // execute to suspend all SS6Player instance of SV Enemy
      if ($gameTroop && $gameTroop.members()) {
        $gameTroop.members().forEach((enemy, index, enemies) => {
          if (enemy && enemy._svEnemySS6Player) {
            enemy._svEnemySS6Player.Pause();
          }
        });
      }

      g_suspendPlayingSS6Player = true;
    }
  }
};

let loaded_EnemyNoteTags = false;
const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (PluginParameters.getInstance().replaceSVActorSpriteFlag) {
    if (!_DataManager_isDatabaseLoaded.call(this)) {
      return false;
    }
    if (!loaded_EnemyNoteTags) {
      this.loadEnemyNoteTags();
      loaded_EnemyNoteTags = true;
    }
    return true;
  } else {
    return _DataManager_isDatabaseLoaded();
  }
}

const SV_ENEMY_TAG = "SS6SVEnemy";
const SV_ENEMY_ATTRIBUTE_FILE = "file";
const SV_ENEMY_ATTRIBUTE_ANIMATIONPACK = "animationPackName";
const SV_ENEMY_ATTRIBUTE_ANIMATIONNAME = "animationName";
const SV_ENEMY_ATTRIBUTE_SCALE_X = "scaleX";
const SV_ENEMY_ATTRIBUTE_SCALE_Y = "scaleY";
const SV_ENEMY_ATTRIBUTE_OFFSET_X = "offsetX";
const SV_ENEMY_ATTRIBUTE_OFFSET_Y = "offsetY";
DataManager.loadEnemyNoteTags = function() {
  const regex = new RegExp('<' + SV_ENEMY_TAG + ' ' + '(.*):(.*)>', 'i');
  $dataEnemies.forEach((enemy, idx, enemies) => {
    if(enemy === null) {
      return;
    }
    const noteData = enemy.note.split(/\r?\n/);
    noteData.forEach((line, idx, lines) => {
      const match = regex.exec(line);
      if (match && match.length === 3) {
        const attribute = match[1].toLowerCase();
        const value = match[2];
        switch(attribute) {
          case SV_ENEMY_ATTRIBUTE_FILE.toLowerCase():
            enemy._svEnemyFile = value;
            break;
          case SV_ENEMY_ATTRIBUTE_ANIMATIONPACK.toLowerCase():
            enemy._svEnemyAnimationPackName = value;
            break;
          case SV_ENEMY_ATTRIBUTE_ANIMATIONNAME.toLowerCase():
            enemy._svEnemyAnimationName = value;
            break;
          case SV_ENEMY_ATTRIBUTE_SCALE_X.toLowerCase():
            enemy._svEnemyScaleX = Number(value);
            break;
          case SV_ENEMY_ATTRIBUTE_SCALE_Y.toLowerCase():
            enemy._svEnemyScaleY = Number(value);
            break;
          case SV_ENEMY_ATTRIBUTE_OFFSET_X.toLowerCase():
            enemy._svEnemyOffsetX = Number(value);
            break;
          case SV_ENEMY_ATTRIBUTE_OFFSET_Y.toLowerCase():
            enemy._svEnemyOffsetY = Number(value);
            break;
          default:
            break;
        }
      }
    });
  });
}

//
//
// replace side view character sprite to sprite studio animation
//
//
Sprite_Actor.svActorSsfbId = function (actorId) {
  return "sv_actor_" + actorId;
}
Sprite_Actor.svActorSsfbDir = function(actorId) {
  return PluginParameters.getInstance().svActorDir + String(actorId) + "/";
}
Sprite_Actor.svActorSsfbPath = function (actorId) {
  return Sprite_Actor.svActorSsfbDir(actorId) + String(actorId) + ".ssbp.ssfb";
}

let notFoundSvActorSsfbMap = new Map();
const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function (battler) {
  const changed = (battler !== this._actor);
  _Sprite_Actor_setBattler.call(this, battler);
  if (PluginParameters.getInstance().replaceSVActorSpriteFlag) {
    if (changed) {
      const actorId = this._actor.actorId();

      const ssfbId = Sprite_Actor.svActorSsfbId(actorId);
      if (notFoundSvActorSsfbMap.has(ssfbId)) {
        return;
      }

      let ssfbPath = Sprite_Actor.svActorSsfbPath(actorId);

      if (SS6ProjectManager.getInstance().isExist(ssfbId)) {
        const existProject = SS6ProjectManager.getInstance().get(ssfbId);
        if (ssfbPath === existProject.ssfbPath) {
          this._actor._svActorSS6Player = null;
          this._actor._svActorSS6PlayerParent = null;

          return;
        }
      }

      SS6ProjectManager.getInstance().prepare(ssfbId);
      let project = new SS6Project(ssfbPath,
        () => {
          this._actor._svActorSS6Player = null;
          this._actor._svActorSS6PlayerParent = null;

          SS6ProjectManager.getInstance().set(ssfbId, project);
        },
        180 * 1000, 3,
        (ssfbPath, timeout, retry, httpObj) => {
          // not found character sub directory
          notFoundSvActorSsfbMap.set(ssfbId, null);
          SS6ProjectManager.getInstance().set(ssfbId, null);
        }
      );
    }
  }
};

const _Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function () {
  if (PluginParameters.getInstance().replaceSVActorSpriteFlag) {
    const actorId = this._actor.actorId();
    const ssfbId = Sprite_Actor.svActorSsfbId(actorId);
    if (SS6ProjectManager.getInstance().isExist(ssfbId) && this._actor._svActorSS6Player !== undefined) {
      Sprite_Battler.prototype.updateBitmap.call(this);

      this._mainSprite.bitmap = null;
      this.updateSS6Player();
    } else {
      // not found ssfb instance
      _Sprite_Actor_updateBitmap.call(this);
    }
  } else {
    // unavailable replaceSVActorSpriteFlag
    _Sprite_Actor_updateBitmap.call(this);
  }
};

Sprite_Actor.prototype.updateSS6Player = function () {
  let motionName = "";
  for (let key in Sprite_Actor.MOTIONS) {
    const motion = Sprite_Actor.MOTIONS[key];
    if (this._motion === motion) {
      motionName = key;
    }
  }
  if (motionName === "") {
    // not found motion
    motionName = "walk";
  }

  if (this._actor._svActorSS6Player === null || this._actor._svActorSS6Player.animeName !== motionName) {
    // change to new motion
    if (this._actor._svActorSS6Player) {
      // delete previous motion
      this._mainSprite.removeChild(this._actor._svActorSS6Player);
      this._actor._svActorSS6Playe = null;
      this._actor._svActorSS6PlayerParent = null;
    }

    const loop = this._motion.loop;
    const actorId = this._actor.actorId();
    const ssfbId = Sprite_Actor.svActorSsfbId(actorId);
    const project = SS6ProjectManager.getInstance().get(ssfbId);
    const animePackName = PluginParameters.getInstance().svActorAnimationPack;
    this._actor._svActorSS6Player = new SS6Player(project, animePackName, motionName);
    this._actor._svActorSS6Player.loop = (loop) ? -1 : 1;
    this._actor._svActorSS6Player.SetPlayEndCallback(player => {
      if (player.loop === 0) {
        this.refreshMotion();
      }
    });
    this._actor._svActorSS6Player.Play();
    this._mainSprite.addChild(this._actor._svActorSS6Player);
    this._actor._svActorSS6PlayerParent = this._mainSprite;
  }
}

const _Sprite_Actor_setupWeaponAnimation = Sprite_Actor.prototype.setupWeaponAnimation;
Sprite_Actor.prototype.setupWeaponAnimation = function () {
  if (PluginParameters.getInstance().replaceSVActorSpriteFlag) {
    if(PluginParameters.getInstance().svActorHideWeaponGraphics) {
      if (this._actor._svActorSS6Player === undefined) {
        _Sprite_Actor_setupWeaponAnimation.call(this);
      }
    } else {
      _Sprite_Actor_setupWeaponAnimation.call(this);
    }
  } else {
    _Sprite_Actor_setupWeaponAnimation.call(this);
  }
};

//
//
// replace side view enemy sprite to sprite studio animation
//
//
Sprite_Enemy.svEnemySsfbId = function (enemyId) {
  return "sv_enemy_" + enemyId;
}
Sprite_Enemy.svEnemySsfbDir = function(enemyId) {
  return PluginParameters.getInstance().svEnemyDir + String(enemyId) + "/";
}
Sprite_Enemy.svEnemySsfbPath = function (enemyId) {
  return Sprite_Enemy.svEnemySsfbDir(enemyId) + String(enemyId) + ".ssbp.ssfb";
}

let notFoundSvEnemySsfbMap = new Map();
const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function (battler) {
  const changed = (battler !== this._enemy);
  _Sprite_Enemy_setBattler.call(this, battler);
  if (PluginParameters.getInstance().replaceSVEnemySpriteFlag) {
    if (changed) {
      const enemyId = this._enemy.enemyId();

      const ssfbId = Sprite_Enemy.svEnemySsfbId(enemyId);
      if (notFoundSvEnemySsfbMap.has(ssfbId)) {
        return;
      }

      let ssfbPath = Sprite_Enemy.svEnemySsfbPath(enemyId);
      // overwrite default plugin parameters by notetags
      const dataEnemy = this._enemy.enemy();
      if (dataEnemy._svEnemyFile) {
        ssfbPath = PluginParameters.getInstance().animationDir + dataEnemy._svEnemyFile;
      }

      this._enemy._svEnemySS6ProjectLoaded = false;
      if (SS6ProjectManager.getInstance().isExist(ssfbId)) {
        const existProject = SS6ProjectManager.getInstance().get(ssfbId);
        if (ssfbPath === existProject.ssfbPath) {
          this._enemy._svEnemySS6ProjectLoaded = true;
          this._enemy._svEnemySS6Player = null;
          this._enemy._svEnemySS6PlayerParent = null;
          return;
        }
      }

      SS6ProjectManager.getInstance().prepare(ssfbId);
      let project = new SS6Project(ssfbPath,
        () => {
          this._enemy._svEnemySS6ProjectLoaded = true;
          this._enemy._svEnemySS6Player = null;
          this._enemy._svEnemySS6PlayerParent = null;
          SS6ProjectManager.getInstance().set(ssfbId, project);
        },
        180 * 1000, 3,
        (ssfbPath, timeout, retry, httpObj) => {
          // not found character sub directory
          this._enemy._svEnemySS6ProjectLoaded = true;
          notFoundSvEnemySsfbMap.set(ssfbId, null);
          SS6ProjectManager.getInstance().set(ssfbId, null);
        }
      );
    }
  }
};

const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
Sprite_Enemy.prototype.updateBitmap = function () {
  if (PluginParameters.getInstance().replaceSVEnemySpriteFlag) {
    const enemyId = this._enemy.enemyId();
    const ssfbId = Sprite_Enemy.svEnemySsfbId(enemyId);
    if (!this._enemy._svEnemySS6ProjectLoaded) {
      // downloading ssfb file and image files yet.
      return;
    }

    if (SS6ProjectManager.getInstance().isExist(ssfbId) && this._enemy._svEnemySS6Player !== undefined) {
      Sprite_Battler.prototype.updateBitmap.call(this);
      this.bitmap = null;
      this.updateSS6Player();
    } else {
      // not found ssfb instance
      _Sprite_Enemy_updateBitmap.call(this);
    }
  } else {
    // unavailable replaceSVEnemySpriteFlag
    _Sprite_Enemy_updateBitmap.call(this);
  }
};

Sprite_Enemy.prototype.updateSS6Player = function () {
  if (this._enemy._svEnemySS6Player === null) {
    const enemyId = this._enemy.enemyId();
    const ssfbId = Sprite_Enemy.svEnemySsfbId(enemyId);
    const project = SS6ProjectManager.getInstance().get(ssfbId);
    let animePackName = PluginParameters.getInstance().svEnemyAnimationPack;
    let animeName = PluginParameters.getInstance().svEnemyAnimationName;
    let scaleX = 1;
    let scaleY = 1;
    let offsetX = 0;
    let offsetY = 0;
    // overwrite default plugin parameters by notetags
    const dataEnemy = this._enemy.enemy();
    if (dataEnemy._svEnemyAnimationPackName) {
      animePackName = dataEnemy._svEnemyAnimationPackName;
    }
    if (dataEnemy._svEnemyAnimationName) {
      animeName = dataEnemy._svEnemyAnimationName;
    }
    if (dataEnemy._svEnemyScaleX) {
      scaleX = dataEnemy._svEnemyScaleX;
    }
    if (dataEnemy._svEnemyScaleY) {
      scaleY = dataEnemy._svEnemyScaleY;
    }
    if (dataEnemy._svEnemyOffsetX) {
      offsetX = dataEnemy._svEnemyOffsetX;
    }
    if (dataEnemy._svEnemyOffsetY) {
      offsetY = dataEnemy._svEnemyOffsetY;
    }
    this._enemy._svEnemySS6Player = new SS6Player(project, animePackName, animeName);
    this._enemy._svEnemySS6Player.loop = -1;
    this._enemy._svEnemySS6Player.SetPlayEndCallback(player => {
      // TODO:
    });
    this._enemy._svEnemySS6Player.scale.x = scaleX;
    this._enemy._svEnemySS6Player.scale.y = scaleY;
    this._enemy._svEnemySS6Player.position.x += offsetX;
    this._enemy._svEnemySS6Player.position.y += offsetY;
    this._enemy._svEnemySS6Player.Play();
    this.addChild(this._enemy._svEnemySS6Player);
    this._enemy._svEnemySS6PlayerParent = this;
  }
}

const _Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
  if (PluginParameters.getInstance().replaceSVEnemySpriteFlag) {
    const enemyId = this._enemy.enemyId();
    const ssfbId = Sprite_Enemy.svEnemySsfbId(enemyId);
    if (!this._enemy._svEnemySS6ProjectLoaded) {
      // downloading ssfb file and image files yet.
      return;
    }

    if (SS6ProjectManager.getInstance().isExist(ssfbId) && this._enemy._svEnemySS6Player !== undefined) {
      const bitmap = this.bitmap;
      if (bitmap) {
        _Sprite_Enemy_updateFrame.call(this);
        return;
      }
      Sprite_Battler.prototype.updateFrame.call(this);
      const player = this._enemy._svEnemySS6Player;
      let width = 0;
      let height = 0;
      if (player) {
        width = player.width;
        height = player.height;
      }
      if (this._effectType === "bossCollapse") {
        this.setFrame(0, 0, width, this._effectDuration);
      } else {
        this.setFrame(0, 0, width, height);
      }
    } else {
      // not found ssfb instance
      _Sprite_Enemy_updateFrame.call(this);
    }
  } else {
    // unavailable replaceSVEnemySpriteFlag
    _Sprite_Enemy_updateFrame.call(this);
  }
};

const _Sprite_Enemy__updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
Sprite_Enemy.prototype.updateStateSprite = function() {
  if (PluginParameters.getInstance().replaceSVEnemySpriteFlag) {
    if (this.bitmap) {
      // not found ssfb instance
      this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
      if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
      }
    } else {
      let height = 0;
      if (this._enemy && this._enemy._svEnemySS6Player) {
        height = this._enemy._svEnemySS6Player;
      }
      this._stateIconSprite.y = -Math.round((height + 40) * 0.9);
      if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
      }
    }
  } else {
    // unavailable replaceSVEnemySpriteFlag
    _Sprite_Enemy__updateStateSprite.call(this);
  }
}
