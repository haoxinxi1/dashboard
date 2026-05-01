import { bindEvent } from './utils';
import { MONTHS } from './constants';

class CalendarPopup {

  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = null;
    this.selected = [];
    this.workingDaysTotal = 0;
    this.workingDaysAbsent = 0;
    this.currentPeriod = '';
    this.employeeID = '';
  }

  createPopup(content) {
    if (this.popup) return;
    this.selected = content.vacationDays;
    this.workingDaysTotal = content.workingDaysTotal;
    this.workingDaysAbsent = content.workingDaysAbsent;
    this.currentPeriod = content.currentPeriod;
    this.employeeID = content.employeeID;
    [this.popup, this.container] = this.render(content.employeeName);
    this.fillCalendar(content.currentPeriod, content.vacationDays);
    document.body.appendChild(this.popup);
    this.bindListeners();
  }

  deletePopup = () => {
    if (!this.popup) return;
    this.popup.remove();
    this.popup = null;
    this.selected = [];
    this.workingDaysTotal = 0;
    this.workingDaysAbsent = 0;
    this.currentPeriod = '';
    this.employeeID = '';
  };

  bindListeners() {
    bindEvent('click', '.calendar-popup', (e) => e.stopPropagation());
    bindEvent('click', '.popup-backdrop', this.deletePopup);
    bindEvent('click', '.close-calendar-btn', this.deletePopup);
    bindEvent('click', '.calendar-grid', this.handleDayClick);
    bindEvent('click', '.set-vacation-btn', this.handleSetVacation);
  }

  // handlers
  handleDayClick = (e) => {
    const cell = e.target.closest('.calendar-day');
    if (!cell || cell.classList.contains('empty')) return;

    const day = cell.id.replace('day-', '');
    cell.classList.toggle('selected');

    if (this.selected.includes(day)) {
      this.selected = this.selected.filter(item => item !== day); // unselect
      this.updateWorkingDaysAttended(-1, cell.classList.contains('weekend'));
    } else {
      this.selected.push(day);   // select
      this.updateWorkingDaysAttended(+1, cell.classList.contains('weekend'));
    }
    this.updateVacationDays();
  };

  updateVacationDays() {
    const month = String(Number(this.currentPeriod.split('-')[1]) + 1).padStart(2, '0');
    this.popup.querySelector('.chosen-days-display').textContent =
      this.formatVacationDays(this.selected, month);
  }

  updateWorkingDaysAttended(change, isWeekend) {
    if (isWeekend === true) return;
    this.workingDaysAbsent += change;
    const workingDaysAttended = this.workingDaysTotal - this.workingDaysAbsent;
    this.popup.querySelector('.working-days-count').textContent =
    `${workingDaysAttended}/${this.workingDaysTotal} days`;
  }

  handleSetVacation = () => {
    if (this.callbacks.onSetVacation(this.employeeID, this.selected, this.workingDaysAbsent)) this.deletePopup();
  };

  /**
   * Renders the calendar popup from the template.
   * @param {Object} data
   * @param {string} data.employeeName
   */
  render(employeeName) {
    const template = document.getElementById('calendar-popup-template');
    const clone = template.content.cloneNode(true);

    const [ year, month ] = this.currentPeriod.split('-');
    const monthFormatted = String(Number(month) + 1).padStart(2, '0');
    const workingDaysCont = this.workingDaysTotal - this.workingDaysAbsent;
    const totalDaysCont = this.workingDaysTotal;

    clone.querySelector('.calendar-name').textContent = `${employeeName} - Availability`;
    clone.querySelector('.calendar-month').textContent = `${MONTHS[month]} `;
    clone.querySelector('.working-days-count').textContent = `${workingDaysCont}/${totalDaysCont} days`;
    clone.querySelector('.chosen-days-display').textContent = this.formatVacationDays(this.selected, monthFormatted);

    const popup = clone.querySelector('.calendar-popup');
    const container = clone.querySelector('.calendar-grid');

    return [ popup, container ];
  }

  fillCalendar(currentPeriod, vacationDays) {
    let [year, month] = currentPeriod.split('-').map(Number);
    const shift = this.calculateShift(year, month);
    for (let i = 0; i < shift; i++) {
      this.addEmptyCell();
    }
    const monthDays = this.calculateDaysInMonth(year, month);
    for (let i = 0; i < monthDays; i++) {
      const day = i + 1;
      const dayOfWeek = (shift + i) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      this.addFilledCell(day, isWeekend);
    }
    this.markToday(year, month);
    this.markVacations(vacationDays);
  }

  calculateShift(year, month) {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    return(firstDayOfWeek);
  }

  calculateDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  addEmptyCell() {
    const template = document.getElementById('calendar-day-template');
    const clone = template.content.cloneNode(true);
    const cell = clone.querySelector('.calendar-day');
    cell.classList.add('empty');
    this.container.appendChild(clone);
  }

  addFilledCell(day, isWeekend) {
    const template = document.getElementById('calendar-day-template');
    const clone = template.content.cloneNode(true);
    const cell = clone.querySelector('.calendar-day');
    cell.textContent = day;
    cell.id = `day-${day}`;
    if (isWeekend) cell.classList.add('weekend');
    this.container.appendChild(clone);
  }

  markToday(year, month) {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === month) {
      const cell = this.container.querySelector(`#day-${now.getDate()}`);
      if (cell) cell.classList.add('today');
    }
  }

  markVacations(vacationDays) {
    for (const day of vacationDays) {
      const cell = this.container.querySelector(`#day-${day}`);
      if (cell) cell.classList.add('vacation');
    }
  }

  formatVacationDays(days, month) {
    const sorted = days.map(Number).sort((a, b) => a - b);
    if (sorted.length === 0) return '';

    const groups = [];
    let current = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === current[current.length - 1] + 1) {
        current.push(sorted[i]);
      } else {
        groups.push(current);
        current = [sorted[i]];
      }
    }
    groups.push(current);

    return groups.map(g => {
      const first = String(g[0]).padStart(2, '0');
      if (g.length === 1) return `${first}.${month}`;
      const last = String(g[g.length - 1]).padStart(2, '0');
      return `${first}.${month}-${last}.${month}`;
    }).join(', ');
  }
}

export default CalendarPopup
