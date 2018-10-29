# -*- coding: utf-8 -*-

import os
import ast
import click
import dotenv
from pathlib import Path

from flask import Flask, current_app, g
from flask.cli import load_dotenv, with_appcontext

from taxi.utils import current_member, mail
from taxi.models import db


def create_app(config=None):
    load_dotenv()

    app = Flask(__name__)
    register_blueprints(app)
    register_commands(app)

    load_configs(app)

    mail.init_app(app)
    db.init_app(app)
    db.app = app

    @app.before_request
    def before_request():
        g.member = current_member()

    @app.after_request
    def add_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    return app


def register_blueprints(app):
    from taxi.views import member, trip

    app.register_blueprint(member.bp)
    app.register_blueprint(trip.bp)

    return app


def register_commands(app):
    app.cli.add_command(init_db)
    return app


def load_configs(app):
    secret_key = os.environ.get("SECRET_KEY", "")
    app.config["SECRET_KEY"] = ast.literal_eval('b"%s"' % secret_key)

    for k, v in dotenv.dotenv_values().items():
        if k != "SECRET_KEY":
            app.config[k] = v

    if "PICTURE_UPLOAD_FOLDER" in app.config:
        app.config["PICTURE_UPLOAD_FOLDER"] = Path(app.config["PICTURE_UPLOAD_FOLDER"])


@click.command()
@with_appcontext
def init_db():
    print(
        "initializing database: {}".format(
            current_app.config["SQLALCHEMY_DATABASE_URI"]
        )
    )
    db.create_all()
    print("done")
