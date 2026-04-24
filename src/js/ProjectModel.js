/**
 * @param {Object} params
 * @param {string} params.projectName
 * @param {string} params.companyName
 * @param {number} params.budget
 * @param {number} params.employeeCapacity
 */


class ProjectModel {
  constructor (params) {
    this.id = crypto.randomUUID();
    this.projectName = params.projectName;
    this.companyName = params.companyName;
    this.budget = params.budget;
    this.employeeCapacity = params.employeeCapacity;
  }
}

export default ProjectModel;


