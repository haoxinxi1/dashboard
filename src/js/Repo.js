import mockData from "./mock-data";

export default class Repo {
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
