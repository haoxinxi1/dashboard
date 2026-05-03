import { bindEvent, positionPopupNearElement } from './utils';

class ActionPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = null;
    this.assignmentID = '';
    this.itemID = '';
  }

  // callbacks
  // handleStartDeleteAssignment(assignmentID)
  // onNavigate(type, itemID)

  createPopup(button, data) {
    if (this.popup) return;
    this.popup = this.render(data);
    document.body.appendChild(this.popup);
    positionPopupNearElement(this.popup, button);
    this.bindListeners();
  }

  deletePopup = () => {
    if (!this.popup) return;
    document.body.removeEventListener('click', this._onBodyClickListener);
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
    bindEvent('click', '.navigate-btn',
      () => this.callbacks.onNavigate(this.itemID), this.deletePopup);
    bindEvent('click', '.popup-unassign-btn',
      () => this.callbacks.handleStartDeleteAssignment(this.assignmentID), this.deletePopup);
  }

  /**
   * Renders the action popup from the template.
   * @param {Object} data
   * @param {string} data.type
   * @param {string} data.assignmentID
   * @param {string} data.projectID
   * @param {string} data.employeeID
   * @returns {HTMLElement}
   */

  render(data) {
    const template = document.getElementById('action-popup-template');
    const clone = template.content.cloneNode(true);
    const popup = clone.firstElementChild;

    this.assignmentID = data.assignmentID;

    if (data.type === 'project') {
      this.itemID = data.employeeID;
    } else {
      this.itemID = data.projectID;
    }

    const navBtn = popup.querySelector('.navigate-btn');
    if (data.type === 'employee') navBtn.textContent = 'See at Projects';
    else navBtn.textContent = 'See at Employees';

    return popup;
  }
}

export default ActionPopup;
