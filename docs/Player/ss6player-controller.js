class SS6PlayerController {
    
    pixiApplication = null;
    ssfbFilePath = null;
    ss6Project = null;
    ss6Player = null;
    onComplete = null;
    timeout = 0;
    retry = 0;
    onError = null;
    onTimeout = null;
    onRetry = null;

    animePackMap = null;


    // ssfbFilePath;
    constructor(ssfbFilePath){
        this.ssfbFilePath = ssfbFilePath;
        console.log('ss6PlayerController' + this.ssfbFilePath);

    }

    load(previewElement) {
        const previewWidth = 320;
        const previewHeight = 320;        
        this.pixiApplication = new PIXI.Application(previewWidth, previewHeight, {
            transparent: true
        });
        previewElement.appendChild(this.pixiApplication.view);


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
                    this.animePackMap[animePackName] = animationMap;
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
            this.ss6Player = new ss6PlayerPixi.SS6Player(this.ss6Project, ssaeName, animeName);
            this.pixiApplication.stage.addChild(this.ss6Player);

            const animationCenterX = previewWidth / 2;
            const animationCenterY = previewHeight - 10;
            this.ss6Player.position = new PIXI.Point(animationCenterX, animationCenterY);

        }else{
            this.ss6Player.Setup(ssaeName, animeName);
        }
        this.ss6Player.Play();

        // console.log('現状のフレームNo:', this.ss6Player.currentCachedFrameNumber);
        console.log('フレームカウント:', this.ss6Player.curAnimation.frameDataLength());
        

        // スケール値自動調整
        const playerHeight = this.ss6Player.curAnimation.canvasSizeH();
        const playerWidth = this.ss6Player.curAnimation.canvasSizeW();

        const widthRatio = previewWidth / playerWidth;
        const heightRatio = previewHeight / playerHeight;
        let scaleRatio = null;
        if (widthRatio < heightRatio) {
            scaleRatio = widthRatio;
        } else if (heightRatio < widthRatio) {
            scaleRatio = heightRatio;
        }
        // scaleRatio *= 0.5;

        // スケールを設定
        this.ss6Player.scale = new PIXI.Point(scaleRatio, scaleRatio);

    }
    

}