//=============================================================================
// SSPlayerForRPGMV.js
//=============================================================================

/*:
* @plugindesc [v0.5.0] This plug-in can be able to play animations made by OPTPiX SpriteStudio.
* @author Web Technology Corp. / Inaba Byakko
* 
* @param Animation File Path
* @desc A folder path to place animation data (json/png). Default value is "img/animations/ssas".
* @default img/animations/ssas
*
* @param Limit Tint Color Range
* @desc For mobile devices, it limits the range of colors that can be tinted in texture to each of 16 steps (ON or OFF).
* @default OFF
*
* @param Use Filter To Tint Color
* @desc It uses PIXI.js filter to change color tone of texture (ON or OFF). [!] The way of coloring might be changed.
* @default OFF
* 
*
* @help
* ** INFORMATION **
* Some plug-ins are depends on this plug-in.
* Those plug-ins must be installed under this
* plug-in.
* 
* For more information, please look at README.md
* in the Github repository.
* https://github.com/InabaByakko/SSPlayerForRPGMV
*
* ** WARNING **
* When you use 'delete unused files' options in deployment,
* the folder which an animation is included in will be deleted.
* You should copy that folder to the folder that you deployed.
* 
* Plug-in commands:
*  * Old plugin commands that defined in version 0.1 are obsoleted.
*   (For compatibility, these are still available)
*
*   PlaySsAnimation [JSON file name] [label name] [[options]]
*   # Play an animation data located in specified animation folder.
*   #
*   # (Label name is required to move or stop the animation later .)
*   # (The extension of the file name ".json" is optional.)
*   #
*   #  * Options： 
*   #   (There must be a colon between the option names and values. 
*   #     Please do not put spaces before or after the colon.)
*   #   - x: An animation's X position  (If omitted: Use 0)
*   #       (To use variables for specifying positon, input like v[variable number])
*   #   - y: An animation's Y position  (If omitted: Use 0)
*   #       (To use variables for specifying positon, input like v[variable number])
*   #   - Repeat: The number of times you want to repeat playback
*   #       (If omitted or specified 0: It will repeat endlessly)
*   #   - Page: If you combine multiple animations in one file,
*   #             specify the number you want to play. 
*   #   　　(The first of number is 0. If omitted: It will play page 0)
*   #   - AnimationName: If you combine multiple animations in one file,
*   #               specify the animation name you want to play. 
*   #       (The name match backward. For example: If you want to play
*   #          anime1 in chara.ssae, input "chara_anime1". 
*   #          If the page and the name has been specified simultaneously,
*   #          the specified page will be priority.)
*   #   - ScaleX: Enlargement ratio in the X-axis direction
*   #   　　(Value range: -1000 - 1000% / If omitted: Use 100%,
*   #        If specified negative number: It will be flipped vertically)
*   #   - ScaleY: Enlargement ratio in the Y-axis direction
*   #   　　(Value range: -1000 - 1000% / If omitted: Use 100%,
*   #        If specified negative number: It will be flipped horizontally)
*   #   - Opacity: Opacity of animation 
*   #       (Value range: 0 - 255 / If omitted: Use 255）
*   #   - BlendType: Blending method of animation
*   #   　　(Choose one of these: [Normal/Additive/Subtraction/Screen]
*   #   　　 If omitted: Use Normal)
*   #   - Speed: Playback speed of animation
*   #       (Value range: 1 - 1000% / If omitted: Use 100%）
*   #   - ShowInAllScenes : Option to make the animation that was created,
*   #                       can be played on maps and battle both of scene
*   #
*   # Example）Play an animation data saved in file "animdata.json"
*   #   at position (300, 400), and put the label named
*   #   "label1". It is repeated 3 times.
*   #  PlaySsAnimation animdata label1 x:300 y:400 repeat:3
*   # 
*   # * TIPS *
*   # If you use label name with integer 1~99, you can display an animation
*   # with same priolity as the corresponding picture number. And then you
*   # can control animation by event commands such as "Move Picture" or
*   # "Erase Picture".
*   
* MoveSsAnimation [label name] Frame:[frame interval] [[options]]
*   # Changes the position, scale, translucency and image properties of a displayed animation.
*   # * Mandatory parameter：
*   #  - Frame: The number of frames to be applied to the animation move
*   # 
*   # * Options：
*   # 　All of "PlaySsAnimations" command's options are available.
*   #  - WaitForCompletion: Wait the event execution until the move is complete.
*   #
*   # Example) Move an animation created with label "label1" to the coordinate
*   # 　(200, 200) for 30 frames, then wait event execution until complete moving.
*   #  MoveSsAnimation label1 Frame:30 x:200 y:200 WaitForCompletion
*   
* WaitForCompleteSsAniamtion [label name]
*   # Wait until the playback of the animation that has been specified in the label name.
*   # If the target of the animation is played endlessly, this command is ignored.
*
* StopSsAnimation [label name]
*   # Stop an animation which a label called "label" was
*   # attached to.
*   
* ** Release Notes **
* v0.5.0 - RPGMV core script version 1.6.x has been supported.
*            New Feature - Playing animation with instance or effect feature has been supported
*            New Feature - Playing animation with integer label can be treated same priolity as pictures
*            Modified - Plugin command "WaitForCompleteSsAniamtion" will be waited until animation data loaded.
*            Fixed issues - A problem that the game will crash if execute "StopSsAnimation" plugin command to non existent label.
* v0.4.1 - RPGMV core script version 1.5.x has been supported.
*            Fixed issues - A problem that the game will crash if execute "StopSsAnimation" plugin command before animation not finish loading.
*            Fixed issues - A problem that the game will slow down if pixi.js filter is used for tinting sprite. 
*            Fixed issues - A problem that sometime the texture of animation cell that uses vertex transform does not draw. 
*            Fixed issues - A problem that changing texture of animation cell does not applied. 
* v0.4.0 - RPGMV core script version 1.4.x and community edition version 1.1b has been supported.
*            Add Plugin Parameter - Tinting with pixi.js filter
*            Modified - Calculating Sprite width and height will use JSON file parameter: CanvasWidth / CanvasHeight
* v0.3.0 - RPGMV core script version 1.3.x has been supported.
* v0.2.2 - Fixed issues - A problem that some animations does not be applied vertex deformation attributes, and A problem that some animation with legacy command does not play.
* v0.2.1 - Change animation that was created in each map and the battle so as not to play in a different scene by default (The same specifications as the picture)
* v0.2.0 - Re-creation of plugin commands / Fixed issues - A probrem that the frame rate is slowed down seriously if a tint of animation changed
* v0.1.10- Fixed issues - A problem that sometimes frame rate is slowed down seriously
* v0.1.9 - Improved consumption efficiency of the memory / SsSprite properties -  blendColor, colorTone, blendMode - , will be applied
* v0.1.8 - Fixed issues - A problem to crash when the save data which were made when this plugin is not installed is loaded
* v0.1.7 - Modified behavior when animation is stopped
* v0.1.6 - Fixed issues - A problem that animation will be glitch when has vertically fliped parts
* v0.1.5 - Fixed issues - A problem that parts' individual scale attributes aren't applied
* v0.1.4 - Modified plugin command - It can appoint the number of times to repeat animation
* v0.1.3 - Fixed issues - A problem when SsSprite had Scale property
* v0.1.2 - Modified internal process of Plugin commands
* v0.1.1 - Added Plugin commands
* v0.1.0 - First release
*/

