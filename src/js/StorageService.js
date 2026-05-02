// Objects: 'monthlyData'

class StorageService {
  constructor() {
    this.root;
    this.dataKey = 'monthlyData';
    this._loadRoot();
  }

  _loadRoot () {
    const raw = localStorage.getItem(this.dataKey);
    this.root = raw ? JSON.parse(raw) : null;
  }

  saveObject(objectToSave) {
    this.root = objectToSave;
    localStorage.setItem(this.dataKey, JSON.stringify(this.root));
  }

  getObject() {
    this._loadRoot();
    return this.root;
  }

  clearStorage() {
    localStorage.clear();
  }
}

export default StorageService;
