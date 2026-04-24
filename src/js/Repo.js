import mockData from "./mock-data";

class Repo {
  constructor () {
    this.data = mockData;
  }
  save(data) {
    this.data = data;
  }
  load() {
    return this.data;
  }
}

export default Repo;
