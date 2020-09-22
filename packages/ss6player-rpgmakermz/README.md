# SS6Player for RPG Maker MZ

[SpriteStudio 6](https://www.webtech.co.jp/spritestudio/index.html) で作成されたアニメーションを [RPGツクールMZ](https://tkool.jp/mz/) で再生するプラグインです。

# プラグイン

リリース最新版のプラグインソースは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/ss6player-rpgmakermz.js) になります。

# デモ

リリース最新版のデモは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/SampleProject/index.html) になります。

# アニメーションデータの作成方法
SpriteStudio 6 のプロジェクトファイル sspj からアニメーションデータファイル ssfb ファイルをコンバートします。 コンバートには Ss6Converter を利用します。

Ss6Converter は SpriteStudio6-SDK に同封するツールです。利用方法に関しては[こちらを参照してください](https://github.com/SpriteStudio/SpriteStudio6-SDK/wiki/%E3%82%B3%E3%83%B3%E3%83%90%E3%83%BC%E3%82%BF%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)

# 使い方
## プラグインのセットアップ
1. プラグインソース `ss6player-rpgmakermz.js` をダウンロードします。
2. RPGツクールMZ プロジェクトの `js/plugins` ディレクトリへ `ss6player-rpgmakermz.js` を格納します。
3. RPGツクールMZ メニューの `ツール -> プラグイン管理`　をクリックし、プラグイン管理ウィンドウを開き `ss6player-rpgmakermz` を有効にしてください。
 
## アニメーションの配置

ssfb ファイルと画像データをプラグインパラメーターの `ssfb アニメーションベースディレクトリ` で指定したディレクトリへ格納してください。
デフォルトでは `img/ssfb` となっています。

サブディレクトリへの格納が可能ですが、 ssfb ロード時にサブディレクトリパスの追加が必要になります。

## アニメーションの表示

アニメーションの表示方法についてかんたんに説明位します。詳細はコマンドの説明あるいはデモのソースを参照してください。

### ピクチャとして表示

1. プラグインコマンド `loadSsfb` で ssfb ファイルパスと画像ファイルの読み込みし、登録します。こちらのコマンドはダウンロード完了するまでウェイトします。
2. プラグインコマンド `setAsPicture` でピクチャとして表示するアニメーションインスタンスを生成します。
3. イベントコマンド `ピクチャの表示` で任意の pictureId を指定し、画像ファイルを未指定で実行してください。
4. アニメーションが表示されます。

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
