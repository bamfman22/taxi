# -*- coding: utf-8 -*-

import re
import uuid
import bcrypt
from flask import jsonify
from typing import List

from taxi.models import db


EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+", re.I)


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)
    token = db.Column(db.String(32), default=lambda: uuid.uuid4().hex)


class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    _password = db.Column("password", db.LargeBinary(120), nullable=False)
    role = db.Column(db.String(20), default="")
    tokens = db.relationship("Token", backref="member", lazy=True)

    @property
    def password(self):
        raise NotImplementedError("use Member.checkpw instead")

    @password.setter
    def password(self, new: bytes):
        self._password = bcrypt.hashpw(new, bcrypt.gensalt())

    def checkpw(self, pw: bytes) -> bool:
        return bcrypt.checkpw(pw, self._password)

    def create_token(self) -> Token:
        return Token(member_id=self.id)

    def jsonify(self):
        return jsonify(email=self.email, name=self.name)

    @staticmethod
    def validate_email(email) -> List[str]:
        if not email:
            return ["Email is required"]
        if not EMAIL_REGEX.fullmatch(email):
            return ["Invalid email address"]
        if Member.query.filter_by(email=email).first():
            return ["Email has been taken"]
        return []

    @staticmethod
    def validate_name(name) -> List[str]:
        if not name:
            return ["Name is required"]
        return []

    @staticmethod
    def validate_password(password) -> List[str]:
        if not password:
            return ["Password is required"]
        return []
