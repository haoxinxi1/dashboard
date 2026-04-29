import AppModel from './AppModel';
import AppView from './AppView';
import ProjectModel from './ProjectModel';
import EmployeeModel from './EmployeeModel';
import AssignmentModel from './AssignmentModel';
import Formatter from './Formatter';
import FilterSortService from './FilterSortService';

class AppController {
  constructor() {
    this.assignmentViewTypeId = [];
    this.appModel = new AppModel(this.setAppModelCallbacks());
    this.appView = new AppView(this.setAppViewCallbacks());
    this.filterSortService = new FilterSortService();
    const content = this.filterSortService.cache(this.setAppViewContent());
    this.appView.fillContentAll(content);
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
      projectsContentView: {
        getContentAssignmentsPopup: this.getContentAssignmentsPopup.bind(this),
        onDeleteProject: this.onDeleteProject.bind(this),
        onFilter: this.onFilter.bind(this),
        onSort: this.onSort.bind(this),
       },
      addEmployeePanel: { onCreateEmployee: this.onCreateEmployee.bind(this) },
      employeesContentView: {
        getContentAssignmentsPopup: this.getContentAssignmentsPopup.bind(this),
        onAssignEmployee: this.onAssignEmployee.bind(this),
        onDeleteEmployee: this.onDeleteEmployee.bind(this),
        handleCheckSchedule: this.handleCheckSchedule.bind(this),
        onFilter: this.onFilter.bind(this),
        onSort: this.onSort.bind(this),
      },
      seedDataPopupView: {
        onSeedChosenMonth: this.onSeedChosenMonth.bind(this),
      },
      assignmentsPopupView: {
        onCloseAssignmentsPopup: this.onCloseAssignmentsPopup.bind(this),
        onStartEditAssignment: this.onStartEditAssignment.bind(this),
        handleStartDeleteAssignment: this.handleStartDeleteAssignment.bind(this),
      },
      addAssignmentPopup: {
        onCreateNewAssignment: this.onCreateNewAssignment.bind(this),
        onChooseProject: this.onChooseProject.bind(this),
      },
      editAssignmentPopup: {
        onFinishEditAssignment: this.onFinishEditAssignment.bind(this),
      },
      deleteAssignmentPopup: {
        onDeleteAssignment: this.onDeleteAssignment.bind(this),
      },
      calendarPopup: {
        onSetVacation: this.onSetVacation.bind(this),
      }
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
      projectsContentView: this.getDataForProjectsTab(),
      employeesContentView: this.getDataForEmployeesTab(),
      assignmentsPopupView: this.getDataForAssignmentsPopup(...this.assignmentViewTypeId),
    };
  }

    /* Re render  */
  onModelChange() {
    const content = this.filterSortService.cache(this.setAppViewContent());
    this.appView.fillContentAll(content);
  }

  /* Filer and sort */
  onFilter(criteria) {
    const filtered = this.filterSortService.filter(criteria);
    this.appView.fillContentFilterSort(filtered);
  }

  onSort(criteria) {
    const sorted = this.filterSortService.sort(criteria);
    this.appView.fillContentFilterSort(sorted);
  }

  // assignment popup cb
  getContentAssignmentsPopup(type, id) {
    this.assignmentViewTypeId = [type, id];
    this.onModelChange();
  }

  onCloseAssignmentsPopup() {
    this.assignmentViewTypeId = [];
  }

  //getting data for content
  getDataForProjectsTab() {
    const projectsRows = this.appModel.getProjects().map((project) => {
      const employeeCapacityRaw = this.getCapacityUsageTotalProject(project.id);
      const employeeCapacity = this.getCapacityUsageStringProject(project.id);
      const income = this.calculateIncome(project.id);
      return {
        projectID: project.id,
        companyName: project.companyName,
        projectName: project.projectName,
        budget: Formatter.currency(project.budget),
        budgetRaw: project.budget,
        employeeCapacity: employeeCapacity,
        employeeCapacityRaw: employeeCapacityRaw,
        income: Formatter.currency(income),
        incomeRaw: income,
        numberEmployees: this.appModel.getAssignmentsOfProject(project.id)?.length ?? 0,
      };
    });
    const period = this.appModel.getCurrentPeriod();
    const totalIncome = this.calculateTotalIncome(period);
    const benchIncome = this.calculateBenchPayments(period);
    return {
      projectsRows: projectsRows,
      totalIncome: Formatter.currency(totalIncome),
      benchIncome: Formatter.currency(benchIncome),
      isIncomeNegative: totalIncome < 0,
      hasProjects: projectsRows.length > 0,
    };
  }

  getDataForEmployeesTab() {
    const employees = this.appModel.getEmployees();
    return employees.map((employee) => {
      const monthlySalary = this.calculateMonthlySalary(employee.id);
      const income = this.calculateIncomePerEmployee(employee.id);
      return {
        employeeID: employee.id,
        name: employee.name,
        surname: employee.surname,
        age: employee.age,
        position: employee.position,
        salary: Formatter.currency(employee.salary),
        salaryRaw: employee.salary,
        estimatedPayment: Formatter.currency(monthlySalary),
        estimatedPaymentRaw: monthlySalary,
        projectedIncome: Formatter.currency(income),
        projectedIncomeRaw: income,
        numberProjects: this.appModel.getAssignmentsOfEmployee(employee.id)?.length ?? 0,
        capacityUsage: this.getCapacityUsageString(employee.id),
      };
    });
  }

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

  getDataForAssignmentsPopup(type, id) {
    let assignments = [];
    let employee;
    let project;
    const content = {};

    if (type === undefined || id === undefined) return {};

    if (type === 'employee') {
      assignments = this.appModel.getAssignmentsOfEmployee(id);
      employee = this.appModel.searchData(id);
      content.header = `Assignments for ${employee.name} ${employee.surname}`;
      content.firstColHeader = 'Project';
    } else if (type === 'project') {
      assignments = this.appModel.getAssignmentsOfProject(id);
      project = this.appModel.searchData(id);
      content.header = `Employees on ${project.projectName}`;
      content.firstColHeader = 'Employee';
    }

    content.data = assignments.map((assignment) => {
      let firstColLinkText;
      if (type === 'employee') {
        project = this.appModel.getProjects().find((el) => el.id === assignment.projectID);
        firstColLinkText = project.projectName;
      } else if (type === 'project') {
        employee = this.appModel.getEmployees().find((el) => el.id === assignment.employeeID);
        firstColLinkText = `${employee.name} ${employee.surname}`;
      }
      const vacation = this.getVacationInfo();
      const effective = this.calculateEffective();
      const revenue = this.calculateRevenue();
      const cost = this.calculateCosts();
      const profit = revenue - cost;

      return {
        assignmentID: assignment.id,
        linkText: firstColLinkText,
        linkHref: '',
        capacity: assignment.capacity,
        fit: assignment.projectFit,
        vacation: vacation,
        effective: effective,
        revenue: Formatter.currency(revenue),
        cost: Formatter.currency(cost),
        profit: Formatter.currency(profit),
        isLoss: profit < 0,
      };
    });
    return content;
  }

  getDataForShowingAddAssingPopup(employeeID) {
    const data = {};
    data.projects = this.appModel.getProjects().map((project) => {
      const available = this.calculateProjectAvailable(project);
      return {
        id: project.id,
        name: project.projectName,
        available: Formatter.decimal1(available),
      };
    });
    const employee = this.appModel.searchData(employeeID);
    const currentCapacity = this.calculateCurrentCapacity(employee);
    const maxCapacity = this.calculateMaxCapacity(employee);
    const availableCapacity = maxCapacity - currentCapacity;

    data.employeeID = employeeID;
    data.employeeName = `${employee.name} ${employee.surname}`;
    data.currentCapacity = Formatter.decimal1(currentCapacity);
    data.maxCapacity = Formatter.decimal1(maxCapacity);
    data.availableCapacity = Formatter.decimal1(availableCapacity);

    return data;
  }

  getProjectInfoForAssignPopup(projectID) { // TODO
    const capacityActual = 0;
    const capacityTotal = 0;
    const capacityEffective = 0;
    const capacityActualAfter = 0;
    const capacityTotalAfter = 0;

    return {
      capacityActual: Formatter.decimal1(capacityActual),
      capacityTotal: capacityTotal,
      capacityEffective:  Formatter.decimal1(capacityEffective) ,
      capacityActualAfter:  Formatter.decimal1(capacityActualAfter),
      capacityTotalAfter: capacityTotalAfter,
    };
  }

  getDataForEditAssigmentPopup(assignmentID) {
    const assignment = this.appModel.searchData(assignmentID);
    const employee = this.appModel.searchData(assignment.employeeID);
    const employeeName = `${employee.name} ${employee.surname}`;
    const projectName = this.appModel.searchData(assignment.projectID).projectName;

    return {
      assignmentID: assignmentID,
      employeeName: employeeName,
      projectName: projectName,
      capacity: Formatter.decimal2(assignment.capacity),
      projectFit: Formatter.decimal2(assignment.projectFit),
    }
  }

  getInfoForDeleteAssignPopup(assignmentID) {
    const assignment = this.appModel.searchData(assignmentID);
    const employee = this.appModel.searchData(assignment.employeeID);
    const employeeName = `${employee.name} ${employee.surname}`;
    const projectName = this.appModel.searchData(assignment.projectID).projectName;
    // TODO
    const incomeNow = 0;
    const incomeAfter = 0;
    const estimatedIncome = 0;

    return {
      assignmentID: assignmentID,
      employeeName: employeeName,
      employeeCapacity: Formatter.decimal1(0),
      projectName: projectName,
      assignedCapacity: Formatter.decimal1(0),
      salaryShare: 0,
      budgetShare: 0,
      estimatedIncome: Formatter.currency(incomeNow),
      currentCapacity: Formatter.decimal1(0),
      afterCapacity: Formatter.decimal1(0),
      incomeNow: Formatter.currency(incomeNow),
      incomeAfter: Formatter.currency(incomeAfter),
      isNegativeEstimated: estimatedIncome < 0,
      isNegativeNow: incomeNow < 0,
      isNegativeAfter: incomeAfter < 0,
    }
  }

  getContentForCalendarPopup(id) {
    const employee = this.appModel.searchData(id);
    const currentPeriod = this.appModel.getCurrentPeriod();
    const workingDaysTotal = this.calculateWorkingDays();
    const workingDaysAbsent = 0;  // TO DO

    return {
      employeeID: id,
      employeeName: `${employee.name} ${employee.surname}`,
      currentPeriod: currentPeriod,
      vacationDays: employee.getVacationDays(currentPeriod),
      workingDaysTotal: workingDaysTotal,
      workingDaysAbsent: workingDaysAbsent,
    };
  }

  /* Calculation of figures */

  calculateCurrentCapacity(employee) {
    return 1.0;
  }

  calculateMaxCapacity(employee) {
    return 1.0;
  }

  calculateProjectAvailable(project) {
    return 1;
  }

  getVacationInfo() {
    return ' '; //TODO
  }

  calculateEffective() {
    return ' '; //TODO
  }

  calculateRevenue() {
    return 0; //TODO
  }

  calculateCosts() {
    return 0; //TODO
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
    return '1.0 / 1'; // TODO
  }

  getCapacityUsageTotalProject(projectID) {
    return 1; // TODO
  }

  getCapacityUsageString(employeeID) {
    return '1.0 / 1.0'; // TODO
  }

  calculateWorkingDays() {
    const [year, month] = this.appModel.getCurrentPeriod().split('-').map(Number);
    const totalDays = this.calculateDaysInMonth(year, month);
    let workingDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      const day = new Date(year, month, d).getDay();
      if (day !== 0 && day !== 6) workingDays++;
    }
    return workingDays;
  }

  calculateDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
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

  /* Create new Assignment */
  onCreateNewAssignment(data) {
    this.appModel.addAssignment(new AssignmentModel(data));
    return 1;
  }

  /* Seed Popup */
  onSeedChosenMonth(period) {
    this.appModel.seedData(period);
  }

  /* Employee Table */
  onAssignEmployee(button, employeeID) {
    const content = this.getDataForShowingAddAssingPopup(employeeID);
    this.appView.showAddAssignPopup(content, button);
  }

  handleCheckSchedule(employeeID) {
    const content = this.getContentForCalendarPopup(employeeID);
    this.appView.showCalendarPopup(content);
  }

  onDeleteEmployee(employeeID) {
    this.appModel.deleteEmployee(employeeID);
    return 1;
  }

  /* Assignments Popup */
  onStartEditAssignment(button, assignmentID) {
    const content = this.getDataForEditAssigmentPopup(assignmentID);
    this.appView.showEditAssignPopup(content, button);
  }

  handleStartDeleteAssignment(id) {
    const content = this.getInfoForDeleteAssignPopup(id);
    this.appView.showDeleteAssignPopup(content);
  }

  /* Assign Employee Popup */
  onChooseProject(projectID) {
    const content = this.getProjectInfoForAssignPopup(projectID);
    this.appView.showProjectInfoAssignPopup(content);
  }

  /* Edit assignment Popup */
  onFinishEditAssignment(data) {
    this.appModel.editAssignment(data.assignmentID, data.capacity, data.projectFit);
    return 1;
  }

  /* Delete assignment Popup */
  onDeleteAssignment(assignmentID) {
    this.appModel.deleteAssignment(assignmentID);
    return 1;
  }

  /* Projects Table */
  onDeleteProject(projectID) {
    this.appModel.deleteProject(projectID);
    return 1;
  }

  /* Calendar Popup*/
  onSetVacation(employeeID, vacationDays) {
    this.appModel.updateVacationDays(employeeID, vacationDays);
    return 1;
  }

}

export default AppController;
