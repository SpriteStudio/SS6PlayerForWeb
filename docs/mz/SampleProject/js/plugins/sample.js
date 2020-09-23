(() => {
    /*:
    * @target MZ
    * @plugindesc sample
    * @author help
    * @help aaa
    * @url https:///
    * 
    * 
    * @command set
    * @text セット
    * @desc パラメータの説明
    */
    'use strict';
    const pluginName = "sample";
    let textPictureText = "";

    PluginManager.registerCommand(pluginName, "set", function(args) {
        textPictureText = String(args.text);
        console.log(this);
    });
})();