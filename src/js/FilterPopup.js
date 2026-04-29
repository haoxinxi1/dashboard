import { bindEvent } from './utils';

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
    bindEvent('click', '.cancel-filter', this.deletePopup);
    bindEvent('click', '.accept-filter', this.handleAcceptClick);
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
    return popup;
  }

  positionPopup(button) {
    const th = button.closest('th');
    const rect = th.getBoundingClientRect();
    const gap = 10;
    this.popup.style.left = `${rect.left}px`;
    this.popup.style.top = `${rect.bottom + gap}px`;
  }
}

export default FilterPopup;
