from enum import Enum
from sqlalchemy.sql import func

from . import db
from .member_role import MemberRole


class TripStatus(Enum):
    CREATED = 1
    PICKING_UP = 2
    EN_ROUTE = 3
    FINISHED = 4
    CANCELED = 5


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, server_default=func.current_timestamp())
    status = db.Column(db.Enum(TripStatus), default=TripStatus.CREATED)
    notified = db.Column(db.Boolean(create_constraint=False), default=False)

    passenger_id = db.Column(db.Integer, db.ForeignKey("member.id"), nullable=False)
    passenger = db.relationship(
        "Member", backref="trips", foreign_keys=[passenger_id], lazy=True
    )

    driver_id = db.Column(db.Integer, db.ForeignKey("member.id"))
    driver = db.relationship(
        "Member", backref="driving_trips", foreign_keys=[driver_id], lazy=True
    )

    route = db.Column(db.String(500))
    origin = db.Column(db.String(200))
    destination = db.Column(db.String(200))

    subtotal = db.Column(db.Numeric(precision=10, scale=3))

    def to_json(self):
        return dict(
            id=self.id,
            created=int(self.created.timestamp()),
            status=self.status.name,
            notified=self.notified,
            passenger=(self.passenger.to_json() if self.passenger_id else None),
            driver=(self.driver.to_json() if self.driver_id else None),
            destination=self.destination,
            subtotal=self.subtotal,
        )

    @classmethod
    def ongoing_for(cls, member):
        predicate = None

        if member.role == MemberRole.DRIVER:
            predicate = Trip.driver_id == member.id
        else:
            predicate = Trip.passenger_id == member.id

        return Trip.query.filter(
            predicate
            & (Trip.status != TripStatus.FINISHED)
            & (Trip.status != TripStatus.CANCELED)
        )
