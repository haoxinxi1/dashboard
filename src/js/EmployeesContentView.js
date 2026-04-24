import { bindEvent} from './utils';

class EmployeesContentView {
    constructor(callbacks) {
      this.callbacks = callbacks;
      this.bindListeners();
    }

    bindListeners() {
      bindEvent('click', '#add-employee-btn', this.hideOpenButton, this.callbacks.showAddEmployeePanelView);
    }

    // handlers
    hideOpenButton = () => {
      document.getElementById('add-employee-btn').classList.add("hidden");
    }
}

export default EmployeesContentView;
