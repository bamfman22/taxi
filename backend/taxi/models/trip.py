from enum import Enum
from flask import jsonify
from sqlalchemy.sql import func

from taxi.models import db


class TripStatus(Enum):
    CREATED = 1
    PICKING_UP_PASSENGER = 2
    EN_ROUTE = 3
    FINISHED = 4
    CANCELED = 5


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(100))
    created = db.Column(db.DateTime, server_default=func.current_timestamp())
    status = db.Column(db.Enum(TripStatus), default=TripStatus.CREATED)
    passenger_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)

    def to_json(self):
        return dict(
            passenger_id=self.passenger_id,
            destination=self.destination,
            created=int(self.created.timestamp()),
            status=self.status.name,
        )
