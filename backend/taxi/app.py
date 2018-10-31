# -*- coding: utf-8 -*-

import os
import sys
import ast
import click
import dotenv
import eventlet
from decimal import Decimal
from pathlib import Path

from flask import Flask, current_app, g
from flask.cli import load_dotenv, with_appcontext

from taxi.ws import socketio
from taxi.utils import current_member, mail
from taxi.models import db, Member, Trip, TripStatus


if "shell" not in sys.argv:
    eventlet.monkey_patch()


def create_app(config=None):
    load_dotenv()

    app = Flask(__name__)
    register_blueprints(app)
    register_commands(app)

    load_configs(app)

    mail.init_app(app)
    socketio.init_app(app, message_queue=app.config["REDIS"])
    db.init_app(app)
    db.app = app

    @app.before_request
    def before_request():
        g.member = current_member()

    @app.after_request
    def add_header(response):
        return response

    return app


def register_blueprints(app):
    from taxi.views import member, trip

    app.register_blueprint(member.bp)
    app.register_blueprint(trip.bp)

    return app


def register_commands(app):
    app.cli.add_command(init_db)
    app.cli.add_command(fill_trip)
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


@click.command()
@click.option("--number", default=20, help="Number of trips to generate.")
@click.option(
    "--member", type=int, required=True, help="Member id of these generated trip"
)
@with_appcontext
def fill_trip(number, member):
    import random

    def generate_point(
        upper=37.38599, lower=37.25043, left=-121.98451, right=-121.822_236_66
    ):
        return (random.uniform(lower, upper), random.uniform(left, right))

    user = Member.query.get(member)

    for i in range(number):
        origin = generate_point()
        trip = Trip(
            status=random.choice(list(TripStatus)),
            passenger_id=user.id,
            route="",
            origin=f"{origin[0]},{origin[1]}",
            destination=random.choice(["sjc", "oak", "sfo"]),
        )

        if trip.status == TripStatus.FINISHED:
            trip.subtotal = Decimal(random.uniform(5.0, 50.0))

        db.session.add(trip)

    db.session.commit()
