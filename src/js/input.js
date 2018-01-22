import 'whatwg-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import setState from './setState';
import router from './router';
import * as $dom from './dom';
import { $, isTouch, isTap } from './util';

document.addEventListener('DOMContentLoaded', () => {
  /* @license smoothscroll v0.4.0 - 2017 - Dustan Kasten, Jeremias Menichelli - MIT License */
  smoothscroll.polyfill();

  const state = setState(window.location.pathname);
  window.history.replaceState(state, null, state.path);
  window.addEventListener('popstate', e => router(e.state));

  $('bottomBar_navBtn').addEventListener((isTouch && isTap) ? 'touchend' : 'click', e => $dom.toggleModal(e));
  $('bottomBar_navSign').addEventListener((isTouch && isTap) ? 'touchend' : 'click', e => $dom.toggleModal(e));
  $('bottomBar').addEventListener((isTouch && isTap) ? 'touchend' : 'click', () => $dom.closeModal());

  const anchors = document.getElementsByTagName('a');
  for (anchor of anchors) {
    anchor.addEventListener((isTouch && isTap) ? 'touchend' : 'click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('targetBlank')) {
        window.open(e.target.href);
      } else if (window.location.pathname === e.target.getAttribute('href')) {
        $dom.closeModal();
      } else {
        const targetState = setState(e.target.getAttribute('href'));
        window.history.pushState(targetState, null, targetState.path);
        router(targetState);
      }
    });
  }
  router(state);
});
