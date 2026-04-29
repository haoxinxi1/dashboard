import { bindEvent } from './utils';

class EmployeesContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
    this.sortColumn;
    this.isAscendingOrder = false;
  }

  bindListeners() {
    bindEvent('click', '#add-employee-btn', this.hideOpenButton, this.callbacks.showAddEmployeePanelView);
    bindEvent('click', '#employees-table-head', this.handleBtnClickHead);
    bindEvent('click', '#employees-table-body', this.handleBtnClickRow);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-employee-btn').classList.add('hidden');
  };

  handleBtnClickHead = (e) => {
    let targetBtn = e.target.closest('.filter-icon');
    if (targetBtn) {
      this.handleFilterBtnClick(targetBtn);
      return;
    }
    targetBtn = e.target.closest('.sort-icon');
    if (targetBtn) {
      this.handleSortBtnClick(targetBtn);
    }
  };

  handleSortBtnClick(targetBtn) {
    const column = targetBtn.closest('th').dataset.sort;
    this.sortColumn = column;
    this.isAscendingOrder = !this.isAscendingOrder;
    const criteria = {
      tab: 'employees',
      column: column,
      ascending: this.isAscendingOrder,
    }
    this.callbacks.onSort(criteria);
    if (this.isAscendingOrder) targetBtn.textContent = '↑';
    else targetBtn.textContent = '↓';
  }

  handleFilterBtnClick(targetBtn) {

  }


  handleBtnClickRow = (e) => {
    let targetBtn = e.target.closest('.employee-row-show-assignments-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-availability-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-assign-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-delete-btn');
    if (!targetBtn) return;
    const employeeID = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'show') this.handleShowAssignments(employeeID);
    else if (action === 'check-schedule') this.callbacks.handleCheckSchedule(employeeID);
    else if (action === 'assign') this.callbacks.onAssignEmployee(targetBtn, employeeID);
    else if (action === 'delete') this.handleDeleteEmployee(employeeID, targetBtn.dataset.name);
  };

  handleShowAssignments = (employeeID) => {
    this.callbacks.showAssignmentsPopupView();
    this.callbacks.getContentAssignmentsPopup('employee', employeeID);
  };

  handleDeleteEmployee = (employeeID, employeeName) => {
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      this.callbacks.onDeleteEmployee(employeeID);
    }
  };

  // render
  fillContent(content) {
    const tableBody = document.getElementById('employees-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    content.forEach((employeeData) => {
      const el = this.createEmployeeRow(employeeData);
      tableBody.appendChild(el);
    });
  }
  /**
   * Creates an employee table row from the template.
   * @param {Object} data
   * @param {string} data.employeeID
   * @param {string} data.name
   * @param {string} data.surname
   * @param {number} data.age
   * @param {string} data.position
   * @param {string} data.salary
   * @param {string} data.estimatedPayment
   * @param {string} data.projectedIncome
   * @param {number} data.numberProjects;
   * @param {string} data.capacityUsage;
   * @returns {DocumentFragment}
   */
  createEmployeeRow({
    employeeID,
    name,
    surname,
    age,
    position,
    salary,
    estimatedPayment,
    projectedIncome,
    numberProjects,
    capacityUsage,
  }) {
    const template = document.getElementById('employee-row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.employee-row-first-name').textContent = name;
    clone.querySelector('.employee-row-last-name').textContent = surname;
    clone.querySelector('.employee-row-age').textContent = age;
    clone.querySelector('.employee-row-position').textContent = position;
    clone.querySelector('.employee-row-salary').textContent = salary;
    clone.querySelector('.employee-row-monthly-salary').textContent = estimatedPayment;
    clone.querySelector('.employee-row-income').textContent = projectedIncome;

    const showProjectsBtn = clone.querySelector('.employee-row-show-assignments-btn');
    showProjectsBtn.dataset.id = employeeID;
    showProjectsBtn.dataset.action = 'show';
    showProjectsBtn.textContent = `Show Assignments (${numberProjects}) ${capacityUsage}`;

    clone.querySelector('.employee-row-availability-btn').dataset.id = employeeID;
    clone.querySelector('.employee-row-availability-btn').dataset.action = 'check-schedule';

    clone.querySelector('.employee-row-assign-btn').dataset.id = employeeID;
    clone.querySelector('.employee-row-assign-btn').dataset.action = 'assign';

    const deleteBtn = clone.querySelector('.employee-row-delete-btn');
    deleteBtn.dataset.id = employeeID;
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.name = `${name} ${surname}`;

    return clone;
  }
}

export default EmployeesContentView;