/*:ja
* @plugindesc [v0.5.0] SpriteStudioで作成されたアニメーションを再生できるようにするプラグインです。
* @author Web Technology Corp. / Inaba Byakko
* 
* @param アニメーションフォルダ
* @desc アニメーションデータ (json/png) が設置されたフォルダのパスです。デフォルトは "img/animations/ssas" です。
* @default img/animations/ssas
*
* @param 色調変更範囲を制限する
* @desc モバイル端末のメモリ不足対策のため、アニメーションの色調変更の範囲を、各色16段階までに制限します（ON/OFF) 。
* @default OFF
*
* @param 色調変更をフィルタで行う
* @desc アニメーションの色調変更をPIXI.jsのフィルタを用いて行います（ON/OFF) 。※従来手法から色味が変わる可能性があります
* @default OFF
*
*
* @help
* ※注意
* 一部のプラグインはこのプラグインに依存しています。
* 依存プラグインを使用する際は、このプラグインよりも下の位置に
* インストールしてください。
* 
* 詳しい使い方は、GithubリポジトリのREADME.mdをお読み
* ください。
* https://github.com/InabaByakko/SSPlayerForRPGMV
*
* また、デプロイメント時に「未使用ファイルを削除」オプション
* を使用した場合、アニメーションを含むフォルダは削除されて
* しまいます。必ず、デプロイメント後にプラグインパラメータで
* 指定したフォルダを、出力先の同じ位置にコピーしてください。
* 
* プラグインコマンド:
* 　※v0.1系で使用できたプラグインコマンドは廃止になりました。
*　　（互換性維持のためとりあえず使えるようにはなっています）
*
* SSアニメーション再生 [JSONファイル名] [ラベル名] [[オプション]]
*   # アニメーションフォルダに保存されたアニメーションデータを再生します。
*   #
*   # (ラベル名は、後でアニメーションの移動や停止を行うのに必要です。）
*   # (ファイル名の ".json" は省略可能です。)
*   #  * オプション（これらの値は省略可能です）： 
*   #   (オプション名と値の間に:をはさみ、スペースは入れないでください)
*   #   - x: 表示するX座標　（省略時は0、v[変数番号]と入れると変数の値を使用）
*   #   - y: 表示するY座標　（省略時は0、v[変数番号]と入れると変数の値を使用）
*   #   - ループ: 繰り返し再生する回数　（省略時または0指定時は停止しない）
*   #   - ページ: 複数のアニメーションを1ファイルにまとめた場合、
*   #             再生するページ番号を指定
*   #   　　（先頭から数えて0、省略時は0ページ目を再生）
*   #   - アニメ名: 複数のアニメーションを1ファイルにまとめた場合、
*   #               再生するアニメーションの名前を指定
*   #       （名前は後方一致。例：chara.ssae の anime1 を再生したい場合、
*   #         chara_anime1 と入力。ページと同時指定した場合はページ優先）
*   #   - 拡大率x: X座標方向への拡大率
*   #   　　（-1000～1000%、省略時100%、負の値を指定すると左右反転します）
*   #   - 拡大率y: Y座標方向への拡大率
*   #   　　（-1000～1000%、省略時100%、負の値を指定すると左右反転します）
*   #   - 不透明度: アニメーションの不透明度　（0～255、省略時は255）
*   #   - 合成方法: アニメーションの合成方法　
*   #   　　（通常/加算/乗算/スクリーン から1つ選択、省略時は通常）
*   #   - 再生速度: アニメーションの再生速度　（1～1000%、省略時100%）
*   #   - 全シーンで表示 : 作成したアニメーションをマップとバトル両方の
*   #                      シーンで再生できるようにする
*   #
*   # 例）animdata.json に保存されたアニメーションデータを、
*   # 　「ラベル1」という名前のラベルを付けて、(300,400)の座標で
*   # 　3回繰り返して再生
*   #  SSアニメーション再生 animdata ラベル1 x:300 y:400 ループ:3
*   #
*   # ◇TIPS◇
*   # ラベル名に1以上99以下（ピクチャ表示枚数拡張をしている場合はその数）の
*   # 数値を指定することで、対応するピクチャ番号と同じ優先度でアニメーション
*   # を表示できます。また、「ピクチャの移動」「ピクチャの消去」などのイベント
*   # コマンドでアニメーションを操作可能になります。
*
* SSアニメーション移動 [ラベル名] フレーム:[フレーム数] [[オプション]]
*   # ラベル名を指定して再生したアニメーションの設定を変更します。
*   # * 必須パラメータ：
*   #  - フレーム: アニメーション移動にかけるフレーム数
*   # 
*   # * オプション：
*   # 　「SSアニメーション再生」コマンドのオプションがすべて使用可能です
*   #  - 完了までウェイト: 移動が完了するまでイベント実行を停止します
*   #
*   # 例）「ラベル1」という名前で再生したアニメーションを(200,200)の座標
*   # 　へ30フレームかけて移動し、その間イベント実行を停止する
*   #  SSアニメーション移動 ラベル1 フレーム:30 x:200 y:200 完了までウェイト
*   
* SSアニメーション完了までウェイト [ラベル名]
*   # ラベル名を指定して再生したアニメーションの再生が終了するまでウェイトします。
*   # 対象のアニメーションのループが無限の場合、このコマンドは無視されます。
*
* SSアニメーション停止 [ラベル名]
*   # ラベル名を指定して再生したアニメーションを停止します。
*   
* 
* 更新履歴：
* v0.5.0 - MVコアスクリプト バージョン1.6.xに対応
*            インスタンス・エフェクト機能を使用したアニメーションの表示に対応
*            ラベル名に数値を使用することでピクチャと同じ優先度で表示する機能の追加
*            「SSアニメーション完了までウェイト」コマンドがロード時間を含めてウェイトするように変更
*            存在しないラベルに対し「SSアニメーション停止」コマンドを実行すると強制終了する不具合を修正
* v0.4.1 - MVコアスクリプト バージョン1.5.xに対応
*            ロードが完了しないうちに「SSアニメーションの停止」プラグインコマンドを実行するとエラーになる不具合の修正
*            pixi.jsフィルタを用いた色調変更に時間がかかる不具合の修正
*            頂点変形を使用したセルのテクスチャが抜けることがある不具合の修正
*            モーションの途中でセルマップのビットマップを変更した場合に反映されない不具合の修正
* v0.4.0 - MVコアスクリプト バージョン1.4.0、及びコミュニティ版バージョン1.1b に対応
*　　　　　　　モバイル環境における色調変更の範囲を制限するオプションの追加
*　　　　　　　色調変更にpixi.jsのフィルタを利用するオプションの追加
*　　　　　　　スプライトサイズの計算にSSA JSONファイルのCanvasWidthを利用するよう変更
*　　　　　　　タイミングによって、プラグインコマンド「SSアニメーション停止」を実行時にエラーとなる場合がある不具合の修正
* v0.3.0 - MVコアスクリプト バージョン1.3.xに対応
* v0.2.2 - 一部アニメーションで頂点変形が適用されない不具合の修正、レガシーコマンドで再生したアニメーションが表示されない不具合の修正
* v0.2.1 - マップとバトルそれぞれで作成したアニメーションはデフォルトで異なるシーンで再生しないように変更（ピクチャと同じ仕様へ）
* v0.2.0 - プラグインコマンドを刷新、アニメーションの色調変更を行うと一部環境で動作が遅くなる不具合を修正
* v0.1.10- 一定の条件でフレームレートが大きく下がってしまう不具合を修正
* v0.1.9 - メモリの使用効率を向上、SsSpriteオブジェクトに設定した blendColor, colorTone, blendMode プロパティが適用されるようにした
* v0.1.8 - プロジェクトに途中から組み込んだときにセーブデータを読み込むとクラッシュする不具合を修正
* v0.1.7 - アニメーション停止時の挙動を変更
* v0.1.6 - 左右反転したパーツを含むアニメーションの表示が崩れる不具合の修正
* v0.1.5 - パーツごとのスケールアトリビュートが適用されていなかった不具合を修正
* v0.1.4 - プラグインコマンドでループ回数を指定できるよう変更
* v0.1.3 - SsSpriteにScaleを設定したときにうまく機能しなかった不具合を修正
* v0.1.2 - プラグインコマンドの内部処理を変更
* v0.1.1 - プラグインコマンドで使用できるようにした
* v0.1.0 - 最初のリリース
*/

function SSP4MV() { }
SSP4MV.parameters = PluginManager.parameters('SSPlayerForRPGMV');
SSP4MV.animationDir = String(SSP4MV.parameters['Animation File Path']
            || SSP4MV.parameters['アニメーションフォルダ']
            || "img/animations/ssas")
            + "/";
SSP4MV.tintColorLimited = (function(){
    if (SSP4MV.parameters['Limit Tint Color Range'] === 'ON' || 
        SSP4MV.parameters['色調変更範囲を制限する'] === 'ON') 
        return true;
    return false;
})();
SSP4MV.tintWithFilter = (function(){
    if (SSP4MV.parameters['Use Filter To Tint Color'] === 'ON' || 
        SSP4MV.parameters['色調変更をフィルタで行う'] === 'ON') 
        return true;
    return false;
})();
SSP4MV.canUseFilter = function() {
    if (this._canUseFilter === undefined)
        this._canUseFilter = Graphics.isWebGL() && !Utils.isMobileDevice() && SSP4MV.tintWithFilter;
    return this._canUseFilter;
};

