const fs = require('fs');
const path = require('path');

const baseDir = path.dirname(path.dirname( __filename));
const docsDir = path.join(baseDir, 'docs');
const ss6playerViewerDir = path.join(baseDir, 'packages', 'ss6player-viewer');

const srcDir = path.join(ss6playerViewerDir, 'Player');
const dstDir = path.join(docsDir, 'ViewerPlayer');


fs.rmSync(dstDir, {force: true, recursive: true});
fs.cpSync(srcDir, dstDir, {recursive: true});
fs.cpSync(path.join(baseDir, 'TestData', 'MeshBone'), path.join(docsDir, 'ViewerPlayer', 'MeshBone'), {recursive: true});

// update index.html
const indexHtmlPath = path.join(docsDir, 'ViewerPlayer', 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replaceAll('../../../TestData/MeshBone/Knight.ssfb', './MeshBone/Knight.ssfb');
indexHtml = indexHtml.replaceAll('../../../TestData/MeshBone/Knight.sspkg', './MeshBone/Knight.sspkg');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

// update player.html
const pixiPackageJsonPath = path.join(ss6playerViewerDir, 'package.json');
const pixiPackageJsonObject = JSON.parse(fs.readFileSync(pixiPackageJsonPath, 'utf8'));
const pixiVersion = pixiPackageJsonObject.devDependencies["pixi.js"].replace('^','');
const cdnURL = `https://cdnjs.cloudflare.com/ajax/libs/pixi.js/${pixiVersion}/pixi.min.js`;
const playerHtmlPath = path.join(docsDir, 'ViewerPlayer', 'player.html');
let playerHtml = fs.readFileSync(playerHtmlPath, 'utf8');
playerHtml = playerHtml.replace('../../../node_modules/pixi.js/dist/pixi.min.js', cdnURL);
playerHtml = playerHtml.replace('../dist/ss6player-viewer.umd.js', './ss6player-viewer.min.js');
fs.writeFileSync(playerHtmlPath, playerHtml, 'utf-8');
