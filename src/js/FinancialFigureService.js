import Formatter from './Formatter';

class FinancialFigureService {
  constructor(model, callbacks) {
    this.appModel = model;
    this.callbacks = callbacks;
    this.employeesMap;
    this.projectsMap;
    this.assignments;
    this.currentPeriod;
    this.employeesResultsMap = new Map();
    this.projectsResultsMap = new Map();
    this.assignResults = [];
    this.aggregated = {};
  }

  debugPrint() {
    console.log(`PERIOD: ${this.currentPeriod}`);
    console.log('RAW employees:', this.appModel.getEmployees());
    console.log('RAW projects:', this.appModel.getProjects());
    console.log('RAW assignments:', this.appModel.getAssignments());
    console.log('employeesResultsMap:', JSON.stringify([...this.employeesResultsMap.entries()], null, 2));
    console.log('projectsResultsMap:', JSON.stringify([...this.projectsResultsMap.entries()], null, 2));
    console.log('assignResults:', JSON.stringify(this.assignResults, null, 2));
    console.log('aggregated:', JSON.stringify(this.aggregated, null, 2));
  }

  update(period) {
    this.currentPeriod = period || this.appModel.getCurrentPeriod();
    this.employeesMap = new Map(this.appModel.getEmployees().map((el) => [el.id, el]));
    this.projectsMap = new Map(this.appModel.getProjects().map((el) => [el.id, el]));
    this.assignments = this.appModel.getAssignments();

    this.aggregated.workingDays = this.calculateWorkingDays();

    this.assignResults = this.assignments.map((el) => {
      return {
        id: el.id,
        projectID: el.projectID,
        employeeID: el.employeeID,
      };
    });
    this.calcAttendance();
    this.calcProjectsEffectiveCapacity();
    this.calcAssignmentsRevenueCosts();
    this.calcProjectsFigures();
    this.calcEmployeesFigures();
    this.aggregated.totalBenchPayments = this.calcTotalBenchPayments();
    this.aggregated.totalEstIncome = this.calcTotalEstIncome();

    // DEBUG
    this.debugPrint();
  }

  /* Calculation of figures */

  calcAttendance() {
    this.assignResults.forEach((result, i) => {
      const employee = this.employeesMap.get(result.employeeID);
      const assignment = this.assignments[i];
      result.capacity = assignment.capacity;
      result.attendance = 1 - (employee.getVacationWorkingDays(this.currentPeriod) / this.aggregated.workingDays);
      result.effectiveCap = assignment.capacity * assignment.projectFit * result.attendance;
    });
  }

  calcProjectsEffectiveCapacity() {
    this.projectsMap.forEach((project, id) => {
      console.log(`Project ${id}:`, { budget: project.budget, capacity: project.capacity });
      const usedEffectiveCapacity = this.getAggregatedValue('projectID', id, 'effectiveCap');
      const capacityForRevenue = Math.min(project.employeeCapacity, usedEffectiveCapacity);
      const revenueEffectiveCap = (!project.budget || !capacityForRevenue) ? 0 : project.budget / capacityForRevenue;
      this.projectsResultsMap.set(id, {
        usedEffectiveCapacity:  usedEffectiveCapacity,
        capacityForRevenue: capacityForRevenue,
        revenueEffectiveCap: revenueEffectiveCap,
      });
    });
  }

  calcAssignmentsRevenueCosts() {
    this.assignResults.forEach((el) => {
      const projectResult = this.projectsResultsMap.get(el.projectID);
      if (!projectResult) throw new Error(`Missing project result for ID: ${el.projectID}`);
      const revenueEffectiveCap = projectResult.revenueEffectiveCap;
      el.revenue = revenueEffectiveCap * el.effectiveCap;

      const projectData = this.projectsMap.get(el.projectID);
      if (projectData.employeeCapacity)
        el.budgetShare = projectData.budget / projectData.employeeCapacity * el.capacity;
      else
        el.budgetShare = 0;

      const salary = this.employeesMap.get(el.employeeID).salary;
      if (!salary) throw new Error(`Missing salary for ID: ${el.employeeID}`);
      el.costs = salary * Math.max(0.5, el.capacity);

      el.profit = el.revenue - el.costs;
    })
  }

  calcProjectsFigures() {
    this.projectsResultsMap.forEach((project, id) => {
      const estimatedIncome = project.revenueEffectiveCap * project.usedEffectiveCapacity;
      const costs = this.getAggregatedValue('projectID', id, 'costs');
      project.estimatedIncome = estimatedIncome;
      project.costs = costs;
      project.profit = project.estimatedIncome - costs;
      project.numberAssignments = this.assignments.filter(el => el.projectID === id).length;
    })
  }

