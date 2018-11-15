# -*- coding: utf-8 -*-

from flask import session, g, jsonify
from flask_mail import Mail
from typing import Optional
from taxi.models import db, Member, MemberRole, Token, TokenKind

mail = Mail()


def login_member(member: Member):
    token = member.create_token()
    db.session.add(token)
    db.session.commit()

    session["id"] = member.id
    session["token"] = token.token
    session.permanent = True


def logout_member(member: Member):
    auth = session.get("token", None)
    token = Token.query.filter_by(token=auth, member_id=member.id).first()

    if token:
        db.session.delete(token)
        db.session.commit()

    session.pop("id", None)
    session.pop("token", None)


def get_member(mid, auth) -> Optional[Member]:
    token = Token.query.filter_by(token=auth, kind=TokenKind.AUTH).first()
    if token and token.member_id == mid:
        return token.member

    return None


def current_member() -> Optional[Member]:
    mid = session.get("id", None)
    auth = session.get("token", None)

    if not auth or not mid:
        return None

    return get_member(mid, auth)


def require_member(f):
    def inner(*args, **kwargs):
        if not g.member:
            return jsonify(), 400
        return f(*args, **kwargs)

    return inner


def require_driver(f):
    def inner(*args, **kwargs):
        if not g.member or g.member.role != MemberRole.DRIVER:
            return jsonify(), 400
        return f(*args, **kwargs)

    return inner
