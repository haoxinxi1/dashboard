import { bindEvent } from './utils'

class SidePanelView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click' ,'#toggle-button', this.hideSidePanelView, this.showOpenButton);
    bindEvent('change' ,'#month-select', this.callbacks.onPeriodChangeMonth);
    bindEvent('change' ,'#year-select', this.callbacks.onPeriodChangeYear);
    bindEvent('click' ,'#nav-projects', this.callbacks.showProjects, this.setProjectsActive);
    bindEvent('click' ,'#nav-employees', this.callbacks.showEmployees, this.setEmployeesActive);
  }

  // handlers

  showOpenButton = () => {
    document.getElementById('open-button').classList.remove("hidden");
    // debug
    const btn = document.getElementById('open-button');
    console.log('showOpenButton called, btn:', btn, 'classList:', btn?.classList);
  }

  hideSidePanelView = () => {
    document.getElementById('side-panel').classList.add("hidden");
  }

  setProjectsActive = () => {
    document.getElementById('nav-projects').classList.add('active');
    document.getElementById('nav-employees').classList.remove('active');
  }

  setEmployeesActive = () => {
    document.getElementById('nav-projects').classList.remove('active');
    document.getElementById('nav-employees').classList.add('active');
  }

  // render
  fillContent(content) {
    const year = content.currentPeriod.split('-')[0];
    const month = content.currentPeriod.split('-')[1];
    document.getElementById('month-select').value = month;
    document.getElementById('year-select').value = year;
  }
}

export default SidePanelView;
