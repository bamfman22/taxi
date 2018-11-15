# -*- coding: utf-8 -*-

import queue
import logging
from time import sleep
from redis import StrictRedis
from threading import Thread


class PubsubListener(Thread):
    def __init__(self, pool, running):
        super().__init__(daemon=True)
        self.redis = StrictRedis(connection_pool=pool)
        self.out = queue.Queue()
        self.running = running

    def run(self):
        self.channel = self.redis.pubsub(ignore_subscribe_messages=True)
        self.channel.subscribe("new-trip")

        logging.info("Pubsub Listener started.")

        while self.running.is_set():
            message = self.channel.get_message()

            if message:
                logging.debug(f"received message: {message}")

            if message and "data" in message:
                try:
                    trip_id = int(message["data"])
                except ValueError:
                    logging.warning(f"pubsub received corrupted message: {message}")
                else:
                    logging.info(f"got push message for trip id: {trip_id}")
                    self.out.put_nowait(trip_id)

            sleep(0.1)

        self.channel.close()
