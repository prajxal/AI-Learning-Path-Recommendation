from sqlalchemy import Column, String, ForeignKey, PrimaryKeyConstraint, Index
from db.database import Base

class CoursePrerequisite(Base):
    __tablename__ = "course_prerequisites"

    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    prerequisite_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint("course_id", "prerequisite_id"),
        Index("ix_course_prereq_course", "course_id"),
    )
