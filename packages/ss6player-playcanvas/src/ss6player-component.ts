import {SS6Player} from './ss6player';
import {Application, Asset, AssetRegistry, Component, ComponentSystem, Entity, GraphNode, Model} from 'playcanvas';

export const SS6PlayerComponentProperties = [
  'enabled',
  'ssfbAsset',
  'textureAssets',
  'animePackName',
  'animeName',
  'ss6player',
  'ssfbData',
  'textures'
];

export class SS6PlayerComponent extends Component {
  // enabled: boolean = true;

  /*
  private _enabled: boolean = true;
  private _ssfbAsset: number | Asset = null;
  private _textureAssets: (number | Asset)[] = null;
  private _animePackName: string = null;
  private _animeName: string = null;

  private _ss6player: SS6Player = null;
  private _ssfbData: Uint8Array = null;
  private _textures: any[] = [];

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(value: boolean) {
    this._enabled = value;
  }

  get ssfbAsset(): number | Asset {
    return this._ssfbAsset;
  }
  set ssfbAsset(value: number | Asset) {
    this._ssfbAsset = value;
  }

  get textureAssets(): (number | Asset)[] {
    return this._textureAssets;
  }
  set textureAssets(value: (number | Asset)[]) {
    this._textureAssets = value;
  }

  get animePackName(): string {
    return this._animePackName;
  }
  set animePackName(value: string) {
    this._animePackName = value;
  }

  get animeName(): string {
    return this._animeName;
  }
  set animeName(value: string) {
    this._animeName = value;
  }

  get ss6player(): SS6Player {
    return this._ss6player;
  }
  set ss6player(value: SS6Player) {
    this._ss6player = value;
  }

  get ssfbData(): Uint8Array {
    return this._ssfbData;
  }
  set ssfbData(value: Uint8Array) {
    this._ssfbData = value;
  }

  get textures(): any[] {
    return this._textures;
  }
  set textures(value: any[]) {
    this._textures = value;
  }
   */

  constructor(system: ComponentSystem, entity: Entity) {
    super(system, entity);

    this.on('set_ssfbAsset', this.onSetAsset, this);
    this.on('set_textureAssets', this.onSetAssets, this);
    this.on('set_animePackName', this.onAnimePackName, this);
    this.on('set_animeName', this.onSetAnimeName, this);

    // resources for ss6player instance
    this.on('set_ssfbData', this.onSetResource, this);
    this.on('set_textures', this.onSetResource, this);
  }

  private _createSS6Player() {
    console.log('_createSS6Player');
    if (this.data.ss6player) {
      this.data.ss6player.destroy();
      this.data.ss6player = null;
    }

    let textureData: { [key: string]: any; } = {};
    let i;
    let n;
    for (i = 0, n = this.data.textureAssets.length; i < n; i++) {
      const assetId = this.data.textureAssets[i] instanceof Asset ? this.data.textureAssets[i].id : this.data.textureAssets[i];
      const asset = this.system.app.assets.get(assetId);
      console.log(asset);
      let path = asset.name ? asset.name : asset.file ? asset.file.filename : null;
      // Fallback if filename doesn't exist
      if (!path) {
        path = path.getBasename(asset.file.url);
      }
      let query = path.indexOf('?');
      if (query !== -1) {
        path = path.substring(0, query);
      }
      textureData[path] = asset.resource;
    }
    console.log(textureData);
    this.data.ss6player = new SS6Player(this.system.app, this.data.ssfbData, textureData);
    this.entity.addChild(this.data.ss6player._node);
  }

  onAssetChanged(asset, attribute, newValue, oldValue) {
    // empty
  }

  onAssetRemoved(asset) {
    // empty
  }

  onEnable() {
    super.onEnable();

    const ss6player = this.data.ss6player;
    if (ss6player) {
      ss6player.addToLayers();
    }
  }

  onDisable() {
    this.onDisable();

    const ss6player = this.data.ss6player;
    if (ss6player) {
      ss6player.removeFromLayers();
    }
  }

