import { defineConfig } from 'rolldown';
import camelCase from 'lodash.camelcase';
import license from 'rollup-plugin-license';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const libraryName = 'ss6player-viewer';
const pixiGlobals = {
  'pixi.js': 'PIXI'
};
const licenseBannerOptions = `-----------------------------------------------------------
 SS6Player For Viewer v<%= pkg.version %>

 Copyright(C) <%= pkg.author.name %>
 <%= pkg.author.url %>
-----------------------------------------------------------
`;

export default defineConfig([
  {
    input: `src/${libraryName}.ts`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'iife', sourcemap: false, globals: pixiGlobals },
      { file: pkg.module, format: 'es', sourcemap: true, globals: pixiGlobals }
    ],
    external: [/@pixi\/.*/, 'pixi.js'],
    
    plugins: [license({ banner: licenseBannerOptions })]
  },
  {
    input: `src/${libraryName}.ts`,
    output: {
      file: `dist/${libraryName}.min.js`,
      name: camelCase(libraryName),
      format: 'iife',
      sourcemap: false, globals: pixiGlobals
    },
    external: [/@pixi\/.*/, 'pixi.js'],
    
    minify: true,
    plugins: [license({ banner: licenseBannerOptions })]
  }
]);
