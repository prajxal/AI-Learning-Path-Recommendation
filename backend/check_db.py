from db.database import SessionLocal
from models.course import Course

db = SessionLocal()
print("Courses:")
for c in db.query(Course).limit(10).all():
    print(c.id, c.roadmap_id, c.difficulty_level, c.node_id)
db.close()