(function () {

    // プラグインコマンドの定義
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        // 旧バージョン互換性のため残す
        if (command === "SsPlayer" && args[0] === "play") {
            $gameScreen.addToSsPlayList(args[1], new SsPlayer());
            var loop = Number(args[5] || 0);
            $gameScreen.getSsPlayerByLabel(args[1]).loadAnimation(args[2],
                    args[3], args[4], loop, 0);
            $gameScreen.getSsPlayerByLabel(args[1]).setScene();
        }
        if (command === "SsPlayer" && args[0] === "stop") {
            $gameScreen.removeSsPlayerByLabel(args[1]);
        }
        
        // 新しいプラグインコマンドを処理
        SSP4MV.processSsCommands.call(this, command, args);
    };

    //　全角英数字記号を半角へ変換
    //　http://jquery.nj-clucker.com/change-double-byte-to-half-width/
    SSP4MV.toHalfWidth = function(strVal) {
        var halfVal = strVal.replace(/[！-～]/g,
            function(tmpStr) {
                return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
            }
        );
        return halfVal.replace(/”/g, "\"").replace(/’/g, "'").replace(/‘/g, "`").replace(/￥/g, "\\").replace(/　/g, " ").replace(/〜/g, "~");
    };
    
    //　SSコマンドディスパッチャー
    SSP4MV.processSsCommands = function (command, args) {
        switch (SSP4MV.toHalfWidth(command).toUpperCase()) {
            case "SSアニメーション再生":
            case "PLAYSSANIMATION":
                SSP4MV.processSsPlay.call(this, args);
                break;
            case "SSアニメーション移動":
            case "MOVESSANIMATION":
                SSP4MV.processSsMove.call(this, args);
                break;
            case "SSアニメーション完了までウェイト":
            case "WAITFORCOMPLETESSANIMATION":
                SSP4MV.processWaitforCompletion.call(this, args);
                break;
            case "SSアニメーション停止":
            case "STOPSSANIMATION":
                SSP4MV.processSsStop.call(this, args);
                break;
        }
    };

    //　プラグインコマンドパラメータオブジェクト
    SSP4MV.SsPlayerArguments = function() {
        this.label = "";
        this.filename = "";
        this.x = 0;
        this.y = 0;
        this.loop = 0;
        this.page = null;
        this.animname = "";
        this.scaleX = 100;
        this.scaleY = 100;
        this.opacity = 255;
        this.blend = 0;
        this.speed = 1;
        this.duration = 0;
        this.waitForCompletion = false;
        this.showInAllScene = false;
    };
    
    // 現在の値からパラメータを生成
    SSP4MV.makeParamsFromCurrent = function(player) {
        var params = new SSP4MV.SsPlayerArguments();
        params.x = player._x;
        params.y = player._y;
        params.scaleX = player._scaleX;
        params.scaleY = player._scaleY;
        params.opacity = player._opacity;
        params.blendMode = player._blendMode;
        params.loop = player._loop;
        params.speed = player._step;
        return params;
    };
    SSP4MV.makeParamsFromPicture = function(player, pictureId) {
        var params = new SSP4MV.SsPlayerArguments();
        var picture = $gameScreen.picture(pictureId);
        params.x = picture.x();
        params.y = picture.y();
        params.scaleX = picture.scaleX();
        params.scaleY = picture.scaleY();
        params.opacity = picture.opacity();
        params.blendMode = picture.blendMode();
        params.loop = player._loop;
        params.speed = player._step;
        return params;
    };

    // ピクチャレイヤー上に描画するかどうか
    SSP4MV.isPictureLayer = function (label) {
        // ラベル名が整数かつピクチャIDの範囲内に収まっているか
        return !isNaN(Number(label)) &&
            Number(label) > 0 && Number(label) < $gameScreen.maxPictures();
    };

    //　SSアニメーション再生コマンド
    SSP4MV.processSsPlay = function (args) {
        var params = new SSP4MV.SsPlayerArguments();
        if (!args[0] || !args[1])
            return;
        params.filename = args[0];
        if (!/\.json$/i.test(params.filename))
            params.filename += ".json";
        params.label = args[1];
        args.slice(2, args.length).forEach(SSP4MV.processSsPlayerArgument, params);
        var player = new SsPlayer();
        $gameScreen.addToSsPlayList(params.label, player);
        player.loadAnimation(params);
        player.setScene(params);
        if (SSP4MV.isPictureLayer(params.label)) {
            $gameScreen.showPicture(Number(params.label), '__ssdummy__', 0,
                player._x, player._y, player._scaleX, player._scaleY, player._opacity, player._blendMode);
        }
    };
    
    //　SSアニメーション移動コマンド
    SSP4MV.processSsMove = function (args) {
        var player = $gameScreen.getSsPlayerByLabel(args[0]);
        if (!player)
            return;
        var params = (SSP4MV.isPictureLayer(args[0]) 
            ? SSP4MV.makeParamsFromPicture(player, args[0])
            : SSP4MV.makeParamsFromCurrent(player)
        );
        params.label = args[0];
        args.slice(1, args.length).forEach(SSP4MV.processSsPlayerArgument, params);
        if (params.duration === 0)
            return;
        player.changeAnimationPage(params);
        if (SSP4MV.isPictureLayer(args[0])){
            $gameScreen.picture(Number(args[0])).move(
                0, params.x, params.y, params.scaleX, params.scaleY,
                params.opacity, params.blendMode, params.duration
            );
        }else{
            player.move(params);
        }
        if (params.waitForCompletion)
            this.wait(params.duration);
    };
    
    //　SSアニメーション完了までウェイトコマンド
    SSP4MV.processWaitforCompletion = function (args) {
        var player = $gameScreen.getSsPlayerByLabel(args[0]);
        if (!player)
            return;
        this.setWaitMode('ssAnim');
        this._waitingSsPlayer = player;
    };
    
    //　SSアニメーション停止コマンド
    SSP4MV.processSsStop = function (args) {
        $gameScreen.removeSsPlayerByLabel(args[0]);
    };

    //　プラグインコマンドパラメータの解釈と代入（forEachのコールバックとして使用）
    SSP4MV.processSsPlayerArgument = function (val) {
        val = SSP4MV.toHalfWidth(val);
        if (val === "完了までウェイト" ||
            val.toUpperCase() === "WAITFORCOMPLETION") {
            this.waitForCompletion = true;
            return;
        }
        if (val === "全シーンで表示" ||
            val.toUpperCase() === "SHOWINALLSCENES") {
            this.showInAllScene = true;
            return;
        }
        var param = val.split(':');
        switch (param[0].toUpperCase()) {
            case "X":
                if ((/^v\[[0-9]+\]/i).test(param[1])) {
                    this.x = $gameVariables.value((/^v\[([0-9]+)\]/i).exec(param[1])[1]);
                } else {
                    this.x = Number(param[1] || 0);
                }
                break;
            case "Y":
                if ((/^v\[[0-9]+\]/i).test(param[1])) {
                    this.y = $gameVariables.value((/^v\[([0-9]+)\]/i).exec(param[1])[1]);
                } else {
                    this.y = Number(param[1] || 0);
                }
                break;
            case "ループ":
            case "LOOP":
            case "REPEAT":
                this.loop = param[1].match(/^[0-9]+/) !== null ? Number(param[1].match(/^[0-9]+/)[0]) : 0;
                break;
            case "ページ":
            case "PAGE":
                this.page = Number(param[1] || 0);
                break;
            case "アニメ名":
            case "ANIMATIONNAME":
                this.animname = String(param[1] || "");
                break;
            case "拡大率X":
            case "SCALEX":
                this.scaleX = Math.min(1000, Math.max(-1000, Number(param[1].match(/^-*[0-9]+/) !== null ? Number(param[1].match(/^-*[0-9]+/)[0]) : 100)));
                break;
            case "拡大率Y":
            case "SCALEY":
                this.scaleY = Math.min(1000, Math.max(-1000, Number(param[1].match(/^-*[0-9]+/) !== null ? Number(param[1].match(/^-*[0-9]+/)[0]) : 100)));
                break;
            case "不透明度":
            case "OPACITY":
                this.opacity = Math.min(255, Math.max(0, Number(param[1] || 255)));
                break;
            case "合成方法":
            case "BLENDTYPE":
                switch (param[1].toUpperCase()){
                    case "加算":
                    case "ADDITIVE":
                    case "ADD":
                        this.blend = Graphics.BLEND_ADD;
                        break;
                    case "乗算":
                    case "SUBTRACTION":
                    case "MULTIPLY":
                        this.blend = Graphics.BLEND_MULTIPLY;
                        break;
                    case "スクリーン":
                    case "SCREEN":
                        this.blend = Graphics.BLEND_SCREEN;
                        break;
                    default:
                        this.blend = Graphics.BLEND_NORMAL;
                        break;
                }
                break;
            case "再生速度":
            case "SPEED":
                this.speed = Math.min(10, Math.max(0.01, Number(param[1].match(/^[0-9]+/) !== null ? Number(param[1].match(/^[0-9]+/)[0]) : 100) / 100));
                break;
            case "フレーム":
            case "FRAME":
                this.duration = Math.floor(Math.max(0, Number(param[1] || 0)));
        }
    };

    // 再生完了までウェイト
    var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        var waiting = false;
        if (this._waitMode === 'ssAnim') {
            waiting = true;
            var player = this._waitingSsPlayer;
            if (player.sprite){
                if (player.sprite.getLoop() === 0) {
                    waiting = false;
                } else {
                    waiting = player.sprite.getAnimation() !== null;
                }
            }
            if (!waiting) {
                this._waitMode = '';
                this._waitingSsPlayer = null;
            }
        } else {
            waiting = _Game_Interpreter_updateWaitMode.call(this);
        }
        return waiting;
    };

    // SSアニメーション再生コマンドで使用するデータコンテナ
    function SsPlayer() {
        this.initBasic();
        this.initTarget();
    }

    // オブジェクトが作成されたシーン
    SsPlayer.SCENE_MARK = {
        all: 0,
        map: 1,
        battle: 2
    };

    SsPlayer.prototype.initBasic = function() {
        this.jsonData = null;
        this.sprite = null;
        this._page = null;
        this._animname = "";
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
        this._loop = 0;
        this._step = 1;
        this._scene = null;
    };

    SsPlayer.prototype.initTarget = function() {
        this._targetX = this._x;
        this._targetY = this._y;
        this._targetScaleX = this._scaleX;
        this._targetScaleY = this._scaleY;
        this._targetOpacity = this._opacity;
        this._duration = 0;
    };

    //　アニメーションデータを読み込んでSsSpriteを作成
    SsPlayer.prototype.loadAnimation = function (filename, x, y, loop, page) {
        var params;
        if (arguments[0] instanceof SSP4MV.SsPlayerArguments) {
            params = arguments[0];
        } else {
            // レガシーコマンド互換性維持
            params = new SSP4MV.SsPlayerArguments();
            params.filename = filename;
            params.x = x;
            params.y = y;
            params.loop = loop;
            params.page = page;
            params.showInAllScene = true;
        }
        this._page = params.page;
        this._animname = params.animname;
        this._x = params.x;
        this._y = params.y;
        this._opacity = params.opacity;
        this._scaleX = params.scaleX;
        this._scaleY = params.scaleY;
        this._blendMode = params.blend;
        this._loop = params.loop;
        this._step = params.speed;
        
        var xhr = new XMLHttpRequest();
        var url = SSP4MV.animationDir + params.filename;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function (params) {
            if (xhr.status < 400) {
                this.jsonData = JSON.parse(xhr.responseText);
                if (this._page === null)
                    this._page = this.searchPageByName(this._animname);
                if (this._page === null)
                    return;
                var imageList = new SsImageList(this.jsonData[this._page].images,
                        SSP4MV.animationDir, true);
                var animation = new SsAnimation(this.jsonData[this._page].animation,
                        imageList);
                this.sprite = new SsSprite(animation);
                this.updateSpriteStatus();
                this.sprite.setEndCallBack(function () {
                    if (this.sprite && this.sprite.getAnimation() !== null)
                        this.sprite.setAnimation(null);
                } .bind(this));
            }
        } .bind(this, params);
        xhr.send();
    };
    
    //　アニメーションデータを別ページに変更
    SsPlayer.prototype.changeAnimationPage = function (params) {
        if (!(params instanceof SSP4MV.SsPlayerArguments))
            return;
        if (params.page === null && params.animname === "")
            return;
        this._page = params.page;
        this._animname = params.animname;
        if (!this.jsonData || !(this.jsonData instanceof Array))
            return;
        if (this._page === null)
            this._page = this.searchPageByName(this._animname);
        if (!this.jsonData[this._page])
            return;
        var imageList = new SsImageList(this.jsonData[this._page].images,
                SSP4MV.animationDir, true);
        var animation = new SsAnimation(this.jsonData[this._page].animation,
                imageList);
        this.sprite.setAnimation(animation);
    };
    
    // 移動パラメータの追加
    SsPlayer.prototype.move = function(params) {
        this._targetX = params.x;
        this._targetY = params.y;
        this._targetScaleX = params.scaleX;
        this._targetScaleY = params.scaleY;
        this._targetOpacity = params.opacity;
        this._blendMode = params.blend;
        this._duration = params.duration;
        this._loop = params.loop;
        this._step = params.speed;
    };

    // ロード済みJSONデータから、指定した名前のアニメーションを後方一致で探す
    SsPlayer.prototype.searchPageByName = function(animname) {
        if (typeof animname !== "string")
            return 0;
        if (!this.jsonData || !(this.jsonData instanceof Array))
            return 0;
        var result = { animname: animname, index: 0 };
        this.jsonData.forEach(function(data, index) {
            if ((new RegExp(this.animname+"$", "i")).test(data.name)) {
                this.index = index;
                return;
            }
        }, result);
        return result.index;
    };

    //　SsSpriteオブジェクトの解放
    SsPlayer.prototype.dispose = function () {
        if (this.sprite && this.sprite.getAnimation() !== null)
            this.sprite.setAnimation(null);
        this.sprite = null;
    };
    
    // フレーム更新
    SsPlayer.prototype.update = function() {
        this.updateMove();
        this.updateSprite();
    };
    
    //　移動座標の更新
    SsPlayer.prototype.updateMove = function() {
        if (this._duration > 0) {
            var d = this._duration;
            this._x = (this._x * (d - 1) + this._targetX) / d;
            this._y = (this._y * (d - 1) + this._targetY) / d;
            this._scaleX  = (this._scaleX  * (d - 1) + this._targetScaleX)  / d;
            this._scaleY  = (this._scaleY  * (d - 1) + this._targetScaleY)  / d;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._duration--;
        }
    };
    
    // SsSpriteの更新
    SsPlayer.prototype.updateSprite = function() {
        if (this.sprite instanceof SsSprite) {
            this.sprite.x = this._x;
            this.sprite.y = this._y;
            this.sprite.scale.x = this._scaleX / 100;
            this.sprite.scale.y = this._scaleY / 100;
            this.sprite.opacity = this._opacity;
            this.sprite.blendMode = this._blendMode;
            this.updateSpriteStatus();            
        }
    };
    SsPlayer.prototype.updateSpriteStatus = function() {
        this.sprite.setStep(this._step);
        if (this.sprite.getLoop() !== this._loop)
            this.sprite.setLoop(this._loop);
    };
    
    // 現在のシーンをセット
    SsPlayer.prototype.setScene = function(params) {
        if (params instanceof SSP4MV.SsPlayerArguments && params.showInAllScene) {
            this._scene = SsPlayer.SCENE_MARK.all;
        } else if ($gameParty.inBattle()) {
            this._scene = SsPlayer.SCENE_MARK.battle;
        } else {
            this._scene = SsPlayer.SCENE_MARK.map;
        }
    };

    // 特定のシーンでアニメーションを表示できるか
    SsPlayer.prototype.isShowableInMap = function() {
        return (this._scene === SsPlayer.SCENE_MARK.all ||
            this._scene === SsPlayer.SCENE_MARK.map);
    };
    SsPlayer.prototype.isShowableInBattle = function() {
        return (this._scene === SsPlayer.SCENE_MARK.all ||
            this._scene === SsPlayer.SCENE_MARK.battle);
    };

    //　Game_Screenの初期化時にSsPlayer配列の初期化
    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function () {
        _Game_Screen_clear.call(this);
        this.clearSsPlayList();
    };

    //　SsPlayer配列の初期化
    Game_Screen.prototype.clearSsPlayList = function () {
        this._ssPlayList = {};
    };

    //　SsPlayer配列の初期化がされているか確認、されていなければ初期化
    Game_Screen.prototype.checkSsPlayListDefined = function () {
        if (this._ssPlayList === undefined)
            this.clearSsPlayList();
    };
    
    //　ラベル名を指定してSsPlayerを追加
    Game_Screen.prototype.addToSsPlayList = function (label, player) {
        this.checkSsPlayListDefined();
        if (label in this._ssPlayList && this._ssPlayList[label] instanceof SsPlayer) {
            this.removeSsPlayerByLabel(label);
        }
        this._ssPlayList[label] = player;
    };

    //　ラベル名を指定してSsPlayerの削除
    Game_Screen.prototype.removeSsPlayerByLabel = function (label) {
        this.checkSsPlayListDefined();
        if (this.getSsPlayerByLabel(label)) {
            this._ssPlayList[label].dispose();
            delete this._ssPlayList[label];
        }
    };

    //　ラベル名からSsPlayerオブジェクトを取得
    Game_Screen.prototype.getSsPlayerByLabel = function (label) {
        this.checkSsPlayListDefined();
        return this._ssPlayList[label];
    };

    //　作成済みのSsPlayerオブジェクトからSsSpriteオブジェクトを集めて返す(非ピクチャレイヤー)
    Game_Screen.prototype.getSsSprites = function () {
        this.checkSsPlayListDefined();
        var result = [];
        for (var key in this._ssPlayList) {
            var player = this._ssPlayList[key];
            if (!!player && player.sprite != null && (isNaN(Number(key)))
            && (($gameParty.inBattle() && player.isShowableInBattle())
            || (!$gameParty.inBattle() && player.isShowableInMap()))) {
                result.push(this._ssPlayList[key].sprite);
            }
        }
        return result;
    };

    var _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function(pictureId) {
        _Game_Screen_erasePicture.call(this, pictureId);
        $gameScreen.removeSsPlayerByLabel(String(pictureId));
    };

    // SsPlayerのアップデート
    var ssGameScreenUpdate = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        ssGameScreenUpdate.call(this);
        this.checkSsPlayListDefined();
        Object.keys(this._ssPlayList).forEach(function(key) {
            // ピクチャ紐付きのアニメーションの座標は更新しない
            if (!isNaN(Number(key))) return;
            var player = this._ssPlayList[key];
            if (player instanceof SsPlayer)
                player.update();
        },this);
    };

    //
    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.call(this);
        var player = $gameScreen.getSsPlayerByLabel(String(this._pictureId));
        if (!player && !this.picture()) {
            this.removeChildren();
            return;
        }
        if (player && player.sprite) {
            if (this.children.indexOf(player.sprite) < 0 && (
                ($gameParty.inBattle() && player.isShowableInBattle()) ||
                (!$gameParty.inBattle() && player.isShowableInMap())
            )) {                
                this.addChild(player.sprite);
            }
        } else {
            this.removeChildren();
        }
    };

    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function(){
        if (this._pictureName === '__ssdummy__') {
            this.bitmap = ImageManager.loadEmptyBitmap();
        } else {
            _Sprite_Picture_loadBitmap.call(this);
        }
    };

    //　SpriteSet作成時にSsSpriteオブジェクトを作成
    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function () {
        _Spriteset_Base_createUpperLayer.call(this);
        this.createSsSprites();
    };

    //　SsSpriteを格納するSpriteを作成
    Spriteset_Base.prototype.createSsSprites = function () {
        this._ssContainer = new Sprite();
        this.addChild(this._ssContainer);
    };
    
    //　SpriteSetフレーム更新
    var _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function () {
        _Spriteset_Base_update.call(this);
        this.updateSsContainer();
    };

    //　SsPlayerの状態を監視し、SsSpriteオブジェクトを更新
    Spriteset_Base.prototype.updateSsContainer = function () {
        var preparedSprites = $gameScreen.getSsSprites();
        preparedSprites.forEach(function (sprite, index) {
            if (this._ssContainer.children.indexOf(sprite) < 0) {
                this._ssContainer.addChild(sprite);
            }
        }, this);

        this._ssContainer.children.forEach(function (sprite, index) {
            if (preparedSprites.indexOf(sprite) < 0) {
                this._ssContainer.removeChild(sprite);
            }
        }, this);
    };

})();

