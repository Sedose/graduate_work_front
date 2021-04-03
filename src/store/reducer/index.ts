import { combineReducers } from 'redux';
import userReducer from './errorReducer';

export default combineReducers({
  user: userReducer,
});