  calcEmployeesFigures() {
    this.employeesMap.forEach((employee, id) => {
      const revenue = this.getAggregatedValue('employeeID', id, 'revenue');
      const costs = this.getAggregatedValue('employeeID', id, 'costs');
      this.employeesResultsMap.set(id, {
        revenue,
        costs,
        profit: revenue - costs,
        numberAssignments: this.assignResults.filter(el => el.employeeID === id).length,
        effectiveCap: this.getAggregatedValue('employeeID', id, 'effectiveCap'),
      });
    });
  }

  calcTotalEstIncome() {
    let result = 0;
    this.projectsResultsMap.forEach((project, id) => {
      result += project.estimatedIncome;
    });
    return result - this.aggregated.totalBenchPayments;
  }

  calcTotalBenchPayments() {
      let benchPayments = 0;
      this.employeesMap.forEach((employee, id) => {
        const hasAssignments = this.assignResults.filter(el => el.employeeID === id).length > 0;
        if (!hasAssignments) {
          benchPayments += employee.salary * 0.5;
        }
      });
      return benchPayments;
  }

  getAggregatedValue(filterKey, filterValue, figure) {
    return this.assignResults.reduce((acc, el) => {
      if (el[filterKey] === filterValue) return acc + (el[figure] || 0);
      return acc;
    }, 0);
  }

  /* Getters */

  // projects tab

  getProjectEstIncome(projectID) {
    return this.projectsResultsMap.get(projectID).estimatedIncome;
  }

  getTotalEstIncomeAllProjects() {
    return this.aggregated.totalEstIncome;
  }

  getBenchPayments() {
    return this.aggregated.totalBenchPayments;
  }

  //employees tab
  getMonthlySalaryPayment(employeeID) {
    return this.employeesResultsMap.get(employeeID).costs;
  }

  getIncomePerEmployee(employeeID) {
    return this.employeesResultsMap.get(employeeID).revenue;
  }

  getNumberProjectsForEmployee(employeeID) {
    return this.employeesResultsMap.get(employeeID).numberAssignments;
  }

  getCapacityUsageString(employeeID) {
    const used = this.employeesResultsMap.get(employeeID).effectiveCap;
    return `${Formatter.decimal1(used)} / 1.5`;
  }

  // assignments popup

  getAssignFigures(id) {
    const info = this.assignResults.find(el => el.id === id);
    const vacation = this.employeesMap.get(info.employeeID).getVacationDays(this.currentPeriod).length;
    return {vacation: vacation, effective: info.effectiveCap, revenue:info.revenue, cost:info.costs, profit: info.profit};
  }

  // add assignments popup
  getProjectAvailableCapacity(projectID) {
    const nominal = this.projectsMap.get(projectID).employeeCapacity;
    const used = this.projectsResultsMap.get(projectID).usedEffectiveCapacity;
    return nominal - used;
  }

  getEmployeeEffectiveCapacity(employeeID) {
    return this.employeesResultsMap.get(employeeID).effectiveCap;
  }

  getProjectEffectiveCapacityUsed(projectID) {
    return this.projectsResultsMap.get(projectID).usedEffectiveCapacity;
  }

  getProjectCapacityNominal(projectID) {
    return this.projectsMap.get(projectID).employeeCapacity;
  }

  // delete assignment popup
  getSalaryShare(assignmentID) {
    return this.assignResults.find(el => el.id === assignmentID).costs;
  }

  getBudgetShare(assignmentID) {
    return this.assignResults.find(el => el.id === assignmentID).budgetShare;
  }

  getEstIncome(assignmentID) {
    return this.assignResults.find(el => el.id === assignmentID).revenue;
  }

  getProjectProfit(projectID) {
    const budget = this.projectsMap.get(projectID).budget;
    const costs = this.projectsResultsMap.get(projectID).costs;
    return budget - costs;
  }


  // calendar popup
  calculateWorkingDays() {
    const [year, month] = this.currentPeriod.split('-').map(Number);
    const totalDays = this.calculateDaysInMonth(year, month);
    let workingDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      const day = new Date(year, month, d).getDay();
      if (day !== 0 && day !== 6) workingDays++;
    }
    return workingDays;
  }

  calculateDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
}

export default FinancialFigureService;
