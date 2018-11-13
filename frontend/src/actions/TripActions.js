import { apiRequest } from './common';

export const UPDATE_TRIP = 'UPDATE_TRIP';
export function updateTrip(trip) {
  return {
    type: UPDATE_TRIP,
    trip: trip
  };
}

export const UPDATE_TRIP_LOCATION = 'UPDATE_TRIP_LOCATION';
export function updateTripLocation(location) {
  return {
    type: UPDATE_TRIP_LOCATION,
    location: location
  };
}

export function notifyPassenger(trip_id) {
  return dispatch =>
    apiRequest('POST', `/trip/${trip_id}/notify`).then(json =>
      dispatch(updateTrip(json))
    );
}

export function pickUpTrip(trip_id) {
  return dispatch =>
    apiRequest('POST', `/trip/${trip_id}/pickup`).then(json =>
      dispatch(updateTrip(json))
    );
}

export function finishTrip(trip_id) {
  return dispatch =>
    apiRequest('POST', `/trip/${trip_id}/finish`).then(json =>
      dispatch(updateTrip(json))
    );
}
