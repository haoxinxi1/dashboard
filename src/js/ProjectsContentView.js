import { bindEvent} from './utils';

class ProjectsContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-project-btn', this.hideOpenButton, this.callbacks.showAddProjectPanelView);
    bindEvent('click', '#seed-data-btn', this.callbacks.showSeedDataPopupView);
    // bindEvent('click', '#projects-table-body', this.handle);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-project-btn').classList.add("hidden");
  }


}

export default ProjectsContentView;
