# -*- coding: utf-8 -*-

from flask import session
from typing import Optional
from taxi.models import db, Member, Token


def login_member(member: Member):
    token = member.create_token()
    db.session.add(token)
    db.session.commit()

    session["id"] = member.id
    session["token"] = token.token
    session.permanent = True


def current_member() -> Optional[Member]:
    id = session.get("id", None)
    auth = session.get("token", None)

    if not auth or not id:
        return None

    token = Token.query.filter_by(token=auth).first()

    if token and token.member_id == id:
        return token.member

    return None
