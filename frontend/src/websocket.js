import io from 'socket.io-client';

import { updateTrip } from './actions/UserActions.js';

export class SocketConnection {
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.socket = io('/');
    this.socket.on('update-trip', this.update_trip.bind(this));
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
}
