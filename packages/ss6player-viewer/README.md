# SS6Player for Viewer

[SpriteStudio 6](https://www.webtech.co.jp/spritestudio/index.html) で作成されたアニメーションを Web 上で再生するプラグインです。

## ライセンス
ss6player-viewer のライセンスは [LISENCE](../../LICENSE) となります。

ss6player-viewer は依存ライブラリの [FlatBuffers](https://google.github.io/flatbuffers/) と [ssfblib](../ssfblib) と [ss6player-pixi](../ss6player-pixi) をバンドルしています。
ForWeb のコンポーネントが依存しているサードパーティライブラリのライセンスは [ThirdPartyLicenses.md](../../ThirdPartyLicenses.md) を参照してください。

## アニメーションデータの作成方法

SpriteStudio 6 のプロジェクトファイル sspj からアニメーションデータファイル ssfb ファイルをコンバートします。 コンバートには Ss6Converter を利用します。

Ss6Converter は SpriteStudio6-SDK に同封するツールです。利用方法に関しては[こちらを参照してください](https://github.com/SpriteStudio/SpriteStudio6-SDK/wiki/%E3%82%B3%E3%83%B3%E3%83%90%E3%83%BC%E3%82%BF%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)

## 使い方

### API リファレンス

...

### サンプル

...

# For Plugin Developer

ライブラリを開発する方、あるいは開発版のライブラリの動作を確認したい方向けです。

## ビルド

ソースの取得方法やビルドに必要な npm のインストール手順は [wiki](https://github.com/SpriteStudio/SS6PlayerForWeb/wiki) を参照してください。

### 全ビルド

`SS6PlayerForWeb/` ディレクトリ上で下記コマンドを実行すると、 packages/ 以下の全ライブラリをビルドします。

```bash
cd SS6PlayerForWeb
npm i
npm run bootstrap
npm run build
```

ビルドが成功すると `ss6player-viewer.umd.js` と `ss6player-viewer.es5.js` が `SS6PlayerForWeb/packages/ss6player-viewer/dist` ディレクトリ以下に生成されます。

### 単独ビルド

[全ビルド](#全ビルド)実行後は `SS6PlayerForWeb/packages/ss6player-viewer` ディレクトリ上で `ss6player-viewer` の単独ビルドが可能になります。

```bash
cd SS6PlayerForWeb/packages/ss6player-viewer
npm run build
```

## ローカル環境での動作確認

[全ビルド](#全ビルド)後、`SS6PlayerForWeb/packages/ss6player-viewer/` ディレクトリ上で下記コマンドを実行してください。

ローカル環境で http サーバが起動し、ブラウザ上で Player ディレクトリのサンプルを表示します。

```bash
cd SS6PlayerForWeb/packages/ss6player-viewer
npm run view
```

## 単独ビルドの監視

`SS6PlayerForWeb/packages/ss6player-viewer` ディレクトリ上で `npm run start` を実行すると、 `src/` ディレクトリのソースファイルが変更されると自動的に[単独ビルド](#単独ビルド)が走るようになります。 

[ローカル環境での動作確認](#ローカル環境での動作確認) と併用するとスムーズに動作確認が行なえます。

```bash
cd SS6PlayerForWeb/packages/ss6player-viewer
npm run start
```
