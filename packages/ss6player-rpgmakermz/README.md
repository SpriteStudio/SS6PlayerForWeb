# SS6Player for RPG Maker MZ

[SpriteStudio](https://www.webtech.co.jp/spritestudio/index.html)で作成されたアニメーションを [RPGツクールMZ](https://tkool.jp/mz/) で再生するプラグインです。

## プラグイン

リリース最新版のプラグインソースは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/ss6player-rpgmakermz.js) になります。

## デモ

リリース最新版のデモは [こちら](https://spritestudio.github.io/SS6PlayerForWeb/mz/SampleProject/index.html) になります。

## プラグインの利用方法
(T.B.D)


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

## ビルドと SampleProject へのコピー
`SS6PlayerForWeb/packages/ss6player-rpgmakermz/` ディレクトリ上で `npm run deploy` を実行すると、`ss6player-rpgmakermz.js` の単独ビルド後 `Sample/js/plugins/` ディレクトリへコピーします。

```
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run deploy
```

## 動作確認
動作確認には RPG ツクール MZ を利用する方法とブラウザを利用する 2 つの方法があります。

### RPGツクールMZ
RPGツクールMZ で `SS6PlayerForWeb/packages/ss6player-rpgmakermz/SampleProject/game.rmmzproject` を開いてください。

### ブラウザ
`SS6PlayerForWeb/packages/ss6player-rpgmakermz/` ディレクトリ上で下記コマンドを実行してください。

ローカル環境で http サーバが起動し、ブラウザ上で ss6player-rpgmakermz を組み込んだサンプルゲームが起動します。

```bash
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run view
```
