from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from db.database import get_db
from models.user_skill import UserSkill
from models.course import Course
from models.event import Event

router = APIRouter()


@router.get("/{user_id}/skills")
def get_user_skills(user_id: str, db: Session = Depends(get_db)):
    # Query all skills for the user
    skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()

    if not skills:
        return {
            "user_id": user_id,
            "skills": []
        }

    skill_list = []

    for skill in skills:
        roadmap_id = skill.skill_name
        trust_score = skill.trust_score if skill.trust_score is not None else 800.0
        proficiency_level = skill.proficiency_level if skill.proficiency_level is not None else 0.0

        # Count total courses in roadmap
        total_courses = db.query(func.count(Course.id)) \
            .filter(Course.roadmap_id == roadmap_id) \
            .scalar()
        total_courses = total_courses or 0

        # Count completed courses
        completed_courses = db.query(func.count(distinct(Event.course_id))) \
            .filter(
                Event.user_id == user_id,
                Event.event_type == "course_completed",
                Event.roadmap_id == roadmap_id
            ) \
            .scalar()
        completed_courses = completed_courses or 0

        # Calculate progress percent safely
        if total_courses > 0:
            progress_percent = round((completed_courses / total_courses) * 100, 2)
        else:
            progress_percent = 0.0

        skill_list.append({
            "roadmap_id": roadmap_id,
            "trust_score": float(trust_score),
            "proficiency_level": float(proficiency_level),
            "completed_courses": completed_courses,
            "total_courses": total_courses,
            "progress_percent": progress_percent,
            "last_updated": skill.last_updated
        })

    return {
        "user_id": user_id,
        "skills": skill_list
    }
