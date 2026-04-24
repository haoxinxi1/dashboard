import AppModel from './AppModel';
import AppView from './AppView';
import ProjectModel from './ProjectModel';
import EmployeeModel from './EmployeeModel';
import AssignmentModel from './AssignmentModel';

class AppController {
  constructor () {
    this.appModel = new AppModel(this.setAppModelCallbacks());
    this.appView = new AppView(this.setAppViewCallbacks());
    this.appView.fillContentAll(this.setAppViewContent())
  }

  setAppModelCallbacks() {
    return {
      'appModelCB': {
        'onModelChange': this.onModelChange.bind(this),
      }
    }
  }

  setAppViewCallbacks() {
    return {
      'appViewCB': {},
      'sidePanelViewCB': {
        'onPeriodChangeMonth': this.onPeriodChangeMonth.bind(this),
        'onPeriodChangeYear': this.onPeriodChangeYear.bind(this),
      },
      'addProjectPanelCB': { 'onCreateProject': this.onCreateProject.bind(this), },
      'projectsContentViewCB': {},
      'addEmployeePanelCB': {},
      'employeesContentViewCB': {},
      'seedDataPopupViewCB': {}
    }
  }

  setAppViewContent() {
    return {
      'appViewContent': {},
      'sidePanelViewContent': {
        'currentPeriod': this.appModel.getCurrentPeriod(),
      }
    }
  }

  /* AppModel CB */
  onModelChange() {
    this.appView.fillContentAll(this.setAppViewContent());
  }

  /* SidePanelView CB */
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
}

export default AppController;
