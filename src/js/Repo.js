export default class Repo {
  constructor () {
    this.data = [];
  }
  save(data) {
    this.data = data;
  }
  load() {
    return this.data;
  }
}
