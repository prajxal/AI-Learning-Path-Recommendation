import json
import requests

# Test the login endpoint directly
BASE_URL = "http://localhost:8000"

test_credentials = {
    "email": "test@example.com",
    "password": "password123"
}

print("🧪 Testing login endpoint...")
print(f"URL: {BASE_URL}/auth/login")
print(f"Credentials: {json.dumps(test_credentials, indent=2)}")
print()

try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json=test_credentials,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ Login successful!")
        access_token = response.json().get("access_token")
        print(f"Access Token: {access_token[:50]}...")
    else:
        print(f"\n❌ Login failed with status {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")
