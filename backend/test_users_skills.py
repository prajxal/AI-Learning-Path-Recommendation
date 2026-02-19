import sys
import os
import json

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Import app and database
from main import app
from db.database import Base, get_db
from models import User, UserSkill, Event
from models.course import Course

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_users_skills.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_users_skills_endpoint():
    # Reset DB
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    # 1. Create User
    user = User(email="skills@example.com", password_hash="pw")
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id = str(user.id)
    print(f"Created user: {user_id}")

    # 2. Create Courses for 'ai-agents' roadmap
    courses = [
        Course(id="ai-agents:1", roadmap_id="ai-agents", node_id="1", title="AI 1", difficulty_level=100),
        Course(id="ai-agents:2", roadmap_id="ai-agents", node_id="2", title="AI 2", difficulty_level=200),
        Course(id="ai-agents:3", roadmap_id="ai-agents", node_id="3", title="AI 3", difficulty_level=300),
    ]
    db.add_all(courses)
    db.commit()

    # 3. Create Events (Completed courses)
    # User completes 1 course
    events = [
        Event(user_id=user_id, event_type="course_completed", course_id="ai-agents:1", roadmap_id="ai-agents"),
    ]
    db.add_all(events)
    db.commit()

    # 4. Create UserSkill
    skill = UserSkill(user_id=user_id, skill_name="ai-agents", trust_score=850.0, proficiency_level=0.1)
    db.add(skill)
    db.commit()

    # 5. Call Endpoint
    print("Requesting skills for user...")
    response = client.get(f"/users/{user_id}/skills")
    
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        exit(1)
        
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2, default=str)}")

    # 6. Verify Logic
    assert data["user_id"] == user_id
    assert len(data["skills"]) == 1
    
    skill_data = data["skills"][0]
    assert skill_data["roadmap_id"] == "ai-agents"
    assert skill_data["trust_score"] == 850.0
    assert skill_data["proficiency_level"] == 0.1
    assert skill_data["total_courses"] == 3
    assert skill_data["completed_courses"] == 1
    # 1/3 * 100 = 33.33
    assert abs(skill_data["progress_percent"] - 33.33) < 0.1

    print("\nVerification Passed! Users skills endpoint is correct.")

    db.close()
    if os.path.exists("./test_users_skills.db"):
        os.remove("./test_users_skills.db")

if __name__ == "__main__":
    test_users_skills_endpoint()
