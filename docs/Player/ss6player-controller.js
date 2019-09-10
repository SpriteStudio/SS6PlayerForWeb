const PREVIEW_POSITION_MARGIN = 30;
const ZOOM_ARRAY = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 300, 400, 800];

class SS6PlayerController {
    
    pixiApplication = null;
    ssfbFilePath = null;
    container = null;
    rootLineGraphics = null;
    gridGraphics = null;
    ss6Project = null;
    ss6Player = null;
    onComplete = null;
    timeout = 0;
    retry = 0;
    onError = null;
    onTimeout = null;
    onRetry = null;

    animePackMap = null;
    previewHeight = null;
    previewWidth = null;

    onUpdate = null;
    onPlayStateChangeCallback = null;

    defaultScaleRatio = null;
    zoomPercent = null;

    isDisplayGrid = false;

    // ssfbFilePath;
    constructor(ssfbFilePath){
        this.ssfbFilePath = ssfbFilePath;
        console.log('ss6PlayerController' + this.ssfbFilePath);

    }

    load(previewElement) {
        this.previewWidth = previewElement.clientWidth;
        this.previewHeight = previewElement.clientHeight;
        this.pixiApplication = new PIXI.Application(this.previewWidth, this.previewHeight, {
            transparent: true,
        });

        const canvasElement = this.pixiApplication.view;
        previewElement.appendChild(canvasElement);

        this.ss6Project = new ss6PlayerPixi.SS6Project(
            this.ssfbFilePath, 
            () => {
                // 
                const animePacksLength = this.ss6Project.fbObj.animePacksLength();
                console.log('animePacksLength', animePacksLength);
                this.animePackMap = {};
                for (let packIndex = 0; packIndex < animePacksLength; packIndex++) {
                    const animePack = this.ss6Project.fbObj.animePacks(packIndex);
                    const animePackName = animePack.name();
                    console.log(animePackName);
                    const animationMap = [];
                    const animationsLength = animePack.animationsLength();
                    for (let animeIndex = 0; animeIndex < animationsLength; animeIndex++) {
                        const animation = animePack.animations(animeIndex);
                        const animationName = animation.name();
                        if (animationName === 'Setup'){
                            continue;
                        }

                        animationMap[animationName] = animation;
                    }
                    const partsCount = animePack.partsLength();
                    this.animePackMap[animePackName] = {
                        animations: animationMap,
                        parts_count: partsCount,
                    };
                }



                if (this.onComplete != null){
                    this.onComplete();
                }
            },
            this.timeout,
            this.retry,
            this.onError,
            this.onTimeout,
            this.onRetry
        );
    }

    setupAnimation(ssaeName, animeName) {
        console.log('setupAnimation: ssae:', ssaeName, ', animation:', animeName);

        if (this.ss6Player === null){
            // アニメーションやグリッドなどを入れるコンテナ
            this.container = new PIXI.Container();

            this.rootLineGraphics = new PIXI.Graphics(true);
            this.gridGraphics = new PIXI.Graphics(true);


            // コンテナに追加する
            this.container.addChild(this.rootLineGraphics);
            this.container.addChild(this.gridGraphics);


            this.ss6Player = new ss6PlayerPixi.SS6Player(this.ss6Project, ssaeName, animeName);
            this.container.addChild(this.ss6Player);


            this.ss6Player.onUserDataCallback = (player) => {
                console.log('onUserDataCallback');
            };
            this.ss6Player.onUpdateCallback = (player) => {
                if (this.onUpdate !== null){
                    this.onUpdate(player);
                }
            };
            this.ss6Player.onPlayStateChangeCallback = (isPlaying, isPausing) => {
                if(this.onPlayStateChangeCallback !== null){
                    this.onPlayStateChangeCallback(isPlaying, isPausing);
                }
            };


            this.pixiApplication.stage.addChild(this.container);

        }else{
            this.ss6Player.Setup(ssaeName, animeName);
        }
        this.ss6Player.Play();

        // console.log('現状のフレームNo:', this.ss6Player.currentCachedFrameNumber);
        console.log('フレームカウント:', this.ss6Player.curAnimation.frameDataLength());
        

        // ポジション設定
        const canvasPvotX = this.ss6Player.curAnimation.canvasPvotX();
        const canvasPvotY = this.ss6Player.curAnimation.canvasPvotY();

        let positionX;
        switch (canvasPvotX) {
            case 0.5:
                positionX = PREVIEW_POSITION_MARGIN;
                break;
            case 0:
                positionX = this.previewWidth * 0.5;
                break;
            case -0.5:
                positionX = this.previewWidth - PREVIEW_POSITION_MARGIN;
                break;
        }
        let positionY;
        switch (canvasPvotY){
            case 0.5: 
                positionY = PREVIEW_POSITION_MARGIN;
                break;
            case 0: 
                positionY = this.previewHeight * 0.5;
                break;
            case -0.5:
                positionY = this.previewHeight - PREVIEW_POSITION_MARGIN;
        }

        this.container.position = new PIXI.Point(positionX, positionY);

        // スケール値自動調整
        const playerHeight = this.ss6Player.curAnimation.canvasSizeH();
        const playerWidth = this.ss6Player.curAnimation.canvasSizeW();

        const widthRatio = this.previewWidth / playerWidth;
        const heightRatio = this.previewHeight / playerHeight;
        let scaleRatio = null;
        if (widthRatio < heightRatio) {
            scaleRatio = widthRatio;
        } else if (heightRatio < widthRatio) {
            scaleRatio = heightRatio;
        }
        // scaleRatio *= 0.5;
        this.defaultScaleRatio = scaleRatio;
        this.zoom(100);
        // zoomPercent = 100;
        // // スケールを設定
        // this.ss6Player.scale = new PIXI.Point(defaultScaleRatio, defaultScaleRatio);
        // var renderer = PIXI.autoDetectRenderer(1000, 1000);

        this.switchGrid();
        
    }

