class ProjectsContentView {
  constructor(callbacks) {
    this.callbacks = callbacks.projectsContentViewCB;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-project-button', this.hideOpenButton, this.callbacks.showAddProjectPanelView);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-project-button').classList.add("hidden");
  }

}

export default ProjectsContentView;
