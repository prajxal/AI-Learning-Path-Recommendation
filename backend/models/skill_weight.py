from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Index
from datetime import datetime
from db.database import Base

class SkillWeight(Base):
    __tablename__ = "skill_weights"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    skill_name = Column(String, primary_key=True)

    weight = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)

    source = Column(String, nullable=False)  # "github"
    last_updated = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("ix_skill_weights_user_id", "user_id"),
        Index("ix_skill_weights_skill_name", "skill_name"),
    )
