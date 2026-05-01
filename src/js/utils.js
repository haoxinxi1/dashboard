import { POSITIONS } from './constants';

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
    handlers.forEach(fn => fn(e));
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

function applyFinancialStyle(element, value) {
  if (value < 0) {
    element.classList.add('negative-income');
    element.classList.remove('positive-income');
  } else {
    element.classList.add('positive-income');
    element.classList.remove('negative-income');
  }
}
