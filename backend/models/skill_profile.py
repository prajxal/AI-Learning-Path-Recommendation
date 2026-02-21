from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from datetime import datetime
from db.database import Base

class SkillProfile(Base):
    __tablename__ = "skill_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    skill_name = Column(String, index=True)
    synthesized_weight = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("user_id", "skill_name", name="uix_user_skill_profile"),
    )
