/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { combineReducers } from 'redux';
import userReducer from './userReducer';

export default combineReducers({
  user: userReducer,
});
