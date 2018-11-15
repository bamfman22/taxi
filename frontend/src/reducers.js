import { combineReducers } from 'redux';

import { UPDATE_USER, LOG_OUT } from './actions/UserActions';
import { UPDATE_TRIP, UPDATE_TRIP_LOCATION } from './actions/TripActions';
import { UPDATE_LOCATION, CLEAR_LOCATION } from './actions/LocationActions';

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
  if (action.trip) {
    return {
      ...action.trip,
      location: state.location
    };
  }
  return state;
}

function tripLocationUpdateReducer(state = {}, action) {
  if (state.location == null) {
    return {
      ...state,
      location: action.location
    };
  } else {
    if (action.location.passenger != null) {
      return {
        ...state,
        location: {
          ...state.location,
          passenger: action.location.passenger
        }
      };
    }

    if (action.location.driver != null) {
      return {
        ...state,
        location: {
          ...state.location,
          driver: action.location.driver
        }
      };
    }
  }
  return state;
}

function tripReducer(state = {}, action) {
  switch (action.type) {
    case UPDATE_TRIP:
      return tripUpdateReducer(state, action);
    case UPDATE_TRIP_LOCATION:
      return tripLocationUpdateReducer(state, action);
    default:
      return state;
  }
}

function locationUpdateReducer(state = null, action) {
  if (action.location) return action.location;
  return state;
}

function locationReducer(state = null, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      return locationUpdateReducer(state, action);
    case CLEAR_LOCATION:
      return {};
    default:
      return state;
  }
}

const taxiApp = combineReducers({
  user: userReducer,
  trip: tripReducer,
  location: locationReducer
});

export default taxiApp;
