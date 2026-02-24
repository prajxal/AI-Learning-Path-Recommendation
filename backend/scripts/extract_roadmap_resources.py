import os
import sys
import json
import re
from datetime import datetime

# Setup paths to import from backend
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BACKEND_DIR)
sys.path.append(BACKEND_DIR)

from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.course import Course
from models.course_resource import CourseResource

# Specific repository mapping rule instructions path
ROADMAP_REPO_PATH = "/Users/prajwal/Documents/Roadmap/developer-roadmap"
ROADMAPS_DIR = os.path.join(ROADMAP_REPO_PATH, "src", "data", "roadmaps")

# Regex to match: - [@type@Title](URL) or - [Title](URL)
# Includes standard markdown link matching
LINK_PATTERN = re.compile(r'- \[(?:@([^@]+)@)?([^\]]+)\]\(([^\)]+)\)')

def get_platform_from_url(url: str) -> str:
    url_lower = url.lower()
    if "youtube.com" in url_lower or "youtu.be" in url_lower:
        return "youtube"
    elif "medium.com" in url_lower:
        return "medium"
    elif "github.com" in url_lower:
        return "github"
    else:
        return "docs"

def main():
    db: Session = SessionLocal()
    
    if not os.path.exists(ROADMAPS_DIR):
        print(f"Error: Roadmap directory not found at {ROADMAPS_DIR}")
        return

    added_count = 0
    skipped_count = 0

    print("Starting static resource extraction pipeline...")

    # Iterate roadmaps
    for roadmap_slug in os.listdir(ROADMAPS_DIR):
        roadmap_path = os.path.join(ROADMAPS_DIR, roadmap_slug)
        if not os.path.isdir(roadmap_path):
            continue
            
        json_file = os.path.join(roadmap_path, f"{roadmap_slug}.json")
        content_dir = os.path.join(roadmap_path, "content")
        
        if not os.path.exists(json_file):
            continue
            
        with open(json_file, 'r', encoding='utf-8') as f:
            try:
                roadmap_data = json.load(f)
            except json.JSONDecodeError:
                print(f"Warning: Failed to parse {json_file}")
                continue
                
        # 1. Load roadmap.sh structured JSON
        nodes = roadmap_data.get('nodes', [])
        
        # Build mapping of node_id -> md_file_path for quick lookup
        file_mapping = {}
        if os.path.exists(content_dir):
            for filename in os.listdir(content_dir):
                if filename.endswith(".md") and "@" in filename:
                    node_id = filename.split("@")[-1].replace(".md", "")
                    file_mapping[node_id] = os.path.join(content_dir, filename)
        
        # 2. Iterate nodes -> find node.id
        for node in nodes:
            node_id = node.get('id')
            if not node_id:
                continue
                
            # 3. Map to Course.id
            course_id = f"{roadmap_slug}:{node_id}"
            
            course = db.query(Course).filter(Course.id == course_id).first()
            if not course:
                # If course doesn't exist, skip it ensuring no wrong resources
                continue
                
            # 4. Open markdown file referenced by node
            md_file = file_mapping.get(node_id)
            if not md_file:
                continue
                
            with open(md_file, 'r', encoding='utf-8') as mf:
                content_text = mf.read()
                
            # 5. Extract links
            matches = LINK_PATTERN.findall(content_text)
            
            is_primary = True
            for match in matches:
                resource_type_raw = match[0].strip() if match[0] else ""
                title = match[1].strip()
                url = match[2].strip()
                
                resource_type = "article"
                if "video" in resource_type_raw.lower() or "youtube" in url.lower() or "youtu.be" in url.lower():
                    resource_type = "video"
                    
                platform = get_platform_from_url(url)
                
                # Check idempotency: course_id, url
                existing = db.query(CourseResource).filter(
                    CourseResource.course_id == course_id,
                    CourseResource.url == url
                ).first()
                
                if existing:
                    skipped_count += 1
                    continue
                    
                # 6. Insert CourseResource safely
                new_resource = CourseResource(
                    course_id=course_id,
                    resource_type=resource_type,
                    title=title,
                    url=url,
                    platform=platform,
                    difficulty_level=course.difficulty_level,
                    quality_score=1.0,
                    is_primary=is_primary
                )
                
                # Basic youtube video ID extraction for iframes to work off embed urls
                if platform == "youtube":
                    vid_id = None
                    if "v=" in url:
                        vid_id = url.split("v=")[-1].split("&")[0]
                    elif "youtu.be/" in url:
                        vid_id = url.split("youtu.be/")[-1].split("?")[0]
                        
                    if vid_id:
                        new_resource.youtube_video_id = vid_id
                        
                db.add(new_resource)
                added_count += 1
                is_primary = False
                
    db.commit()
    db.close()
    
    print(f"Extraction Pipeline Complete.")
    print(f"Assigned Curated Resources: {added_count}")
    print(f"Skipped Duplicates: {skipped_count}")

if __name__ == "__main__":
    main()
