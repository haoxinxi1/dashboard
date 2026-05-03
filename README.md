# Employee & Project Dashboard 📋

A comprehensive management application for tracking employees, projects, and their assignments across different time periods. Built with vanilla JavaScript using an MVC architecture — no frameworks or libraries.

## Description

The Employee & Project Dashboard enables managers to maintain a database of employees and projects, assign employees to projects with flexible capacity allocation, track availability through a vacation calendar, and view financial projections including revenue, costs, and profits. All data is organized in monthly snapshots, allowing independent planning and historical tracking for each period.

## Features

- **Employee Management** — Add, edit, and delete employees with name, date of birth, position (Junior/Middle/Senior/Lead/Architect/BO), and salary. Inline editing for position and salary fields.
- **Project Management** — Create and manage projects with company name, budget, and employee capacity requirements.
- **Assignment System** — Assign employees to projects with adjustable capacity (0.0–1.5) and project fit coefficients (0.0–1.0). Supports multiple assignments per employee with real-time capacity validation.
- **Financial Calculations** — Automatic computation of revenue, costs, estimated payments, and projected income per employee and project. Includes bench payment logic (0.5× salary for unassigned or under-allocated employees).
- **Vacation Calendar** — Interactive calendar popup for selecting vacation days per employee per month. Vacation coefficients automatically adjust effective capacity and all downstream financial metrics.
- **Monthly Snapshots** — Each month stores an independent copy of all data. Switch between months/years via the sidebar selectors without affecting other periods.
- **Seed Data** — Copy a complete dataset from one month to another for planning purposes, with vacation days reset for the target month.
- **Sorting & Filtering** — Column-level sorting (ascending/descending) and filtering with filter chips. Text filters for names, dropdown filter for position.
- **Unassignment Impact Preview** — Detailed financial impact popup before confirming an unassignment, showing salary share, budget share, and projected income changes.
- **Collapsible Sidebars** — Toggle sidebars visibility for more screen space.
- **Data Persistence** — All data automatically saved to `localStorage` after every modification and restored on page reload.

## Tech Stack

- **HTML5** — Semantic markup with `<template>` elements for dynamic content
- **CSS3** — Custom styling with responsive layout, slide-in panels, popups, and calendar grid
- **Vanilla JavaScript (ES6+)** — Modular class-based architecture using ES modules
- **Webpack** — Module bundling (implied by `import` statements and `index.js` entry point)
- **localStorage** — Client-side data persistence

No external frameworks or libraries (React, Vue, Angular, jQuery, etc.) are used.

## Project Structure

```
├── index.html                  # Main HTML with templates for popups, forms, and calendar
├── styles.css                  # Application styles
├── src/
│   ├── index.js                # Entry point — initializes AppController on DOMContentLoaded
│   ├── constants.js            # Shared constants (months, positions, capacity limits)
│   ├── AppModel.js             # Central data model — CRUD operations, period management, calculations
│   ├── AppView.js              # View coordinator — manages all sub-views and UI state
│   ├── AssignmentModel.js      # Assignment entity with capacity/fit validation
│   ├── AssignmentsPopupView.js # Detail popup for viewing/editing assignments
│   ├── Repo.js                 # Repository layer — bridges model and storage
│   ├── StorageService.js       # localStorage abstraction
│   └── utils.js                # Shared utilities (event binding, popup positioning, validation)
```

Additional modules referenced in the codebase (not included in uploads): `AppController`, `EmployeeModel`, `ProjectModel`, `EmployeesContentView`, `ProjectsContentView`, `SidePanelView`, `AddEmployeePanel`, `AddProjectPanel`, `SeedDataPopupView`, `AddAssignmentPopup`, `EditAssignmentPopup`, `DeleteAssignmentPopup`, `CalendarPopup`, `ActionPopup`, `Formatter`, and `mock-data`.

## How to Run

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd employee-project-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. Open `http://localhost:8080` (or the port shown in the terminal) in your browser.

On first load, if no data exists in `localStorage`, the application initializes with sample mock data.

## Implementation Notes

- **Architecture:** The app follows an MVC pattern. `AppModel` owns all state and business logic, `AppView` coordinates sub-views, and an `AppController` (not included in uploads) wires them together via callback objects passed through constructors.
- **Monthly Data Model:** Data is stored under `localStorage` key `monthlyData` as an array of `{ "YYYY-M": { employees, projects, assignments } }` objects. Each month is fully independent — deleting an item in one month has no effect on other months.
- **Capacity System:** Employees can be assigned up to 1.5 total capacity across all projects. Effective capacity is computed as `assignedCapacity × projectFit × vacationCoefficient`, where the vacation coefficient reflects the ratio of actual working days in the month.
- **Financial Model:** Revenue is distributed proportionally by effective capacity; costs use a minimum of 0.5× salary (bench payment). Total estimated income accounts for both project-level profits and bench costs of unassigned employees.
- **Template-Based Rendering:** The HTML uses native `<template>` elements for popups, table rows, calendar days, filter chips, and action menus — cloned and populated dynamically at runtime.
- **No Framework Dependency:** The entire application is built with vanilla JavaScript ES6+ modules, using only the native DOM API and Web Platform features.
