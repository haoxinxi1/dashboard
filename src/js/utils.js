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
