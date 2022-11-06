const fs = require('fs');
const path = require('path');

const baseDir = path.dirname(path.dirname( __filename));
const docsDir = path.join(baseDir, 'docs');
const ss6playerPixi6Dir = path.join(baseDir, 'packages', 'ss6player-pixi6');

let srcDir = path.join(ss6playerPixi6Dir, 'Player');
let dstDir = path.join(docsDir, 'Player6');

fs.rmSync(dstDir, {force: true, recursive: true});
fs.cpSync(srcDir, dstDir, {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'MeshBone'), path.join(dstDir, 'MeshBone'), {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'character_sample1'), path.join(dstDir, 'character_sample1'), {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'AnimeMaking'), path.join(dstDir, 'AnimeMaking'), {recursive: true});

// update index.html
const pixiPackageJsonPath = path.join(ss6playerPixi6Dir, 'package.json');
const pixiPackageJsonObject = JSON.parse(fs.readFileSync(pixiPackageJsonPath, 'utf8'));
const pixiVersion = pixiPackageJsonObject.devDependencies["pixi.js"].replace('^','');
const cdnURL = `https://cdnjs.cloudflare.com/ajax/libs/pixi.js/${pixiVersion}/browser/pixi.min.js`;
let indexHtmlPath = path.join(dstDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace('../node_modules/pixi.js/dist/browser/pixi.min.js', cdnURL);
indexHtml = indexHtml.replace('../dist/ss6player-pixi6.umd.js', './ss6player-pixi6.min.js');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

// update sample.js
const sampleJsPath = path.join(dstDir, 'sample.js');
let sampleJs = fs.readFileSync(sampleJsPath, 'utf8');
sampleJs = sampleJs.replaceAll('../../../TestData/character_sample1/character_sample1.ssfb', './character_sample1/character_sample1.ssfb');
sampleJs = sampleJs.replaceAll('../../../TestData/AnimeMaking/AnimeMaking.ssfb', './AnimeMaking/AnimeMaking.ssfb');
sampleJs = sampleJs.replaceAll('../../../TestData/MeshBone/Knight.ssfb', './MeshBone/Knight.ssfb');
fs.writeFileSync(sampleJsPath, sampleJs, 'utf-8');
