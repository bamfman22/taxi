from flask import Blueprint, request, jsonify, g, current_app

from taxi.utils import require_member, require_driver
from taxi.models import db, Trip, TripStatus

bp = Blueprint("trip", __name__, url_prefix="/trip")


@require_member
@bp.route("/create", methods=["POST"])
def createtrip():
    destination = request.form.get("destination", None)

    if not destination:
        return jsonify(errorrs=["please specify destination"]), 400

    if db.session.query(Trip.ongoing_for(g.member).exists()).scalar():
        return jsonify(errors=["You can only have one active order at one time"]), 400

    trip = Trip(passenger_id=g.member.id, destination=destination)
    db.session.add(trip)
    db.session.commit()

    current_app.redis.publish("new-trip", trip.id)

    return jsonify(trip.to_json())


@require_member
@bp.route("/<int:trip_id>/info", methods=["GET"])
def tripInfo(trip_id):
    trip = Trip.query.get(trip_id)

    if not trip:
        return jsonify(errors=["trip not found"]), 404

    if trip.passenger_id != g.member.id:
        return jsonify(), 400

    return jsonify(trip.to_json())


@require_driver
@bp.route("/<int:trip_id>/notify", methods=["POST"])
def notify(trip_id):
    trip = Trip.query.get(trip_id)

    if not trip:
        return jsonify(errors=["trip not found"]), 404

    if trip.driver_id != g.member.id:
        return jsonify(errors=["no permission"]), 400

    if trip.status != TripStatus.PICKING_UP:
        return jsonify(errors=["invalid trip status"]), 400

    # TODO: notify user via websocket

    trip.notified = True
    db.session.add(trip)
    db.session.commit()

    return jsonify(trip.to_json())


@require_driver
@bp.route("/<int:trip_id>/pickup", methods=["POST"])
def pickup(trip_id):
    trip = Trip.query.get(trip_id)

    if not trip:
        return jsonify(errors=["trip not found"]), 404

    if trip.driver_id != g.member.id:
        return jsonify(errors=["no permission"]), 400

    if trip.status != TripStatus.PICKING_UP:
        return jsonify(errors=["invalid trip status"]), 400

    trip.status = TripStatus.EN_ROUTE
    db.session.add(trip)
    db.session.commit()

    return jsonify(trip.to_json())


@require_driver
@bp.route("/<int:trip_id>/finish", methods=["POST"])
def finish(trip_id):
    trip = Trip.query.get(trip_id)

    if not trip:
        return jsonify(errors=["trip not found"]), 404

    if trip.driver_id != g.member.id:
        return jsonify(errors=["no permission"]), 400

    if trip.status != TripStatus.EN_ROUTE:
        return jsonify(errors=["invalid trip status"]), 400

    trip.status = TripStatus.FINISHED
    db.session.add(trip)
    db.session.commit()

    return jsonify(trip.to_json())
