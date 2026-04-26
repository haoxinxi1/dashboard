import { bindEvent } from './utils';

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
    document.getElementById('add-project-btn').classList.add('hidden');
  };

  handleBtnClick = (e) => {
    let targetBtn = e.target.closest('.project-row-show-employees-btn');
    if (!targetBtn) targetBtn = e.target.closest('.project-row-delete-btn');
    if (!targetBtn) return;
    const projectID = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'show') this.handleShowAssignments(projectID);
    else if (action === 'delete') this.handleDeleteProject(projectID);
  };

  handleShowAssignments = (projectID) => {};

  handleDeleteProject = (projectID) => {};

  // render
  fillContent(content) {
    const tableBody = document.getElementById('projects-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    content.projectsRows.forEach((row) => {
      const el = this.createProjectRow(row);
      tableBody.appendChild(el);
    });
    const resume = document.getElementById('projects-total-income');
    if (content.hasProjects) {
      resume.querySelector('.total-amount').textContent = `${content.totalIncome}`;
      resume.querySelector('.bench-payments').textContent = `(Bench payments: ${content.benchIncome})`;
      resume.classList.remove('hidden');
      const totalEl = resume.querySelector('.total-amount');
      if (content.isIncomeNegative) {
        totalEl.classList.add('negative-income');
      } else {
        totalEl.classList.remove('negative-income');
      }
    } else {
      resume.classList.add('hidden');
    }
  }
  /**
   * Creates a project table row from the template
   * @param {Object} data
   * @param {string} data.projectID
   * @param {string} data.companyName
   * @param {string} data.projectName
   * @param {string} data.budget
   * @param {string} data.rating
   * @param {string} data.income
   * @param {number} data.numberEmployees
   * @returns {DocumentFragment}
   */
  createProjectRow({ projectID, companyName, projectName, budget, rating, income, numberEmployees }) {
    const template = document.getElementById('project-row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.project-row-company-name').textContent = companyName;
    clone.querySelector('.project-row-project-name').textContent = projectName;
    clone.querySelector('.project-row-budget').textContent = budget;
    clone.querySelector('.project-row-rating').textContent = rating;
    clone.querySelector('.project-row-income').textContent = income;

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
