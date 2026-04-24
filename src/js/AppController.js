import AppModel from './AppModel';
import AppView from './AppView';

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
}

export default AppController;
