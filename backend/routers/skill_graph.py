from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.user import User
from core.security import get_current_user
from services.skill_graph_service import get_roadmap_skill_status

router = APIRouter()

@router.get("/{roadmap_id}/status")
def read_roadmap_skill_status(roadmap_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns the unlock status (completed, unlocked, locked) 
    for all skills in the given roadmap for the active user.
    """
    user_id = str(current_user.id)
    return get_roadmap_skill_status(user_id, roadmap_id, db)
