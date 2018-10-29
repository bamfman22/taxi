# -*- coding: utf-8 -*-

from flask import session
from flask_socketio import SocketIO, join_room, emit

from taxi.utils import get_member

socketio = SocketIO()


@socketio.on("connect")
def subscribe():
    if "id" not in session or "token" not in session:
        emit("error", {"message": "user is not logged in"})
        return

    member = get_member(session["id"], session["token"])

    if not member:
        emit("error", {"message": "user is not logged in"})
        return

    join_room(f"member-{member.id}")
