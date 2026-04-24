export function bindClick(selector, ...handlers) {
  document.querySelector(selector).addEventListener('click', (e) => {
    handlers.forEach(fn => fn(e));
  });
}

