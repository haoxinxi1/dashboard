/**
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.surname
 * @param {string} params.dateOfBirth
 * @param {string} params.position
 * @param {number} params.salary
 */

class EmployeeModel {
  constructor (params) {
    this.id = crypto.randomUUID();
    this.name = params.name;
    this.surname = params.surname;
    this.dateOfBirth = params.dateOfBirth;
    this.position = params.position;
    this.salary = params.salary;
    this.vacationDays = {};
    this.vacationWorkingDays = {};
    this.assignments = {};
    if (params.period) this.initPeriod(params.period);
  }

  initPeriod(period) {
    this.assignments[period] ??= [];
    this.vacationDays[period] ??= [];
    this.vacationWorkingDays[period] ??= 0;
  }

  getVacationDays(period) {
    return this.vacationDays[period] ?? [];
  }

  setVacationDays(period, daysArray) {
    this.vacationDays[period] = daysArray;
  }

  getVacationWorkingDays(period) {
    return this.vacationWorkingDays[period] ?? 0;
  }

  setVacationWorkingDays(period, daysAmount) {
    this.vacationWorkingDays[period] = daysAmount;
  }

  getNumberAssignments(period) {
    return this.assignments[period]?.length ?? 0;
  }

  setSalary(value) {
    const numericSalary = parseFloat(value);
    if (isNaN(numericSalary) || numericSalary <= 0) return;
    this.salary = numericSalary;
  }

  setPosition(value) {
    this.position = value;
  }
}

export default EmployeeModel;
