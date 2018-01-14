import setState from './setState';
import router from './router';
import { $, isTouch, isTap } from './util';

// const isTouch = ('ontouchstart' in window) ? {} : false;

// let isTap = true;
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
  const totalPage = (_scrollWidth + viewAreaWidth) / viewAreaWidth;
  $('postView_contentTotalPage').innerText = ` / ${totalPage}`;
  totalPages = totalPage;
};
const postScrollBtnBehavior = () => {
  setTimeout(() => {
    const scrollPosition = $('postView_contentText').scrollLeft;
    const contentWidth = $('postView_contentText').clientWidth;
    const scrollWidth = $('postView_contentText').scrollWidth;
    const targetWidth = scrollPosition + contentWidth + 50;
    if (scrollPosition === 0) {
      $('postView_contentShiftBtnPrev').classList.add('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
    } else if (scrollPosition !== 0 && targetWidth < scrollWidth) {
      $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
    } else {
      $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.add('postView_contentShiftBtn-hidden');
    }
  }, 1000);
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

// export const getPath = () => window.location.pathname;

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
};
export const closeModal = () => {
  $('bottomBar_navBtnContent').classList.remove('bottomBar_navBtnContent-modal');
  $('bottomBar').classList.remove('bottomBar-modal');
  $('bottomBar_navSign').classList.remove('bottomBar_navSign-modal');
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
        res.code === 0 ? $('listView').classList.remove('hidden') : false
        res.code === -2 ? $('listView').classList.remove('hidden') : false
      };
      Ts.onComplete(tsCompRes);
      Ts.reload();
    })
    .catch(() => showError());
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
      $('postView_contentCurrentPage').innerText = '1';
      $('postView_contentTotalPage').innerText = ' / 0';
      $('postView_contentCurrentPagePre').classList.remove('defs');
      $('postView_contentCurrentPage').classList.remove('defs');
      $('postView_contentTotalPage').classList.remove('defs');
      $('postView_contentText').scrollTo(0, 0);
    })
    .then(() => {
      const tsCompRes = (res) => {
        res.code === 0 ? $('postView').classList.remove('hidden') : false
        res.code === -2 ? $('postView').classList.remove('hidden') : false
      };
      Ts.onComplete(tsCompRes);
      Ts.reload();
    })
    .then(() => {
      setPostAreaHeight();
      setTotalPage();
      postScrollBtnBehavior();
    })
    .catch(() => showError());
};

// window.addEventListener('touchstart', e => { isTap = true });
// window.addEventListener('touchmove', e => { isTap = false });
// window.addEventListener('touchend', e => { isTap ? isTap = true : isTap = false });

$('postView_contentShiftBtnNext').addEventListener(isTouch ? 'touchend' : 'click', () => {
  if (ready && isTap) {
    if (currentPage < totalPages) $('postView_contentCurrentPage').innerText = currentPage += 1;
    postScrollBtnBehavior();
    scrollNext();
    ready = false;
    setTimeout(() => {
      ready = true;
    }, 1000);
  }
});
$('postView_contentShiftBtnPrev').addEventListener(isTouch ? 'touchend' : 'click', () => {
  if (ready && isTap) {
    if (currentPage > 1) $('postView_contentCurrentPage').innerText = currentPage -= 1;
    postScrollBtnBehavior();
    scrollPrev();
    ready = false;
    setTimeout(() => {
      ready = true;
    }, 1000);
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
    if (Math.abs(touchMoveX - touchStartX) > 10) e.preventDefault()
  });
  $('postView_contentText').addEventListener('touchend', (e) => {
    if (touchStartX > touchMoveX && ready) {
      if (touchStartX > (touchMoveX + 30)) {
        if (currentPage < totalPages) $('postView_contentCurrentPage').innerText = currentPage += 1;
        postScrollBtnBehavior();
        scrollNext();
        ready = false;
        setTimeout(() => {
          ready = true;
        }, 1000);
      }
    } else if (touchStartX < touchMoveX && ready) {
      if ((touchStartX + 30) < touchMoveX) {
        if (currentPage > 1) $('postView_contentCurrentPage').innerText = currentPage -= 1;
        postScrollBtnBehavior();
        scrollPrev();
        ready = false;
        setTimeout(() => {
          ready = true;
        }, 1000);
      }
    }
  });
} else {
  $('postView_contentText').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaX > 20 && ready) {
      if (currentPage < totalPages) $('postView_contentCurrentPage').innerText = currentPage += 1;
      postScrollBtnBehavior();
      scrollNext();
      ready = false;
      setTimeout(() => {
        ready = true;
      }, 1000);
    } else if (e.deltaX < -20 && ready) {
      if (currentPage > 1) $('postView_contentCurrentPage').innerText = currentPage -= 1;
      postScrollBtnBehavior();
      scrollPrev();
      ready = false;
      setTimeout(() => {
        ready = true;
      }, 1000);
    }
  });
}
