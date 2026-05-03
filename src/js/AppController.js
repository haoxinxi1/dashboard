import AppModel from './AppModel';
import AppView from './AppView';
import ProjectModel from './ProjectModel';
import EmployeeModel from './EmployeeModel';
import AssignmentModel from './AssignmentModel';
import FilterSortService from './FilterSortService';
import FinancialFigureService from './FinancialFigureService';
import { MAX_CAP_FOR_EMPLOYEE } from './constants';

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
        onNavigate: this.onNavigate.bind(this),
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

  // getting content for Views

  getDataForProjectsTab() {
    const projectsRows = this.appModel.getProjects().map((project) => {
      return {
        projectID: project.id,
        companyName: project.companyName,
        projectName: project.projectName,
        budget: project.budget,
        employeeCapacityUsed: this.finService.getProjectEffectiveCapacityUsed(project.id),
        employeeCapacityFull: this.finService.getProjectCapacityNominal(project.id),
        income: this.finService.getProjectEstIncome(project.id),
        numberEmployees: this.appModel.getAssignmentsOfProject(project.id)?.length ?? 0,
      };
    });
    return {
      projectsRows: projectsRows,
      totalIncome: this.finService.getTotalEstIncomeAllProjects(),
      benchIncome: this.finService.getBenchPayments(),
      hasProjects: projectsRows.length > 0,
    };
  }

  getDataForEmployeesTab() {
    const employees = this.appModel.getEmployees();
    return employees.map((employee) => {
      return {
        employeeID: employee.id,
        name: employee.name,
        surname: employee.surname,
        age: this.calculateAge(employee.dateOfBirth),
        position: employee.position,
        salary: employee.salary,
        estimatedPayment: this.finService.getMonthlySalaryPayment(employee.id),
        projectedIncome: this.finService.getIncomePerEmployee(employee.id),
        numberProjects: this.finService.getNumberProjectsForEmployee(employee.id),
        capacityUsageNom: this.finService.getEmployeeNominalCapacity(employee.id),
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
        const tempService = new FinancialFigureService(this.appModel, {});
        tempService.update(period);
        const income = tempService.getTotalEstIncomeAllProjects();
        const obj = {
          period: period,
          projects: periodData.projects.length,
          employees: periodData.employees.length,
          income: income,
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
    content.type = type;

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
        projectID: project.id,
        employeeID: employee.id,
        linkText: firstColLinkText,
        linkHref: '',
        capacity: assignment.capacity,
        fit: assignment.projectFit,
        vacation: vacation,
        effective: effective,
        revenue: revenue,
        cost: cost,
        profit: profit,
      };
    });
    return content;
  }

  getDataForShowingAddAssingPopup(employeeID) {
    const data = {};
    data.projects = this.appModel.getProjects().map((project) => {
      return {
        id: project.id,
        name: project.projectName,
        available: this.finService.getProjectAvailableCapacity(project.id),
      };
    });
    const employee = this.appModel.searchData(employeeID);
    const currentCapacity = this.finService.getEmployeeNominalCapacity(employeeID);

    data.employeeID = employeeID;
    data.employeeName = `${employee.name} ${employee.surname}`;
    data.currentCapacity = currentCapacity;
    data.maxCapacity = MAX_CAP_FOR_EMPLOYEE;
    data.availableCapacity = MAX_CAP_FOR_EMPLOYEE - currentCapacity;

    return data;
  }

  getProjectInfoForAssignPopup(projectID) {
    return {
      capacityActual: this.finService.getProjectEffectiveCapacityUsed(projectID),
      capacityTotal: this.finService.getProjectCapacityNominal(projectID),
    };
  }

  getDataForEditAssigmentPopup(assignmentID) {
    const assignment = this.appModel.searchData(assignmentID);
    const employee = this.appModel.searchData(assignment.employeeID);
    return {
      assignmentID: assignmentID,
      employeeName: `${employee.name} ${employee.surname}`,
      projectName: this.appModel.searchData(assignment.projectID).projectName,
      capacity: assignment.capacity,
      projectFit: assignment.projectFit,
      employeeCurrentCapacity: this.finService.getEmployeeNominalCapacity(employee.id),
    }
  }

  getInfoForDeleteAssignPopup(assignmentID) {
    const assignment = this.appModel.searchData(assignmentID);
    const projectID = assignment.projectID;
    const employee = this.appModel.searchData(assignment.employeeID);
    const salaryShare = this.finService.getSalaryShare(assignmentID);
    const projectIncomeBefore = this.finService.getProjectProfit(projectID);
    const projectIncomeAfter = projectIncomeBefore + salaryShare;
    const projectCapacityBefore = this.finService.getProjectCapacityNominal(projectID);
    const projectCapacityAfter = projectCapacityBefore - assignment.capacity;

    return {
      assignmentID: assignmentID,
      employeeName: `${employee.name} ${employee.surname}`,
      employeeCapacity: assignment.capacity,
      projectName: this.appModel.searchData(assignment.projectID).projectName,
      assignedCapacity: assignment.capacity,
      salaryShare,
      budgetShare: this.finService.getBudgetShare(assignmentID),
      estimatedIncome: this.finService.getEstIncome(assignmentID),
      currentCapacity: projectCapacityBefore,
      afterCapacity: projectCapacityAfter,
      incomeNow: projectIncomeBefore,
      incomeAfter: projectIncomeAfter,
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

  /* other */
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

  // action popup
  onNavigate(itemID) {
    const item = this.appModel.searchData(itemID);
    this.appView.hideAssignmentsPopupView();
    this.appView.clearFiltersProjects();
    this.appView.clearFiltersEmployees();

    if (item instanceof ProjectModel) {
      const filterObj = { projectName: item.projectName };
      this.appView.callAddFilterProjects(filterObj)
      this.appView.showProjects();
    } else if (item instanceof EmployeeModel) {
      const filterObj1 = { name: item.name };
      const filterObj2 = { surname: item.surname };
      this.appView.callAddFilterEmployees(filterObj1);
      this.appView.callAddFilterEmployees(filterObj2);
      this.appView.showEmployees();
    }
  }
}

export default AppController;
