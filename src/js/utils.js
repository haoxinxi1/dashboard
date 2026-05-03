import { POSITIONS } from './constants';
import Formatter from './Formatter';

/**
 * Binds a click event listener to an element that calls
 * the provided handlers in sequence.
 *
 * @param {string} selector - CSS selector for the target element.
 * @param {...function(Event): void} handlers - One or more callback functions to invoke on click.
 * @throws {TypeError} If the selector does not match any element.
 */

export function bindEvent(event, selector, ...handlers) {
  const listener = (e) => {
    handlers.forEach((fn) => fn(e));
  };
  document.querySelector(selector).addEventListener(event, listener);
  return listener;
}

export function populatePositionSelect(selectElement, currentValue = '') {
  POSITIONS.forEach((pos) => {
    const option = document.createElement('option');
    option.value = pos;
    option.textContent = pos;
    selectElement.appendChild(option);
  });
  if (currentValue) {
    selectElement.value = currentValue;
  }
}

export function toggleNoEntries(containerId, length) {
  const container = document.getElementById(containerId);
  let msg = container.querySelector('.no-entries-msg');
  if (!msg) {
    msg = document.createElement('p');
    msg.textContent = 'No entries to show';
    msg.classList.add('no-entries-msg');
    container.appendChild(msg);
  }
  msg.classList.toggle('hidden', length > 0);
}

export function applyFinancialStyle(element, value) {
  if (value < 0) {
    element.classList.add('negative-income');
    element.classList.remove('positive-income');
  } else {
    element.classList.add('positive-income');
    element.classList.remove('negative-income');
  }
}

export function applyOverCapacityStyle(element, used, total) {
  if (used > total) {
    element.classList.add('negative-income');
    element.classList.remove('positive-income');
  } else {
    element.classList.remove('negative-income');
  }
}

export function positionPopup(button, popup) {
  const rect = button.getBoundingClientRect();
  const popupHeight = popup.offsetHeight;
  const margin = 8;

  let top;
  if (rect.bottom + popupHeight + margin < window.innerHeight) {
    top = rect.bottom + margin;
  } else {
    top = margin;
    popup.style.maxHeight = `${window.innerHeight - 2 * margin}px`;
    popup.style.overflowY = 'auto';
  }

  popup.style.top = `${top}px`;
  popup.style.right = `${margin}px`;
}

export function validateEmployeeCapacity(popup, currentCapacity, capacityToAdd, maxCapacity) {
  const msg = popup.querySelector('.validation-message-employee');
  const target = currentCapacity + capacityToAdd;
  if (target > maxCapacity) {
    msg.textContent =
      `Employee capacity would exceed ${Formatter.decimal1(maxCapacity)} ` +
      `(current: ${Formatter.decimal1(currentCapacity)}, target: ${Formatter.decimal1(target)})`;
    msg.style.display = 'block';
  } else {
    msg.style.display = 'none';
  }
}

/**
 * @param {HTMLElement} popup
 * @param {HTMLElement} anchor
 * @param {number} [gap=10]
 */
export function positionPopupNearElement(popup, anchor, gap = 10) {
  const rect = anchor.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + gap;

  const popupRect = popup.getBoundingClientRect();

  if (left + popupRect.width > window.innerWidth) {
    left = window.innerWidth - popupRect.width - gap;
  }
  if (top + popupRect.height > window.innerHeight) {
    top = window.innerHeight - popupRect.height - gap;
  }
  if (left < gap) left = gap;
  if (top < gap) top = gap;

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}
