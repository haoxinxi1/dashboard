import { bindEvent} from './utils';

class ProjectsContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-project-btn', this.hideOpenButton, this.callbacks.showAddProjectPanelView);
    bindEvent('click', '#seed-data-btn', this.callbacks.showSeedDataPopupView);
    bindEvent('click', '#projects-table-body', this.handleBtnClick);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-project-btn').classList.add("hidden");
  }

  handleBtnClick = (e) => {
    let targetBtn = e.target.closest('.project-row-show-employees-btn');
    if (!targetBtn) targetBtn = e.target.closest('.project-row-delete-btn');
    if (!targetBtn) return;
    const projectID = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'show') this.handleShowAssignments(projectID);
    else if (action === 'delete') this.handleDeleteProject(projectID);
  }

  handleShowAssignments = (projectID) => {

  }

  handleDeleteProject = (projectID) => {

  }

  // render
  fillContent(content) {
    const tableBody = document.getElementById('projects-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    content.forEach((projectData) => {
      const el = this.createProjectRow(projectData);
      tableBody.appendChild(el);
    });
  }
    /**
   * Creates a project table row from the template.
   * @param {Object} data
   * @param {string} data.projectID
   * @param {string} data.companyName
   * @param {string} data.projectName
   * @param {number} data.budget
   * @param {number} data.rating
   * @param {number} data.income
   * @param {number} data.numberEmployees;
   * @returns {DocumentFragment}
   */
  createProjectRow({ projectID, companyName, projectName, budget, rating, income, numberEmployees }) {
    const template = document.getElementById('project-row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.project-row-company-name').textContent = companyName;
    clone.querySelector('.project-row-project-name').textContent = projectName;
    clone.querySelector('.project-row-budget').textContent = `$${budget.toFixed(2)}`;
    clone.querySelector('.project-row-rating').textContent = rating;
    clone.querySelector('.project-row-income').textContent = `$${income.toFixed(2)}`;

    const showEmployeesBtn = clone.querySelector('.project-row-show-employees-btn');
    showEmployeesBtn.dataset.id = projectID;
    showEmployeesBtn.dataset.action = 'show';
    showEmployeesBtn.textContent = `Show Employees (${numberEmployees})`;

    const deleteProjectBtn = clone.querySelector('.project-row-delete-btn');
    deleteProjectBtn.dataset.id = projectID;
    deleteProjectBtn.dataset.action = 'delete';

    return clone;
  }
}

export default ProjectsContentView;
