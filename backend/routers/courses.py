from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.database import get_db
from models.course import Course

router = APIRouter()


@router.get("")
def list_courses(
    limit: int = Query(default=100, ge=1),
    db: Session = Depends(get_db),
) -> list[dict[str, str | int | None]]:
    courses = db.query(Course).limit(limit).all()
    return [
        {
            "id": course.id,
            "title": course.title,
            "roadmap_id": course.roadmap_id,
            "difficulty_level": course.difficulty_level,
        }
        for course in courses
    ]


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return {
        "id": course.id,
        "title": course.title,
        "roadmap_id": course.roadmap_id,
        "difficulty_level": course.difficulty_level,
        "description": course.description,
    }
