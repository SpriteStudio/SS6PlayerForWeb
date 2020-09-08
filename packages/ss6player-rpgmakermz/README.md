# `ss6player-rpgmakermz`

[SpriteStudio](https://www.webtech.co.jp/spritestudio/index.html)で作成されたアニメーションを [RPGツクールMZ](https://tkool.jp/mz/) で再生するプラグインです。

## ビルド

ソースの取得方法やビルドに必要な npm のインストール手順は [wiki](https://github.com/SpriteStudio/SS6PlayerForWeb/wiki) を参照してください。

### 全ビルド

`SS6PlayerForWeb` ディレクトリ上で下記コマンドを実行すると、依存ライブラリと ss6player-rpgmakermz を全ビルドします。

```
cd SS6PlayerForWeb
npm i
npm run bootstrap
npm run build
```

ビルドが成功すると `ss6player-rpgmakermz.js` が `SS6PlayerForWeb/packages/ss6player-rpgmakermz/dist` ディレクトリ以下に生成されます。

### 単独ビルド

全ビルド実行後は `SS6PlayerForWeb/packages/ss6player-rpgmakermz` ディレクトリ上で `ss6player-rpgmakermz` の単独ビルドが可能になります。

```
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run build
```

## デモ

`SS6PlayerForWeb/packages/ss6player-rpgmakermz` ディレクトリ上で下記コマンドを実行してください。

http サーバが起動し、ブラウザ上で ss6player-rpgmakermz を組み込んだサンプルゲームが起動し、動作確認できます。

```bash
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run view
```

## プラグインの利用方法
(T.B.D)


# 開発者向け
## build and deploy to Sample Game
`SS6PlayerForWeb/packages/ss6player-rpgmakermz` ディレクトリ上で `npm run deploy` を実行すると、`ss6player-rpgmakermz.js` の単独ビルド後 `Sample/js/plugins` へコピーします。

```
cd SS6PlayerForWeb/packages/ss6player-rpgmakermz
npm run deploy
```
