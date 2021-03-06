export default (state = true, action) => {
  switch (action.type) {
    case 'VISUALIZER_TOGGLED': {
      return state ? false : true;
    }
    case 'GAME_INITIALIZED': {
      return true;
    }
  }
  return state;
};
