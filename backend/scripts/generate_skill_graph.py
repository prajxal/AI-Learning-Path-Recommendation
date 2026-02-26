import sys
from pathlib import Path
from sqlalchemy.orm import Session

# Add parent directory to sys.path to allow importing from backend modules
file_path = Path(__file__).resolve()
sys.path.append(str(file_path.parent.parent))

from db.database import SessionLocal
from models.course import Course
from services.skill_graph_service import generate_graph_for_roadmap

def generate_graphs():
    db = SessionLocal()
    try:
        # Get all distinct roadmaps
        roadmaps = db.query(Course.roadmap_id).distinct().all()
        roadmap_ids = [r[0] for r in roadmaps if r[0] is not None]
        
        print(f"Found {len(roadmap_ids)} roadmaps. Generating skill graphs...")
        
        for roadmap_id in roadmap_ids:
            print(f"Processing roadmap: {roadmap_id}")
            generate_graph_for_roadmap(roadmap_id, db)
            
        print("Skill graph generation complete.")
    except Exception as e:
        print(f"Error during graph generation: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    generate_graphs()
