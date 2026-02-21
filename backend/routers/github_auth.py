import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from core.security import get_current_user, create_access_token, decode_access_token
from db.database import get_db
from models.user import User
from services import github_service

load_dotenv()

router = APIRouter(prefix="/auth/github", tags=["github-auth"])

@router.get("/login")
def github_login(current_user: User = Depends(get_current_user)):
    CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")
    
    if not CLIENT_ID or not REDIRECT_URI:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured properly.")

    # Sign the user ID to prevent CSRF replay attacks
    state = create_access_token(str(current_user.id))
    
    github_auth_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"scope=read:user repo&"
        f"state={state}"
    )
    return RedirectResponse(url=github_auth_url)

@router.get("/callback")
async def github_callback(code: str, state: str, db: Session = Depends(get_db)):
    CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
    CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
    REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")

    if not CLIENT_ID or not CLIENT_SECRET or not REDIRECT_URI:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured properly.")

    # Decode the state to fetch user_id, throwing 401 on JWTError
    user_id = decode_access_token(state)
    
    # Strictly verify user exists in local database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Exchange code for access token
    token_data = await github_service.exchange_code_for_token(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        code=code,
        redirect_uri=REDIRECT_URI,
        state=state
    )

    if "access_token" not in token_data:
        raise HTTPException(status_code=400, detail="GitHub OAuth failed")

    access_token = token_data["access_token"]

    # Fetch GitHub profile to map identity
    profile_data = await github_service.fetch_github_profile(access_token)
    
    if "id" not in profile_data or "login" not in profile_data:
        raise HTTPException(status_code=400, detail="Failed to fetch complete GitHub profile")
        
    github_id = str(profile_data["id"])
    github_username = profile_data["login"]

    # Check for reconnect protections (different account attempting linkage)
    if user.github_id and user.github_id != github_id:
        raise HTTPException(status_code=400, detail="GitHub already connected. Disconnect first.")
        
    # Check if this GitHub account is already linked to another system user
    existing_link = db.query(User).filter(User.github_id == github_id).first()
    if existing_link and existing_link.id != user.id:
        raise HTTPException(status_code=400, detail="GitHub account already linked to another user")

    # Update current user record with GitHub metadata
    user.github_id = github_id
    user.github_username = github_username
    user.github_access_token = access_token
    user.github_connected_at = datetime.utcnow()

    db.commit()

    from services.github_skill_extractor import extract_and_store_github_skills
    await extract_and_store_github_skills(user, db)

    return {"status": "success", "message": "GitHub account successfully linked"}

@router.get("/status")
def github_status(current_user: User = Depends(get_current_user)):
    return {
        "connected": current_user.github_id is not None,
        "username": current_user.github_username
    }
