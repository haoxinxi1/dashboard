import { bindEvent, populatePositionSelect} from './utils';

class AddEmployeePanel {
  constructor(callbacks){
    this.callbacks = callbacks;
    this.formTouched = false;
    this.fields = document.querySelectorAll('#add-employee-form input, #add-employee-form select');
    this.bindListeners();
    this.bindValidation();
    this.renderPositions();
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
    }, this.showOpenButton, this.hideAddEmployeePanelView);
  }

    // handlers
  showOpenButton = () => {
    document.getElementById('add-employee-btn').classList.remove("hidden");
  }

  hideAddEmployeePanelView = () => {
    document.getElementById('add-employee-panel').classList.remove("open");
  }

  // reset
  resetForm() {
    document.getElementById('add-employee-form').reset();
    this.formTouched = false;
    this.fields.forEach(field => {
      field.classList.remove('invalid');
      document.getElementById(`${field.id}-error`).style.display = 'none';
    });
    document.getElementById('add-btn-form').disabled = true;
  }

  // render positions
  renderPositions() {
    populatePositionSelect(document.getElementById('position'));
  }

  // validation
  bindValidation() {
    this.fields.forEach(field => {
      bindEvent('blur', `#${field.id}`, () => {
        this.formTouched = true;
        this.validateAll();
      });
      bindEvent('input', `#${field.id}`, () => {
        if (this.formTouched) this.validateAll();
      });
    });
  }

  validateAll() {
    let allValid = true;
    this.fields.forEach(field => {
      const isValid = field.id === 'dob' ? this.isAtLeast18(field.value) : field.checkValidity();
      field.classList.toggle('invalid', !isValid);
      document.getElementById(`${field.id}-error`).style.display = isValid ? 'none' : 'block';
      if (!isValid) allValid = false;
    });
    document.getElementById('add-btn-form').disabled = !allValid;
  }

  isAtLeast18(value) {
    if (!value) return false;
    const dob = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
  }
}

export default AddEmployeePanel;
