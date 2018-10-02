# -*- coding: utf-8 -*-

from flask import Blueprint, request, jsonify
from taxi.utils import login_member, current_member
from taxi.models import db, Member

bp = Blueprint("member", __name__, url_prefix="/member")


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

    return jsonify(success=1)


@bp.route("/login", methods=["POST"])
def login():
    email = request.form.get("email", None)
    password = request.form.get("password", "").encode("utf-8")

    member = Member.query.filter_by(email=email).first()

    if member and password and member.checkpw(password):
        login_member(member)
        return jsonify(success=1)

    return jsonify(errors=["email or password is wrong"]), 400


@bp.route("/current")
def current():
    member = current_member()

    if member:
        return jsonify(name=member.name)

    return jsonify()
