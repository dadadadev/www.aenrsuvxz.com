import setState from './setState';
import router from './router';
import { $, isTouch, isTap } from './util';

class fetchData {
  constructor(state) {
    this.state = state;
    this.view = state.view;
    this.target = state.view === 'list' ? $('listView') : $('postView');
    this.promiseData = fetch(`https://api.aenrsuvxz.com${state.path}.json`)
      .then(res => res.json())
      .catch(() => {
        this.state.view = '404';
        router(this.state);
      });
  }
  init() {
    window.scrollTo(0, 0);
    this.target.classList.add('hidden');
    if (this.view === 'list') {
      this.target.scrollTo(0, 0);
    } else if (this.view === 'post') {
      $('postView_contentText').scrollTo(0, 0);
    }
  }
  removeHidden() {
    const tsCompRes = (res) => {
      if (res.code === 0) {
        setTimeout(() => {
          this.target.classList.remove('hidden');
        }, 100);
      } else {
        setTimeout(() => {
          this.target.classList.remove('hidden');
        }, 1500);
      }
    };
    Ts.onComplete(tsCompRes);
    Ts.reload();
  }
}

export class FetchList extends fetchData {
  setData() {
    this.init();
    this.promiseData
      .then((data) => {
        this.showList(data);
      })
      .then(() => {
        this.removeHidden();
      });
  }
  showList(data) {
    this.fragment = document.createDocumentFragment();
    for (let post of data.list) {
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
      this.fragment.appendChild(li);
    }
    while ($('listView_items').firstChild) {
      $('listView_items').removeChild($('listView_items').firstChild);
    }
    $('listView_items').appendChild(this.fragment);

  }
}
export class FetchPost extends fetchData {
  setData() {
    this.init();
    this.ready = true;
    this.currentPage = 1;
    this.totalPages = 1;
    this.touchStartX = 0;
    this.touchMoveX = 0;
    this.promiseData
      .then((data) => {
        this.title = data.title;
        this.date = data.date;
        this.text = data.text;
      })
      .then(() => {
        this.insertTexts()
        this.removeHidden();
        this.setPostAreaHeight();
        this.setTotalPage();
        this.postScrollBtnBehavior();
        this.swipeBehavior();
      });
  }
  setPostAreaHeight() {
    this.titleHeight = $('postView_contentTitle').clientHeight;
    $('postView_contentText').style.cssText += `height: calc(100vh - ${this.titleHeight}px - 115px);`;
    $('postView_contentShiftBtnPrev').style.cssText += `height: calc(100vh - ${this.titleHeight}px - 115px);`;
    $('postView_contentShiftBtnNext').style.cssText += `height: calc(100vh - ${this.titleHeight}px - 115px);`;
  }
  setTotalPage() {
    this.scrollWidth = $('postView_contentText').scrollWidth;
    this.viewAreaWidth = $('postView_contentText').clientWidth + 65;
    this.restWidth = this.scrollWidth % this.viewAreaWidth;
    this._scrollWidth = this.scrollWidth - this.restWidth;
    this.totalPages = (this._scrollWidth + this.viewAreaWidth) / this.viewAreaWidth;
    $('postView_contentTotalPage').innerText = ` / ${this.totalPages}`;
  }
  postScrollBtnBehavior() {
    this.scrollPosition = $('postView_contentText').scrollLeft;
    this.contentWidth = $('postView_contentText').clientWidth;
    this.scrollWidth = $('postView_contentText').scrollWidth;
    this.targetWidth = this.scrollPosition + this.contentWidth + 65;
    if (this.scrollPosition === 0 && this.targetWidth >= this.scrollWidth) {
      $('postView_contentShiftBtnPrev').classList.add('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.add('postView_contentShiftBtn-hidden');
    } else if (this.scrollPosition === 0 && this.targetWidth < this.scrollWidth) {
      $('postView_contentShiftBtnPrev').classList.add('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
    } else if (this.scrollPosition !== 0 && this.targetWidth < this.scrollWidth) {
      $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.remove('postView_contentShiftBtn-hidden');
    } else {
      $('postView_contentShiftBtnPrev').classList.remove('postView_contentShiftBtn-hidden');
      $('postView_contentShiftBtnNext').classList.add('postView_contentShiftBtn-hidden');
    }
  }
  scrollNext() {
    $('postView_contentText').scrollBy({
      behavior: 'smooth',
      top: 0,
      left: $('postView_contentText').clientWidth + 65,
    });
  }
  scrollPrev() {
    $('postView_contentText').scrollBy({
      behavior: 'smooth',
      top: 0,
      left: -($('postView_contentText').clientWidth + 65),
    });
  }
  postScrollBehavior(action) {
    if (action === 'next') {
      this.currentPage++;
      this.ready = false;
      $('postView_contentCurrentPage').innerText = `表示中のページ： ${this.currentPage}`;
      this.scrollNext();
      setTimeout(() => {
        this.postScrollBtnBehavior();
        this.ready = true;
      }, 1000);
    } else if (action === 'prev') {
      this.currentPage--;
      this.ready = false;
      $('postView_contentCurrentPage').innerText = `表示中のページ： ${this.currentPage}`;
      this.scrollPrev();
      setTimeout(() => {
        this.postScrollBtnBehavior();
        this.ready = true;
      }, 1000);
    }
  }
  insertTexts() {
    document.title = `${this.title} - www.aenrsuvxz.com`;
    $('postView_contentTitleArea').innerText = this.title;
    $('postView_contentTimeArea').innerText = `更新日： ${this.date}`;
    $('postView_contentTimeArea').setAttribute('datetime', this.date);
    $('postView_contentText').innerHTML = this.text;
    $('postView_contentCurrentPage').innerText = `表示中のページ： ${this.currentPage}`;
  }
  swipeBehavior() {
    $('postView_contentShiftBtnNext').addEventListener((isTouch && isTap) ? 'touchend' : 'click', () => {
      if (this.ready && this.currentPage < this.totalPages) {
        this.postScrollBehavior('next');
      }
    });
    $('postView_contentShiftBtnPrev').addEventListener((isTouch && isTap) ? 'touchend' : 'click', () => {
      if (this.ready && this.currentPage > 1) {
        this.postScrollBehavior('prev');
      }
    });
    if (isTouch) {
      $('postView_contentText').addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].pageX;
      });
      $('postView_contentText').addEventListener('touchmove', (e) => {
        this.touchMoveX = e.changedTouches[0].pageX;
        if (Math.abs(this.touchMoveX - this.touchStartX) > 10) e.preventDefault();
      });
      $('postView_contentText').addEventListener('touchend', () => {
        if (this.touchStartX > this.touchMoveX + 30 && this.currentPage < this.totalPages && this.ready) {
          this.postScrollBehavior('next');
        } else if (this.touchStartX + 30 < this.touchMoveX && this.currentPage > 1 && this.ready) {
          this.postScrollBehavior('prev');
        }
      });
    } else {
      $('postView_contentText').addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaX > 0 && this.currentPage < this.totalPages && this.ready) {
          this.postScrollBehavior('next');
        } else if (e.deltaX < 0 && this.currentPage > 1 && this.ready) {
          this.postScrollBehavior('prev');
        }
      });
    }
  }
}
