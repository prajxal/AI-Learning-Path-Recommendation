from sqlalchemy.orm import Session
from datetime import datetime
from models.skill_weight import SkillWeight
from services.github_service import fetch_user_repositories, fetch_repository_languages

async def extract_and_store_github_skills(user, db: Session):

    access_token = user.github_access_token

    if not access_token:
        return

    repos = await fetch_user_repositories(access_token)
    if not isinstance(repos, list):
        return

    language_counts = {}

    for repo in repos:
        # Use full_name (e.g. owner/repo) for the API call
        repo_name = repo.get("full_name") or repo["name"]

        languages = await fetch_repository_languages(access_token, repo_name)
        if not isinstance(languages, dict):
            continue

        for lang, bytes_used in languages.items():
            language_counts[lang] = language_counts.get(lang, 0) + bytes_used

    if not language_counts:
        return

    total_bytes = sum(language_counts.values())

    for skill, bytes_used in language_counts.items():

        weight = bytes_used / total_bytes

        confidence = min(1.0, weight * 2.0)

        existing = db.query(SkillWeight).filter(
            SkillWeight.user_id == user.id,
            SkillWeight.skill_name == skill.lower()
        ).first()

        if existing:
            existing.weight = weight
            existing.confidence = confidence
            existing.last_updated = datetime.utcnow()
        else:
            new_skill = SkillWeight(
                user_id=user.id,
                skill_name=skill.lower(),
                weight=weight,
                confidence=confidence,
                source="github"
            )
            db.add(new_skill)

    db.commit()

    # Automatically synthesize the skills for the user's fetched roadmaps
    from services.skill_synthesizer import synthesize_skill_profile
    for skill in language_counts.keys():
        synthesize_skill_profile(user.id, skill.lower(), db)
