# -*- coding: utf-8 -*-

from flask import session, current_app, g
from flask_socketio import SocketIO, join_room, emit

from taxi.utils import get_member

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


@socketio.on("current-location")
@websocket_logined
def current_location(message):
    if g.member.is_driver:
        key = f"driver-{g.member.id}"
    else:
        key = f"member-{g.member.id}"

    lat = message.get("lat")
    lng = message.get("lng")

    pipe = current_app.redis.pipeline()
    pipe.hmset(key, {"lng": lng, "lat": lat})
    pipe.zrem("map", key)
    pipe.geoadd("map", lng, lat, key)

    pipe.execute()
