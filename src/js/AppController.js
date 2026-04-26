import AppModel from './AppModel';
import AppView from './AppView';
import ProjectModel from './ProjectModel';
import EmployeeModel from './EmployeeModel';
import AssignmentModel from './AssignmentModel';
import Formatter from './Formatter'

class AppController {
  constructor() {
    this.appModel = new AppModel(this.setAppModelCallbacks());
    this.appView = new AppView(this.setAppViewCallbacks());
    this.appView.fillContentAll(this.setAppViewContent());
  }

  setAppModelCallbacks() {
    return {
      appModel: {
        onModelChange: this.onModelChange.bind(this),
      },
    };
  }

  setAppViewCallbacks() {
    return {
      appView: {},
      sidePanelView: {
        onPeriodChangeMonth: this.onPeriodChangeMonth.bind(this),
        onPeriodChangeYear: this.onPeriodChangeYear.bind(this),
      },
      addProjectPanel: { onCreateProject: this.onCreateProject.bind(this) },
      projectsContentView: {},
      addEmployeePanel: { onCreateEmployee: this.onCreateEmployee.bind(this) },
      employeesContentView: {},
      seedDataPopupView: {
        onSeedChosenMonth: this.onSeedChosenMonth.bind(this),
      },
    };
  }

  // rendering
  setAppViewContent() {
    return {
      sidePanelView: {
        currentPeriod: this.appModel.getCurrentPeriod(),
      },
      seedDataPopupView: {
        currentPeriod: this.appModel.getCurrentPeriod(),
        monthsData: this.getDataForSeedPopup(),
      },
      projectsContentView:  this.getDataForProjectsTab(),
      employeesContentView: this.getDataForEmployeesTab(),
    };
  }

  /* Calculation of figures */
  getDataForSeedPopup() {
    const data = this.appModel.getWholeData();
    let monthsData = [];
    let current = this.appModel.getCurrentPeriod();
    Object.entries(data)
      .filter((el) => el[0] !== current)
      .forEach(([period, periodData]) => {
        const income = this.calculateTotalIncome(period);
        const obj = {
          period: period,
          projects: periodData.projects.length,
          employees: periodData.employees.length,
          income: Formatter.currency(income),
          isNegative: income < 0,
        };
        monthsData.push(obj);
      });
    return monthsData;
  }

  calculateTotalIncome(period) {
    return 0; //TODO
  }

  calculateBenchPayments(period) {
    return 0; //TODO
  }

  calculateIncome(projectID) {
    return 0; //TODO
  }

  calculateMonthlySalary(employeeID) {
    return 0; //TODO
  }

  calculateIncomePerEmployee(employeeID) {
    return 0; //TODO
  }

  getCapacityUsageStringProject(projectID) {
    return '1.0 / 1';  // TODO
  }

  getCapacityUsageString(employeeID) {
    return '1.0 / 1.0';  // TODO
  }

  getDataForProjectsTab() {
    const projectsRows = this.appModel.getProjects().map((project) => {
      const rating = this.getCapacityUsageStringProject(project.id);
      const income = this.calculateIncome(project.id);
      return {
        projectID: project.id,
        companyName: project.companyName,
        projectName: project.projectName,
        budget: Formatter.currency(project.budget),
        rating: rating,
        income: Formatter.currency(income),
        numberEmployees: this.appModel.getAssignmentsOfProject(project.id)?.length ?? 0
      }
    })
    const period = this.appModel.getCurrentPeriod();
    const totalIncome = this.calculateTotalIncome(period);
    const benchIncome = this.calculateBenchPayments(period);
    return {
      projectsRows: projectsRows,
      totalIncome: Formatter.currency(totalIncome),
      benchIncome: Formatter.currency(benchIncome),
      isIncomeNegative: totalIncome < 0,
      hasProjects: projectsRows.length > 0
    }
  }

  getDataForEmployeesTab() {
    const employees = this.appModel.getEmployees();
    return employees.map((employee) => {
      const monthlySalary = this.calculateMonthlySalary(employee.id);
      const income = this.calculateIncomePerEmployee(employee.id);
      return {
        employeeID: employee.id,
        firstName: employee.name,
        lastName: employee.surname,
        age: employee.age,
        position: employee.position,
        salary: Formatter.currency(employee.salary),
        monthlySalary: Formatter.currency(monthlySalary),
        income: Formatter.currency(income),
        numberProjects: this.appModel.getAssignmentsOfEmployee(employee.id)?.length ?? 0,
        capacityUsage: this.getCapacityUsageString(employee.id)
      }
    })
  }

  /* AppModel  */
  onModelChange() {
    this.appView.fillContentAll(this.setAppViewContent());
  }

  /* SidePanelView  */
  onPeriodChangeMonth(e) {
    this.appModel.setCurrentMonth(e.target.value);
  }

  onPeriodChangeYear(e) {
    this.appModel.setCurrentYear(e.target.value);
  }

  /* Create new Project */
  onCreateProject(projectData) {
    this.appModel.addProject(new ProjectModel(projectData));
  }

  /* Create new Employee */
  onCreateEmployee(employeeData) {
    this.appModel.addEmployee(new EmployeeModel(employeeData));
  }

  /* Seed Popup */
  onSeedChosenMonth(period) {
    this.appModel.seedData(period);
  }
}

export default AppController;
