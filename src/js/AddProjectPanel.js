class AddProjectPanel {
  constructor(callbacks){
    this.callbacks = callbacks.addProjectPanelCB;
    this.bindListeners();
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
    document.getElementById('add-project-button').classList.remove("hidden");
  }

  hideAddProjectPanelView = () => {
    document.getElementById('add-project-panel').classList.remove("open");
  }

}

export default AddProjectPanel;
