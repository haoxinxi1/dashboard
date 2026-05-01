import { bindEvent } from './utils';
import Formatter from './Formatter';

class AddAssignmentPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.formTouched = false;
    this.popup = null;
    this.fitInput = 0;
    this.capacityInput = 0;
    this.added = 0;
  }

  createPopup(content, button) {
    if (this.popup) return;
    this.popup = this.render(content);
    document.body.appendChild(this.popup);
    this.positionPopup(button);
    this.bindListeners();
    this.bindValidation();
  }

  deletePopup = () => {
    if (!this.popup) return;
    document.body.removeEventListener('click', this._onBodyClickListener);
    this.popup.remove();
    this.popup = null;
    this.formTouched = false;
  };

  bindListeners() {
    setTimeout(() => {
      this._onBodyClickListener = bindEvent('click', 'body', (e) => {
        if (this.popup && !this.popup.contains(e.target)) {
          this.deletePopup();
        }
      });
    }, 0);
    bindEvent('click', '.cancel-assignment', this.deletePopup);
    bindEvent('click', '.apply-assignment', this.handleAssignClick);
    bindEvent('change', '.project-select', this.showInputs, (e) => this.callbacks.onChooseProject(e.target.value));
    bindEvent('input', '.capacity-input', (e) => {
      this.capacityInput = e.target.value;
      this.popup.querySelector('.capacity-value').textContent = this.capacityInput;
      this.added = this.capacityInput * this.fitInput;
      this.popup.querySelector('.effective-capacity').textContent = Formatter.decimal2(this.added);
      const used = parseFloat(this.popup.querySelector('.used-capacity').textContent) || 0;
      this.popup.querySelector('.target-capacity').textContent =
        `${Formatter.decimal2(used + this.added)} / ${this.popup.querySelector('.total-capacity').textContent}`;
    });
    bindEvent('input', '.fit-input', (e) => {
      this.fitInput = e.target.value;
      this.popup.querySelector('.fit-value').textContent = this.fitInput;
      this.added = this.capacityInput * this.fitInput;
      this.popup.querySelector('.effective-capacity').textContent = Formatter.decimal2(this.added);
      const used = parseFloat(this.popup.querySelector('.used-capacity').textContent) || 0;
      this.popup.querySelector('.target-capacity').textContent =
        `${Formatter.decimal2(used + this.added)} / ${this.popup.querySelector('.total-capacity').textContent}`;
    });
  }

  handleAssignClick = () => {
    const projectID = this.popup.querySelector('.project-select').value;
    const employeeID = this.popup.querySelector('.apply-assignment').dataset.employeeID;
    const capacity = parseFloat(this.popup.querySelector('.capacity-input').value);
    const projectFit = parseFloat(this.popup.querySelector('.fit-input').value);
    const data = { projectID, employeeID, capacity, projectFit };
    if (this.callbacks.onCreateNewAssignment(data) === 1) this.deletePopup();
  };

  showInputs = () => {
    const hasProject = this.popup.querySelector('.project-select').value !== '';
    this.popup.querySelector('.capacity-input-section').style.display = hasProject ? 'block' : 'none';
    this.popup.querySelector('.popup-buttons').style.display = hasProject ? 'flex' : 'none';
    this.popup.querySelector('.project-info').style.display = hasProject ? 'block' : 'none';
  };

  bindValidation() {} // TODO

  /**
   * Creates and appends the assignment popup from the template.
   * @param {Object} data
   * @param {string} data.employeeID
   * @param {string} data.employeeName
   * @param {string} data.currentCapacity
   * @param {string} data.maxCapacity
   * @param {string} data.availableCapacity
   * @param {Array<{id: string, name: string, available: number}>} data.projects
   */
  render({ employeeID, employeeName, currentCapacity, maxCapacity, availableCapacity, projects }) {
    const template = document.getElementById('assignment-popup-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.popup-title').textContent = `Assign ${employeeName}`;
    clone.querySelector('.current-capacity').textContent = currentCapacity;
    clone.querySelector('.max-capacity').textContent = maxCapacity;
    clone.querySelector('.available-capacity').textContent = availableCapacity;

    const select = clone.querySelector('.project-select');
    projects.forEach(({ id, name, available }) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${name} - Available: ${available}`;
      select.appendChild(option);
    });
    // clone.querySelector('.capacity-input').max = maxCapacity;
    const assignBtn = clone.querySelector('.apply-assignment');
    assignBtn.dataset.employeeID = employeeID;

    return clone.firstElementChild;
  }

  renderProjectInfo(projectInfo) {
    this.popup.querySelector('.used-capacity').textContent = Formatter.decimal1(projectInfo.capacityActual);
    this.popup.querySelector('.total-capacity').textContent = projectInfo.capacityTotal;
    if (!projectInfo.capacityTotal) return;
    this.popup.querySelector('.effective-capacity').textContent = Formatter.decimal2(this.added);
    const capacityActualAfter = projectInfo.capacityActual + this.added;
    this.popup.querySelector('.target-capacity').textContent =
      `${Formatter.decimal2(capacityActualAfter)} / ${projectInfo.capacityTotal}`;
  }

  positionPopup(button) {
    const rect = button.getBoundingClientRect();
    const popupHeight = this.popup.offsetHeight;
    const margin = 8;

    let top;
    if (rect.bottom + popupHeight + margin < window.innerHeight) {
      top = rect.bottom + margin;
    } else {
      top = margin;
    }

    this.popup.style.top = `${top}px`;
    this.popup.style.right = `${margin}px`;
  }
}

export default AddAssignmentPopup;
