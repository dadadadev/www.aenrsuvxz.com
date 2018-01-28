import { $ } from './util';
// import * as $dom from './dom';
import { FetchList, FetchPost } from './fetch';

// const showFront = () => {
//   $('topBar').classList.add('topBar-hidden');
//   $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-postView', 'innerContainer-errorView');
//   $('bottomBar').classList.remove('bottomBar-listView');
// };
// const showList = () => {
//   $('topBar').classList.remove('topBar-hidden');
//   $('innerContainer').classList.add('innerContainer-listView');
//   $('innerContainer').classList.remove('innerContainer-postView', 'innerContainer-errorView');
//   $('bottomBar').classList.add('bottomBar-listView');
// };
// const showPost = () => {
//   $('topBar').classList.remove('topBar-hidden');
//   $('innerContainer').classList.add('innerContainer-postView');
//   $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-errorView');
//   $('bottomBar').classList.add('bottomBar-listView');
// };
// const showError = () => {
//   $('errorView_textArea').innerText = 'このURLのコンテンツは存在しません。';
//   $('topBar').classList.add('topBar-hidden');
//   $('innerContainer').classList.add('innerContainer-errorView');
//   $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-postView');
//   $('bottomBar').classList.remove('bottomBar-listView');
// };
const showView = (state) => {
  if (state.view === 'front') {
    $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-postView', 'innerContainer-errorView');
  } else if (state.view === 'list') {
    const getData = new FetchList(state);
    getData.setData();
    $('innerContainer').classList.add('innerContainer-listView');
    $('innerContainer').classList.remove('innerContainer-postView', 'innerContainer-errorView');
  } else if (state.view === 'post') {
    const getData = new FetchPost(state);
    getData.setData();
    $('innerContainer').classList.add('innerContainer-postView');
    $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-errorView');
  } else if (state.view === '404') {
    $('errorView_textArea').innerText = 'このURLのコンテンツは存在しません。';
    $('innerContainer').classList.add('innerContainer-errorView');
    $('innerContainer').classList.remove('innerContainer-listView', 'innerContainer-postView');
  }
};
const topBarBehavior = (state) => {
  if (state.view === 'front') $('topBar').classList.add('topBar-hidden');
  else if (state.view === 'list') $('topBar').classList.remove('topBar-hidden');
  else if (state.view === 'post') $('topBar').classList.remove('topBar-hidden');
  else if (state.view === '404') $('topBar').classList.add('topBar-hidden');
  if (state.category === 'performance') {
    $('topBar_categoryItems').classList.add('topBar_categoryItems-performance');
    $('topBar_categoryItems').classList.remove('topBar_categoryItems-architecture', 'topBar_categoryItems-uiux');
  } else if (state.category === 'architecture') {
    $('topBar_categoryItems').classList.add('topBar_categoryItems-architecture');
    $('topBar_categoryItems').classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-uiux');
  } else if (state.category === 'uiux') {
    $('topBar_categoryItems').classList.add('topBar_categoryItems-uiux');
    $('topBar_categoryItems').classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-architecture');
  }
};
const bottomBarBehavior = (state) => {
  if (state.view === 'front') $('bottomBar').classList.remove('bottomBar-listView');
  else if (state.view === 'list') $('bottomBar').classList.add('bottomBar-listView');
  else if (state.view === 'post') $('bottomBar').classList.add('bottomBar-listView');
  else if (state.view === '404') {
    // $('bottomBar').classList.remove('bottomBar-listView');
    $('bottomBar_navItems').classList.add('bottomBar_navItems-error');
  }
};
export default (state) => {
  showView(state);
  topBarBehavior(state);
  bottomBarBehavior(state);
  // if (state.view === 'front') {
  //   showFront();
  // } else if (state.view === 'list') {
  //   const getData = new FetchList(state);
  //   getData.setData();
  //   showList();
  // } else if (state.view === 'post') {
  //   const getData = new FetchPost(state);
  //   getData.setData();
  //   showPost();
  // } else if (state.view === '404') {
  //   showError();
  //   bottomBarError();
  // }
};
