import EmployeesContentView from './EmployeesContentView';
import ProjectsContentView from './ProjectsContentView';
import SidePanelView from './SidePanelView';
import AddEmployeePanel from './AddEmployeePanel';
import AddProjectPanel from './AddProjectPanel';
import SeedDataPopupView from './SeedDataPopupView';
import { bindEvent} from './utils'

class AppView {
  constructor (callbacks) {
    this.callbacks = callbacks.appView;
    this.staticViews = this.createStaticViews(callbacks);
    this.bindListeners();
  }

  createStaticViews (callbacks) {
    let staticViews = {};
    callbacks.employeesContentView['showAddEmployeePanelView'] = this.showAddEmployeePanelView;
    staticViews['employeesContentView'] = new EmployeesContentView(callbacks.employeesContentView);
    callbacks.projectsContentView['showAddProjectPanelView'] = this.showAddProjectPanelView;
    callbacks.projectsContentView['showSeedDataPopupView'] = this.showSeedDataPopupView;
    staticViews['projectsContentView'] = new ProjectsContentView(callbacks.projectsContentView);
    callbacks.sidePanelView['showProjects'] = this.showProjects;
    callbacks.sidePanelView['showEmployees'] = this.showEmployees;
    staticViews['sidePanelView'] = new SidePanelView(callbacks.sidePanelView);
    staticViews['addEmployeePanel'] = new AddEmployeePanel(callbacks.addEmployeePanel);
    staticViews['addProjectPanel'] = new AddProjectPanel(callbacks.addProjectPanel);
    staticViews['seedDataPopupView'] =  new SeedDataPopupView(callbacks.seedDataPopupView);
    return staticViews;
  }

  bindListeners() {
    bindEvent('click', '#open-button', this.hideOpenButton, this.showSidePanelView);
  }

  // render
  fillContentAll(content) {
    this.staticViews.sidePanelView.fillContent(content.sidePanelView);
    this.staticViews.seedDataPopupView.fillContent(content.seedDataPopupView);
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
}

export default AppView ;
