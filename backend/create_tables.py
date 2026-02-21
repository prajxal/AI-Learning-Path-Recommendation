from db.database import Base, engine
from models import Event, User, UserSkill
from models.course import Course
from models.course_prerequisite import CoursePrerequisite
from models.skill_weight import SkillWeight
from models.skill_profile import SkillProfile


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    create_tables()
