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
}

export default AssignmentModel;
