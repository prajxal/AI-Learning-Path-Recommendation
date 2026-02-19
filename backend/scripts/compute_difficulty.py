import sys
from pathlib import Path
from collections import defaultdict, deque

sys.path.append(str(Path(__file__).parent.parent))

from db.database import SessionLocal
from models.course import Course
from models.course_prerequisite import CoursePrerequisite


def compute_difficulty() -> None:
    db = SessionLocal()
    try:
        courses = db.query(Course).all()
        edges = db.query(CoursePrerequisite).all()

        dependents_map = defaultdict(list)
        in_degree = defaultdict(int)
        depth = {}

        for course in courses:
            in_degree[course.id] = 0

        for edge in edges:
            prereq = edge.prerequisite_id
            course = edge.course_id
            dependents_map[prereq].append(course)
            in_degree[course] += 1

        queue = deque()
        for course in courses:
            if in_degree[course.id] == 0:
                queue.append(course.id)
                depth[course.id] = 0

        while queue:
            current = queue.popleft()
            current_depth = depth[current]

            for dependent in dependents_map[current]:
                in_degree[dependent] -= 1
                new_depth = current_depth + 1
                if dependent not in depth or new_depth > depth[dependent]:
                    depth[dependent] = new_depth

                if in_degree[dependent] == 0:
                    queue.append(dependent)

        for course in courses:
            d = depth.get(course.id, 0)
            course.difficulty_level = 800 + (d * 100)

        db.commit()

        print(f"Updated {len(courses)} courses")
        print("Sample output:")
        for course in courses[:10]:
            print(f"{course.id} difficulty={course.difficulty_level}")
    finally:
        db.close()


if __name__ == "__main__":
    compute_difficulty()
