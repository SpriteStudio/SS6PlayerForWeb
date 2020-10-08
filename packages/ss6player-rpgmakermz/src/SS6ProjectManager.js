export class SS6ProjectManager {
  static instance;

  ssprojectMap;
  _isLoading

  constructor() {
    this.clear();
    this._isLoading = false;
  }

  prepare(ssfbId) {
    this.ssprojectMap.set(ssfbId, null);
    this._isLoading = true;
  }

  isLoading() {
    return this._isLoading;
  }

  isExist(ssfbId) {
    return (this.ssprojectMap.has(ssfbId) && this.ssprojectMap.get(ssfbId) !== null);
  }

  set(ssfbId, ssproject) {
    this.ssprojectMap.set(ssfbId, ssproject);
    this._isLoading = false;
  }

  get(ssfbId) {
    return (this.ssprojectMap.has(ssfbId))? this.ssprojectMap.get(ssfbId) : null;
  }

  clear() {
    this.ssprojectMap = new Map();
  }


  static getInstance() {
    if (SS6ProjectManager.instance) {
      return SS6ProjectManager.instance;
    }
    SS6ProjectManager.instance = new SS6ProjectManager();
    return SS6ProjectManager.instance;
  }
}