// //////////////////////////////////////////////////////////
// SsImageList
// //////////////////////////////////////////////////////////

function SsImageList(imageFiles, aFileRoot, loadImmediately, aOnLoad) {

    this.fileRoot = aFileRoot;
    this.imagePaths = new Array();
    this.images = new Array();

    // ロード完了時に呼ばれるコールバック
    // Callback that is called when the load is finished.
    this.onLoad = aOnLoad;

    // 全部読み込まれた場合のみユーザーが設定したコールバックを呼ぶ
    // Only when it is all loaded, is called a callback set by the user.
    this.onLoad_ = function () {
        for (var i in this.images)
            if (i != null && i.complete == false)
                return;
        if (this.onLoad != null)
            this.onLoad();
    };

    for (var i = 0; i < imageFiles.length; i++) {
        var path = this.fileRoot + imageFiles[i];
        this.imagePaths.push(path);
        var image = new Image();
        if (loadImmediately) {
            image.onload = this.onLoad_;
            image.src = path;
        }
        this.images.push(image);
    }
}

// 指定したインデックスのImageを返す
// Get image at specified index.
SsImageList.prototype.getImage = function (index) {
    if (index < 0 || index >= this.images.length)
        return null;
    return this.images[index];
};

// 指定したインデックスの画像をimagePathで差し替える。
// Replace image of specified index at imagePath.
SsImageList.prototype.setImage = function (index, imagePath) {
    if (index < 0 || index >= this.images.length)
        return null;
    this.imagePaths[index] = this.fileRoot + imagePath;
    this.images[index].onload = this.onLoad_;
    this.images[index].src = this.imagePaths[index];
};

