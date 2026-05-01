import { bindEvent, toggleNoEntries } from './utils';
import Formatter from './Formatter';

class AssignmentsPopupView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = document.getElementById('details-popup');
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#details-data-backdrop', this.hideAssignmentsPopupView);
    bindEvent('click', '#close-details-popup-btn', this.hideAssignmentsPopupView);
    bindEvent('click', '#assignments-table-body', this.handleBtnClick);
  }

  // handlers
  hideAssignmentsPopupView = () => {
    document.getElementById('details-data-backdrop').classList.add('hidden');
    this.popup.classList.add('hidden');
    this.callbacks.onCloseAssignmentsPopup();
  };

  handleBtnClick = (e) => {
    let targetBtn = e.target.closest('.edit-assignment-btn');
    if (!targetBtn) targetBtn = e.target.closest('.unassign-action-btn');
    if (!targetBtn) return;
    const id = targetBtn.dataset.id;
    const action = targetBtn.dataset.action;
    if (action === 'edit') this.callbacks.onStartEditAssignment(targetBtn, id);
    else if (action === 'unassign') this.callbacks.handleStartDeleteAssignment(id);
  };

  // render
  fillContent(content) {
    if (content.header === undefined) return;

    this.popup.querySelector('#details-popup-header').textContent = content.header;
    this.popup.querySelector('#details-first-col-header').textContent = content.firstColHeader;

    const tableBody = document.getElementById('assignments-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    content.data.forEach((row) => {
      const el = this.createAssignmentDataRow(row);
      tableBody.appendChild(el);
    });
    toggleNoEntries('assignments-table-body', content.data.length);
  }

  /**
   * Creates an assignment detail row from the template
   * @param {Object} data
   * @param {string} data.assignmentID
   * @param {string} data.linkText
   * @param {string} data.linkHref
   * @param {string} data.capacity
   * @param {string} data.fit
   * @param {string} data.vacation
   * @param {number} data.effective
   * @param {number} data.revenue
   * @param {number} data.cost
   * @param {number} data.profit
   * @returns {DocumentFragment}
   */
  createAssignmentDataRow({
    assignmentID,
    linkText,
    linkHref,
    capacity,
    fit,
    vacation,
    effective,
    revenue,
    cost,
    profit,
  }) {
    const template = document.getElementById('details-row-template');
    const clone = template.content.cloneNode(true);

    const link = clone.querySelector('.details-action-link');
    link.textContent = linkText;
    link.href = linkHref || '#';

    clone.querySelector('.detail-capacity').textContent = capacity;
    clone.querySelector('.detail-fit').textContent = fit;
    clone.querySelector('.detail-vacation').textContent = vacation;
    clone.querySelector('.detail-effective').textContent = Formatter.decimal3(effective);
    clone.querySelector('.detail-revenue').textContent = Formatter.currency(revenue);
    clone.querySelector('.detail-cost').textContent = Formatter.currency(cost);

    const profitCell = clone.querySelector('.detail-profit');
    profitCell.textContent = Formatter.currency(profit);
    applyFinancialStyle(profitCell, profit);

    const editBtn = clone.querySelector('.edit-assignment-btn');
    editBtn.dataset.id = assignmentID;
    editBtn.dataset.action = 'edit';

    const unassignBtn = clone.querySelector('.unassign-action-btn');
    unassignBtn.dataset.id = assignmentID;
    unassignBtn.dataset.action = 'unassign';

    return clone;
  }
}

export default AssignmentsPopupView;
