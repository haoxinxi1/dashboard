import EmployeesContentView from './EmployeesContentView';
import ProjectsContentView from './ProjectsContentView';
import SidePanelView from './SidePanelView';
import AddEmployeePanel from './AddEmployeePanel';
import AddProjectPanel from './AddProjectPanel';
import SeedDataPopupView from './SeedDataPopupView';
import AssignmentsPopupView from './AssignmentsPopupView';
import AddAssignmentPopup from './AddAssignmentPopup';
import EditAssignmentPopup from './EditAssignmentPopup';
import DeleteAssignmentPopup from './DeleteAssignmentPopup';
import CalendarPopup from './CalendarPopup';
import { bindEvent} from './utils';

class AppView {
  constructor (callbacks) {
    this.callbacks = callbacks.appView;
    this.staticViews = this.createStaticViews(callbacks);
    this.bindListeners();
  }

  createStaticViews (callbacks) {
    let staticViews = {};
    callbacks.employeesContentView['showAddEmployeePanelView'] = this.showAddEmployeePanelView;
    callbacks.employeesContentView['showAssignmentsPopupView'] = this.showAssignmentsPopupView;
    staticViews['employeesContentView'] = new EmployeesContentView(callbacks.employeesContentView);
    callbacks.projectsContentView['showAddProjectPanelView'] = this.showAddProjectPanelView;
    callbacks.projectsContentView['showSeedDataPopupView'] = this.showSeedDataPopupView;
    callbacks.projectsContentView['showAssignmentsPopupView'] = this.showAssignmentsPopupView;
    staticViews['projectsContentView'] = new ProjectsContentView(callbacks.projectsContentView);
    callbacks.sidePanelView['showProjects'] = this.showProjects;
    callbacks.sidePanelView['showEmployees'] = this.showEmployees;
    staticViews['sidePanelView'] = new SidePanelView(callbacks.sidePanelView);
    staticViews['addEmployeePanel'] = new AddEmployeePanel(callbacks.addEmployeePanel);
    staticViews['addProjectPanel'] = new AddProjectPanel(callbacks.addProjectPanel);
    staticViews['seedDataPopupView'] =  new SeedDataPopupView(callbacks.seedDataPopupView);
    staticViews['assignmentsPopupView'] = new AssignmentsPopupView(callbacks.assignmentsPopupView);
    staticViews['addAssignmentPopup'] = new AddAssignmentPopup(callbacks.addAssignmentPopup);
    staticViews['editAssignmentPopup'] = new EditAssignmentPopup(callbacks.editAssignmentPopup);
    staticViews['deleteAssignmentPopup'] = new DeleteAssignmentPopup(callbacks.deleteAssignmentPopup);
    staticViews['calendarPopup'] = new CalendarPopup(callbacks.calendarPopup);
    return staticViews;
  }

  bindListeners() {
    bindEvent('click', '#open-button', this.hideOpenButton, this.showSidePanelView);
  }

  // render
  fillContentAll(content) {
    this.staticViews.sidePanelView.fillContent(content.sidePanelView);
    this.staticViews.seedDataPopupView.fillContent(content.seedDataPopupView);
    this.staticViews.projectsContentView.fillContent(content.projectsContentView);
    this.staticViews.employeesContentView.fillContent(content.employeesContentView);
    this.staticViews.assignmentsPopupView.fillContent(content.assignmentsPopupView);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('open-button').classList.add("hidden");
  }

  showSidePanelView = () => {
    document.getElementById('side-panel').classList.remove("hidden");
  }

  showProjects = () => {
    document.getElementById('employees-content').classList.add("hidden");
    document.getElementById('projects-content').classList.remove("hidden");
  }

  showEmployees = () => {
    document.getElementById('projects-content').classList.add("hidden");
    document.getElementById('employees-content').classList.remove("hidden");
  }

  showAddProjectPanelView = () => {
    this.staticViews.addProjectPanel.resetForm();
    document.getElementById('add-project-panel').classList.add("open");
  }

  showAddEmployeePanelView = () => {
    this.staticViews.addEmployeePanel.resetForm();
    document.getElementById('add-employee-panel').classList.add("open");
  }

  showSeedDataPopupView = () => {
    document.getElementById('seed-data-backdrop').classList.remove("hidden");
    document.getElementById('seed-data-popup').classList.remove("hidden");
  }

  showAssignmentsPopupView = () => {
    document.getElementById('details-data-backdrop').classList.remove("hidden");
    document.getElementById('details-popup').classList.remove("hidden");
  };

  showAddAssignPopup(content, button) {
    this.staticViews.addAssignmentPopup.createPopup(content, button);
  }

  showProjectInfoAssignPopup(content) {
    this.staticViews.addAssignmentPopup.renderProjectInfo(content);
  }

  showEditAssignPopup(content, button) {
    this.staticViews.editAssignmentPopup.createPopup(content, button);
  }

  showDeleteAssignPopup(content) {
    this.staticViews.deleteAssignmentPopup.createPopup(content);
  }

  showCalendarPopup(content) {
    this.staticViews.calendarPopup.createPopup(content);
  }
}

export default AppView ;