// ロード完了時コールバックを設定する
// Set a callback when load is finished.
SsImageList.prototype.setOnLoad = function (cb) {
    this.onLoad = cb;
};

// //////////////////////////////////////////////////////////
// SsPartState
// //////////////////////////////////////////////////////////

function SsPartState(name) {

    // パーツ名
    // Parts name.
    this.name = name;
    // 現在の描画Xポジション
    // Current x position at drawing.
    this.x = 0;
    // 現在の描画Yポジション
    // Current x position at drawing.
    this.y = 0;
}

// //////////////////////////////////////////////////////////
// SsPartData
// //////////////////////////////////////////////////////////
function SsPartData(dataArray) {
    this._data = dataArray;
    this._length = dataArray.length;
}

SsPartData.prototype.getPartNo = function () {
    return this._data[0];
};

SsPartData.prototype.getImageNo = function () {
    return this._data[1];
};

SsPartData.prototype.getSourceX = function () {
    return this._data[2];
};

SsPartData.prototype.getSourceY = function () {
    return this._data[3];
};

SsPartData.prototype.getSourceWidth = function () {
    return this._data[4];
};

SsPartData.prototype.getSourceHeight = function () {
    return this._data[5];
};

SsPartData.prototype.getSourcePosition = function () {
    return new Point(this.getSourceX(), this.getSourceY());
};

SsPartData.prototype.getSourceRect = function () {
    return new Rectangle(this.getSourceX(), this.getSourceY(), this.getSourceWidth(), this.getSourceHeight());
};

SsPartData.prototype.getDestX = function () {
    return this._data[6];
};

SsPartData.prototype.getDestY = function () {
    return this._data[7];
};

SsPartData.prototype.getDestPosition = function () {
    return new Point(this.getDestX(), this.getDestY());
};

SsPartData.prototype.getDestAngle = function () {
    return this._data[8];
};

SsPartData.prototype.getDestScaleX = function () {
    return this._data[9];
};

SsPartData.prototype.getDestScaleY = function () {
    return this._data[10];
};

SsPartData.prototype.getOriginX = function () {
    return ((this._length > 11) ? this._data[11] : 0);
};

SsPartData.prototype.getOriginY = function () {
    return ((this._length > 12) ? this._data[12] : 0);
};

SsPartData.prototype.getOrigin = function () {
    return new Point(this.getOriginX(), this.getOriginY());
};

SsPartData.prototype.getFlipHorizontal = function () {
    return ((this._length > 13) ? (this._data[13] != 0 ? -1 : 1) : 1);
};

SsPartData.prototype.getFlipVertical = function () {
    return ((this._length > 14) ? (this._data[14] != 0 ? -1 : 1) : 1);
};

SsPartData.prototype.getAlpha = function () {
    return ((this._length > 15) ? this._data[15] : 1.0);
};

SsPartData.prototype.getBlend = function () {
    return ((this._length > 16) ? this._data[16] : 0);
};

