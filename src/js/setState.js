export default (path) => {
  const state = {};
  if (path.match(/^\/$/)) {
    state.view = 'front';
    state.category = null;
  } else if (path.match(/^\/performance\//)) {
    state.view = path.match(/^\/.+\/list$/) ? 'list' : 'post';
    state.category = 'performance';
  } else if (path.match(/^\/architecture\//)) {
    state.view = path.match(/^\/.+\/list$/) ? 'list' : 'post';
    state.category = 'architecture';
  } else if (path.match(/^\/uiux\//)) {
    state.view = path.match(/^\/.+\/list$/) ? 'list' : 'post';
    state.category = 'uiux';
  } else {
    state.view = '404';
    state.category = '404';
  }
  state.path = path;
  return state;
};
