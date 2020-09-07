export class SSPlayerManager {
  static instance;

  ssfbDictionary;
  constructor() {
    this.clear();
  }

  set(ssfbId, ssplayer) {
    this.ssfbDictionary[ssfbId] = ssplayer;
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
