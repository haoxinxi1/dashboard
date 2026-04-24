/**
 * Binds a click event listener to an element that calls
 * the provided handlers in sequence.
 *
 * @param {string} selector - CSS selector for the target element.
 * @param {...function(Event): void} handlers - One or more callback functions to invoke on click.
 * @throws {TypeError} If the selector does not match any element.
 */

export function bindClick(selector, ...handlers) {
  document.querySelector(selector).addEventListener('click', (e) => {
    handlers.forEach(fn => fn(e));
  });
}

