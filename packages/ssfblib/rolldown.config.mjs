import { defineConfig } from 'rolldown';
import camelCase from 'lodash.camelcase';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = 'ssfblib';
const banner = `/*!
 * -----------------------------------------------------------
 *  ssfblib v${pkg.version}
 *
 *  Copyright(C) ${pkg.author.name}
 *  ${pkg.author.url}
 * -----------------------------------------------------------
 */`;


export default defineConfig([
  {
    input: `src/${libraryName}.ts`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true, banner},
      { file: pkg.module, format: 'es', sourcemap: true, banner }
    ],
    external: []
  }
]);
