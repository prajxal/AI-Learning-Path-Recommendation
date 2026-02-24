import os, sys
from dotenv import load_dotenv
load_dotenv()

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import SessionLocal
from models.course import Course
from services.video_content_service import extract_video_resources, store_resources

def main():
    print("Automatic resource generation is DISABLED.")
    print("Please use static insertion scripts or manually insert course_resources.")
    return

if __name__ == "__main__":
    main()
