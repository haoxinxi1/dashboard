import { bindEvent} from './utils'

class AddProjectPanel {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.formTouched = false;
    this.fields = document.querySelectorAll('#add-project-form input');
    this.bindListeners();
    this.bindValidation();
  }

  bindListeners() {
    bindEvent('click', '#cancel-project-btn-form', this.showOpenButton, this.hideAddProjectPanelView);
    bindEvent('click', '#add-project-btn-form', () => {
      const projectData = {
        projectName: document.getElementById('project-name').value.trim(),
        companyName: document.getElementById('company-name').value.trim(),
        budget: parseFloat(document.getElementById('project-budget').value),
        employeeCapacity: parseInt(document.getElementById('employee-capacity').value, 10),
      };
      this.callbacks.onCreateProject(projectData);
    });
  }

    // handlers
  showOpenButton = () => {
    document.getElementById('add-project-btn').classList.remove("hidden");
  }

  hideAddProjectPanelView = () => {
    document.getElementById('add-project-panel').classList.remove("open");
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
      const isValid = field.checkValidity();
      field.classList.toggle('invalid', !isValid);
      document.getElementById(`${field.id}-error`).style.display = isValid ? 'none' : 'block';
      if (!isValid) allValid = false;
    });
    document.getElementById('add-project-btn-form').disabled = !allValid;
  }
}

export default AddProjectPanel;
