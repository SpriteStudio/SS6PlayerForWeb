class Ss6Player extends pc.ScriptType {
    initialize() {
        // console.log(this.ssfb);
        // console.log(this.textures);
        // console.log(this.animePackName);
        // console.log(this.animeName);
        if (this.ssfb && this.textures && this.animePackName && this.animeName) {
            this.entity.addComponent("ss6player", {
                ssfbAsset: this.ssfb.id,
                textureAssets: this.textures.map(function (a) {
                    return a.id;
                }),
                animePackName: this.animePackName,
                animeName: this.animeName
            });
        }
    }
}
pc.registerScript(Ss6Player, 'ss6player');
Ss6Player.attributes.add("ssfb", { type: "asset", assetType: "binary"});
Ss6Player.attributes.add("textures", { type: "asset", array: true, assetType: "texture" });
Ss6Player.attributes.add("animePackName", { type: "string", default: "" });
Ss6Player.attributes.add("animeName", { type: "string", default: "" });

