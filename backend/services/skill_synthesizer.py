from sqlalchemy.orm import Session
from datetime import datetime

from models.skill_weight import SkillWeight
from models.skill_profile import SkillProfile

def synthesize_skill_profile(user_id: str, roadmap_id: str, db: Session) -> SkillProfile:

    weights = db.query(SkillWeight).filter(
        SkillWeight.user_id == user_id,
        SkillWeight.skill_name == roadmap_id
    ).all()

    if not weights:
        return None

    SOURCE_MULTIPLIERS = {
        "github": 1.0,
        "resume": 0.6,
        "quiz": 1.3,
        "engagement": 1.1
    }

    numerator = 0.0
    denominator = 0.0

    for w in weights:
        multiplier = SOURCE_MULTIPLIERS.get(w.source, 1.0)
        numerator += w.weight * w.confidence * multiplier
        denominator += w.confidence * multiplier

    if denominator == 0:
        return None

    synthesized_weight = numerator / denominator
    aggregated_confidence = min(1.0, denominator / len(weights))

    profile = db.query(SkillProfile).filter(
        SkillProfile.user_id == user_id,
        SkillProfile.skill_name == roadmap_id
    ).first()

    if not profile:
        profile = SkillProfile(
            user_id=user_id,
            skill_name=roadmap_id
        )
        db.add(profile)

    profile.synthesized_weight = synthesized_weight
    profile.confidence = aggregated_confidence
    profile.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(profile)
    
    print(f"[SkillSynth] user={user_id} skill={roadmap_id} weight={synthesized_weight}")

    return profile


def get_skill_profile(user_id: str, roadmap_id: str, db: Session) -> SkillProfile:
    return db.query(SkillProfile).filter(
        SkillProfile.user_id == user_id,
        SkillProfile.skill_name == roadmap_id
    ).first()