    switchGrid() {
        if (this.rootLineGraphics == null || this.gridGraphics == null){
            return;
        }
        this.rootLineGraphics.clear();
        this.gridGraphics.clear();
        if (this.isDisplayGrid) {
            const min = -5000;
            const max = (min * -1) + 1;

            // 基準点の描画            
            this.rootLineGraphics.lineStyle(1, 0x000000);
            this.rootLineGraphics.alpha = 0.3;
            this.rootLineGraphics.moveTo(min, 0).lineTo(max, 0);
            this.rootLineGraphics.moveTo(0, min).lineTo(0, max);

            // グリッドの描画
            this.gridGraphics.lineStyle(1, 0x000000);
            this.gridGraphics.alpha = 0.1;

            let gridSize = 100;
            for (let x = min; x < max; x += gridSize) {
                this.gridGraphics.moveTo(x, min).lineTo(x, max);

            }
            for (let y = min; y < max; y += gridSize) {
                this.gridGraphics.moveTo(min, -y).lineTo(max, -y);

            }
        }
    }




    movePosition(movementX, movementY) {
        const position = this.container.position;
        position.x += movementX;
        position.y += movementY;
        this.container.position = position;
    }

    setFrame(frameNumber) {
        this.ss6Player._currentFrame = frameNumber;
        this.ss6Player.SetFrameAnimation(frameNumber);
        if (this.onUpdate !== null) {
            this.onUpdate(this.ss6Player);
        }
    }
    nextFrame() {
        const currentFrame = this.ss6Player._currentFrame;
        const endFrame = this.ss6Player.endFrame;
        if (currentFrame == endFrame) {
            return;
        }
        this.setFrame(currentFrame + 1);
    }

    prevFrame() {
        const currentFrame = this.ss6Player._currentFrame;
        if (currentFrame === 0){
            return;
        }
        this.setFrame(currentFrame - 1);
    }

    zoom(zoomPercent) {
        let scaleRatio = this.defaultScaleRatio;
        if (zoomPercent !== 100){
            scaleRatio = this.defaultScaleRatio * (zoomPercent * 0.01);
        }
        this.zoomPercent = zoomPercent;
        this.container.scale = new PIXI.Point(scaleRatio, scaleRatio);
    }
    zoomIn() {
        const zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
        const nextZoomArrayIndex = zoomArrayIndex + 1;
        if (nextZoomArrayIndex >= ZOOM_ARRAY.length){
            // 拡大するズーム率が存在しない場合は処理しない
            return;
        }
        const nextZoomPercent = ZOOM_ARRAY[nextZoomArrayIndex];
        this.zoom(nextZoomPercent);
    }

    zoomOut() {
        const zoomArrayIndex = ZOOM_ARRAY.indexOf(this.zoomPercent);
        const prevZoomArrayIndex = zoomArrayIndex - 1;
        if (prevZoomArrayIndex < 0) {
            // 縮小するズーム率が存在しない場合は処理しない
            return;
        }
        const prevZoomPercent = ZOOM_ARRAY[prevZoomArrayIndex];
        this.zoom(prevZoomPercent);

    }


    

}