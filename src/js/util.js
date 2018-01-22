export const $ = (id) => {
  const el = document.getElementById(id);
  return el;
};

export const isTouch = ('ontouchstart' in window) ? {} : false;

export let isTap = false;
window.addEventListener('touchstart', () => { isTap = true; });
window.addEventListener('touchmove', () => { isTap = false; });
window.addEventListener('touchend', () => { isTap = isTap ? true : false; });
