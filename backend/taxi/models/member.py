# -*- coding: utf-8 -*-

import re
import enum
import uuid
import bcrypt
from flask import jsonify, current_app
from typing import List

from taxi.models import db


EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+", re.I)


class TokenKind(enum.Enum):
    AUTH = 1
    ACTIVATE = 2
    PICTURE = 3


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)
    token = db.Column(db.String(32), nullable=False)
    kind = db.Column(db.Enum(TokenKind), default=TokenKind.AUTH)

    @staticmethod
    def genreate_token():
        return uuid.uuid4().hex

    @classmethod
    def create(cls, member, kind):
        return cls(member_id=member.id, kind=kind, token=cls.genreate_token())

    @property
    def picture_path(self):
        if self.kind != TokenKind.PICTURE:
            return None

        return current_app.config["PICTURE_UPLOAD_FOLDER"] / "{}.png".format(self.token)


class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    _password = db.Column("password", db.LargeBinary(120), nullable=False)
    role = db.Column(db.String(20), default="deactivated")
    tokens = db.relationship("Token", backref="member", lazy=True)
    phone = db.Column(db.String(40))

    @property
    def password(self):
        raise NotImplementedError("use Member.checkpw instead")

    @password.setter
    def password(self, new: bytes):
        self._password = bcrypt.hashpw(new, bcrypt.gensalt())

    def checkpw(self, pw: bytes) -> bool:
        return bcrypt.checkpw(pw, self._password)

    def create_token(self, kind=TokenKind.AUTH) -> Token:
        return Token.create(self, kind)

    def jsonify(self):
        return jsonify(
            email=self.email,
            name=self.name,
            phone=self.phone,
            role=self.role,
            profile_picture=self.profile_picture,
        )

    @property
    def profile_picture(self):
        token = (
            Token.query.filter_by(member_id=self.id, kind=TokenKind.PICTURE)
            .order_by(Token.id.desc())
            .first()
        )

        if token:
            return token.token
        return None

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
    def validate_phone(phone) -> List[str]:
        if len(phone) != 10:
            return ["Phone number should be 10-digits long"]

        return []

    @staticmethod
    def validate_password(password) -> List[str]:
        if not password:
            return ["Password is required"]
        return []
