import sys
from db.database import SessionLocal
from models.user import User

# Check if test user exists
db = SessionLocal()

try:
    user = db.query(User).filter(User.email == "test@example.com").first()
    if user:
        print("✅ Test user exists in database!")
        print(f"  Email: {user.email}")
        print(f"  User ID: {user.id}")
        print(f"  Password hash exists: {bool(user.password_hash)}")
        sys.exit(0)
    else:
        print("❌ Test user NOT found in database!")
        print("Please run: python create_test_user.py")
        sys.exit(1)
finally:
    db.close()
