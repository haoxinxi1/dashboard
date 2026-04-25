import { bindEvent} from './utils'
import { MONTHS } from './constants.js';

class SeedDataPopupView {
  constructor() {
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#seed-data-backdrop', this.hideSeedDataPopupView);
    bindEvent('click', '#close-seed-popup-btn', this.hideSeedDataPopupView);
  }

  // handlers
  hideSeedDataPopupView = () => {
    document.getElementById('seed-data-backdrop').classList.add("hidden");
    document.getElementById('seed-data-popup').classList.add("hidden");
  }

    // render
  fillContent(content) {
    const monthIndex = content.currentPeriod.split('-')[1];
    const year = content.currentPeriod.split('-')[0];
    document.getElementById('current-month-display').textContent = `${MONTHS[monthIndex]} ${year}`;
    // TODO
  }

    /**
   * Creates a seed data table row from the template.
   * @param {Object} data
   * @param {string} data.period
   * @param {number} data.projects
   * @param {number} data.employees
   * @param {number} data.income
   * @returns {DocumentFragment}
   */
  createSeedDataRow({ year, month, monthIndex, projects, employees, income }) {
    const template = document.getElementById('seed-data-row-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.seed-year').textContent = year;
    clone.querySelector('.seed-month').textContent = month;
    clone.querySelector('.seed-projects').textContent = projects;
    clone.querySelector('.seed-employees').textContent = employees;

    const incomeCell = clone.querySelector('.seed-income');
    incomeCell.textContent = `$${income.toFixed(2)}`;
    if (income < 0) incomeCell.classList.add('negative-income');

    clone.querySelector('.seed-month-btn').dataset.period = `${year}-${monthIndex}`;

    return clone;
  }
}

export default SeedDataPopupView;
