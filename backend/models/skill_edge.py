from sqlalchemy import Column, String, ForeignKey, DateTime, Index, UniqueConstraint
from datetime import datetime
import uuid
from db.database import Base

class SkillEdge(Base):
    __tablename__ = "skill_edges"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    roadmap_id = Column(String, nullable=False, index=True)
    from_skill_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), index=True)
    to_skill_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("from_skill_id", "to_skill_id", name="unique_edge"),
        Index("idx_roadmap_from", "roadmap_id", "from_skill_id"),
        Index("idx_roadmap_to", "roadmap_id", "to_skill_id"),
    )
