import { bindEvent, positionPopup, validateEmployeeCapacity } from './utils';
import Formatter from './Formatter';
import { MAX_CAP_FOR_EMPLOYEE } from './constants';

class EditAssignmentPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = null;
    this.assignmentCapBefore = 0;
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
  };

  bindListeners() {
    setTimeout(() => {
      this._onBodyClickListener = bindEvent('click', 'body', (e) => {
        if (this.popup && !this.popup.contains(e.target)) {
          this.deletePopup();
        }
      });
    }, 0);
    bindEvent('click', '.popup-cancel-edit', this.deletePopup);
    bindEvent('click', '.popup-save-edit', this.handleEditClick);
    bindEvent('input', '.edit-capacity-input', (e) => {
      this.popup.querySelector('.edit-capacity-value').textContent = Formatter.decimal2(parseFloat(e.target.value));
      const delta = parseFloat(e.target.value) - this.assignmentCapBefore;
      validateEmployeeCapacity(this.popup, this.employeeCurrentCapacity, delta, MAX_CAP_FOR_EMPLOYEE);
    });
    bindEvent('input', '.edit-fit-input', (e) => {
      this.popup.querySelector('.edit-fit-value').textContent = Formatter.decimal2(parseFloat(e.target.value));
    });
  }

  handleEditClick = () => {
    const assignmentID = this.popup.dataset.assignmentID;
    const capacity = parseFloat(this.popup.querySelector('.edit-capacity-input').value);
    const projectFit = parseFloat(this.popup.querySelector('.edit-fit-input').value);
    const data = { assignmentID, capacity, projectFit };
    if (this.callbacks.onFinishEditAssignment(data) === 1) this.deletePopup();
  };

  /**
   * Creates and appends the edit assignment popup from the template.
   * @param {Object} data
   * @param {string} data.assignmentID
   * @param {string} data.employeeName
   * @param {string} data.projectName
   * @param {number} data.capacity
   * @param {number} data.projectFit
    */
  render({ assignmentID, employeeName, projectName, capacity, projectFit, employeeCurrentCapacity }) {
    this.assignmentCapBefore = capacity;
    this.employeeCurrentCapacity = employeeCurrentCapacity;

    const template = document.getElementById('edit-assignment-template');
    const clone = template.content.cloneNode(true);

    const popup = clone.firstElementChild;
    popup.dataset.assignmentID = assignmentID;

    const strongs = clone.querySelectorAll('p strong');
    strongs[0].textContent = employeeName;
    strongs[1].textContent = projectName;

    clone.querySelector('.edit-capacity-input').value = capacity;
    clone.querySelector('.edit-capacity-value').textContent = Formatter.decimal2(capacity);

    clone.querySelector('.edit-fit-input').value = projectFit;
    clone.querySelector('.edit-fit-value').textContent = Formatter.decimal2(projectFit);

    popup.style.display = 'block';
    return popup;
  }
}

export default EditAssignmentPopup;
