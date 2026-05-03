import { bindEvent, populatePositionSelect, positionPopupNearElement } from './utils';

class FilterPopup {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.column = '';
    this.popup = null;
  }

  createPopup(button) {
    if (this.popup) return;
    this.column = button.closest('th').dataset.filter;
    this.popup = this.render();
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
    bindEvent('click', '.cancel-filter', this.deletePopup);
    bindEvent('click', '.accept-filter', this.handleAcceptClick);
    bindEvent('change', '.filter-popup-select', this.handleAcceptClick);
    bindEvent('keydown', '.filter-popup-input', (e) => {
      if (e.key === 'Enter') this.handleAcceptClick();
    });
  }

  handleAcceptClick = () => {
    const isPosition = this.column === 'position';
    const value = this.popup.querySelector(isPosition ? '.filter-popup-select' : '.filter-popup-input').value;
    this.callbacks.addFilter({ [this.column]: value });
    this.deletePopup();
  }

  render() {
    const template = document.getElementById('filter-popup-template');
    const clone = template.content.cloneNode(true);
    const popup = clone.firstElementChild;
    const isPosition = this.column === 'position';
    popup.querySelector('.filter-popup-input').style.display = isPosition ? 'none' : '';
    popup.querySelector('.filter-popup-select').style.display = isPosition ? '' : 'none';
    popup.style.display = 'block';
    populatePositionSelect(popup.querySelector('.filter-popup-select'));
    return popup;
  }
}

export default FilterPopup;
