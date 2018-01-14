import * as $dom from './dom';

export default (state) => {
  if (state.view === 'front') {
    $dom.showFront();
  } else if (state.view === 'list') {
    $dom.fetchList(state.path);
    $dom.showList();
  } else if (state.view === 'post') {
    $dom.fetchPost(state.path);
    $dom.showPost();
  } else if (state.view === '404') {
    $dom.showError();
  }

  if (state.category === 'performance') $dom.showTopBarPerformance();
  else if (state.category === 'architecture') $dom.showTopBarArchitecture();
  else if (state.category === 'uiux') $dom.showTopBarUiux();

  console.log(state);
};
