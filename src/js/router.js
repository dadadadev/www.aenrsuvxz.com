import * as $dom from './dom';
import { FetchList, FetchPost } from './fetch';

export default (state) => {
  if (state.view === 'front') {
    $dom.showFront();
  } else if (state.view === 'list') {
    const getData = new FetchList(state);
    getData.init();
    getData.setData();
    $dom.showList();
  } else if (state.view === 'post') {
    const getData = new FetchPost(state);
    getData.init();
    getData.setData();
    $dom.showPost();
  } else if (state.view === '404') {
    $dom.showError();
    $dom.bottomBarError();
  }

  if (state.category === 'performance') $dom.showTopBarPerformance();
  else if (state.category === 'architecture') $dom.showTopBarArchitecture();
  else if (state.category === 'uiux') $dom.showTopBarUiux();
};