SsPartData.prototype.getTranslates = function () {
    return [
        (this._length > 17) ? this._data[17] : 0,
        (this._length > 18) ? this._data[18] : 0,
        (this._length > 19) ? this._data[19] : 0,
        (this._length > 20) ? this._data[20] : 0,
        (this._length > 21) ? this._data[21] : 0,
        (this._length > 22) ? this._data[22] : 0,
        (this._length > 23) ? this._data[23] : 0,
        (this._length > 24) ? this._data[24] : 0
    ];
};

SsPartData.prototype.hasTranslates = function () {
    if (this._length >= 17 &&
        (this._data.slice(17, 24).some(function(i){return (i !== 0);})))
        return true;
    return false;
};

// //////////////////////////////////////////////////////////
// SsAnimation
// //////////////////////////////////////////////////////////

function SsAnimation(ssaData, imageList) {

    this.ssaData = ssaData;
    this.imageList = imageList;

    this.partsMap = new Array();
    this.parts = ssaData.parts;
    for (var i = 0; i < this.parts.length; i++) {
        this.partsMap[this.parts[i]] = i;
    }
    this._bitmaps = {};
    this._partSprites = new Array();
    this._partMeshs = new Array();
}

// このアニメーションのFPS
// This animation FPS.
SsAnimation.prototype.getFPS = function () {
    return this.ssaData.fps;
};

// トータルフレーム数を返す
// Get total frame count.
SsAnimation.prototype.getFrameCount = function () {
    return this.ssaData.ssa.length;
};

// パーツリストを返す
// Get parts list.
SsAnimation.prototype.getParts = function () {
    return this.ssaData.parts;
};

// パーツ名からNoを取得するマップを返す
// Return the map, to get the parts from number.
SsAnimation.prototype.getPartsMap = function () {
    return this.partsMap;
};

// 基準枠の幅・高さ・原点情報があれば返す
SsAnimation.prototype.getCanvasWidth = function () {
    return (this.ssaData.CanvasWidth ? this.ssaData.CanvasWidth : 0);
};
SsAnimation.prototype.getCanvasHeight = function () {
    return (this.ssaData.CanvasHeight ? this.ssaData.CanvasHeight : 0);
};
SsAnimation.prototype.getMarginWidth = function () {
    return (this.ssaData.MarginWidth ? this.ssaData.MarginWidth : 0);
};
SsAnimation.prototype.getMarginHeight = function () {
    return (this.ssaData.MarginHeight ? this.ssaData.MarginHeight : 0);
};

// 画像ファイル名からBitmapオブジェクトをロード
// Return a Bitmap object from file path.
SsAnimation.prototype.getBitmap = function (filepath, hue, blendColor, colorTone) {
    // 判定が重いのでキャッシュ
    if (this._isMobileDevice === undefined)
        this._isMobileDevice = Utils.isMobileDevice();
    
    if (!Array.isArray(blendColor))
        blendColor = [0, 0, 0, 0];
    if (!Array.isArray(colorTone))
        colorTone = [0, 0, 0, 0];
    // 色調変更範囲制限がONかつモバイル端末の場合は16段階に制限
    if (SSP4MV.tintColorLimited && this._isMobileDevice) {
        for (var i=0; i < 4; i++) {
            blendColor[i] = Math.round(blendColor[i]/16) * 16;
            colorTone[i] = Math.round(colorTone[i]/16) * 16;
        }
    }

    // 画像をファイルパスから読み込んでキャッシュ
    if (!this._bitmaps[filepath + String(hue)]) {
        var filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1).replace(new RegExp('.png$', 'g'), "");
        var dirname = filepath.replace(/\\/g, '/').replace(/\/[^\/]*$/, '') + '/';
        var bitmap = ImageManager.loadBitmap(dirname, filename, hue, true);
        this._bitmaps[filepath + String(hue)] = bitmap;
    }

    // WebGLモードで色調変更にフィルタを用いる場合、色調変更はSprite側に任せるのでそのまま返す
    if (!this._bitmaps[filepath + String(hue)].isReady || SSP4MV.canUseFilter()) {
        return this._bitmaps[filepath + String(hue)]
    } else {
        // blendColor / colorTone が指定されたとき、着色処理したビットマップをキャッシュ
        if (!this._bitmaps[filepath + String(hue) + blendColor.join('') + colorTone.join('')]) {
            if (blendColor.some(function(i){return i != 0}) || colorTone.some(function(i){return i != 0})) {
                var tinted = this.createTintedBitmap(this._bitmaps[filepath + String(hue)], colorTone, blendColor);
                if (tinted !== null) {
                    this._bitmaps[filepath + String(hue) + blendColor.join('') + colorTone.join('')] = tinted;
                }else{
                    blendColor = [0, 0, 0, 0];
                    colorTone = [0, 0, 0, 0];
                }
            } else {
                this._bitmaps[filepath + String(hue) + blendColor.join('') + colorTone.join('')] =
                    this._bitmaps[filepath + String(hue)];
            }
        }
    }
    return this._bitmaps[filepath + String(hue) + blendColor.join('') + colorTone.join('')];
};

// パーツNoから生成済のSpriteオブジェクトを呼び出すか、ない場合は新規作成して返す
// Return a Sprite object of the generated from partNo. If there is no return to create a new one.
SsAnimation.prototype.getPartSprite = function (partNo, bitmap, subPartNo) {
    if (partNo <= 1 && typeof subPartNo === 'number') {
        if (!Array.isArray(this._partSprites[partNo])) this._partSprites[partNo] = []; 
        if (!this._partSprites[partNo][subPartNo]) {
            this._partSprites[partNo][subPartNo] = new Sprite(bitmap);
        }else {
            this._partSprites[partNo][subPartNo].bitmap = bitmap;
        }
        return this._partSprites[partNo][subPartNo];
    } else {
        if (!this._partSprites[partNo]) {
            this._partSprites[partNo] = new Sprite(bitmap);
        }else {
            this._partSprites[partNo].bitmap = bitmap;
        }
        return this._partSprites[partNo];
    }
};

// パーツNoから生成済のStripオブジェクトを呼び出すか、ない場合は新規作成して返す
// Return a Strip object of the generated from partNo. If there is no return to create a new one.
SsAnimation.prototype.getPartMesh = function (partNo, bitmap, subPartNo) {
    if (partNo <= 1 && typeof subPartNo === 'number') {
        if (!Array.isArray(this._partMeshs[partNo])) this._partMeshs[partNo] = []; 
        if (!this._partMeshs[partNo][subPartNo]) {
            this._partMeshs[partNo][subPartNo] = this.createNewMesh(bitmap);
        // bitmapの状態が変わったとき作り直す
        } else if ((this._partMeshs[partNo][subPartNo].texture._bitmapUrl !== bitmap.url) ||
                    (!this._partMeshs[partNo][subPartNo].texture._bitmapReady && bitmap.isReady())) {
            this._partMeshs[partNo][subPartNo].destroy();
            this._partMeshs[partNo][subPartNo] = this.createNewMesh(bitmap);
        }
        return this._partMeshs[partNo][subPartNo];
    } else {
        if (!this._partMeshs[partNo]) {
            this._partMeshs[partNo] = this.createNewMesh(bitmap);
        // bitmapの状態が変わったとき作り直す
        } else if ((this._partMeshs[partNo].texture._bitmapUrl !== bitmap.url) ||
                    (!this._partMeshs[partNo].texture._bitmapReady && bitmap.isReady())) {
            this._partMeshs[partNo].destroy();
            this._partMeshs[partNo] = this.createNewMesh(bitmap);
        }
        return this._partMeshs[partNo];
    }
};

// Meshオブジェクトの新規作成
// Create a new Mesh object.
SsAnimation.prototype.createNewMesh = function(bitmap) {
        var verts = new Float32Array([0, 0, 300, 0, 0, 300, 400, 400]);
        var uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
        var triangles = new Uint16Array([0, 1, 2, 3, 2, 1]);
    var mesh = new PIXI.mesh.Mesh(new PIXI.Texture(bitmap.baseTexture), verts, uvs, triangles,
        PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);
    mesh.texture._bitmapUrl = bitmap.url;
    mesh.texture._bitmapReady = bitmap.isReady();
    
    return mesh;
};

