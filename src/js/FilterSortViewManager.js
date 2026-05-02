
import FilterPopup from './FilterPopup';

class FilterSortViewManager {
  constructor(tab, chipContainerId, callbacks) {
    this.callbacks = callbacks;
    this.tab = tab;
    this.sortColumn;
    this.isAscendingOrder = false;
    this.filters = [];
    this.chipContainerId = chipContainerId;
    this.sortedIcon = null;
  }

  handleSortBtnClick(targetBtn) {
    const column = targetBtn.closest('th').dataset.sort;

    if (this.sortedIcon && this.sortedIcon !== targetBtn) {
      this.sortedIcon.textContent = '⇅';
      this.isAscendingOrder = false;
    }

    this.sortColumn = column;
    this.isAscendingOrder = !this.isAscendingOrder;
    const criteria = {
      tab: this.tab,
      column: column,
      ascending: this.isAscendingOrder,
    }
    this.callbacks.onSort(criteria);
    if (this.isAscendingOrder) targetBtn.textContent = '↑';
    else targetBtn.textContent = '↓';
    
    this.sortedIcon = targetBtn;
  }

  handleFilterBtnClick(targetBtn) {
    const filterPopup = new FilterPopup({addFilter: this.addFilter});
    filterPopup.createPopup(targetBtn);
  }

  handleChipClick = (e) => {
    let targetChip = e.target.closest('.chip-remove');
    if (!targetChip) return;
    this.removeFilter(targetChip.dataset.column);
  }

///////////////////////////////////////////////////////////////////////////////
// Filter

  addFilter = (filterObj) => {
    this.filters.push(filterObj);
    this.renderChips();
    const criteria = Object.assign({}, ...this.filters);
    criteria.tab = this.tab;
    this.callbacks.onFilter(criteria);
  }

  removeFilter(column) {
      if (!column) {
          this.filters = [];
      } else {
          this.filters = this.filters.filter(obj => !obj.hasOwnProperty(column));
      }
      this.renderChips();
      const criteria = Object.assign({}, ...this.filters);
      criteria.tab = this.tab;
      this.callbacks.onFilter(criteria);
  }

  renderChips() {
    const container = document.getElementById(this.chipContainerId);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    this.filters.forEach((filter) => {
        const key = Object.keys(filter)[0];
        const label = `${key}: ${filter[key]}`;
        this.renderChip(label, this.chipContainerId);
    });
    if (this.filters.length > 1) this.renderClearChip(this.chipContainerId);
  }

  renderChip(label, containerId) {
    const template = document.getElementById('filter-chip-template');
    const clone = template.content.cloneNode(true);
    const chip = clone.firstElementChild;
    chip.querySelector('.chip-label').textContent = label;
    const removeBtn = chip.querySelector('.chip-remove');
    removeBtn.textContent = '×';
    removeBtn.dataset.column = label.split(':')[0];
    document.getElementById(containerId).appendChild(chip);
  }

  renderClearChip(containerId) {
    const template = document.getElementById('filter-clear-chip-template');
    const clone = template.content.cloneNode(true);
    const chip = clone.firstElementChild;
    document.getElementById(containerId).appendChild(chip);
  }
}

export default FilterSortViewManager;

