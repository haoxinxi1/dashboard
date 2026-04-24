import { bindEvent} from './utils'

class AddEmployeePanel {
  constructor(callbacks){
    this.callbacks = callbacks;
    this.bindListeners();
  }
  bindListeners() {
    bindEvent('click', '#cancel-btn-form', this.showOpenButton, this.hideAddEmployeePanelView);
    bindEvent('click', '#add-btn-form', () => {
      const employeeData = {
        name: document.getElementById('name').value.trim(),
        surname: document.getElementById('surname').value.trim(),
        dateOfBirth: document.getElementById('dob').value,
        position: document.getElementById('position').value,
        salary: parseFloat(document.getElementById('salary').value),
      };
      this.callbacks.onCreateEmployee(employeeData);
    });
  }

    // handlers
  showOpenButton = () => {
    document.getElementById('add-employee-btn').classList.remove("hidden");
  }

  hideAddEmployeePanelView = () => {
    document.getElementById('add-employee-panel').classList.remove("open");
  }
}

export default AddEmployeePanel;
