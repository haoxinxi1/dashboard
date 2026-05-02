import { bindEvent, applyFinancialStyle } from './utils';
import Formatter from './Formatter';

class DeleteAssignmentPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = null;
  }

  createPopup(content) {
    if (this.popup) return;
    this.popup = this.render(content);
    document.body.appendChild(this.popup);
    this.bindListeners();
  }

  deletePopup = () => {
    if (!this.popup) return;
    this.popup.remove();
    this.popup = null;
  };

  bindListeners() {
    bindEvent('click', '.unassignment-popup-content', (e) => e.stopPropagation());
    bindEvent('click', '.unassignment-popup-overlay', this.deletePopup);
    bindEvent('click', '.popup-cancel', this.deletePopup);
    bindEvent('click', '.popup-confirm-unassign', this.handleDeleteAssignmentClick);
  }

  handleDeleteAssignmentClick = () => {
    const assignmentID = this.popup.dataset.assignmentID;
    if (this.callbacks.onDeleteAssignment(assignmentID) === 1) this.deletePopup();
  };

  /**
   * Renders the unassignment confirmation popup from the template.
   * @param {Object} data
   * @param {string} data.assignmentID
   * @param {string} data.employeeName
   * @param {number} data.employeeCapacity
   * @param {string} data.projectName
   * @param {number} data.assignedCapacity
   * @param {number} data.salaryShare
   * @param {number} data.budgetShare
   * @param {number} data.estimatedIncome
   * @param {number} data.currentCapacity
   * @param {number} data.afterCapacity
   * @param {number} data.incomeNow
   * @param {number} data.incomeAfter
   */
  render({
    assignmentID,
    employeeName,
    employeeCapacity,
    projectName,
    assignedCapacity,
    salaryShare,
    budgetShare,
    estimatedIncome,
    currentCapacity,
    afterCapacity,
    incomeNow,
    incomeAfter,
  }) {
    const template = document.getElementById('unassignment-popup-template');
    const clone = template.content.cloneNode(true);
    const popup = clone.firstElementChild;
    popup.dataset.assignmentID = assignmentID;

    clone.querySelector('.employee-name').textContent = employeeName;
    clone.querySelector('.employee-capacity').textContent = Formatter.decimal1(employeeCapacity);
    clone.querySelector('.project-name').textContent = projectName;
    clone.querySelector('.assigned-capacity').textContent = Formatter.decimal1(assignedCapacity);
    clone.querySelector('.salary-share').textContent = salaryShare;
    clone.querySelector('.budget-share').textContent = budgetShare;
    clone.querySelector('.estimated-income').textContent = Formatter.currency(estimatedIncome);
    clone.querySelector('.current-capacity').textContent = Formatter.decimal1(currentCapacity);
    clone.querySelector('.after-capacity').textContent = Formatter.decimal1(afterCapacity);
    clone.querySelector('.income-now').textContent = Formatter.currency(incomeNow);
    clone.querySelector('.income-after').textContent = Formatter.currency(incomeAfter);

    applyFinancialStyle(clone.querySelector('.estimated-income'), estimatedIncome);
    applyFinancialStyle(clone.querySelector('.income-now'), incomeNow);
    applyFinancialStyle(clone.querySelector('.income-after'), incomeAfter);

    popup.style.display = 'flex';
    return popup;
  }
}

export default DeleteAssignmentPopup;
