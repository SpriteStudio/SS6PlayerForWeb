# SS6Player for RPG Maker MZ

[SpriteStudio 6](https://www.webtech.co.jp/spritestudio/index.html) で作成されたアニメーションを [RPGツクールMZ](https://tkool.jp/mz/) で再生するプラグインです。

## プラグイン

リリース最新版のプラグインソースは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/ss6player-rpgmakermz.js) になります。

## デモ

リリース最新版のデモは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/SampleProject/index.html) になります。

## ライセンス
ss6player-rpgmakermz のライセンスは [LISENCE](../../LICENSE) となります。

ss6player-rpgmakermz は依存ライブラリの [FlatBuffers](https://google.github.io/flatbuffers/) と [ssfblib](../ssfblib) と [ss6player-pixi](../ss6player-pixi) をバンドルしています。
ForWeb のコンポーネントが依存しているサードパーティライブラリのライセンスは [ThirdPartyLicenses.md](../../ThirdPartyLicenses.md) を参照してください。

## アニメーションデータの作成方法

SpriteStudio 6 のプロジェクトファイル sspj からアニメーションデータファイル ssfb ファイルをコンバートします。 コンバートには Ss6Converter を利用します。

Ss6Converter は SpriteStudio6-SDK に同封するツールです。利用方法に関しては[こちらを参照してください](https://github.com/SpriteStudio/SpriteStudio6-SDK/wiki/%E3%82%B3%E3%83%B3%E3%83%90%E3%83%BC%E3%82%BF%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)

## 使い方
### プラグインのセットアップ

1. プラグイン `ss6player-rpgmakermz.js` の最新版を[ダウンロード](#プラグイン)するか、あるいはお手元で[ビルド](#ビルド)してください。
2. RPGツクールMZ プロジェクトの `js/plugins` ディレクトリへ `ss6player-rpgmakermz.js` を格納します。
3. RPGツクールMZ メニューの `ツール -> プラグイン管理`　をクリックし、プラグイン管理ウィンドウを開き `ss6player-rpgmakermz` を追加し、状態を `ON` にして有効にしてください。

### ピクチャとして表示

#### アニメーションの配置

ssfb ファイルと画像ファイルをプラグインパラメーターの `ssfb アニメーションベースディレクトリ` (`animationDir`)で指定したディレクトリへ格納してください。
デフォルトでは `img/ssfb` となっています。

サブディレクトリへの格納が可能です。(サブディレクトリは ssfb ロード時にサブディレクトリの相対パスでの指定が必要になります。)

#### アニメーションの表示

1. プラグインコマンド `ssfbロード`(`loadSsfb`) で ssfb ファイルと画像ファイルの読み込みし、登録します。こちらのコマンドはダウンロード完了するまでウェイトします。
2. プラグインコマンド `アニメーションピクチャの設定`(`setAsPicture`) でピクチャとして表示するアニメーションインスタンスを生成します。
3. イベントコマンド `ピクチャの表示` で任意の picture ID を指定し、画像ファイルを未指定で実行してください。
4. `3.` のピクチャ表示で指定した座標にアニメーションが表示されます。アニメーションは再生が完了すると非表示になります。


### サイドビューアクターとして表示

プラグインパラメーターの `SV アクター置き換え`(`replaceSVActorSpriteFlag`) を `ON` にすると、サイドビューアクターの置き換え機能が有効になります。

#### アニメーションの用意

SV アクターアニメーションサンプルは [こちら](../../TestData/SideViewActorSample/) になります。

下記のアニメーションを保持するアニメパック(ssae)を用意してください。
アニメパック名(ssae)はプラグインパラメーター `SV アクターアニメーションパック名`(`svActorAnimationPack`) で指定した名前にしてください。デフォルトでは `motions` になります。

- walk
- wait
- chant
- guard
- damage
- evade
- thrust
- swing
- missile
- skill
- spell
- item
- escape
- victory
- dying
- abnormal
- sleep
- dead

#### アニメーションの配置

プラグインパラメーター `SV アクターディレクトリ`(`svActorDir`) で指定したディレクトリに ssfb ファイルと画像ファイルを配置します。デフォルトでは `img/ssfb/sv_actors` となっております。

1. `SV アクターディレクトリ` へ置換したいキャラクターの ActorID と同じ名前のサブディレクトリを作成します。
2. ssfb ファイル名を `ディレクトリと同じ名前.ssbp.ssfb` にリネームし、`1.` で作成したディレクトリへ配置します。
3. `1.` で作成したディレクトリへ 画像ファイルを配置します。

下記の例は、 ActorID 0001 のスプライトを [SV アクターアニメーションサンプル](../../TestData/SideViewActorSample/) のアニメーションに置き換える例となります。

ActorID 0001 の ID は `1` になります。

1. `img/ssfb/sv_actors/1/` というディレクトリを作成します。
2. ssfb ファイル `sv_actor_motions_template.ssbp.ssfb` を `1.ssbp.ssfb` にリネームして `img/ssfb/sv_actors/1/` ディレクトリに配置します。
3. 画像ファイル `motions.png` ファイルを `img/ssfb/sv_actors/1/` ディレクトリに配置します。

下記のようなディレクトリ構成になります。

```
img/ssfb/sv_actors/1/
|-- 1.ssbp.ssfb
`-- motions.png
```

アニメーションが配置されてない ActorID は `XV アクター置き換え`(`replaceSVActorSpriteFlag`) を `ON` でも RPGツクールMZ で設定したアクターの SV スプライトが表示されるのでご注意ください。

### サイドビューエネミーとして表示

プラグインパラメーターの `SV エネミー置き換え`(`replaceSVEnemySpriteFlag`) を `ON` にすると、サイドビューでの敵の置き換え機能が有効になります。

#### アニメーションの配置

プラグインパラメーター `SV エネミーディレクトリ`(`svEnemyDir`) で指定したディレクトリに ssfb ファイルと画像ファイルを配置します。デフォルトでは `img/ssfb/sv_enemies` となっております。

1. `SV エネミーディレクトリ` へ置換したいキャラクターの EnemyID と同じ名前のサブディレクトリを作成します。
2. ssfb ファイル名を `ディレクトリと同じ名前.ssbp.ssfb` にリネームし、`1.` で作成したディレクトリへ配置します。
3. `1.` で作成したディレクトリへ 画像ファイルを配置します。

下記の例は、 EnemyID 0001 のスプライトを [SV アクターアニメーションサンプル](../../TestData/SideViewActorSample/) のアニメーションに置き換える例となります。

ActorID 0001 の ID は `1` になります。

1. `img/ssfb/sv_actors/1/` というディレクトリを作成します。
2. ssfb ファイル `sv_actor_motions_template.ssbp.ssfb` を `1.ssbp.ssfb` にリネームして `img/ssfb/sv_actors/1/` ディレクトリに配置します。
3. 画像ファイル `motions.png` ファイルを `img/ssfb/sv_actors/1/` ディレクトリに配置します。

下記のようなディレクトリ構成になります。

```
img/ssfb/sv_actors/1/
|-- 1.ssbp.ssfb
`-- motions.png
```

アニメーションが配置されてない ActorID は `XV アクター置き換え`(`replaceSVActorSpriteFlag`) を `ON` でも RPGツクールMZ で設定したアクターの SV スプライトが表示されるのでご注意ください。

#### データベース設定

設定したいエネミーのメモ欄でカスタマイズが可能です。

##### `<SS6SVEnemy file:>`
利用する ssfb ファイルパスを指定します。

プラグインパラメーター `SV エネミーディレクトリ`(`svEnemyDir`) に配置された ssfb ファイル**以外**を利用する際に設定します。
(e.g. 複数のエネミーで 1つ ssfb ファイルを利用する際など)

プラグインパラメーター `ssfb アニメーションベースディレクトリ`(`animationDir`) からの相対パスで指定してください。

e.g. `img/ssfb/MeshBone/Knight.ssbp.ssfb` を指定する場合は下記のように設定してください。

```xml
<SS6SVEnemy file:MeshBone/Knight.ssbp.ssfb>
```

##### `<SS6SVEnemy animationPackName:>`
利用するアニメーションパック名を指定します。

プラグインパラメーター `SV エネミーアニメーションパック名`(`svEnemyAnimationPack`) で指定したアニメーションパック名**以外**を利用する際に設定します。

e.g. アニメーションパック名を `Knight_bomb` を指定する場合は下記のように指定してください。

```xml
<SS6SVEnemy animationPackName:Knight_bomb>
```

##### `<SS6SVEnemy animationName:>`
利用するアニメーション名を指定します。

プラグインパラメーター `SV エネミーアニメーション名`(`svEnemyAnimationName`) で指定したアニメーション名**以外**を利用する際に設定します。

e.g. アニメーション名を `Balloon` を指定する場合は下記のように指定してください。

```xml
<SS6SVEnemy animationPackName:Balloon>
```

##### `<SS6SVEnemy scaleX:>`
再生するアニメーションの X スケールを変更します。

e.g. X スケールを半分にする場合は下記のように指定してください。

```xml
<SS6SVEnemy scaleX:0.5>
```

e.g. 左右反転する場合はマイナス値で指定してください。

```xml
<SS6SVEnemy scaleX:-1>
```

##### `<SS6SVEnemy scaleY:>`
再生するアニメーションの Y スケールを変更します。

e.g. Y スケールを半分にする場合は下記のように指定してください。

```xml
<SS6SVEnemy scaleY:0.5>
```

e.g. 上下反転する場合はマイナス値で指定してください。

```xml
<SS6SVEnemy scaleY:-1>
```

##### `<SS6SVEnemy offsetX:>`
表示位置の X 座標を変更します。
マイナス値で左へ配置、プラス値で右へ配置となります。

e.g. 左に 100 移動する場合は下記のように指定してください。

```xml
<SS6SVEnemy offsetX:100>
```

##### `<SS6SVEnemy offsetY:>`
表示位置の X 座標を変更します。
マイナス値で上へ配置、プラス値で下へ配置となります。

e.g. 上に 100 移動する場合は下記のように指定してください。

```xml
<SS6SVEnemy offsetY:-100>
```


# For Plugin Developer

プラグインを開発する方、あるいは開発版のプラグインの動作を確認したい方向けです。

## ビルド

ソースの取得方法やビルドに必要な npm のインストール手順は [wiki](https://github.com/SpriteStudio/SS6PlayerForWeb/wiki) を参照してください。

### 全ビルド

`SS6PlayerForWeb/` ディレクトリ上で下記コマンドを実行すると、依存ライブラリと ss6player-rpgmakermz を全ビルドします。

```
cd SS6PlayerForWeb
npm i
npm run bootstrap
npm run build
```

ビルドが成功すると `ss6player-rpgmakermz.js` が `SS6PlayerForWeb/packages/ss6player-rpgmakermz/dist/` ディレクトリ以下に生成されます。

### 単独ビルド

全ビルド実行後は `SS6PlayerForWeb/packages/ss6player-rpgmakermz/` ディレクトリ上で `ss6player-rpgmakermz` の単独ビルドが可能になります。

```
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run build
```

## ビルドと SampleProject への配置

`SS6PlayerForWeb/packages/ss6player-rpgmakermz/` ディレクトリ上で `npm run deploy` を実行すると、`ss6player-rpgmakermz.js` の単独ビルド後 `Sample/js/plugins/` ディレクトリへ配置します。

```
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run deploy
```

## 動作確認

RPG ツクール MZ を利用する方法とブラウザを利用する 2 つの方法があります。

### RPGツクールMZ

RPGツクールMZ で `SS6PlayerForWeb/packages/ss6player-rpgmakermz/SampleProject/game.rmmzproject` を開いてください。

### ブラウザ

`SS6PlayerForWeb/packages/ss6player-rpgmakermz/` ディレクトリ上で下記コマンドを実行してください。

ローカル環境で http サーバが起動し、ブラウザ上で ss6player-rpgmakermz を組み込んだサンプルゲームが起動します。

```bash
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run view
```