  hide() {
    if (this.data.ss6player) {
      this.data.ss6player.hide();
    }
  }

  show() {
    if (this.data.ss6player) {
      this.data.ss6player.show();
    }
  }

  removeComponent() {
    // TODO:
    /*
    let asset;

    if (this.atlasAsset) {
      asset = this.system.app.assets.get(this.atlasAsset);
      if (asset) {
        asset.off("change", this.onAssetChanged);
        asset.off("remove", this.onAssetRemoved);
      }
    }

    if (this.skeletonAsset) {
      asset = this.system.app.assets.get(this.skeletonAsset);
      if (asset) {
        asset.off("change", this.onAssetChanged);
        asset.off("remove", this.onAssetRemoved);
      }
    }

    if (this.textureAssets && this.textureAssets.length) {
      for (var i = 0; i < this.textureAssets.length; i++) {
        asset = this.system.app.assets.get(this.textureAssets[i]);
        if (asset) {
          asset.off("change", this.onAssetChanged);
          asset.off("remove", this.onAssetRemoved);
        }
      }
    }
     */
  }

  onSetAsset(name: string, oldValue: number | Asset, newValue: number | Asset): void {
    const registry: AssetRegistry = this.system.app.assets;
    let asset: Asset = null;
    if (oldValue) {
      asset = registry.get(oldValue as number);
      if (asset) {
        asset.off('change', this.onAssetChanged);
        asset.off('remove', this.onAssetRemoved);
      }
    }

    if (newValue) {
      let id = newValue;
      if (newValue instanceof Asset) {
        id = newValue.id;
        this.data[name] = id;
      }
      asset = registry.get(id as number);
      if (asset) {
        this._onAssetAdd(asset);
      } else {
        console.log(id);
        // const a: string = 'add:' + id;
        // registry.on(a);
      }
    }
  }

  onAnimePackName(name: string, oldValue: number | Asset, newValue: number | Asset): void {
  }

  onSetAnimeName(name: string, oldValue: number | Asset, newValue: number | Asset): void {
  }

  private onSetResource() {
    console.log(this.data.ssfbData);
    console.log(this.data.textures.length);
    if (this.data.ssfbData && this.data.textures.length) {
      this._createSS6Player();
    }
  }

  private onSetAssets(name: string, oldValue: (number | Asset)[], newValue: (number | Asset)[]) {
    const registry: AssetRegistry = this.system.app.assets;
    let asset = null;
    let i: number;
    let n: number;
    if (oldValue !== null && oldValue.length) {
      n = oldValue.length;
      for (i = 0; i < n; i++) {
        asset = registry.get(oldValue[i] as number);
        if (asset) {
          asset.off('change', this.onAssetChanged);
          asset.off('remove', this.onAssetRemoved);
        }
      }
    }

    if (newValue && newValue.length) {
      let ids: number[] = newValue.map(function (v) {
        if (v instanceof Asset) {
          return v.id;
        }
        return v;
      });

      for (i = 0, n = newValue.length; i < n; i++) {
        asset = registry.get(ids[i]);
        // console.log("ids: " + ids[i]);
        if (asset) {
          this._onAssetAdd(asset);
        } else {
          // TODO:
          // registry.on()
        }
      }
    }
  }

  private _onAssetAdd(asset: Asset) {
    asset.off('change', this.onAssetChanged, this);
    asset.on('change', this.onAssetChanged, this);

    asset.off('remove', this.onAssetRemoved, this);
    asset.on('remove', this.onAssetRemoved, this);

    asset.ready(this._onAssetReady, this);
    this.system.app.assets.load(asset);
  }

  private _onAssetReady(asset: Asset) {
    // console.log('_onAssetReady: ');
    // console.log(asset);
    if (asset.type === 'texture') {
      // console.log(this.data.textures);
      this.data.textures.push(asset.resource);
    } else if (asset.type === 'binary') {
      this.data.ssfbData = new Uint8Array(asset.resource);
    }
  }
}
