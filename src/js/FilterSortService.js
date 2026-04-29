class FilterSortService {
  constructor() {
    this.projectsCache = {};
    this.employeesCache = {};
    this.projectsCriteriaSort = {};
    this.employeesCriteriaSort = {};
    this.projectsCriteriaFilter = {};
    this.employeesCriteriaFilter = {};
    this.hasFilterOrSort = false;
  }

  cache(content) {
    this.projectsCache = content.projectsContentView;
    this.employeesCache = content.employeesContentView;
    if (this.hasFilterOrSort === false) return content;
    const updated = this.apply();
    return {...content, ...updated};
  }

  filter(criteria) {
    if (criteria.tab === 'projects') this.projectsCriteriaFilter = criteria;
    else if (criteria.tab === 'employees') this.employeesCriteriaFilter = criteria;
    this.hasFilterOrSort = true;
    return this.apply();
  }

  sort(criteria) {
    if (criteria.tab === 'projects') {
      this.projectsCriteriaSort = criteria;
    }
    else if (criteria.tab === 'employees') {
      this.employeesCriteriaSort= criteria;
    }
    this.hasFilterOrSort = true;
    return this.apply();
  }

  clear() {
    this.projectsCriteriaSort = {};
    this.employeesCriteriaSort = {};
    this.projectsCriteriaFilter = {};
    this.employeesCriteriaFilter = {};
    this.hasFilterOrSort = false;
  }

  apply() {
    let applied = {
      projectsContentView: this.projectsCache,
      employeesContentView: this.employeesCache,
    };

    applied = this.applyFilter('projects', applied);
    applied = this.applyFilter('employees', applied);
    applied = this.applySort('projects', applied);
    applied = this.applySort('employees', applied);
    return applied;
  }

  /**
   * @typedef {Object} ProjectsFilterCriteria
   * @property {'projects'} tab
   * @property {string} [companyName]
   * @property {string} [projectName]
   */

  /**
   * @typedef {Object} EmployeesFilterCriteria
   * @property {'employees'} tab
   * @property {string} [name]
   * @property {string} [surname]
   * @property {string} [position]
   */
  applyFilter(tab, updated) {
    if (tab === 'projects') {
      const criteria = this.projectsCriteriaFilter;
      const filteredArray = updated.projectsContentView.projectsRows.filter(
        (el) =>
          (criteria.companyName === undefined || el.companyName.includes(criteria.companyName)) &&
          (criteria.projectName === undefined || el.projectName.includes(criteria.projectName)),
      );
      const filteredObj = { ...updated.projectsContentView, projectsRows: filteredArray };
      return {
        projectsContentView: filteredObj,
        employeesContentView: updated.employeesContentView,
      };
    } else if (tab === 'employees') {
      const criteria = this.employeesCriteriaFilter;
      const filteredArray = updated.employeesContentView.filter(
        (el) =>
          (criteria.name === undefined || el.name.includes(criteria.name)) &&
          (criteria.surname === undefined || el.surname.includes(criteria.surname)) &&
          (criteria.position === undefined || criteria.position === el.position),
      );
      return {
        projectsContentView: updated.projectsContentView,
        employeesContentView: filteredArray,
      };
    }
  }

  /**
   * @typedef {Object} SortCriteria
   * @property {'projects'|'employees'} tab
   * @property {string} [column]
   * @property {boolean} [ascending]
   */

  applySort(tab, updated) {
    const criteria = tab === 'projects' ? this.projectsCriteriaSort : this.employeesCriteriaSort;
    if (tab === 'projects') {
      const sorted = criteria.column
        ? this.sortArray(updated.projectsContentView.projectsRows, criteria.column, criteria.ascending)
        : updated.projectsContentView.projectsRows;
      return {
        projectsContentView: { ...updated.projectsContentView, projectsRows: sorted },
        employeesContentView: updated.employeesContentView,
      };
    } else {
      const sorted = criteria.column
        ? this.sortArray(updated.employeesContentView, criteria.column, criteria.ascending)
        : updated.employeesContentView;
      return {
        projectsContentView: updated.projectsContentView,
        employeesContentView: sorted,
      };
    }
  }

  sortArray(array, column, ascending) {
    const RAW_COLUMNS = {
      budget: 'budgetRaw',
      income: 'incomeRaw',
      salary: 'salaryRaw',
      estimatedPayment: 'estimatedPaymentRaw',
      employeeCapacity: 'employeeCapacityRaw',
      projectedIncome: 'projectedIncomeRaw',
    };
    const sortKey = RAW_COLUMNS[column] || column;
    return [...array].sort((a, b) => {
      const result =
        typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number'
          ? a[sortKey] - b[sortKey]
          : String(a[sortKey]).localeCompare(String(b[sortKey]));
      return ascending ? result : -result;
    });
  }
}

export default FilterSortService;
