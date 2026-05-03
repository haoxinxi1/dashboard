const employee1 = {
    id: "100",
    name: "John",
    surname: "Smith",
    dateOfBirth: "1990-05-15",
    position: "Senior",
    salary: 4500,
    assignments: {
        '2026-0': ["300"],
    },
    vacationDays: {
        '2026-0': [],
    },
    vacationWorkingDays: {
        '2026-0': 0,
    }
};

const employee2 = {
    id: "101",
    name: "Anna",
    surname: "Johnson",
    dateOfBirth: "1995-08-22",
    position: "Middle",
    salary: 3200,
    assignments: {
        '2026-0': ["301"],
    },
    vacationDays: {
        '2026-0': [],
    },
    vacationWorkingDays: {
        '2026-0': 0,
    }
};

const project1 = {
  id: "200",
  projectName: "Website Redesign",
  companyName: "Acme Corp",
  budget: 25000,
  employeeCapacity: 1,
};

const project2 = {
  id: "201",
  projectName: "Mobile App",
  companyName: "TechStart Inc",
  budget: 40000,
  employeeCapacity: 1,
};

const assignment1 = {
  id: "300",
  projectID: "200",
  employeeID: "100",
  capacity: 0.75,
  projectFit: 0.85,
};

const assignment2 = {
  id: "301",
  projectID: "201",
  employeeID: "101",
  capacity: 1.0,
  projectFit: 0.70,
};

const mockData = [
  { '2026-0': { employees: [employee1, employee2], projects: [project1, project2], assignments: [assignment1, assignment2] } },
];

export default mockData;
