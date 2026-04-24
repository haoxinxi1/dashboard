import EmployeesContentView from './EmployeesContentView';
import ProjectsContentView from './ProjectsContentView';
import SidePanelView from './SidePanelView';
import AddEmployeePanel from './AddEmployeePanel';
import AddProjectPanel from './AddProjectPanel';
import SeedDataPopupView from './SeedDataPopupView';
import { bindEvent} from './utils'

class AppView {
  constructor (callbacks) {
    this.callbacks = callbacks.appViewCB;
    this.staticViews = this.createStaticViews(callbacks);
    this.bindListeners();
  }

  createStaticViews (callbacks) {
    let staticViews = {};
    staticViews['employeesContentView'] = new EmployeesContentView();
    staticViews['projectsContentView'] = new ProjectsContentView();
    callbacks.sidePanelViewCB['showProjects'] = this.showProjects;
    callbacks.sidePanelViewCB['showEmployees'] = this.showEmployees;
    staticViews['sidePanelView'] = new SidePanelView(callbacks.sidePanelViewCB);
    staticViews['addEmployeePanel'] = new AddEmployeePanel();
    staticViews['addProjectPanel'] = new AddProjectPanel();
    staticViews['seedDataPopupView'] =  new SeedDataPopupView();
    return staticViews;
  }

  bindListeners() {
    bindEvent('click', '#open-button', this.hideOpenButton, this.showSidePanelView);
  }

  // render
  fillContentAll(content) {
    this.staticViews.sidePanelView.fillContent(content.sidePanelViewContent);
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
}

export default AppView ;
