@echo off
setlocal
set CURDIR=%~dp0
set BASEDIR=%CURDIR%..
@echo on

pushd "%BASEDIR%"
npm install || exit 1
npm run clean || exit 1
npm run bootstrap || exit 1
npm run build || exit 1
popd
