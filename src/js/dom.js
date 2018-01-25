import setState from './setState';
import router from './router';
import { $, isTouch, isTap } from './util';

let ready = true;
let currentPage = 1;
let totalPages = 1;

const setPostAreaHeight = () => {
  const titleHeight = $('postView_contentTitle').clientHeight;
  $('postView_contentText').style.cssText += `height: calc(100vh - ${titleHeight}px - 115px);`;
  $('postView_contentShiftBtnPrev').style.cssText += `height: calc(100vh - ${titleHeight}px - 115px);`;
  $('postView_contentShiftBtnNext').style.cssText += `height: calc(100vh - ${titleHeight}px - 115px);`;
};
const setTotalPage = () => {
  const scrollWidth = $('postView_contentText').scrollWidth;
  const viewAreaWidth = $('postView_contentText').clientWidth + 65;
  const restWidth = scrollWidth % viewAreaWidth;
  const _scrollWidth = scrollWidth - restWidth;
  totalPages = (_scrollWidth + viewAreaWidth) / viewAreaWidth;
  $('postView_contentTotalPage').innerText = ` / ${totalPages}`;
};
const postScrollBtnBehavior = () => {
  const scrollPosition = $('postView_contentText').scrollLeft;
  const contentWidth = $('postView_contentText').clientWidth;
  const scrollWidth = $('postView_contentText').scrollWidth;
  const targetWidth = scrollPosition + contentWidth + 65;
  if (scrollPosition === 0 && targetWidth >= scrollWidth) {
    $('postView_contentShiftBtnPrev').classList.add('postView_contentShiftBtn-hidden');
    $('postView_contentShiftBtnNext').classList.add('postView_contentShiftBtn-hidden');
  } else if (scrollPosition === 0 && targetWidth < scrollWidth) {
    $('postView_contentShiftBtnPrev').classList.add('postView_contentShiftBtn-hidden');
    $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
  } else if (scrollPosition !== 0 && targetWidth < scrollWidth) {
    $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
    $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
  } else {
    $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
    $('postView_contentShiftBtnNext').classList.add('postView_contentShiftBtn-hidden');
  }
};
const scrollNext = () => {
  $('postView_contentText').scrollBy({
    behavior: 'smooth',
    top: 0,
    left: $('postView_contentText').clientWidth + 65,
  });
};
const scrollPrev = () => {
  $('postView_contentText').scrollBy({
    behavior: 'smooth',
    top: 0,
    left: -($('postView_contentText').clientWidth + 65),
  });
};
const postScrollBehavior = (action) => {
  if (action === 'next') {
    currentPage++;
    ready = false;
    $('postView_contentCurrentPage').innerText = `表示中のページ： ${currentPage}`;
    scrollNext();
    setTimeout(() => {
      postScrollBtnBehavior();
      ready = true;
    }, 1000);
  } else if (action === 'prev') {
    currentPage--;
    ready = false;
    $('postView_contentCurrentPage').innerText = `表示中のページ： ${currentPage}`;
    scrollPrev();
    setTimeout(() => {
      postScrollBtnBehavior();
      ready = true;
    }, 1000);
  }
};

export const showFront = () => {
  $('topBar').classList.add('topBar-hidden');
  $('innerContainer').classList.remove('innerContainer-listView');
  $('innerContainer').classList.remove('innerContainer-postView');
  $('innerContainer').classList.remove('innerContainer-errorView');
  $('bottomBar').classList.remove('bottomBar-listView');
};
export const showList = () => {
  $('topBar').classList.remove('topBar-hidden');
  $('innerContainer').classList.add('innerContainer-listView');
  $('innerContainer').classList.remove('innerContainer-postView');
  $('innerContainer').classList.remove('innerContainer-errorView');
  $('bottomBar').classList.add('bottomBar-listView');
};
export const showPost = () => {
  $('topBar').classList.remove('topBar-hidden');
  $('innerContainer').classList.remove('innerContainer-listView');
  $('innerContainer').classList.add('innerContainer-postView');
  $('innerContainer').classList.remove('innerContainer-errorView');
  $('bottomBar').classList.add('bottomBar-listView');
};
export const showError = () => {
  $('topBar').classList.add('topBar-hidden');
  $('innerContainer').classList.remove('innerContainer-listView');
  $('innerContainer').classList.remove('innerContainer-postView');
  $('innerContainer').classList.add('innerContainer-errorView');
  $('bottomBar').classList.remove('bottomBar-listView');
};

export const showTopBarPerformance = () => {
  $('topBar_categoryItems').classList.add('topBar_categoryItems-performance');
  $('topBar_categoryItems').classList.remove('topBar_categoryItems-architecture', 'topBar_categoryItems-uiux');
};
export const showTopBarArchitecture = () => {
  $('topBar_categoryItems').classList.add('topBar_categoryItems-architecture');
  $('topBar_categoryItems').classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-uiux');
};
export const showTopBarUiux = () => {
  $('topBar_categoryItems').classList.add('topBar_categoryItems-uiux');
  $('topBar_categoryItems').classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-architecture');
};

