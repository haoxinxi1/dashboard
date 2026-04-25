import { bindEvent} from './utils';

class ProjectsContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-project-btn', this.hideOpenButton, this.callbacks.showAddProjectPanelView);
    bindEvent('click', '#seed-data-btn', this.callbacks.showSeedDataPopupView);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-project-btn').classList.add("hidden");
  }


}

export default ProjectsContentView;
