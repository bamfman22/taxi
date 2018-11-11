# -*- coding: utf-8 -*-

import re
import enum
import uuid
import bcrypt
from flask import jsonify
from typing import List

from taxi.models import db, Trip
from .member_role import MemberRole


EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+", re.I)


class PictureKind(enum.Enum):
    PROFILE = 1
    LICENSE = 2


class Picture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)
    token = db.Column(db.String(32), nullable=False)
    kind = db.Column(db.Enum(PictureKind), nullable=False)
    picture = db.Column(db.LargeBinary(0xFFFFFFF), nullable=False)

    @staticmethod
    def genreate_token():
        return uuid.uuid4().hex

    @classmethod
    def create(cls, member, kind, picture):
        return cls(
            member_id=member.id, kind=kind, token=cls.genreate_token(), picture=picture
        )


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


class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    activated = db.Column(db.Boolean(create_constraint=False), default=False)
    name = db.Column(db.String(80), nullable=False)
    _password = db.Column("password", db.LargeBinary(120), nullable=False)
    role = db.Column(db.Enum(MemberRole), default=MemberRole.PASSENGER)
    tokens = db.relationship("Token", backref="member", lazy=True)
    phone = db.Column(db.String(40))

    driver_verified = db.Column(db.Boolean(create_constraint=False), default=False)
    plate = db.Column(db.String(20))
    license = db.Column(db.String(20))
    license_picture_id = db.Column(db.Integer, db.ForeignKey("picture.id"))
    license_picture = db.relationship(
        "Picture", backref="member", foreign_keys=[license_picture_id], lazy=True
    )

    @property
    def password(self):
        raise NotImplementedError("use Member.checkpw instead")

    @property
    def is_driver(self):
        return self.role == MemberRole.DRIVER

    @password.setter
    def password(self, new: bytes):
        self._password = bcrypt.hashpw(new, bcrypt.gensalt())

    def checkpw(self, pw: bytes) -> bool:
        return bcrypt.checkpw(pw, self._password)

    def create_token(self, kind=TokenKind.AUTH) -> Token:
        return Token.create(self, kind)

    def to_json(self):
        result = dict(
            email=self.email,
            name=self.name,
            phone=self.phone,
            role=self.role.name.lower(),
            profile_picture=self.profile_picture,
            activated=self.activated,
        )

        if self.role == MemberRole.DRIVER:
            result["plate"] = self.plate

        return result

    def jsonify(self):
        return jsonify(self.to_json())

    @property
    def profile_picture(self):
        token = (
            Picture.query.filter_by(member_id=self.id, kind=PictureKind.PROFILE)
            .order_by(Picture.id.desc())
            .first()
        )

        if token:
            return token.token
        return None

    @property
    def active_trip(self):
        if not hasattr(self, "_active_trip"):
            self._active_trip = Trip.ongoing_for(self).first()
        return self._active_trip

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
