import { bindEvent } from './utils';

class EmployeesContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-employee-btn', this.hideOpenButton, this.callbacks.showAddEmployeePanelView);
    bindEvent('click', '#employees-table-body', this.handleBtnClick);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-employee-btn').classList.add('hidden');
  };

  handleBtnClick = (e) => {
    let targetBtn = e.target.closest('.employee-row-show-assignments-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-availability-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-assign-btn');
    if (!targetBtn) targetBtn = e.target.closest('.employee-row-delete-btn');
    if (!targetBtn) return;
    const employeeID = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'show') this.handleShowAssignments(employeeID);
    else if (action === 'check-schedule') this.handleCheckSchedule(employeeID);
    else if (action === 'assign') this.onAssign(employeeID);
    else if (action === 'delete') this.handleDeleteEmployee(employeeID);
  };

  handleShowAssignments = (employeeID) => {
    this.callbacks.showAssignmentsPopupView();
    this.callbacks.getContentAssignmentsPopup('employee', employeeID);
  };

  handleCheckSchedule = (employeeID) => {};

  onAssign = (employeeID) => {};

  handleDeleteEmployee = (employeeID) => {};

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
   * @param {string} data.firstName
   * @param {string} data.lastName
   * @param {number} data.age
   * @param {string} data.position
   * @param {string} data.salary
   * @param {string} data.monthlySalary
   * @param {string} data.income
   * @param {number} data.numberProjects;
   * @param {string} data.capacityUsage;
   * @returns {DocumentFragment}
   */
  createEmployeeRow({
    employeeID,
    firstName,
    lastName,
    age,
    position,
    salary,
    monthlySalary,
    income,
    numberProjects,
    capacityUsage,
  }) {
    const template = document.getElementById('employee-row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.employee-row-first-name').textContent = firstName;
    clone.querySelector('.employee-row-last-name').textContent = lastName;
    clone.querySelector('.employee-row-age').textContent = age;
    clone.querySelector('.employee-row-position').textContent = position;
    clone.querySelector('.employee-row-salary').textContent = salary;
    clone.querySelector('.employee-row-monthly-salary').textContent = monthlySalary;
    clone.querySelector('.employee-row-income').textContent = income;

    const showProjectsBtn = clone.querySelector('.employee-row-show-assignments-btn');
    showProjectsBtn.dataset.id = employeeID;
    showProjectsBtn.dataset.action = 'show';
    showProjectsBtn.textContent = `Show Assignments (${numberProjects}) ${capacityUsage}`;

    clone.querySelector('.employee-row-availability-btn').dataset.id = employeeID;
    clone.querySelector('.employee-row-availability-btn').dataset.action = 'check-schedule';

    clone.querySelector('.employee-row-assign-btn').dataset.id = employeeID;
    clone.querySelector('.employee-row-assign-btn').dataset.action = 'assign';

    clone.querySelector('.employee-row-delete-btn').dataset.id = employeeID;
    clone.querySelector('.employee-row-delete-btn').dataset.action = 'delete';

    return clone;
  }
}

export default EmployeesContentView;
