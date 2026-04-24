/**
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.surname
 * @param {string} params.dateOfBirth
 * @param {string} params.position
 * @param {number} params.salary
 * @param {Object} params.vacationDays
 */


class EmployeeModel {
  constructor (params) {
    this.id = crypto.randomUUID();
    this.name = params.name,
    this.surname = params.surname,
    this.dateOfBirth = params.dateOfBirth,
    this.position = params.position,
    this.salary = params.salary,
    this.vacationDays = {};
  }
}

export default EmployeeModel;
