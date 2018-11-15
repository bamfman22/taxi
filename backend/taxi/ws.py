# -*- coding: utf-8 -*-

from flask import session, current_app, g
from flask_socketio import SocketIO, join_room, emit

from taxi.utils import get_member
from taxi.models import Trip

socketio = SocketIO()


def websocket_logined(f):
    def wrap(*args, **kwargs):
        if "id" not in session or "token" not in session:
            emit("error", {"message": "user is not logged in"})
            return

        member = get_member(session["id"], session["token"])

        if not member:
            emit("error", {"message": "user is not logged in"})
            return

        g.member = member

        return f(*args, **kwargs)

    return wrap


@socketio.on("connect")
@websocket_logined
def on_connect():
    join_room(f"member-{g.member.id}")

    if g.member.active_trip:
        join_room(f"trip-{g.member.active_trip.id}")


@socketio.on("current-location")
@websocket_logined
def current_location(message):
    if g.member.is_driver:
        key = f"driver-{g.member.id}"
    else:
        key = f"member-{g.member.id}"

    if not message:
        return

    lat = message.get("lat")
    lng = message.get("lng")
    location = {"lng": lng, "lat": lat}

    pipe = current_app.redis.pipeline()
    pipe.hmset(key, location)
    pipe.zrem("map", key)
    pipe.geoadd("map", lng, lat, key)
    pipe.execute()

    print("location updated")
    print(g.member)
    print(g.member.active_trip)
    if g.member.active_trip:
        data = {}
        data[g.member.role.name.lower()] = location
        emit("user-location", data, room=f"trip-{g.member.active_trip.id}")


@socketio.on("subscribe-trip")
@websocket_logined
def subscribe_trip(message):
    trip_id = message.get("id", None)

    if not trip_id:
        emit("error", {"message": "need trip id"})
        return

    trip = Trip.query.get(trip_id)

    if not trip or (trip.driver.id != g.member.id and trip.passenger.id != g.member.id):
        emit("error", {"message": "trip not found or no permission"})
        return

    join_room(f"trip-{trip.id}")

    location = current_app.redis.geopos(
        "map", f"driver-{trip.driver_id}", f"member-{trip.passenger_id}"
    )

    data = {}

    if location[0]:
        data["driver"] = dict(lng=location[0][0], lat=location[0][1])
    if location[1]:
        data["passenger"] = dict(lng=location[1][0], lat=location[1][1])

    emit("user-location", data)
