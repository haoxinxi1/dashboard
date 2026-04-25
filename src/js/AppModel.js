import Repo from './Repo';

class AppModel {
  constructor (callbacks) {
    this.callbacks = callbacks.appModel;
    this.repo = new Repo();
    this.currentPeriod =  this.getCurrentMonthYear();
    this.data = this.loadFromRepo();
  }

  loadFromRepo() {
    let arr = this.repo.load();
    if (!arr) return {};
    return arr.reduce((acc, current) => {
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

  setCurrentYear(value) {
    if (value !== '2025' && value !== '2026' && value !== '2027') return;
    const month = this.currentPeriod.split('-')[1];
    this.currentPeriod = `${value}-${month}`;
    this.callbacks.onModelChange();
  }

  setCurrentMonth(value) {
    let num = Number(value);
    if (num < 0 || num > 11) return;
    const year = this.currentPeriod.split('-')[0];
    this.currentPeriod = `${year}-${value}`;
    this.callbacks.onModelChange();
  }

  seedData(chosenPeriod) {
    this.data[this.currentPeriod] = this.data[chosenPeriod];
    this.callbacks.onModelChange();
    this.saveToRepo();
    console.log("Periods :", this.data);
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
    this.callbacks.onModelChange();
    this.saveToRepo();
    console.log("Projects :", this.getProjects());
  }

  getEmployees() {
    return this.data[this.currentPeriod]?.employees ?? [];
  }

  addEmployee(employee) {
    if (!this.data[this.currentPeriod]) this.initPeriodData();
    this.data[this.currentPeriod].employees.push(employee);
    this.callbacks.onModelChange();
    this.saveToRepo();
    console.log("Employees :", this.getEmployees());
  }

  getAssignments() {
    return this.data[this.currentPeriod]?.assignments ?? [];
  }

  getAssignmentsOfProject(projectID) {
    return this.getAssignments().filter((el) => el.projectID === projectID);
  }

  getAssignmentsOfEmployee(employeeID) {
    return this.getAssignments().filter((el) => el.employeeID === employeeID);
  }

  addAssignment(assignment) {
    if (!this.data[this.currentPeriod]) this.initPeriodData();
    this.data[this.currentPeriod].assignments.push(assignment);
    this.callbacks.onModelChange();
    this.saveToRepo();
  }

  getWholeData() {
    return this.data;
  }

  searchData(id) {
    return this.data[this.currentPeriod]?.projects.find((el) => el.id === id) ||
           this.data[this.currentPeriod]?.employees.find((el) => el.id === id) ||
           this.data[this.currentPeriod]?.assignments.find((el) => el.id === id);
  }
}

export default AppModel;
