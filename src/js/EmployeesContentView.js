import FilterSortViewManager from './FilterSortViewManager';
import Formatter from './Formatter';
import { bindEvent, populatePositionSelect, toggleNoEntries } from './utils';

class EmployeesContentView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.chipContainerId = 'employee-filters-container';
    this.filterSortManager = new FilterSortViewManager('employees', this.chipContainerId, {
      onSort: callbacks.onSort,
      onFilter: callbacks.onFilter,
    });
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#add-employee-btn', this.hideOpenButton, this.callbacks.showAddEmployeePanelView);
    bindEvent('click', '#employees-table-head', this.handleBtnClickHead);
    bindEvent('click', '#employees-table-body', this.handleBtnClickRow);
    bindEvent('change', '#employees-table-body', this.handleSelectChange);
    bindEvent('keydown', '#employees-table-body', this.handleInlineKeydown);
    bindEvent('focusout', 'body', this.handleInlineEdit);
    bindEvent('click', `#${this.chipContainerId}`, this.filterSortManager.handleChipClick);
  }

  // handlers
  hideOpenButton = () => {
    document.getElementById('add-employee-btn').classList.add('hidden');
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
    const editableCell = e.target.closest('.editable-position') || e.target.closest('.editable-salary');
    if (editableCell) {
      this.activateInlineEdit(editableCell);
      return;
    }

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

  activateInlineEdit = (cell) => {
    const isPosition = cell.classList.contains('editable-position');
    const editElement = cell.querySelector(isPosition ? '.inline-edit-select' : '.inline-edit-input');
    if (!editElement.classList.contains('hidden')) return;
    const span = cell.querySelector('.display-text');
    span.classList.add('hidden');
    editElement.classList.remove('hidden');
    editElement.focus();
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

  handleInlineEdit = (e) => {
    const target = e.target;
    if (target.classList.contains('inline-edit-input')) {
      const employeeID = target.closest('.editable-salary').dataset.employeeId;
      this.callbacks.onUpdateSalary(employeeID, target.value);
    }
  };

  handleSelectChange = (e) => {
    const target = e.target;
    if (!target.classList.contains('inline-edit-select')) return;
    const employeeID = target.closest('.editable-position').dataset.employeeId;
    this.callbacks.onUpdatePosition(employeeID, target.value);
  };

  handleInlineKeydown = (e) => {
    if (e.key !== 'Enter') return;
    const target = e.target;
    if (!target.classList.contains('inline-edit-input')) return;
    target.blur(); // triggers focusout → handleInlineEdit saves the value
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
    toggleNoEntries('employees-table-body', content.length);
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
    clone.querySelector('.employee-row-position .display-text').textContent = position;

    const positionSelect = clone.querySelector('.inline-edit-select');
    populatePositionSelect(positionSelect, position);
    clone.querySelector('.editable-position').dataset.employeeId = employeeID;

    clone.querySelector('.employee-row-salary .display-text').textContent = Formatter.currency(salary);
    clone.querySelector('.inline-edit-input').value = salary;
    clone.querySelector('.editable-salary').dataset.employeeId = employeeID;

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
