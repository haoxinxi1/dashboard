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
      'appModel': {
        'onModelChange': this.onModelChange.bind(this),
      }
    }
  }

  setAppViewCallbacks() {
    return {
      'appView': {},
      'sidePanelView': {
        'onPeriodChangeMonth': this.onPeriodChangeMonth.bind(this),
        'onPeriodChangeYear': this.onPeriodChangeYear.bind(this),
      },
      'addProjectPanel': { 'onCreateProject': this.onCreateProject.bind(this), },
      'projectsContentView': {},
      'addEmployeePanel': {},
      'employeesContentView': {},
      'seedDataPopupView': {}
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
}

export default AppController;