// 描画メソッド
// Draw method.
SsAnimation.prototype.getPartSprites = function (frameNo, flipH, flipV,
        partStates, scale, hue, blendColor, colorTone) {
    var sprites = [];
    var subSpriteNum = [0,0];
    var subMeshNum = [0,0];

    var blendOperations = new Array(PIXI.BLEND_MODES.NORMAL, PIXI.BLEND_MODES.MULTIPLY, PIXI.BLEND_MODES.ADD,
            PIXI.BLEND_MODES.DIFFERENCE);

    var frameData = this.ssaData.ssa[frameNo];
    var frameLength = frameData.length;
    for (var refNo = 0; refNo < frameLength; refNo++) {

        var partData = new SsPartData(frameData[refNo]);

        var partNo = partData.getPartNo();
        var bitmap = this.getBitmap(this.imageList.imagePaths[partData.getImageNo()], hue, blendColor, colorTone);
        var sx = partData.getSourceX();
        var sy = partData.getSourceY();
        var sw = partData.getSourceWidth();
        var sh = partData.getSourceHeight();
        var dx = partData.getDestX();
        var dy = partData.getDestY();

        var vdw = sw;
        var vdh = sh;

        if (sw > 0 && sh > 0) {

            var dang = partData.getDestAngle();
            var scaleX = partData.getDestScaleX();
            var scaleY = partData.getDestScaleY();

            var ox = partData.getOriginX();
            var oy = partData.getOriginY();
            var fh = partData.getFlipHorizontal();
            var fv = partData.getFlipVertical();
            var alpha = partData.getAlpha();
            var blend = partData.getBlend();
            var translate = partData.getTranslates();

            var spr_part;
            // 頂点変形データがあるかないかでSpriteとMeshを分ける
            if (partData.hasTranslates()) {
                if (partNo <= 1) {
                    subMeshNum[partNo] += 1;
                    spr_part = this.getPartMesh(partNo, bitmap, subMeshNum[partNo]);
                } else {
                    spr_part = this.getPartMesh(partNo, bitmap);
                }
                var texW = bitmap.width;
                var texH = bitmap.height;
                var verts = new Float32Array([
                    (-ox + translate[0]), (-oy + translate[1]),
                    (sw - ox + translate[2]), (-oy + translate[3]), 
                    (-ox + translate[4]), (sh - oy + translate[5]), 
                    (sw - ox + translate[6]), (sh - oy + translate[7])
                    ]);
                var uvs = new Float32Array([
                (sx + (fh == -1 ? sw : 0)) / texW, (sy + (fv == -1 ? sh : 0)) / texH,
                (sx + (fh == -1 ? 0 : sw)) / texW, (sy + (fv == -1 ? sh : 0)) / texH,
                (sx + (fh == -1 ? sw : 0)) / texW, (sy + (fv == -1 ? 0 : sh)) / texH,
                (sx + (fh == -1 ? 0 : sw)) / texW, (sy + (fv == -1 ? 0 : sh)) / texH
                ]);

                for (var i=0; i<8; i++) {
                    spr_part.vertices[i] = verts[i];
                    spr_part.uvs[i] = uvs[i];
                }
                spr_part.dirty = true;
                spr_part.scale = new PIXI.Point(scaleX, scaleY);
                spr_part.alpha = alpha;
            } else {
                if (partNo <= 1) {
                    subSpriteNum[partNo] += 1;
                    spr_part = this.getPartSprite(partNo, bitmap, subSpriteNum[partNo]);
                } else {
                    spr_part = this.getPartSprite(partNo, bitmap);
                }
                spr_part.setFrame(sx, sy, sw, sh);
                spr_part.anchor = new PIXI.Point(ox * 1.0 / sw, oy * 1.0 / sh);
                if (fh == -1)
                    spr_part.anchor.x = 1 - spr_part.anchor.x;
                if (fv == -1)
                    spr_part.anchor.y = 1 - spr_part.anchor.y;
                spr_part.scale = new PIXI.Point(scaleX * fh, scaleY * fv);
                spr_part.opacity = Math.round(255 * alpha);
            }
            spr_part.blendMode = blendOperations[blend];
            spr_part.position = partData.getDestPosition();
            spr_part.rotation = -dang;

            sprites.push(spr_part);

        }

        var state = partStates[partNo];
        state.x = dx;
        state.y = dy;
    }

    return sprites;
};

// 着色済みビットマップを生成
// Create tinted Bitmap object.
SsAnimation.prototype.createTintedBitmap = function (bitmap, tone, color) {
    var x = 0, y = 0;
    w = bitmap.width; 
    h = bitmap.height;
    var newBitmap = new Bitmap(bitmap.width, bitmap.height);
    var context = newBitmap.context;

    context.globalCompositeOperation = 'copy';
    try {
        context.drawImage(bitmap.canvas, x, y, w, h, 0, 0, w, h);

        if (Graphics.canUseSaturationBlend()) {
            var gray = Math.max(0, tone[3]);
            context.globalCompositeOperation = 'saturation';
            context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
            context.fillRect(0, 0, w, h);
        }

        var r1 = Math.max(0, tone[0]);
        var g1 = Math.max(0, tone[1]);
        var b1 = Math.max(0, tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
        context.fillRect(0, 0, w, h);

        if (Graphics.canUseDifferenceBlend()) {
            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);

            var r2 = Math.max(0, -tone[0]);
            var g2 = Math.max(0, -tone[1]);
            var b2 = Math.max(0, -tone[2]);
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
            context.fillRect(0, 0, w, h);

            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);
        }

        var r3 = Math.max(0, color[0]);
        var g3 = Math.max(0, color[1]);
        var b3 = Math.max(0, color[2]);
        var a3 = Math.max(0, color[3]);
        context.globalCompositeOperation = 'source-atop';
        context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
        context.globalAlpha = a3 / 255;
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = 'destination-in';
        context.globalAlpha = 1;
        context.drawImage(bitmap.canvas, x, y, w, h, 0, 0, w, h);
    } catch (e) {
        console.log("An error occured while drawing tinted bitmap: "+e);
        newBitmap = null;
    }

    return newBitmap;
};

// ビットマップのロードが完了しているかを返す
// Return whether bitmap loading is completed.
SsAnimation.prototype.isReady = function () {
    if (Object.keys(this._bitmaps).length === 0) return false;
    var result = true;
    for (var key in this._bitmaps){
        if (this._bitmaps.hasOwnProperty(key) && this._bitmaps[key] instanceof Bitmap) {
            result = result && this._bitmaps[key].isReady();
        }
    }
    return result;
}

// //////////////////////////////////////////////////////////
// ColorBlendFilter
// //////////////////////////////////////////////////////////

ColorBlendFilter = function () {
    var fragmentSrc = `
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float blendColor[4];
void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    if (color.a > 0.0) {
        float deltaR = (blendColor[0] - color.r ) * blendColor[3];
        float deltaG = (blendColor[1] - color.g ) * blendColor[3];
        float deltaB = (blendColor[2] - color.b ) * blendColor[3];
        color.r += deltaR;
        color.g += deltaG;
        color.b += deltaB;
        color.rgb *= color.a;
    }
    gl_FragColor = color;
}
`;

    PIXI.Filter.call(this,
        // vertex shader
        null,
        // fragment shader
        fragmentSrc,
        // custom uniforms
    　　 {blendColor : { type: '4fv', value: new Float32Array([0, 0, 0, 0]) }}
    );
};

ColorBlendFilter.prototype = Object.create(PIXI.Filter.prototype);
ColorBlendFilter.prototype.constructor = PIXI.filters.MyFilter;

ColorBlendFilter.prototype.setBlendColor = function (values) {
    var r = Math.min(Math.max((values[0] || 0), -255), 255) / 255;
    var g = Math.min(Math.max((values[1] || 0), -255), 255) / 255;
    var b = Math.min(Math.max((values[2] || 0), -255), 255) / 255;
    var a = Math.min(Math.max((values[3] || 0), 0), 255) / 255;
    this.uniforms.blendColor[0] = r;
    this.uniforms.blendColor[1] = g;
    this.uniforms.blendColor[2] = b;
    this.uniforms.blendColor[3] = a;
};

// //////////////////////////////////////////////////////////
// SsSprite
// //////////////////////////////////////////////////////////

function SsSprite(animation, hue) {
    Sprite.call(this);

    // プライベート変数
    // Private variables.
    this.inner = {
        animation: null,
        playingFrame: 0,
        prevDrawnTime: 0,
        step: 1,
        loop: 0,
        loopCount: 0,
        hue: Number(hue || 0),
        endCallBack: null, // draw end callback
        // isPlaying: false,

        partStates: null,
        initPartStates: function () {
            this.partStates = null;
            if (this.animation != null) {
                var parts = this.animation.getParts();
                var states = new Array();
                for (var i = 0; i < parts.length; i++) {
                    states.push(new SsPartState(parts[i]));
                }
                this.partStates = states;
            }
        }
    };

    this.x = 0;
    this.y = 0;
    this.anchor = new PIXI.Point(0, 0);
    this.inner.initPartStates();
    this.setAnimation(animation);

}

