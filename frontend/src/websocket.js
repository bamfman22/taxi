import io from 'socket.io-client';

import { updateTrip, updateTripLocation } from './actions/TripActions.js';
import store from './store';

export class SocketConnection {
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.socket = io('/');
    this.socket.on('update-trip', this.update_trip.bind(this));
    this.socket.on('user-location', this.user_location.bind(this));

    this.subscribed_trip = [];
    let cache;
    store.subscribe(() => {
      const { location, trip } = store.getState();

      if (trip.id != null && this.subscribed_trip.indexOf(trip.id) === -1) {
        this.subscribed_trip.push(trip.id);
        this.socket.emit('subscribe-trip', { id: trip.id });
      }

      if (
        location != null &&
        (cache == null ||
          cache.lat !== location.lat ||
          cache.lng !== location.lng)
      ) {
        this.update_location(location);
        cache = location;
        console.debug('updating location to: ', cache);
      }
    });
  }

  update_location(location) {
    this.socket.emit('current-location', {
      lat: location.lat,
      lng: location.lng
    });
  }

  update_trip(trip) {
    this.dispatch(updateTrip(trip));
  }

  user_location(location) {
    console.log('updating location: ', location);
    this.dispatch(updateTripLocation(location));
  }
}
