import { Repo } from './Repo';

export default class AppModel {
  constructor () {
    this.repo = new Repo();
    this.currentPeriod =  this.getCurrentMonthYear();
    this.data = this.loadFromRepo();
  }
  loadFromRepo() {
    let arr = this.repo.load();
    this.data = arr.reduce((acc, current) => {
      let key = Object.keys(current)[0];
      let value = Object.values(current)[0];
      acc[key] = value;
      return acc;
    }, {})
  }
  saveToRepo() {
    let arr = Object.entries(this.data).map(([key, value]) => {return {[key] : value}});
    this.repo.save(arr);
  }
  getCurrentMonthYear() {
    return `${new Date().getFullYear()}-${new Date().getMonth()}`;
  }
  getCurrentPeriod() {
    return this.currentPeriod;
  }
  setCurrentPeriod(period) {
    this.currentPeriod = period;
  }
  initPeriodData(){
    this.data[this.currentPeriod] = { employees: [], projects: [], assignments: [] };
  }
  getProjects() {
    return this.data[this.currentPeriod]?.projects ?? [];
  }
  addProject(project) {
    if (!this.data[this.currentPeriod]) this.initPeriodData();
    this.data[this.currentPeriod].projects.push(project);
    this.saveToRepo();
  }
  getEmployees() {
    return this.data[this.currentPeriod]?.employees ?? [];
  }
  addEmployee(employee) {
    if (!this.data[this.currentPeriod]) this.initPeriodData();
    this.data[this.currentPeriod].employees.push(employee);
    this.saveToRepo();
  }
  getAssignments() {
    return this.data[this.currentPeriod]?.assignments ?? [];
  }
  addAssignment(assignment) {
    if (!this.data[this.currentPeriod]) this.initPeriodData();
    this.data[this.currentPeriod].assignments.push(assignment);
    this.saveToRepo();
  }
  searchData(id) {
    return this.data[this.currentPeriod]?.projects.find((el) => el.id === id) ||
           this.data[this.currentPeriod]?.employees.find((el) => el.id === id) ||
           this.data[this.currentPeriod]?.assignments.find((el) => el.id === id);
  }
}
