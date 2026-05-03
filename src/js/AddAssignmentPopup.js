import { bindEvent,  positionPopup, validateEmployeeCapacity } from './utils';
import Formatter from './Formatter';
import { MAX_CAP_FOR_EMPLOYEE } from './constants'

class AddAssignmentPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.formTouched = false;
    this.popup = null;
    this.fitInput = 1.0;
    this.capacityInput = 1.0;
    this.added = 0;
    this.employeeCurrentCapacity = 0;
    this.triggerButton = null;
  }

  createPopup(content, button) {
    if (this.popup) return;
    this.triggerButton = button;
    this.popup = this.render(content);
    document.body.appendChild(this.popup);
    positionPopup(button, this.popup);
    this.bindListeners();
    this.updateCapacityDisplay();
    this._onScrollResize = () => positionPopup(this.triggerButton, this.popup);
    window.addEventListener('scroll', this._onScrollResize, true);
    window.addEventListener('resize', this._onScrollResize);
  }

  deletePopup = () => {
    if (!this.popup) return;
    document.body.removeEventListener('click', this._onBodyClickListener);
    window.removeEventListener('scroll', this._onScrollResize, true);
    window.removeEventListener('resize', this._onScrollResize);
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
      this.updateCapacityDisplay();
    });

    bindEvent('input', '.fit-input', (e) => {
      this.fitInput = e.target.value;
      this.popup.querySelector('.fit-value').textContent = this.fitInput;
      this.updateCapacityDisplay();
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

  updateCapacityDisplay() {
    this.added = this.capacityInput * this.fitInput;
    this.popup.querySelector('.effective-capacity').textContent = Formatter.decimal2(this.added);
    const used = parseFloat(this.popup.querySelector('.used-capacity').textContent) || 0;
    const total = parseFloat(this.popup.querySelector('.total-capacity').textContent) || 0;
    this.popup.querySelector('.target-capacity').textContent =
      `${Formatter.decimal2(used + this.added)} / ${this.popup.querySelector('.total-capacity').textContent}`;
    validateEmployeeCapacity(this.popup, this.employeeCurrentCapacity, parseFloat(this.capacityInput), MAX_CAP_FOR_EMPLOYEE);
    if (this.popup.querySelector('.project-select').value) {
      this.validateProjectCapacity(used, this.added, total);
    }
  }

  validateProjectCapacity(usedCapacity, effectiveToAdd, totalCapacity) {
    const msg = this.popup.querySelector('.validation-message-project');
    const target = usedCapacity + effectiveToAdd;
    if (target > totalCapacity) {
      msg.textContent =
        `Project effective capacity would exceed ${Formatter.decimal1(totalCapacity)} ` +
        `(current: ${Formatter.decimal1(usedCapacity)}, target: ${Formatter.decimal1(target)})`;
      msg.style.display = 'block';
    } else {
      msg.style.display = 'none';
    }
  }
  /**
   * Creates and appends the assignment popup from the template.
   * @param {Object} data
   * @param {string} data.employeeID
   * @param {string} data.employeeName
   * @param {number} data.currentCapacity
   * @param {number} data.maxCapacity
   * @param {number} data.availableCapacity
   * @param {Array<{id: string, name: string, available: number}>} data.projects
   */
  render({ employeeID, employeeName, currentCapacity, maxCapacity, availableCapacity, projects }) {
    this.employeeCurrentCapacity = currentCapacity;

    const template = document.getElementById('assignment-popup-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.popup-title').textContent = `Assign ${employeeName}`;
    clone.querySelector('.current-capacity').textContent = Formatter.decimal1(currentCapacity);
    clone.querySelector('.max-capacity').textContent = Formatter.decimal1(maxCapacity);
    clone.querySelector('.available-capacity').textContent = Formatter.decimal1(availableCapacity);

    const select = clone.querySelector('.project-select');
    projects.forEach(({ id, name, available }) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${name} - Available: ${Formatter.decimal1(available)}`;
      select.appendChild(option);
    });
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
}
export default AddAssignmentPopup;
