import { bindEvent } from './utils';

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
   * @param {string} data.employeeCapacity
   * @param {string} data.projectName
   * @param {string} data.assignedCapacity
   * @param {string} data.salaryShare
   * @param {string} data.budgetShare
   * @param {string} data.estimatedIncome
   * @param {string} data.currentCapacity
   * @param {string} data.afterCapacity
   * @param {string} data.incomeNow
   * @param {string} data.incomeAfter
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
    isNegativeEstimated,
    isNegativeNow,
    isNegativeAfter
  }) {
    const template = document.getElementById('unassignment-popup-template');
    const clone = template.content.cloneNode(true);
    const popup = clone.firstElementChild;
    popup.dataset.assignmentID = assignmentID;

    clone.querySelector('.employee-name').textContent = employeeName;
    clone.querySelector('.employee-capacity').textContent = employeeCapacity;
    clone.querySelector('.project-name').textContent = projectName;
    clone.querySelector('.assigned-capacity').textContent = assignedCapacity;
    clone.querySelector('.salary-share').textContent = salaryShare;
    clone.querySelector('.budget-share').textContent = budgetShare;
    clone.querySelector('.estimated-income').textContent = estimatedIncome;
    clone.querySelector('.current-capacity').textContent = currentCapacity;
    clone.querySelector('.after-capacity').textContent = afterCapacity;
    clone.querySelector('.income-now').textContent = incomeNow;
    clone.querySelector('.income-after').textContent = incomeAfter;

    clone.querySelector('.estimated-income').classList.toggle('negative-income', isNegativeEstimated);
    clone.querySelector('.income-now').classList.toggle('negative-income', isNegativeNow);
    clone.querySelector('.income-after').classList.toggle('negative-income', isNegativeAfter);

    popup.style.display = 'flex';
    return popup;
  }
}

export default DeleteAssignmentPopup;
