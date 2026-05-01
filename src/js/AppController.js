import AppModel from './AppModel';
import AppView from './AppView';
import ProjectModel from './ProjectModel';
import EmployeeModel from './EmployeeModel';
import AssignmentModel from './AssignmentModel';
import Formatter from './Formatter';
import FilterSortService from './FilterSortService';
import FinancialFigureService from './FinancialFigureService';

class AppController {
  constructor() {
    this.assignmentViewTypeId = [];
    this.appModel = new AppModel(this.setAppModelCallbacks());
    this.finService = new FinancialFigureService(this.appModel, {});
    this.finService.update();
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
        onUpdateSalary: this.onUpdateSalary.bind(this),
        onUpdatePosition: this.onUpdatePosition.bind(this),
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
    this.finService.update();
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
      const employeeCapacityRaw = this.finService.getCapacityUsageTotalProject(project.id);
      const employeeCapacity = this.finService.getCapacityUsageStringProject(project.id);
      const income = this.finService.getProjectEstIncome(project.id);
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
    const totalIncome = this.finService.getTotalEstIncomeAllProjects();
    const benchIncome = this.finService.getBenchPayments();
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
      const monthlySalary = this.finService.getMonthlySalaryPayment(employee.id);
      const income = this.finService.getIncomePerEmployee(employee.id);
      const age = this.calculateAge(employee.dateOfBirth);
      return {
        employeeID: employee.id,
        name: employee.name,
        surname: employee.surname,
        age: age,
        position: employee.position,
        salary: employee.salary,
        salaryRaw: employee.salary,
        estimatedPayment: Formatter.currency(monthlySalary),
        estimatedPaymentRaw: monthlySalary,
        projectedIncome: Formatter.currency(income),
        projectedIncomeRaw: income,
        numberProjects: this.finService.getNumberProjectsForEmployee(employee.id),
        capacityUsage: this.finService.getCapacityUsageString(employee.id),
      };
    });
  }

  calculateAge(dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getDataForSeedPopup() {
    const data = this.appModel.getWholeData();
    let monthsData = [];
    let current = this.appModel.getCurrentPeriod();
    Object.entries(data)
      .filter((el) => el[0] !== current)
      .forEach(([period, periodData]) => {
        const tempService = new FinancialFigureService(this.appModel, {});
        tempService.update(period);
        const income = tempService.getTotalEstIncomeAllProjects();
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

      const {vacation, effective, revenue, cost, profit} = this.finService.getAssignFigures(assignment.id);
      return {
        assignmentID: assignment.id,
        linkText: firstColLinkText,
        linkHref: '',
        capacity: assignment.capacity,
        fit: assignment.projectFit,
        vacation: vacation,
        effective: Formatter.decimal3(effective),
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
      const available = this.finService.getProjectAvailableCapacity(project.id);
      return {
        id: project.id,
        name: project.projectName,
        available: Formatter.decimal1(available),
      };
    });
    const employee = this.appModel.searchData(employeeID);
    const currentCapacity = this.finService.getEmployeeEffectiveCapacity(employeeID);
    const maxCapacity = 1.5;
    const availableCapacity = maxCapacity - currentCapacity;

    data.employeeID = employeeID;
    data.employeeName = `${employee.name} ${employee.surname}`;
    data.currentCapacity = Formatter.decimal1(currentCapacity);
    data.maxCapacity = Formatter.decimal1(maxCapacity);
    data.availableCapacity = Formatter.decimal1(availableCapacity);

    return data;
  }

  getProjectInfoForAssignPopup(projectID) {
    const capacityActual = this.finService.getProjectEffectiveCapacityUsed(projectID);
    const capacityTotal = this.finService.getProjectCapacityNominal(projectID);

    return {
      capacityActual: capacityActual,
      capacityTotal: capacityTotal,
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
    const projectID = assignment.projectID;
    const employee = this.appModel.searchData(assignment.employeeID);
    const employeeName = `${employee.name} ${employee.surname}`;
    const projectName = this.appModel.searchData(assignment.projectID).projectName;
    const assignedCapacity = assignment.capacity;
    const salaryShare = this.finService.getSalaryShare(assignmentID);
    const budgetShare = this.finService.getBudgetShare(assignmentID);
    const employeeEstIncome = this.finService.getEstIncome(assignmentID);
    const projectIncomeBefore = this.finService.getProjectProfit(projectID);
    const projectCapacityBefore = this.finService.getProjectCapacityNominal(projectID);
    const projectCapacityAfter = projectCapacityBefore - assignedCapacity;
    const projectIncomeAfter = projectIncomeBefore + salaryShare;
    return {
      assignmentID: assignmentID,
      employeeName: employeeName,
      employeeCapacity: Formatter.decimal1(assignedCapacity),
      projectName: projectName,
      assignedCapacity: Formatter.decimal1(assignedCapacity),
      salaryShare: salaryShare,
      budgetShare: budgetShare,
      estimatedIncome: Formatter.currency(employeeEstIncome),
      currentCapacity: Formatter.decimal1(projectCapacityBefore),
      afterCapacity: Formatter.decimal1(projectCapacityAfter),
      incomeNow: Formatter.currency(projectIncomeBefore),
      incomeAfter: Formatter.currency(projectIncomeAfter),
      isNegativeEstimated: employeeEstIncome < 0,
      isNegativeNow: projectIncomeBefore < 0,
      isNegativeAfter: projectIncomeAfter < 0,
    }
  }

  getContentForCalendarPopup(id) {
    const employee = this.appModel.searchData(id);
    const currentPeriod = this.appModel.getCurrentPeriod();
    const workingDaysTotal = this.finService.calculateWorkingDays();
    const workingDaysAbsent = employee.getVacationWorkingDays(currentPeriod);

    return {
      employeeID: id,
      employeeName: `${employee.name} ${employee.surname}`,
      currentPeriod: currentPeriod,
      vacationDays: employee.getVacationDays(currentPeriod),
      workingDaysTotal: workingDaysTotal,
      workingDaysAbsent: workingDaysAbsent,
    };
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
    employeeData.period = this.appModel.getCurrentPeriod();
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
    if (!projectID) return;
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
  onSetVacation(employeeID, vacationDays, vacationWorkingDays) {
    this.appModel.updateVacationDays(employeeID, vacationDays, vacationWorkingDays);
    return 1;
  }

  /* Inline editing in employees tab */
  onUpdateSalary(employeeID, value) {
    this.appModel.updateEmployeeSalary(employeeID, value)
  }

  onUpdatePosition(employeeID, value) {
    this.appModel.updateEmployeePosition(employeeID, value)
  }

}

export default AppController;
