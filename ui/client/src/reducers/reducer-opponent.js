export default (state = null, action) => {
  switch (action.type) {
    case 'OPPONENT_FETCHED': 
      return action.payload;
      break;
  }
  return state;
};