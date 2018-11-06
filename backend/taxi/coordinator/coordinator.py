# -*- coding: utf-8 -*-

import time
import redis
import logging
from threading import Thread
from flask_socketio import SocketIO

from ..models import db, Trip, TripStatus, Member


class Coordinator(Thread):
    def __init__(self, redis_out, db_out, redis_url, redis_pool, session, running):
        super().__init__(daemon=True)
        self.redis_out = redis_out
        self.db_out = db_out
        self.socketio = SocketIO(message_queue=redis_url)
        self.running = running
        self.redis = redis.StrictRedis(connection_pool=redis_pool)
        self.session = session

    def run(self):
        logging.info("Coordinator started.")

        while self.running.is_set():
            if not self.redis_out.empty():
                trip_id = self.redis_out.get_nowait()
                trip = self.session.query(Trip).get(trip_id)
                logging.debug(f"got <Trip: {trip_id}> from redis queue")
                self._match(trip)
            elif not self.db_out.empty():
                trip = self.db_out.get_nowait()
                trip = self.session.merge(trip)
                logging.debug(f"got <Trip: {trip.id}> from db queue")
                self._match(trip)
            time.sleep(0.1)

    def _match(self, trip):
        logging.debug(f"finding driver for trip #{trip.id}")

        if trip.status != TripStatus.CREATED:
            logging.warning(f"trip #{trip.id}: invalid status, skipping")
            return

        users = self.redis.georadiusbymember(
            "map",
            f"member-{trip.passenger.id}",
            10,
            unit="km",
            withdist=True,
            sort="ASC",
        )

        result = None

        for user in users:
            if user[0].startswith("driver"):
                result = user
                break
        else:
            logging.warning(
                f"trip #{trip.id}: unable to find driver within 20km, aborting..."
            )
            return

        try:
            driver_id = int(result[0].rsplit("-")[-1])
        except ValueError:
            logging.exception(
                f"trip #{trip.id}: this shouldn't happen, corrupted result: {result}"
            )
            return

        driver = self.session.query(Member).get(driver_id)

        if not driver:
            logging.error(f"trip #{trip.id}: corrupted driver id: {driver_id}")
            return

        logging.info(
            f"trip #{trip.id}: assigning driver #{driver.id} that is {result[1]}km "
            "away from the passenger"
        )
        trip.driver = driver
        trip.status = TripStatus.PICKING_UP_PASSENGER

        self.session.add(trip)
        self.session.commit()

        self._notify(trip)

    def _notify(self, trip):
        self.socketio.emit(
            "update-trip", trip.to_json(), room=f"member-{trip.passenger.id}"
        )
        self.socketio.emit(
            "update-trip", trip.to_json(), room=f"member-{trip.driver.id}"
        )
