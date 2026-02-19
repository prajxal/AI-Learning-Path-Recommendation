from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from db.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, nullable=False, index=True)
    node_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    difficulty_level = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
