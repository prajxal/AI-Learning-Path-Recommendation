import requests
from db.database import SessionLocal
from models.course import Course
from models.user import User
from models.skill_weight import SkillWeight
from services.skill_synthesizer import synthesize_skill_profile

# Create test user
try:
    requests.post("http://localhost:8000/auth/signup", json={"email":"test_user2@example.com", "password":"test123"})
except:
    pass

login_res = requests.post("http://localhost:8000/auth/login", json={"email":"test_user2@example.com", "password":"test123"})
if login_res.status_code != 200:
    print(f"Login failed: {login_res.text}")
    exit(1)

token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create mock data in DB
db = SessionLocal()
user = db.query(User).filter_by(email="test_user2@example.com").first()

# Pick the first valid course
course = db.query(Course).first()
if not course:
    print("No courses in database!")
    exit(1)

course_id = course.id
roadmap_id = course.roadmap_id or (course.id.split(":")[0] if ":" in course.id else course.id)

if not db.query(SkillWeight).filter_by(user_id=user.id, skill_name=roadmap_id).first():
    db.add(SkillWeight(user_id=user.id, skill_name=roadmap_id, weight=0.8, confidence=1.0, source="github"))
    db.commit()

# Trigger synthesis process manually for local test context
synthesize_skill_profile(user.id, roadmap_id, db)

db.close()

# Test the learning path API
lp_res = requests.get(f"http://localhost:8000/learning-path/{course_id}", headers=headers)
print(f"Learning Path Response for {course_id} (Roadmap: {roadmap_id}):")
print(lp_res.status_code)
print(lp_res.json())
