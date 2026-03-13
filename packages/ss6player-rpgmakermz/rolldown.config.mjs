import { defineConfig } from 'rolldown';
import camelCase from 'lodash.camelcase';
import license from 'rollup-plugin-license';
import { createRequire } from 'module';
import * as path from 'path';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = 'ss6player-rpgmakermz';
const pixiGlobals = {
  '@pixi/loaders': 'PIXI',
  '@pixi/display': 'PIXI',
  '@pixi/mesh': 'PIXI',
  '@pixi/ticker': 'PIXI',
  '@pixi/filter-color-matrix': 'PIXI.filters',
  '@pixi/core': 'PIXI',
  '@pixi/constants': 'PIXI',
  '@pixi/app': 'PIXI',
  '@pixi/graphics': 'PIXI'
};
const licenseBannerOptions = {
  commentStyle: 'none',
  content: {
    file: path.join(import.meta.dirname, 'src/header.js'),
    encoding: 'utf-8' // Default is utf-8
  }
};

export default defineConfig([
  {
    input: `src/${libraryName}.js`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals }
    ],
    external: [/@pixi\/.*/, 'pixi.js'],
    moduleContext: 'this',
    plugins: [license({ banner: licenseBannerOptions })]
  },
  {
    input: `src/${libraryName}.js`,
    output: {
      file: `dist/${libraryName}.min.js`,
      name: camelCase(libraryName),
      format: 'iife',
      sourcemap: false, globals: pixiGlobals
    },
    external: [/@pixi\/.*/, 'pixi.js'],
    moduleContext: 'this',
    minify: true,
    plugins: [license({ banner: licenseBannerOptions })]
  }
]);
