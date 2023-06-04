/**
 * -----------------------------------------------------------
 * SS6Player For RPG Maker MZ v<%= pkg.version %>
 *
 * Copyright(C) <%= pkg.author.name %>
 * <%= pkg.author.url %>
 * -----------------------------------------------------------
 */

// eslint-disable-next-line
var Imported = Imported || {};
Imported.SS6PlayerRPGMakerMZ = true;

/*:ja
 * @target MZ
 * @plugindesc SpriteStudio 7.0 & 6 アニメーション再生プラグイン
 * @version <%= pkg.version %>
 * @author CRI Middleware Co., Ltd.
 * @url https://github.com/SpriteStudio/SS6PlayerForWeb/tree/master/packages/ss6player-rpgmakermz
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
 * @desc ssfb ファイルをアニメーションディレクトリからの相対パスで指定してください。 (e.g. MeshBone/Knight.ssfb)
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
