import { bindEvent } from './utils';
import Formatter from './Formatter';

class EditAssignmentPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.popup = null;
  }

  createPopup(content, button) {
    if (this.popup) return;
    this.popup = this.render(content);
    document.body.appendChild(this.popup);
    this.positionPopup(button);
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
    bindEvent('click', '.popup-cancel-edit', this.deletePopup);
    bindEvent('click', '.popup-save-edit', this.handleEditClick);
    bindEvent('input', '.edit-capacity-input', (e) => {
      this.popup.querySelector('.edit-capacity-value').textContent = Formatter.decimal2(e.target.value);
    });
    bindEvent('input', '.edit-fit-input', (e) => {
      this.popup.querySelector('.edit-fit-value').textContent = Formatter.decimal2(e.target.value);
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
  render({ assignmentID, employeeName, projectName, capacity, projectFit }) {
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

export default EditAssignmentPopup;
