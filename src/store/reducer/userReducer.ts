const SOME_ACTION = 'SOME_ACTION';

interface UserState {
    some: any;
}

const initState: UserState = {
  some: {},
};

export default (state = initState, action: any): UserState => {
  switch (action.type) {
    case SOME_ACTION:
      return { some: action.payload };
    default:
      return state;
  }
};
