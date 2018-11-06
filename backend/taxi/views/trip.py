from flask import Blueprint, request, jsonify, g, current_app

from taxi.utils import require_member
from taxi.models import db, Trip

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
@bp.route("/info/<trip_id>", methods=["GET"])
def tripInfo(trip_id):
    trip = Trip.query.get(trip_id)

    if not trip:
        return jsonify(errors=["trip not found"]), 404

    if trip.passenger_id != g.member.id:
        return jsonify(), 400

    return jsonify(trip.to_json())
