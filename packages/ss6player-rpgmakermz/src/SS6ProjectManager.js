export class SS6ProjectManager {
  static instance;

  ssprojectDictionary;
  _isLoading

  constructor() {
    this.clear();
    this._isLoading = false;
  }

  prepare(ssfbId) {
    this.ssprojectDictionary[ssfbId] = null;
    this._isLoading = true;
  }

  isLoading() {
    return this._isLoading;
  }

  isExist(ssfbId) {
    return (this.ssprojectDictionary[ssfbId] !== undefined && this.ssprojectDictionary[ssfbId] !== null);
  }

  set(ssfbId, ssproject) {
    this.ssprojectDictionary[ssfbId] = ssproject;
    this._isLoading = false;
  }

  get(ssfbId) {
    return (this.ssprojectDictionary[ssfbId] !== undefined)? this.ssprojectDictionary[ssfbId] : null;
  }

  clear() {
    this.ssprojectDictionary = {}
  }

  static getInstance() {
    if (SS6ProjectManager.instance) {
      return SS6ProjectManager.instance;
    }
    SS6ProjectManager.instance = new SS6ProjectManager();
    return SS6ProjectManager.instance;
  }
}