SsSprite.prototype = Object.create(Sprite.prototype);
SsSprite.prototype.constructor = SsSprite;

// ※未実装
// *Not implemented.
SsSprite.prototype.flipH = false;
SsSprite.prototype.flipV = false;

// アニメーションの設定
// Set animation.
SsSprite.prototype.setAnimation = function (animation) {
    this.inner.animation = animation;
    this.inner.initPartStates();
    this.inner.playingFrame = 0;
    this.inner.prevDrawnTime = 0;
    this.clearLoopCount();
};

// アニメーションの取得
// Get animation.
SsSprite.prototype.getAnimation = function () {
    return this.inner.animation;
};

// 再生フレームNoを設定
// Set frame no of playing.
SsSprite.prototype.setFrameNo = function (frameNo) {
    this.inner.playingFrame = frameNo;
    this.inner.prevDrawnTime = 0;
};

// 再生フレームNoを取得
// Get frame no of playing.
SsSprite.prototype.getFrameNo = function () {
    return this.inner.playingFrame >> 0;
};

// 再生スピードを設定 (1:標準)
// Set speed to play. (1:normal speed)
SsSprite.prototype.setStep = function (step) {
    this.inner.step = step;
};

// 再生スピードを取得
// Get speed to play. (1:normal speed)
SsSprite.prototype.getStep = function () {
    return this.inner.step;
};

// ループ回数の設定 (0:無限)
// Set a playback loop count. (0:infinite)
SsSprite.prototype.setLoop = function (loop) {
    if (loop < 0)
        return;
    this.inner.loop = loop;
};

// ループ回数の設定を取得
// Get a playback loop count of specified. (0:infinite)
SsSprite.prototype.getLoop = function () {
    return this.inner.loop;
};

// 現在の再生回数を取得
// Get repeat count a playback.
SsSprite.prototype.getLoopCount = function () {
    return this.inner.loopCount;
};

// 現在の再生回数をクリア
// Clear repeat count a playback.
SsSprite.prototype.clearLoopCount = function () {
    this.inner.loopCount = 0;
};

// アニメーション終了時のコールバックを設定
// Set the call back at the end of animation.
SsSprite.prototype.setEndCallBack = function (func) {
    this.inner.endCallBack = func;
};

// パーツの状態（現在のX,Y座標など）を取得
// Gets the state of the parts. (Current x and y positions)
SsSprite.prototype.getPartState = function (name) {
    if (this.inner.partStates == null)
        return null;

    var partsMap = this.inner.animation.getPartsMap();
    var partNo = partsMap[name];
    if (partNo == null)
        return null;
    return this.inner.partStates[partNo];
};

// 幅、高さを取得
SsSprite.prototype.getWidth = function() {
    if (!this.inner.animation) return 0;    
    return (this.inner.animation.getCanvasWidth() ? this.inner.animation.getCanvasWidth() : this.frameWidth())
};

SsSprite.prototype.getHeight = function() {
    if (!this.inner.animation) return 0;    
    return (this.inner.animation.getCanvasHeight() ? this.inner.animation.getCanvasHeight() : this.frameHeight())
};


// 幅、高さを取得（現フレームのおおよその値）
// Get width and height (inaccuracy value) of this frame.
SsSprite.prototype.frameWidth = function () {
    var min = 0, max = 0;
    if (!Array.isArray(this.inner.partStates)) return 0;
    for (var i = 0; i < this.inner.partStates.length; i++) {
        if (min < this.inner.partStates[i].x) min = this.inner.partStates[i].x;
        if (max > this.inner.partStates[i].x) max = this.inner.partStates[i].x;
    }
    return Math.abs(max - min);
};
SsSprite.prototype.frameHeight = function () {
    var min = 0, max = 0;
    if (!Array.isArray(this.inner.partStates)) return 0;
    for (var i = 0; i < this.inner.partStates.length; i++) {
        if (min < this.inner.partStates[i].y) min = this.inner.partStates[i].y;
        if (max > this.inner.partStates[i].y) max = this.inner.partStates[i].y;
    }
    return Math.abs(max - min);
};

// 色相
// Hue of Sprite
Object.defineProperty(SsSprite.prototype, 'hue', {
    get: function () {
        return this.inner.hue;
    },
    set: function (value) {
        this.inner.hue = Math.max(0, Math.min(359, value));
    },
    configurable: true
});

// 現在再生中か
SsSprite.prototype.isPlaying = function () {
    if (this.inner.loop == 0) {
        return true;
    } else if (this.inner.loop > this.inner.loopCount) {
        return true;
    }
    return false;
};

SsSprite.prototype._needsTint = function() {
    if (SSP4MV.canUseFilter()) {
        return false;
    }
    return Sprite.prototype._needsTint.call(this);
};

// 描画実行
// Drawing method.
SsSprite.prototype.update = function () {
    if (this.children.length > 0) {
        this.removeChildren(0, this.children.length);
    }

    if (!this.inner.animation)
        return;

    if (this.isPlaying()) {
        // フレームを進める
        // To next frame.
        this.inner.playingFrame += (1.0 / (60 / this.inner.animation.getFPS()))
                * this.inner.step;

        var c = (this.inner.playingFrame / this.inner.animation.getFrameCount()) >> 0;

        if (this.inner.step >= 0) {
            if (this.inner.playingFrame >= this.inner.animation.getFrameCount()) {
                // ループ回数更新
                // Update repeat count.
                this.inner.loopCount += c;
                if (this.inner.loop == 0
                        || this.inner.loopCount < this.inner.loop) {
                    // フレーム番号更新、再生を続ける
                    // Update frame no, and playing.
                    this.inner.playingFrame %= this.inner.animation
                            .getFrameCount();
                } else {
                    // 再生停止、最終フレームへ
                    // Stop animation, to last frame.
                    this.inner.playingFrame = this.inner.animation
                            .getFrameCount() - 1;
                    // 停止時コールバック呼び出し
                    // Call finished callback.
                    if (this.inner.endCallBack != null) {
                        this.inner.endCallBack();
                    }
                }
            }
        } else {
            if (this.inner.playingFrame < 0) {
                // ループ回数更新
                // Update repeat count.
                this.inner.loopCount += 1 + -c;
                if (this.inner.loop == 0
                        || this.inner.loopCount < this.inner.loop) {
                    // フレーム番号更新、再生を続ける
                    // Update frame no, and playing.
                    this.inner.playingFrame %= this.inner.animation
                            .getFrameCount();
                    if (this.inner.playingFrame < 0)
                        this.inner.playingFrame += this.inner.animation
                                .getFrameCount();
                } else {
                    // 再生停止、最終フレームへ
                    // Stop animation, to last frame.
                    this.inner.playingFrame = this.inner.animation
                            .getFrameCount() - 1;
                    // 停止時コールバック呼び出し
                    // Call finished callback.
                    if (this.inner.endCallBack != null) {
                        this.inner.endCallBack();
                    }
                }
            }
        }
    } else {
        // // 再生停止
        // // Stop animation.
        //this.inner.playingFrame = 0;
    }
    if (this.inner.animation) {
        this.inner.animation.getPartSprites(this.getFrameNo(), this.flipH,
            this.flipV, this.inner.partStates, this.scale, this.inner.hue,
            this.getBlendColor(), this.getColorTone()).forEach(
                function(val, index, ar) {
                    if (this.blendMode != 0) {
                        val.blendMode = this.blendMode;
                        if (val._toneFilter instanceof ToneFilter)
                            val._toneFilter.blendMode = this.blendMode;
                        if (val._blendFilter instanceof ColorBlendFilter)
                            val._blendFilter.blendMode = this.blendMode;
                    }
                    this.addChild(val);
                }, this);

        // WebGLモードで色調変更にフィルタを用いる場合、フィルタを適用
        if (SSP4MV.canUseFilter()) {
            if (! this._toneFilter) {
                this._toneFilter = new ToneFilter();
                this.filters = [this._toneFilter];
            }
            var colorTone = this.getColorTone();
            this._toneFilter.reset();
            this._toneFilter.adjustTone(colorTone[0],colorTone[1],colorTone[2]);
            this._toneFilter.adjustSaturation(colorTone[3] * -1);
            if (!this._blendFilter) {
                this._blendFilter = new ColorBlendFilter();
                this.filters = [this._toneFilter, this._blendFilter];
            }
            this._blendFilter.setBlendColor(this.getBlendColor());
        }
    }
};
