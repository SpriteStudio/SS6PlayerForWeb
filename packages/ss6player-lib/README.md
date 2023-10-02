# ss6player-lib

[OPTPiX SpriteStudio 7.0](https://www.webtech.co.jp/help/ja/spritestudio7/download/) と [OPTPiX SpriteStudio 6](https://www.webtech.co.jp/help/ja/spritestudio/download/) で制作したアニメーションデータの一つである ssfb フォーマットをパースし、 player 向けのデータへ変換するライブラリです。

## ライセンス

ss6player-lib のライセンスは [LISENCE](../../LICENSE) となります。 

ss6player-lib は依存ライブラリの [FlatBuffers](https://google.github.io/flatbuffers/) と [ssfblib](../ssfblib) をバンドルしています。
ForWeb のコンポーネントが依存しているサードパーティライブラリのライセンスは [ThirdPartyLicenses.md](../../ThirdPartyLicenses.md) を参
照してください。

## 使い方
### API リファレンス

ss6player-lib の API リファレンスは[こちら](https://spritestudio.github.io/SS6PlayerForWeb/ss6player-lib_api/modules/ss.ssfb.html)です。

## ビルド

ソースの取得方法やビルドに必要な npm のインストール手順は [wiki](https://github.com/SpriteStudio/SS6PlayerForWeb/wiki) を参照してください。

### 全ビルド

`SS6PlayerForWeb/` ディレクトリ上で下記コマンドを実行すると、 packages/ 以下の全ライブラリをビルドします。

```
cd SS6PlayerForWeb
npm i
npm run build
```

ビルドが成功すると `ss6player-lib.umd.js` と `ss6player-lib.es5.js` が `SS6PlayerForWeb/packages/ss6player-lib/dist` ディレクトリ以下に生成されます。

### 単独ビルド

全ビルド実行後は `SS6PlayerForWeb/packages/ss6player-lib` ディレクトリ上で `ss6player-lib` の単独ビルドが可能になります。

```
cd SS6PlayerForWeb/packages/ss6player-lib
npm run build
```
