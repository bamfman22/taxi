# -*- coding: utf-8 -*-

from flask import Blueprint, request, jsonify, g, current_app, Response
from flask_mail import Message
from taxi.utils import login_member, logout_member, require_member, mail
from taxi.models import db, Member, Token, TokenKind, Trip

bp = Blueprint("member", __name__, url_prefix="/member")


def send_activate_mail(member, token):
    msg = Message("Please verify your Email address", recipients=[member.email])
    msg.body = f"""
Hello {member.name},

Please use the following link to verify your account:

{request.host_url}member/activate/{token.token}

If you believe this email is sent to you by mistake, please ignore it.

Thanks
    """

    mail.send(msg)


@bp.route("/signup", methods=["POST"])
def signup():
    email = request.form.get("email", None)
    name = request.form.get("name", None)
    password = request.form.get("password", "").encode("utf-8")

    errors = []
    errors.extend(Member.validate_email(email))
    errors.extend(Member.validate_name(name))
    errors.extend(Member.validate_password(password))

    if errors:
        return jsonify(errors=errors), 400

    member = Member(email=email, name=name, password=password)
    db.session.add(member)
    db.session.commit()

    activate_token = member.create_token(TokenKind.ACTIVATE)
    db.session.add(activate_token)
    db.session.commit()
    send_activate_mail(member, activate_token)

    login_member(member)

    return member.jsonify()


@bp.route("/login", methods=["POST"])
def login():
    email = request.form.get("email", None)
    password = request.form.get("password", "").encode("utf-8")

    member = Member.query.filter_by(email=email).first()

    if member and password and member.checkpw(password):
        login_member(member)
        return member.jsonify()

    return jsonify(errors=["Email or password is incorrect"]), 400


@bp.route("/logout")
def logout():
    if g.member:
        logout_member(g.member)

    return jsonify()


@bp.route("/current")
def current():
    if g.member:
        return g.member.jsonify()

    return jsonify()


@bp.route("/activate/<raw_token>", methods=["GET", "POST"])
def activate(raw_token):
    token = Token.query.filter_by(token=raw_token, kind=TokenKind.ACTIVATE).first()

    if not token:
        return jsonify(), 404

    if request.method == "GET":
        return jsonify(success=1, message="exist")

    member = token.member
    member.role = "member"

    db.session.add(member)
    db.session.delete(token)
    db.session.commit()

    return jsonify(success=1, message="activated")


@require_member
@bp.route("/settings", methods=["POST"])
def settings():
    name = request.form.get("name", None)
    phone = request.form.get("phone", None)

    member = g.member

    errors = []
    if name:
        errors.extend(Member.validate_name(name))

    if phone:
        errors.extend(Member.validate_phone(phone))

    if errors:
        return jsonify(errors=errors), 400

    if name:
        member.name = name

    if phone:
        member.phone = phone

    db.session.add(member)
    db.session.commit()

    return member.jsonify()


PICTURE_MIME = ["image/png"]


@require_member
@bp.route("/picture", methods=["POST"])
def upload_picture():
    picture = request.files.get("picture", None)
    errors = []

    if not picture:
        errors.append("no file uploaded")
    else:
        if picture.mimetype not in PICTURE_MIME:
            errors.append("wrong file type")

    if errors:
        return jsonify(errors=errors), 400

    member = g.member
    token = member.create_token(TokenKind.PICTURE)
    path = token.picture_path

    picture.save(str(path))

    db.session.add(token)
    db.session.commit()

    return jsonify(token=token.token)


@bp.route("/picture/<token>")
def picture(token):
    picture_token = Token.query.filter_by(token=token, kind=TokenKind.PICTURE).first()

    if not picture_token:
        return "not found", 404

    with open(picture_token.picture_path, "rb") as fp:
        content = fp.read()

    return Response(content, mimetype="image/png")


@require_member
@bp.route("/trips")
def history():
    trips = Trip.query.filter_by(passenger_id=g.member.id).all()

    if trips:
        return jsonify(history=list(map(lambda x: x.to_json(), trips)))

    return jsonify(errors=["No history for member"])
