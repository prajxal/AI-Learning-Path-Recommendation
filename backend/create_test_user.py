import uuid
from datetime import datetime
from db.database import SessionLocal
from models.user import User
from core.security import hash_password

# Create a test user
db = SessionLocal()

try:
    # Check if test user already exists
    existing_user = db.query(User).filter(User.email == "test@example.com").first()
    if existing_user:
        print("Test user already exists!")
        print(f"Email: test@example.com")
        print(f"Password: password123")
    else:
        # Create new test user
        user_id = str(uuid.uuid4())
        hashed_pw = hash_password("password123")
        test_user = User(
            id=user_id,
            email="test@example.com",
            password_hash=hashed_pw,
            skill_level="beginner",
            created_at=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"Email: test@example.com")
        print(f"Password: password123")
        print(f"User ID: {test_user.id}")

finally:
    db.close()
