import { defineConfig } from 'rolldown';
import camelCase from 'lodash.camelcase';
import { createRequire } from 'module';
import * as path from 'path';
import * as fs from 'fs';
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
const headerFilePath = path.join(import.meta.dirname, 'src/header.js');
let banner = fs.readFileSync(headerFilePath, 'utf-8');
banner = banner
  .replace(/<%= pkg\.version %>/g, pkg.version)
  .replace(/<%= pkg\.author\.name %>/g, pkg.author.name)
  .replace(/<%= pkg\.author\.url %>/g, pkg.author.url);


function injectBannerAfterMinify() {
  return {
    name: 'inject-banner-after-minify',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          chunk.code = banner + '\n' + chunk.code;
        }
      }
    }
  };
}

export default defineConfig([
  {
    input: `src/${libraryName}.js`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals, banner }
    ],
    external: [/@pixi\/.*/, 'pixi.js'],
    moduleContext: 'this'
  },
  {
    input: `src/${libraryName}.js`,
    output: {
      file: `dist/${libraryName}.min.js`,
      name: camelCase(libraryName),
      format: 'iife',
      sourcemap: false,
      globals: pixiGlobals,
      minify: true,
    },
    external: [/@pixi\/.*/, 'pixi.js'],
    moduleContext: 'this',
    plugins: [injectBannerAfterMinify()]
  }
]);
