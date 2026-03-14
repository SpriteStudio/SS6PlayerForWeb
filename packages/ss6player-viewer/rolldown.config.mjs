import { defineConfig } from 'rolldown';
import camelCase from 'lodash.camelcase';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = 'ss6player-viewer';
const pixiGlobals = {
  'pixi.js': 'PIXI'
};
const banner = `/*!
 * -----------------------------------------------------------
 *  SS6Player For Viewer v${pkg.version}
 *
 *  Copyright(C) ${pkg.author.name}
 *  ${pkg.author.url}
 * -----------------------------------------------------------
 */`;


export default defineConfig([
  {
    input: `src/${libraryName}.ts`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals, banner},
      { file: pkg.module, format: 'es', sourcemap: true, globals: pixiGlobals, banner}
    ],
    external: [/@pixi\/.*/, 'pixi.js']
  },
  {
    input: `src/${libraryName}.ts`,
    output: {
      file: `dist/${libraryName}.min.js`,
      name: camelCase(libraryName),
      format: 'iife',
      sourcemap: false,
      globals: pixiGlobals,
      minify: true,
      banner
    },
    external: [/@pixi\/.*/, 'pixi.js']
  }
]);
