from db.database import Base, engine
from models import Event, User, UserSkill


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()
