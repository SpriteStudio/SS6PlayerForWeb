export class SSPlayerManager {
  static instance;

  ssfbDictionary;
  _isLoading

  constructor() {
    this.clear();
    this._isLoading = false;
  }

  prepare(ssfbId) {
    this.ssfbDictionary[ssfbId] = null;
    this._isLoading = true;
  }

  isLoading() {
    return this._isLoading;
  }

  set(ssfbId, ssplayer) {
    this.ssfbDictionary[ssfbId] = ssplayer;
    this._isLoading = false;
  }

  get(ssfbId) {
    return (this.ssfbDictionary[ssfbId] !== undefined)? this.ssfbDictionary[ssfbId] : null;
  }

  clear() {
    this.ssfbDictionary = {}
  }

  static getInstance() {
    if (SSPlayerManager.instance) {
      return SSPlayerManager.instance;
    }
    SSPlayerManager.instance = new SSPlayerManager();
    return SSPlayerManager.instance;
  }
}
