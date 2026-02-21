import requests

# 1. Login to get token
login_res = requests.post("http://localhost:8000/auth/login", json={"email":"test_user2@example.com", "password":"test123"})
if login_res.status_code != 200:
    print(f"Login failed: {login_res.text}")
    exit(1)

token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Upload Resume PDF using a prepared dummy file in repo if present, or create a mock text file bypassing strict PDF layout checking since we only use extract_text
print("\nUploading Resume...")
mock_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources << >>\n>>\nendobj\n4 0 obj\n<< /Length 59 >>\nstream\nBT\n10 0 Td\n(Skills: python, kubernetes, devops, react) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000213 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n323\n%%EOF\n"

with open("mock_resume.pdf", "wb") as f:
    f.write(mock_pdf_content)

with open("mock_resume.pdf", "rb") as f:
    files = {"file": ("mock_resume.pdf", f, "application/pdf")}
    upload_res = requests.post("http://localhost:8000/resume/upload", headers=headers, files=files)
    print("Upload Response:", upload_res.status_code, upload_res.text)

# 4. Check unified Pipeline score adaptation for Python roadmap
print("\nFetching Adaptive Learning Path for Python...")
lp_res = requests.get("http://localhost:8000/learning-path/python:123", headers=headers)
print("Learning Path Response:", lp_res.status_code)
print(lp_res.json())
