# ssfblib

[SpriteStudio 6](https://www.webtech.co.jp/spritestudio/index.html) のアニメーションデータの一つである ssfb フォーマットをパースするライブラリです。

## ssfb schema

ssfblib は [FlatBuffers](https://google.github.io/flatbuffers/) が schema から生成した TypeScript コードをライブラリ化したものです。

ssfblib の schema ファイルは SpriteStudio6-SDK に同封しています。
[こちらを参照してください](https://github.com/SpriteStudio/SpriteStudio6-SDK/blob/develop/Build/Converter/fbs/ssfb.fbs)

## ライセンス
ssfb のライセンスは [LISENCE](../../LICENSE) となります。 

## 使い方
### API リファレンス

ssfblib の API リファレンスは[こちら](https://spritestudio.github.io/SS6PlayerForWeb/ssfblib_api/modules/ss.ssfb.html)です。

### サンプル

FlatBuffers の [TypeScript 利用ガイド](https://google.github.io/flatbuffers/flatbuffers_guide_use_typescript.html) か [JavaScript 利用ガイド](https://google.github.io/flatbuffers/flatbuffers_guide_use_javascript.html) を参照してください。


## ビルド

ソースの取得方法やビルドに必要な npm のインストール手順は [wiki](https://github.com/SpriteStudio/SS6PlayerForWeb/wiki) を参照してください。

### 全ビルド

`SS6PlayerForWeb/` ディレクトリ上で下記コマンドを実行すると、 packages/ 以下の全ライブラリをビルドします。

```
cd SS6PlayerForWeb
npm i
npm run bootstrap
npm run build
```

ビルドが成功すると `ssfblib.umd.js` と `ssfblib.es5.js` が `SS6PlayerForWeb/packages/ssfblib/dist` ディレクトリ以下に生成されます。

### 単独ビルド

全ビルド実行後は `SS6PlayerForWeb/packages/ssfblib` ディレクトリ上で `ssfblib` の単独ビルドが可能になります。

```
cd SS6PlayerForWeb/packages/ssfblib
npm run build
```
