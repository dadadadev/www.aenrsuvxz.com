import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import setState from './setState';
import router from './router';
import eventListen from './eventListen';

/* @license smoothscroll v0.4.0 - 2017 - Dustan Kasten, Jeremias Menichelli - MIT License */
smoothscroll.polyfill();

document.addEventListener('DOMContentLoaded', () => {
  const state = setState(window.location.pathname);
  window.history.replaceState(state, null, state.path);
  eventListen();
  router(state);
});
