import { combineReducers } from 'redux';

import { UPDATE_USER, LOG_OUT } from './actions/UserActions';

function userUpdateReducer(state = {}, action) {
  if (action.user) return action.user;
  return state;
}

function userReducer(state = {}, action) {
  switch (action.type) {
    case UPDATE_USER:
      return userUpdateReducer(state, action);
    case LOG_OUT:
      return {};
    default:
      return state;
  }
}

const taxiApp = combineReducers({ user: userReducer });

export default taxiApp;
