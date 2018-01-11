export default (path) => {
  const state = {};

  if (path.match(/^\/$/)) {
    state.view = 'front';
    state.category = null;
    state.path = path;
  } else if (path.match(/^\/performance\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'performance';
    state.path = path;
  } else if (path.match(/^\/architecture\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'architecture';
    state.path = path;
  } else if (path.match(/^\/uiux\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'uiux';
    state.path = path;
  } else {
    state.view = '404';
    state.category = null;
    state.path = '404';
  }
  return state;
};
