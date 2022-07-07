import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import camelCase from 'lodash.camelcase';
import esbuild, { minify } from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import license from 'rollup-plugin-license';
import * as path from 'path';

const production = !process.env.ROLLUP_WATCH;

const pkg = require('./package.json');

const libraryName = 'ss6player-rpgmakermz';

// reference: @pixi-build-tools/globals
const pixiGlobals = {
  '@pixi/loaders': 'PIXI',
  '@pixi/display': 'PIXI',
  '@pixi/mesh-extras': 'PIXI',
  '@pixi/ticker': 'PIXI',
  '@pixi/filter-color-matrix': 'PIXI.filters',
  '@pixi/core': 'PIXI',
  '@pixi/constants': 'PIXI',
  '@pixi/app': 'PIXI',
  '@pixi/graphics': 'PIXI'
};

export default {
  input: `src/${libraryName}.js`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals },
    { file: `dist/${libraryName}.min.js`, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals, plugins: [ minify() ] }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'pixi.js',
    /@pixi\/.*/
  ],
  watch: {
    include: 'src/**'
  },
  context: 'this',
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    esbuild({sourceMap: !production}),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    license({
      banner: {
        commentStyle: 'none',
        content: {
          file: path.join(__dirname, 'src/header.ts'),
          encoding: 'utf-8' // Default is utf-8
        }
      }
    })
  ]
};
