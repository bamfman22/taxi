import * as io from 'socket.io-client';

export class SocketConnection {
  constructor() {
    this.socket = io('/');
    this.socket.on('driver_coordinate', data => console.log(data));
  }

  subscribe() {
    this.socket.emit('subscribe', { trip: 1 });
  }
}
