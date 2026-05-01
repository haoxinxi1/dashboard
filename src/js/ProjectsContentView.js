import FilterSortViewManager from './FilterSortViewManager';
import Formatter from './Formatter';
import { bindEvent, toggleNoEntries, applyFinancialStyle } from './utils';

class ProjectsContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.chipContainerId = 'project-filters-container';
    this.filterSortManager = new FilterSortViewManager('projects', this.chipContainerId, {
      onSort: callbacks.onSort,
      onFilter: callbacks.onFilter,
    });
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-project-btn', this.hideOpenButton, this.callbacks.showAddProjectPanelView);
    bindEvent('click', '#seed-data-btn', this.callbacks.showSeedDataPopupView);
    bindEvent('click', '#projects-table-head', this.handleBtnClickHead);
    bindEvent('click', '#projects-table-body', this.handleBtnClickRow);
    bindEvent('click', `#${this.chipContainerId}`, this.filterSortManager.handleChipClick);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-project-btn').classList.add('hidden');
  };

  handleBtnClickHead = (e) => {
    let targetBtn = e.target.closest('.filter-icon');
    if (targetBtn) {
      this.filterSortManager.handleFilterBtnClick(targetBtn);
      return;
    }
    targetBtn = e.target.closest('.sort-icon');
    if (targetBtn) {
      this.filterSortManager.handleSortBtnClick(targetBtn);
    }
  };

  handleBtnClickRow = (e) => {
    let targetBtn = e.target.closest('.project-row-show-employees-btn');
    if (!targetBtn) targetBtn = e.target.closest('.project-row-delete-btn');
    if (!targetBtn) return;
    const projectID = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'show') this.handleShowAssignments(projectID);
    else if (action === 'delete') this.handleDeleteProject(projectID, targetBtn.dataset.name);
  };

  handleShowAssignments = (projectID) => {
    this.callbacks.showAssignmentsPopupView(); // appView cb
    this.callbacks.getContentAssignmentsPopup('project', projectID); // controller cb
  };

  handleDeleteProject = (projectID, projectName) => {
    if (confirm(`Are you sure you want to delete project "${projectName}"? All employees will be unassigned.`)) {
      this.callbacks.onDeleteProject(projectID);
    }
  };

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
    toggleNoEntries('projects-table-body', content.projectsRows.length);
    const resume = document.getElementById('projects-total-income');
    if (content.hasProjects) {
      resume.querySelector('.total-amount').textContent = `${Formatter.currency(content.totalIncome)}`;
      resume.querySelector('.bench-payments').textContent =
        `(Bench payments: ${Formatter.currency(content.benchIncome)})`;
      resume.classList.remove('hidden');
      applyFinancialStyle(resume.querySelector('.total-amount'), content.totalIncome);
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
   * @param {string} data.employeeCapacityUsed
   * @param {string} data.employeeCapacityFull
   * @param {string} data.income
   * @param {number} data.numberEmployees
   * @returns {DocumentFragment}
   */
  createProjectRow({
    projectID,
    companyName,
    projectName,
    budget,
    employeeCapacityUsed,
    employeeCapacityFull,
    income,
    numberEmployees,
  }) {
    const template = document.getElementById('project-row-template');
    const clone = template.content.cloneNode(true);
    const employeeCapText = `${Formatter.decimal2(employeeCapacityUsed)}/${Formatter.decimal0(employeeCapacityFull)}`;

    clone.querySelector('.project-row-company-name').textContent = companyName;
    clone.querySelector('.project-row-project-name').textContent = projectName;
    clone.querySelector('.project-row-budget').textContent = Formatter.currency(budget);
    clone.querySelector('.project-row-rating').textContent = employeeCapText;
    clone.querySelector('.project-row-income').textContent = Formatter.currency(income);
    applyFinancialStyle(clone.querySelector('.project-row-income'), income);

    const showEmployeesBtn = clone.querySelector('.project-row-show-employees-btn');
    showEmployeesBtn.dataset.id = projectID;
    showEmployeesBtn.dataset.action = 'show';
    showEmployeesBtn.textContent = `Show Employees (${numberEmployees})`;

    const deleteProjectBtn = clone.querySelector('.project-row-delete-btn');
    deleteProjectBtn.dataset.id = projectID;
    deleteProjectBtn.dataset.action = 'delete';
    deleteProjectBtn.dataset.name = projectName;

    return clone;
  }
}

export default ProjectsContentView;
