# -*- coding: utf-8 -*-

import os
import ast
import click

from flask import Flask, current_app
from flask.cli import load_dotenv, with_appcontext

from taxi.models import db


def create_app(config=None):
    load_dotenv()

    app = Flask(__name__)
    register_blueprints(app)
    register_commands(app)

    load_configs(app)

    db.init_app(app)
    db.app = app

    @app.after_request
    def add_header(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    return app


def register_blueprints(app):
    from taxi.views import member

    app.register_blueprint(member.bp)

    return app


def register_commands(app):
    app.cli.add_command(init_db)
    return app


def load_configs(app):
    secret_key = os.environ.get("SECRET_KEY", "")
    app.config["SECRET_KEY"] = ast.literal_eval('b"%s"' % secret_key)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "SQLALCHEMY_DATABASE_URI", ""
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = (
        os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS", "") == "true"
    )


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
