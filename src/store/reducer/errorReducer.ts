const SET_IS_ERROR_ACTION = 'SET_IS_ERROR_ACTION';

interface GlobalState {
  isErrorTokenExpired: boolean;
}

const initState: GlobalState = {
  isErrorTokenExpired: true,
};

export default (state = initState, action: any): GlobalState => {
  switch (action.type) {
    case SET_IS_ERROR_ACTION:
      return { isErrorTokenExpired: action.payload };
    default:
      return state;
  }
};
