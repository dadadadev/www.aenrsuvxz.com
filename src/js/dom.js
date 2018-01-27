import { $ } from './util';

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
  $('errorView_textArea').innerText = 'このURLのコンテンツは存在しません。';
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
