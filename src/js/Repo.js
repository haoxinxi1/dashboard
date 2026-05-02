import mockData from "./mock-data";
import StorageService from "./StorageService";

class Repo {
  constructor () {
    this.storage = new StorageService();
  }
  save(data) {
    this.storage.saveObject(data);
  }
  load() {
    return this.storage.getObject() ?? mockData;
  }
}

export default Repo;
