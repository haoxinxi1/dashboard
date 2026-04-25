import { bindEvent} from './utils'

class SeedDataPopupView {
  constructor() {
    this.bindListeners();
  }

  bindListeners() {
    bindEvent('click', '#seed-data-backdrop', this.hideSeedDataPopupView);
    bindEvent('click', '#close-seed-popup-btn', this.hideSeedDataPopupView);
  }
  // render
  fillContent(content) {
    const monthIndex = content.currentPeriod.split('-')[1];
    const year = content.currentPeriod.split('-')[0];
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    document.getElementById('current-month-display').textContent = `${months[monthIndex]} ${year}`;
    // TODO
  }
  // handlers
  hideSeedDataPopupView = () => {
    document.getElementById('seed-data-backdrop').classList.add("hidden");
    document.getElementById('seed-data-popup').classList.add("hidden");
  }
}

export default SeedDataPopupView;
