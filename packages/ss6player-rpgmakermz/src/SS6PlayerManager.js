export class SS6PlayerManager {
  static instance;

  ssplayerDictionary;

  constructor() {
    this.clear();
    this._isLoading = false;
  }

  isExist(playerId) {
    return (this.ssplayerDictionary[playerId] !== undefined && this.ssplayerDictionary[playerId] !== null);
  }

  set(playerId, ssplayer) {
    this.ssplayerDictionary[playerId] = ssplayer;
    this._isLoading = false;
  }

  get(playerId) {
    return (this.ssplayerDictionary[playerId] !== undefined) ? this.ssplayerDictionary[playerId] : null;
  }

  clear() {
    this.ssplayerDictionary = {}
  }

  static getInstance() {
    if (SS6PlayerManager.instance) {
      return SS6PlayerManager.instance;
    }
    SS6PlayerManager.instance = new SS6PlayerManager();
    return SS6PlayerManager.instance;
  }
}
