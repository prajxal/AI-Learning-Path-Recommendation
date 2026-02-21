import requests
from db.database import SessionLocal
from models.course import Course
from models.user import User
from models.skill_weight import SkillWeight
from models.skill_profile import SkillProfile

# 1. Login to get token
login_res = requests.post("http://localhost:8000/auth/login", json={"email":"test_user2@example.com", "password":"test123"})
if login_res.status_code != 200:
    print(f"Login failed: {login_res.text}")
    exit(1)

token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

db = SessionLocal()
user = db.query(User).filter_by(email="test_user2@example.com").first()

print("--- RAW RESUME EXTRACTS (SkillWeights) ---")
weights = db.query(SkillWeight).filter_by(user_id=user.id, source="resume").all()
for w in weights:
    print(f"Skill: {w.skill_name} | Weight: {w.weight} | Conf: {w.confidence}")

print("\n--- SYNTHESIZED INTELLIGENCE (SkillProfiles) ---")
profiles = db.query(SkillProfile).filter_by(user_id=user.id).all()
for p in profiles:
    print(f"Skill: {p.skill_name} | Synth Weight: {p.synthesized_weight} | Conf: {p.confidence}")

# Pick valid python course ID
course = db.query(Course).filter(Course.roadmap_id == 'python').first()
db.close()

if course:
    lp_res = requests.get(f"http://localhost:8000/learning-path/{course.id}", headers=headers)
    print(f"\n--- ADAPTIVE RESPONSE FOR {course.id} ---")
    print(lp_res.json().get("user_elo"))
else:
    print("Could not find a valid python course.")
