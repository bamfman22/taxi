# -*- coding: utf-8 -*-

from flask_socketio import SocketIO

socket = SocketIO(message_queue="redis://")

socket.emit("driver_coordinate", {"lat": 0, "lng": 0}, room="member-5")
