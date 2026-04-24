import EmployeesContentView from './EmployeesContentView';
import ProjectsContentView from './ProjectsContentView';
import SidePanelView from './SidePanelView';
import AddEmployeePanel from './AddEmployeePanel';
import AddProjectPanel from './AddProjectPanel';
import SeedDataPopupView from './SeedDataPopupView';

class AppView {
  constructor (callbacks) {
    this.callbacks = callbacks;
    this.staticViews = this.createStaticViews();
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
}

export default AppView ;
