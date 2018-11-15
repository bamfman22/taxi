# -*- coding: utf-8 -*-

import os

from flask import _app_ctx_stack
from flask_sqlalchemy import SQLAlchemy, BaseQuery
from sqlalchemy import orm


class MySQLAlchemy(SQLAlchemy):
    sessionmaker = None

    def create_session(self, options):
        if os.environ.get("FLASK_APP", ""):
            return super().create_session(options)

        return MySQLAlchemy.get_session

    @classmethod
    def get_session(cls):
        return cls.sessionmaker()

    @classmethod
    def set_sessionmaker(cls, sessionmaker):
        cls.sessionmaker = sessionmaker


db = MySQLAlchemy()
