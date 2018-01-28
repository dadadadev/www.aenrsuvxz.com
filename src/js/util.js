export const $ = id => document.getElementById(id);

export const isTouch = ('ontouchstart' in window) ? {} : false;

export let isTap = false;
window.addEventListener('touchstart', () => { isTap = {}; });
window.addEventListener('touchmove', () => { isTap = false; });
window.addEventListener('touchend', () => { isTap = isTap ? {} : false; });
