import os
import logging
from typing import List, Dict, Any
import httpx
from datetime import datetime
from sqlalchemy.orm import Session
from models.course import Course
from models.course_resource import CourseResource
from difflib import SequenceMatcher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_video_resources(course: Course, roadmap_id: str) -> List[dict]:
    """
    Disabled. Automatic resource generation is no longer supported.
    """
    logger.info(f"[Disabled] Automatic resource generation is disabled. Skipping {course.id}")
    return []

def store_resources(db: Session, resources_data: List[dict]):
    """
    Stores extracted resources safely while ensuring idempotency.
    """
    count = 0
    for data in resources_data:
        existing = db.query(CourseResource).filter(
            CourseResource.course_id == data["course_id"],
            CourseResource.url == data["url"]
        ).first()
        
        if not existing:
            resource = CourseResource(**data)
            db.add(resource)
            count += 1
            
    if count > 0:
        db.commit()
        
    return count
