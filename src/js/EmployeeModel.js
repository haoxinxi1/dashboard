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
    this.name = params.name;
    this.surname = params.surname;
    this.dateOfBirth = params.dateOfBirth;
    this.age = this.calculateAge();
    this.position = params.position;
    this.salary = params.salary;
    this.vacationDays = {};
  }

  calculateAge() {
    const birth = new Date(this.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getVacationDays(period) {
    return this.vacationDays[period] ?? [];
  }

  setVacationDays(period, days) {
    this.vacationDays[period] = days;
  }
}

export default EmployeeModel;
