# -*- coding: utf-8 -*-

import os
import time
import redis
import signal
import logging
import coloredlogs
from dotenv import load_dotenv
from threading import Event
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .pubsub import PubsubListener
from .database import DatabaseWatcher
from .coordinator import Coordinator
from ..models import MySQLAlchemy


def exit_handler(event):
    def _inner(_signal, _frame):
        event.clear()

    return _inner


def config_logger():
    logging.basicConfig(level=logging.DEBUG)
    coloredlogs.install(level="DEBUG")


def main():
    load_dotenv()
    config_logger()

    running = Event()
    running.set()
    signal.signal(signal.SIGINT, exit_handler(running))
    redis_url = os.environ.get("REDIS", "redis://")
    redis_pool = redis.ConnectionPool.from_url(redis_url)

    pubsub = PubsubListener(redis_pool, running)
    pubsub.start()

    mysql_url = os.environ["SQLALCHEMY_DATABASE_URI"]
    mysql_pool = create_engine(mysql_url, pool_size=20, max_overflow=0)
    mysql_session = sessionmaker(bind=mysql_pool)
    MySQLAlchemy.set_sessionmaker(mysql_session)

    dbwatcher = DatabaseWatcher(mysql_session(), running)
    dbwatcher.start()

    coordinator = Coordinator(
        pubsub.out, dbwatcher.out, redis_url, redis_pool, mysql_session(), running
    )
    coordinator.start()

    while running.is_set():
        time.sleep(0.1)

    pubsub.join()
    dbwatcher.join()
    coordinator.join()


if __name__ == "__main__":
    main()
