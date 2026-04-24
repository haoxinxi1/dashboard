const employee1 = {
  id: "100",
  name: "",
  surname: "",
  dateOfBirth: "",
  position: "",
  salary: 0,
  projectAssignments: [],
  vacationDays: {}
};

const employee2 = {
  id: "101",
  name: "",
  surname: "",
  dateOfBirth: "",
  position: "",
  salary: 0,
  projectAssignments: [],
  vacationDays: {}
};

const project1 = {
  id: "200",
  projectName: "",
  companyName: "",
  budget: 0,
  employeeCapacity: 0
};

const project2 = {
  id: "201",
  projectName: "",
  companyName: "",
  budget: 0,
  employeeCapacity: 0
};

const assignment1 = {
  id: "300",
  projectID: "200",
  employeeID: "100",
  capacity: 0.0,
  projectFit: 0.0,
};

const assignment2 = {
  id: "301",
  projectID: "201",
  employeeID: "101",
  capacity: 0.0,
  projectFit: 0.0,
};

const mockData = [
  { '2026-1': { employees: [employee1, employee2], projects: [project1, project2], assignments: [assignment1, assignment2] } },
  { '2026-2': { employees: [employee1, employee2], projects: [project1, project2], assignments: [assignment1, assignment2] } }
];

export default mockData;
