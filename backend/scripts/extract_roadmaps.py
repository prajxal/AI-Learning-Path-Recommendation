import sys
import json
import os
from pathlib import Path
from sqlalchemy.orm import Session

# Add parent directory to sys.path to allow importing from backend modules
file_path = Path(__file__).resolve()
sys.path.append(str(file_path.parent.parent))

from db.database import SessionLocal, engine
from models.course import Course
from models.course_prerequisite import CoursePrerequisite
from create_tables import create_tables

ROADMAPS_DIR = "/Users/prajwal/Documents/Roadmap/developer-roadmap/src/data/roadmaps"

def extract_roadmaps():
    # Ensure tables exist
    create_tables()

    session = SessionLocal()
    total_courses = 0
    total_prereqs = 0
    scanned_files = 0
    
    print(f"Scanning for roadmaps in: {ROADMAPS_DIR}")

    try:
        for root, dirs, files in os.walk(ROADMAPS_DIR):
            for filename in files:
                if not filename.endswith(".json"):
                    continue

                # Skip meta files if any (e.g. package.json, tsconfig.json if they exist in that tree)
                # The user requirement says "roadmap_id = filename without .json"
                # We will assume all JSONs in this structure are relevant unless they lack "nodes" or "edges"
                
                filepath = os.path.join(root, filename)
                roadmap_id = filename[:-5] # Remove .json
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    # Basic validation to ensure it's a roadmap file
                    if not isinstance(data, dict):
                         # Some files might be metadata
                        continue
                        
                    # Some roadmap.sh files might wrap content in "json" key or be direct arrays?
                    # But the prompt says "Each JSON file represents a roadmap graph containing nodes and edges."
                    # Structure: { "nodes": [], "edges": [] } usually.
                    # Or check for keys.
                    
                    # User sample:
                    # Nodes: { "id": "...", ... }
                    # Edges: { "source": "...", ... }
                    # Usually these are lists under keys "nodes" and "edges" or the root is the object.
                    # Let's assume the root object has "nodes" and "edges" keys based on standard graph formats, 
                    # OR check if the user prompt implies a specific structure.
                    # "Each JSON file represents a roadmap graph containing nodes and edges."
                    
                    nodes = data.get("nodes", [])
                    edges = data.get("edges", [])

                    if not nodes and not edges:
                        # Might not be a roadmap file (e.g. migration-mapping.json saw earlier)
                        # print(f"Skipping {filename}: No nodes/edges found.")
                        continue
                        
                    print(f"Processing {filename} (ID: {roadmap_id})...")
                    scanned_files += 1
                    
                    # 1. Extract Nodes
                    file_courses_count = 0
                    current_course_ids = set()
                    
                    for node in nodes:
                        node_type = node.get("type")
                        if node_type not in ["topic"]:
                            # Prompt says extract ONLY "topic"
                            # But if the file has "subtopic" we might miss content.
                            # However, strict compliance with prompt:
                            continue
                        
                        node_id = node.get("id")
                        if not node_id:
                            continue
                            
                        # Use label as title if title is missing
                        node_data = node.get("data", {})
                        title = node_data.get("title")
                        if not title:
                            title = node_data.get("label")
                        
                        if not title:
                            # Skip nodes without titles
                            continue
                            
                        description = node_data.get("description")
                        
                        course_id = f"{roadmap_id}:{node_id}"
                        current_course_ids.add(course_id)
                        
                        # Upsert Course
                        existing = session.query(Course).filter_by(id=course_id).first()
                        if existing:
                            existing.title = title
                            existing.description = description
                            # Don't touch difficulty or other fields
                        else:
                            new_course = Course(
                                id=course_id,
                                roadmap_id=roadmap_id,
                                node_id=node_id,
                                title=title,
                                description=description,
                                difficulty_level=None
                            )
                            session.add(new_course)
                        
                        file_courses_count += 1
                    
                    session.flush() # Flush to ensure foreign keys are valid for prerequisites
                    total_courses += file_courses_count

                    # 2. Extract Prerequisites (Edges)
                    file_prereqs_count = 0
                    for edge in edges:
                        source = edge.get("source")
                        target = edge.get("target")
                        
                        if not source or not target:
                            continue
                            
                        prereq_id = f"{roadmap_id}:{source}"
                        course_id = f"{roadmap_id}:{target}"
                        
                        # Verify both exist as Courses (filtered by type="topic")
                        # We only added type="topic" to DB. If an edge connects to a non-topic node, skip it.
                        # We can check existence in DB or against current_course_ids set.
                        # Using DB check is safer but slower? Use set for speed within this file context.
                        # Wait, edges might connect to nodes we skipped?
                        # If so, we can't create a FK relationship.
                        if prereq_id not in current_course_ids or course_id not in current_course_ids:
                            continue
                            
                        # Check existance of relationship
                        # Because PK is composite (course_id, prerequisite_id)
                        existing_prereq = session.query(CoursePrerequisite).filter_by(
                            course_id=course_id, 
                            prerequisite_id=prereq_id
                        ).first()
                        
                        if not existing_prereq:
                            new_prereq = CoursePrerequisite(
                                course_id=course_id,
                                prerequisite_id=prereq_id
                            )
                            session.add(new_prereq)
                            file_prereqs_count += 1
                            
                    total_prereqs += file_prereqs_count
                    
                except Exception as e:
                    print(f"Error processing file {filename}: {e}")
                    # Continue to next file
                    continue

        session.commit()
        print("\nExtraction Complete.")
        print(f"Scanned {scanned_files} files.")
        print(f"Inserted/Updated {total_courses} courses.")
        print(f"Inserted {total_prereqs} prerequisite relationships.")

    except Exception as e:
        session.rollback()
        print(f"CRITICAL ERROR: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    extract_roadmaps()