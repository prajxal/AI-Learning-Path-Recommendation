from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()

# Request models
class AuthRequest(BaseModel):
    email: str
    password: str

# Signup endpoint
@router.post("/signup")
def signup(request: AuthRequest):
    user_id = str(uuid.uuid4())

    return {
        "user_id": user_id,
        "email": request.email
    }

# Login endpoint
@router.post("/login")
def login(request: AuthRequest):
    # For now, accept any login (mock)
    user_id = str(uuid.uuid4())

    return {
        "user_id": user_id,
        "email": request.email
    }