import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app.db')

def migrate():
    print(f"Migrating db at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if columns exist
    cursor.execute("PRAGMA table_info(course_resources)")
    columns = [info[1] for info in cursor.fetchall()]
    
    new_columns = [
        ("youtube_video_id", "VARCHAR"),
        ("thumbnail_url", "VARCHAR"),
        ("channel_name", "VARCHAR"),
        ("view_count", "INTEGER"),
        ("generated_at", "DATETIME")
    ]
    
    for col_name, col_type in new_columns:
        if col_name not in columns:
            print(f"Adding column {col_name} to course_resources")
            cursor.execute(f"ALTER TABLE course_resources ADD COLUMN {col_name} {col_type}")
    
    # Convert any existing watch urls to embed urls, to be safe.
    cursor.execute("SELECT id, url FROM course_resources WHERE url LIKE '%watch?v=%'")
    rows = cursor.fetchall()
    for row_id, url in rows:
        video_id = url.split('watch?v=')[1].split('&')[0]
        new_url = f"https://www.youtube.com/embed/{video_id}"
        cursor.execute("UPDATE course_resources SET url = ?, youtube_video_id = ? WHERE id = ?", (new_url, video_id, row_id))
    
    if rows:
        print(f"Updated {len(rows)} existing URLs from watch to embed.")
        
    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == '__main__':
    migrate()
