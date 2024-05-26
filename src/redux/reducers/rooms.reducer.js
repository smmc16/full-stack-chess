const roomsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_ROOMS':
        return action.payload;
      default:
        return state;
    }
  };

export default roomsReducer;