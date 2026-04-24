import EmployeesContentView from './EmployeesContentView';
import ProjectsContentView from './ProjectsContentView';
import SidePanelView from './SidePanelView';
import AddEmployeePanel from './AddEmployeePanel';
import AddProjectPanel from './AddProjectPanel';
import SeedDataPopupView from './SeedDataPopupView';
import { bindClick } from './utils'

class AppView {
  constructor (callbacks) {
    this.callbacks = callbacks;
    this.staticViews = this.createStaticViews();
    this.init();
  }

  createStaticViews () {
    let staticViews = {};
    staticViews['employeesContentView'] = new EmployeesContentView();
    staticViews['projectsContentView'] = new ProjectsContentView();
    staticViews['sidePanelView'] = new SidePanelView();
    staticViews['addEmployeePanel'] = new AddEmployeePanel();
    staticViews['addProjectPanel'] = new AddProjectPanel();
    staticViews['seedDataPopupView'] =  new SeedDataPopupView();
    return staticViews;
  }

  init() {
    let openButton = document.getElementById('#open-button')
    bindClick('#open-button', this.hideOpenButton, this.showSidePanelView);
  }

  hideOpenButton = () => {
    document.getElementById('#open-button').classList.add("hidden");
  }

  showSidePanelView = () => {
    document.getElementById('#hide-panel').classList.remove("hidden");
  }

}

export default AppView ;
