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
