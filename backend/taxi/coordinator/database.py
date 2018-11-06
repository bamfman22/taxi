# -*- coding :utf-8 -*-

import queue
import logging
from time import sleep, time
from threading import Thread

from ..models import Trip, TripStatus


class DatabaseWatcher(Thread):
    def __init__(self, session, running, interval=120):
        super().__init__(daemon=True)

        self.session = session
        self.interval = interval
        self.running = running
        self.last_run = 0
        self.out = queue.Queue()

    def run(self):
        logging.info("Database watcher started.")

        while self.running.is_set():
            now = int(time())

            if now - self.last_run >= self.interval:
                logging.debug(
                    f"checking database because {now} - {self.last_run} is less "
                    f"than {self.interval}"
                )
                self.check_database()
                self.last_run = now

            sleep(0.1)

    def check_database(self):
        unassigned_trips = (
            self.session.query(Trip).filter(Trip.status == TripStatus.CREATED).all()
        )

        logging.info(f"found {len(unassigned_trips)} unassigned trips")

        for trip in unassigned_trips:
            self.out.put_nowait(trip)
