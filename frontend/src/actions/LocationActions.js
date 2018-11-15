export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    location
  };
}

export const CLEAR_LOCATION = 'CLEAR_LOCATION';
export function clearLocation() {
  return {
    type: CLEAR_LOCATION
  };
}
