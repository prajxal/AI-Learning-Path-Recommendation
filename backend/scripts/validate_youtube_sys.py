import os, sys
# Assuming YOUTUBE_API_KEY is available in environment
from dotenv import load_dotenv
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.video_content_service import extract_video_resources
from models.course import Course

print("YouTube validation is DISABLED as automatic generation is removed.")
