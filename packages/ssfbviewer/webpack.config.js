const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {test: /\.ts$/, loader: 'ts-loader'},
    ],
  },
  output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
  },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
  plugins: [
    new CleanWebpackPlugin({}),
    new HtmlWebPackPlugin({
      title: 'SpriteStudio6 Ssfb Viewer'
    })
  ],
};

