import os
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import OperationalError

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://demo_user:demo_password@db:3306/demo_db",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def wait_for_db(max_retries: int = 30, delay_seconds: int = 2) -> None:
    """MySQL can take a few seconds to accept connections even after its
    healthcheck passes, so retry here instead of crashing the backend."""
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect():
                return
        except OperationalError:
            if attempt == max_retries:
                raise
            time.sleep(delay_seconds)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
