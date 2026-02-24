from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from datetime import datetime
from db.database import Base

class CourseResource(Base):
    __tablename__ = "course_resources"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False, index=True)
    resource_type = Column(String, nullable=False, index=True) # video, article, quiz
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    platform = Column(String, nullable=True) # e.g. youtube, medium
    duration_seconds = Column(Integer, nullable=True)
    difficulty_level = Column(Integer, nullable=True) # Mapped to adaptive score
    quality_score = Column(Float, nullable=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Added fields for robust YouTube API integration
    youtube_video_id = Column(String, nullable=True, index=True)
    thumbnail_url = Column(String, nullable=True)
    channel_name = Column(String, nullable=True)
    view_count = Column(Integer, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
