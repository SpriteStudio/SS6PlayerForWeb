const fs = require('fs');
const path = require('path');

const baseDir = path.dirname(path.dirname( __filename));
const docsDir = path.join(baseDir, 'docs');
const ss6playerPixiDir = path.join(baseDir, 'packages', 'ss6player-pixi');

let srcDir = path.join(ss6playerPixiDir, 'Player');
let dstDir = path.join(docsDir, 'Player');

fs.rmSync(dstDir, {force: true, recursive: true});
fs.cpSync(srcDir, dstDir, {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'MeshBone'), path.join(dstDir, 'MeshBone'), {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'character_sample1'), path.join(dstDir, 'character_sample1'), {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'AnimeMaking'), path.join(dstDir, 'AnimeMaking'), {recursive: true});

// update index.html
const pixiPackageJsonPath = path.join(ss6playerPixiDir, 'package.json');
const pixiPackageJsonObject = JSON.parse(fs.readFileSync(pixiPackageJsonPath, 'utf8'));
const pixiVersion = pixiPackageJsonObject.devDependencies["pixi.js"].replace('^','');
const cdnURL = `https://cdnjs.cloudflare.com/ajax/libs/pixi.js/${pixiVersion}/pixi.min.js`;
let indexHtmlPath = path.join(dstDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace('../node_modules/pixi.js/dist/pixi.min.js', cdnURL);
indexHtml = indexHtml.replace('../dist/ss6player-pixi.umd.js', './ss6player-pixi.min.js');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

// update sample.js
const sampleJsPath = path.join(dstDir, 'sample.js');
let sampleJs = fs.readFileSync(sampleJsPath, 'utf8');
sampleJs = sampleJs.replaceAll('../../../TestData/character_sample1/character_sample1.ssfb', './character_sample1/character_sample1.ssfb');
sampleJs = sampleJs.replaceAll('../../../TestData/AnimeMaking/AnimeMaking.ssfb', './AnimeMaking/AnimeMaking.ssfb');
sampleJs = sampleJs.replaceAll('../../../TestData/MeshBone/Knight.ssfb', './MeshBone/Knight.ssfb');
fs.writeFileSync(sampleJsPath, sampleJs, 'utf-8');

// ----
srcDir = path.join(ss6playerPixiDir, 'examples', 'ui');
dstDir = path.join(docsDir, 'ui-examples');

fs.rmSync(dstDir, {force: true, recursive: true});
fs.cpSync(srcDir, dstDir, {recursive: true});

// update index.html
indexHtmlPath = path.join(docsDir, 'ui-examples', 'index.html');
indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace('../../node_modules/pixi.js/dist/pixi.min.js', cdnURL);
indexHtml = indexHtml.replace('../../dist/ss6player-pixi.umd.js', './ss6player-pixi.min.js');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
