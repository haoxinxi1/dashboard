import { bindEvent, toggleNoEntries } from './utils'
import { MONTHS } from './constants.js';

class SeedDataPopupView {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.currentPeriod = null;
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#seed-data-backdrop', this.hideSeedDataPopupView);
    bindEvent('click', '#close-seed-popup-btn', this.hideSeedDataPopupView);
    bindEvent('click', '#seed-data-table-body', this.handleSeedClick);
  }

  // handlers
  hideSeedDataPopupView = () => {
    document.getElementById('seed-data-backdrop').classList.add("hidden");
    document.getElementById('seed-data-popup').classList.add("hidden");
  }

  handleSeedClick = (e) => {
    const targetBtn = e.target.closest('.seed-month-btn');
    if (!targetBtn) return;
    const periodChosen = targetBtn.dataset.period;
    const [year, month] = periodChosen.split('-');
    const [yearCur, monthCur] = this.currentPeriod.split('-');
    if (confirm(`Copy data from ${MONTHS[Number(month)]} ${year} to ${MONTHS[Number(monthCur)]} ${yearCur}?`)) {
      this.callbacks.onSeedChosenMonth(periodChosen);
    }
  }

    // render
  fillContent(content) {
    this.currentPeriod = content.currentPeriod;
    const [year, monthIndex] = this.currentPeriod.split('-');
    document.getElementById('current-month-display').textContent = `${MONTHS[Number(monthIndex)]} ${year}`;
    const tableBody = document.getElementById('seed-data-table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    content.monthsData.forEach((data) => {
      const el = this.createSeedDataRow(data);
      tableBody.appendChild(el);
    });
    toggleNoEntries('seed-data-table-body', content.monthsData.length);
  }

    /**
   * Creates a seed data table row from the template.
   * @param {Object} data
   * @param {string} data.period
   * @param {number} data.projects
   * @param {number} data.employees
   * @param {string} data.income
   * @param {boolean} data.isNegative
   * @returns {DocumentFragment}
   */
  createSeedDataRow({ period, projects, employees, income, isNegative }) {
    const template = document.getElementById('seed-data-row-template');
    const clone = template.content.cloneNode(true);

    const [year, monthIndex] = period.split('-');
    clone.querySelector('.seed-year').textContent = year;
    clone.querySelector('.seed-month').textContent = MONTHS[Number(monthIndex)];
    clone.querySelector('.seed-projects').textContent = projects;
    clone.querySelector('.seed-employees').textContent = employees;

    const incomeCell = clone.querySelector('.seed-income');
    incomeCell.textContent = income;
    if (isNegative) incomeCell.classList.add('negative-income');

    clone.querySelector('.seed-month-btn').dataset.period = period;

    return clone;
  }
}

export default SeedDataPopupView;
