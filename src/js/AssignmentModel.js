import { MAX_CAP_FOR_EMPLOYEE, MAX_FIT_FOR_EMPLOYEE } from './constants';


/**
 * @param {Object} params
 * @param {string} params.projectID
 * @param {string} params.employeeID
 * @param {number} params.capacity
 * @param {number} params.projectFit
 */


class AssignmentModel {
  constructor (params) {
    this.id = crypto.randomUUID();
    this.projectID = params.projectID;
    this.employeeID = params.employeeID;
    this.capacity = params.capacity;
    this.projectFit = params.projectFit;
  }

  setCapacity(value) {
    if (value === undefined || value === null) return;
    const number = Number(value);
    if (Number.isNaN(number) || number < 0 || number > MAX_CAP_FOR_EMPLOYEE) return;
    this.capacity = number;
  }

  setProjectFit(value) {
    if (value === undefined || value === null) return;
    const number = Number(value);
    if (Number.isNaN(number) || number < 0 || number > MAX_FIT_FOR_EMPLOYEE) return;
    this.projectFit = number;
  }
}

export default AssignmentModel;
