export class SS6PlayerManager {
  static instance;

  ss6playerDictionary;

  constructor() {
    this.clear();
  }

  isExist(playerId) {
    return (this.ss6playerDictionary[playerId] !== undefined && this.ss6playerDictionary[playerId] !== null);
  }

  set(playerId, ssplayer) {
    this.ss6playerDictionary[playerId] = ssplayer;
  }

  get(playerId) {
    return (this.ss6playerDictionary[playerId] !== undefined) ? this.ss6playerDictionary[playerId] : null;
  }

  clear() {
    if (this.ss6playerDictionary !== null) {
      for(let player in this.ss6playerDictionary) {
        player.Stop();
      }
    }
    this.ss6playerDictionary = {}
  }

  static getInstance() {
    if (SS6PlayerManager.instance) {
      return SS6PlayerManager.instance;
    }
    SS6PlayerManager.instance = new SS6PlayerManager();
    return SS6PlayerManager.instance;
  }
}
