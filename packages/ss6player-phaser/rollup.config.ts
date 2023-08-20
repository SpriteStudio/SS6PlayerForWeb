import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import camelCase from 'lodash.camelcase';
import esbuild, { minify } from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import license from 'rollup-plugin-license';

const production = !process.env.ROLLUP_WATCH;

const pkg = require('./package.json');

const libraryName = 'ss6player-phaser';

const licenseBannerOptions = `-----------------------------------------------------------
 SS6Player For Phaser v<%= pkg.version %>

 Copyright(C) <%= pkg.author.name %>
 <%= pkg.author.url %>
-----------------------------------------------------------
`;

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: `dist/${libraryName}.min.js`, name: camelCase(libraryName), format: 'iife', sourcemap: false, plugins: [ minify(), license({ banner: licenseBannerOptions }) ] },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'phaser',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    esbuild.default({sourceMap: !production}),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    license({ banner: licenseBannerOptions })
  ]
};
