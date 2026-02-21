import pdfplumber
import re
from sqlalchemy.orm import Session

from models.course import Course
from models.skill_weight import SkillWeight
from services.skill_synthesizer import synthesize_skill_profile


def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.lower()


def extract_skills_from_text(text: str, db: Session) -> dict:
    roadmap_ids = db.query(Course.roadmap_id).distinct().all()
    roadmap_ids = [r[0].lower() for r in roadmap_ids]

    skill_scores = {}

    for skill in roadmap_ids:
        occurrences = len(re.findall(r"\b" + re.escape(skill) + r"\b", text))
        if occurrences > 0:
            skill_scores[skill] = occurrences

    return skill_scores


def ingest_resume(file_path: str, user_id: str, db: Session):
    text = extract_text_from_pdf(file_path)
    skill_scores = extract_skills_from_text(text, db)

    if not skill_scores:
        return

    max_score = max(skill_scores.values())

    for skill_name, score in skill_scores.items():
        normalized_weight = score / max_score
        confidence = min(1.0, score / 5.0)

        existing = db.query(SkillWeight).filter(
            SkillWeight.user_id == user_id,
            SkillWeight.skill_name == skill_name,
            SkillWeight.source == "resume"
        ).first()

        if existing:
            existing.weight = normalized_weight
            existing.confidence = confidence
        else:
            db.add(
                SkillWeight(
                    user_id=user_id,
                    skill_name=skill_name,
                    weight=normalized_weight,
                    confidence=confidence,
                    source="resume"
                )
            )

        synthesize_skill_profile(user_id, skill_name, db)

    db.commit()
