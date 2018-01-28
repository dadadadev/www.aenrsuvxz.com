import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import setState from './setState';
import router from './router';
import { $, isTouch, isTap } from './util';

const toggleModal = (e) => {
  e.stopPropagation();
  $('bottomBar_navBtnContent').classList.toggle('bottomBar_navBtnContent-modal');
  $('bottomBar').classList.toggle('bottomBar-modal');
  $('bottomBar_navSign').classList.toggle('bottomBar_navSign-modal');
  $('bottomBar_navItems').classList.remove('bottomBar_navItems-error');
};
const closeModal = () => {
  $('bottomBar_navBtnContent').classList.remove('bottomBar_navBtnContent-modal');
  $('bottomBar').classList.remove('bottomBar-modal');
  $('bottomBar_navSign').classList.remove('bottomBar_navSign-modal');
  $('bottomBar_navItems').classList.remove('bottomBar_navItems-error');
};
const eventListen = () => {
  window.addEventListener('popstate', e => router(e.state));

  $('bottomBar_navBtn').addEventListener((isTouch && isTap) ? 'touchend' : 'click', e => toggleModal(e));
  $('bottomBar_navSign').addEventListener((isTouch && isTap) ? 'touchend' : 'click', e => toggleModal(e));
  $('bottomBar').addEventListener((isTouch && isTap) ? 'touchend' : 'click', () => closeModal());

  const anchors = document.getElementsByTagName('a');
  for (anchor of anchors) {
    anchor.addEventListener((isTouch && isTap) ? 'touchend' : 'click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('targetBlank')) {
        window.open(e.target.href);
      } else if (window.location.pathname === e.target.getAttribute('href')) {
        closeModal();
      } else {
        const targetState = setState(e.target.getAttribute('href'));
        window.history.pushState(targetState, null, targetState.path);
        router(targetState);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /* @license smoothscroll v0.4.0 - 2017 - Dustan Kasten, Jeremias Menichelli - MIT License */
  smoothscroll.polyfill();
  const state = setState(window.location.pathname);
  window.history.replaceState(state, null, state.path);
  eventListen();
  router(state);
});
