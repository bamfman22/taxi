// @flow

import type { Dispatch } from 'redux';

import { updateLocation } from './actions/LocationActions';

class LocationService {
  dispatch: Dispatch;
  watch_handle: ?number;

  constructor(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  success({ coords }: Position) {
    console.debug('location info get');

    this.dispatch(
      updateLocation({ lat: coords.latitude, lng: coords.longitude })
    );
  }

  failed() {
    console.debug('failed to get location info: ', arguments);
  }

  start() {
    if (this.watch_handle != null) return;

    console.debug('location service started.');

    this.watch_handle = navigator.geolocation.watchPosition(
      this.success.bind(this),
      this.failed.bind(this),
      {
        enableHighAccuracy: true,
        maximumAge: 100,
        timeout: Infinity
      }
    );
  }

  stop() {
    console.log('location service stopped');

    if (this.watch_handle != null) {
      navigator.geolocation.clearWatch(this.watch_handle);
      this.watch_handle = null;
    }
  }
}

export default LocationService;
