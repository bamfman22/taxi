import { combineReducers } from 'redux';

import { UPDATE_USER, LOG_OUT, UPDATE_TRIP } from './actions/UserActions';

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

function tripUpdateReducer(state = {}, action) {
  if (action.trip) return action.trip;
  return state;
}

function tripReducer(state = {}, action) {
  switch (action.type) {
    case UPDATE_TRIP:
      return tripUpdateReducer(state, action);
    default:
      return state;
  }
}

const taxiApp = combineReducers({ user: userReducer, trip: tripReducer });

export default taxiApp;