export const toggleModal = (e) => {
  e.stopPropagation();
  $('bottomBar_navBtnContent').classList.toggle('bottomBar_navBtnContent-modal');
  $('bottomBar').classList.toggle('bottomBar-modal');
  $('bottomBar_navSign').classList.toggle('bottomBar_navSign-modal');
  $('bottomBar_navItems').classList.remove('bottomBar_navItems-error');
  $('bottomBar_navItems').classList.remove('bottomBar_navItems-error');
};
export const closeModal = () => {
  $('bottomBar_navBtnContent').classList.remove('bottomBar_navBtnContent-modal');
  $('bottomBar').classList.remove('bottomBar-modal');
  $('bottomBar_navSign').classList.remove('bottomBar_navSign-modal');
  $('bottomBar_navItems').classList.remove('bottomBar_navItems-error');
};
export const bottomBarError = () => {
  $('bottomBar_navItems').classList.add('bottomBar_navItems-error');
};

export const fetchList = (path) => {
  $('listView').classList.add('hidden');
  const fragment = document.createDocumentFragment();
  fetch(`https://api.aenrsuvxz.com${path}.json`)
    .then(res => res.json())
    .then((json) => {
      for (let post of json.list) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const h2 = document.createElement('h2');
        const time = document.createElement('time');
        a.href = post.path;
        a.classList.add('listView_item');
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPath = e.target.getAttribute('href');
          const targetState = setState(targetPath);
          window.history.pushState(targetState, null, targetState.path);
          router(targetState);
        });
        h2.classList.add('title');
        h2.innerText = post.title;
        time.classList.add('info');
        time.innerText = `更新日： ${post.date}`;
        time.setAttribute('datetime', post.date);
        a.appendChild(h2);
        a.appendChild(time);
        li.appendChild(a);
        fragment.appendChild(li);
      }
      while ($('listView_items').firstChild) {
        $('listView_items').removeChild($('listView_items').firstChild);
      }
      $('listView').scrollTo(0, 0);
      $('listView_items').appendChild(fragment);
    })
    .then(() => {
      const tsCompRes = (res) => {
        if (res.code === -2) {
          setTimeout(() => $('listView').classList.remove('hidden'), 2000);
        } else {
          $('listView').classList.remove('hidden');
        }
      };
      Ts.onComplete(tsCompRes);
      Ts.reload();
    })
    .catch(() => {
      showError();
      bottomBarError();
    });
};
export const fetchPost = (path) => {
  $('postView').classList.add('hidden');
  currentPage = 1;
  fetch(`https://api.aenrsuvxz.com${path}.json`)
    .then(res => res.json())
    .then((json) => {
      document.title = `${json.title} - www.aenrsuvxz.com`;
      $('postView_contentTitleArea').innerText = json.title;
      $('postView_contentTimeArea').innerText = `更新日： ${json.date}`;
      $('postView_contentTimeArea').setAttribute('datetime', json.date);
      while ($('postView_contentText').firstChild) {
        $('postView_contentText').removeChild($('postView_contentText').firstChild);
      }
      $('postView_contentText').innerHTML = json.text;
      $('postView_contentCurrentPage').innerText = `表示中のページ： ${currentPage}`;
      $('postView_contentTotalPage').innerText = ' / 0';
      $('postView_contentText').scrollTo(0, 0);
    })
    .then(() => {
      const tsCompRes = (res) => {
        if (res.code === -2) {
          setTimeout(() => $('postView').classList.remove('hidden'), 2000);
        } else {
          $('postView').classList.remove('hidden');
        }
      };
      Ts.onComplete(tsCompRes);
      Ts.reload();
    })
    .then(() => {
      setPostAreaHeight();
      setTotalPage();
      postScrollBtnBehavior();
      $('postView_contentShiftBtnNext').addEventListener((isTouch && isTap) ? 'touchend' : 'click', () => {
        if (ready && currentPage < totalPages) {
          postScrollBehavior('next');
        }
      });
      $('postView_contentShiftBtnPrev').addEventListener(isTouch ? 'touchend' : 'click', () => {
        if (ready && currentPage > 1) {
          postScrollBehavior('prev');
        }
      });
      if (isTouch) {
        let touchStartX;
        let touchMoveX;
        $('postView_contentText').addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].pageX;
        });
        $('postView_contentText').addEventListener('touchmove', (e) => {
          touchMoveX = e.changedTouches[0].pageX;
          if (Math.abs(touchMoveX - touchStartX) > 10) e.preventDefault();
        });
        $('postView_contentText').addEventListener('touchend', () => {
          if (touchStartX > touchMoveX + 30 && currentPage < totalPages && ready) {
            postScrollBehavior('next');
          } else if (touchStartX + 30 < touchMoveX && currentPage > 1 && ready) {
            postScrollBehavior('prev');
          }
        });
      } else {
        $('postView_contentText').addEventListener('wheel', (e) => {
          e.preventDefault();
          if (e.deltaX > 20 && currentPage < totalPages && ready) {
            postScrollBehavior('next');
          } else if (e.deltaX < -20 && currentPage > 1 && ready) {
            postScrollBehavior('prev');
          }
        });
      }
    })
    .catch(() => {
      showError();
      bottomBarError();
    });
};
