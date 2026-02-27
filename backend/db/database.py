import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

if DATABASE_URL.startswith("sqlite"):
    print("Using SQLite database")
else:
    print("Using PostgreSQL database")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
elif DATABASE_URL.startswith("postgresql"):
    connect_args["sslmode"] = "require"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
