import setState from './setState';
import router from './router';
import * as $dom from './dom';

export default () => {
  const isTouch = ('ontouchstart' in window) ? {} : false;
  let isTap = true;
  window.addEventListener('touchstart', (e) => { isTap = true });
  window.addEventListener('touchmove', (e) => { isTap = false });
  window.addEventListener('touchend', (e) => { isTap ? isTap = true : isTap = false });

  const anchors = document.getElementsByTagName('a');

  window.addEventListener('popstate', e => router(e.state));

  for (anchor of anchors) {
    if (anchor.classList.contains('targetBlank')) {
      anchor.addEventListener(isTouch ? 'touchend' : 'click', (e) => {
        e.preventDefault();
        if (isTap) window.open(e.target.href);
      });
    } else {
      anchor.addEventListener(isTouch ? 'touchend' : 'click', (e) => {
        e.preventDefault();
        const currentState = setState(window.location.pathname);
        const targetState = setState(e.target.getAttribute('href'));
        if (window.location.pathname === e.target.getAttribute('href')) {
          $dom.closeModal();
        } else if (isTap) {
          window.history.pushState(targetState, null, targetState.path);
          router(targetState);
        }
      });
    }
  }

  $dom.$('bottomBar_navBtn').addEventListener(isTouch ? 'touchend' : 'click', (e) => {
    if (isTap) $dom.toggleModal(e);
  });
  $dom.$('bottomBar_navSign').addEventListener(isTouch ? 'touchend' : 'click', (e) => {
    if (isTap) $dom.toggleModal(e);
  });
  $dom.$('bottomBar').addEventListener(isTouch ? 'touchend' : 'click', () => {
    if (isTap) $dom.closeModal();
  });
};
