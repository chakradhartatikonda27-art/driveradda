import os
import sys

# Add backend app folder to search path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_api():
    print("--- STARTING AUTOMATED BACKEND VERIFICATION ---")
    
    # Manually seed database since TestClient doesn't fire startup_event on single calls
    from app.database import SessionLocal
    from app.models import AdminUser
    from app.auth import get_password_hash
    db = SessionLocal()
    try:
        admin_exists = db.query(AdminUser).filter(AdminUser.username == settings.DEFAULT_ADMIN_USERNAME).first()
        if not admin_exists:
            db.add(AdminUser(
                username=settings.DEFAULT_ADMIN_USERNAME,
                password_hash=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                role="admin"
            ))
            db.commit()
    finally:
        db.close()
    
    # 1. Test Gateway Root
    res = client.get("/")
    assert res.status_code == 200
    print("✓ API Gateway root accessible:", res.json())

    # 2. Driver Registration
    driver_payload = {
        "name": "Testing Raj",
        "mobile": "9999988888",
        "working_state": "Maharashtra"
      }
    res = client.post("/api/v1/drivers/register", json=driver_payload)
    assert res.status_code == 201
    driver_id = res.json()["id"]
    print("✓ Driver registration working. Driver ID:", driver_id)

    # 3. Retrieve Registered Profile
    res = client.get(f"/api/v1/drivers/me/9999988888")
    assert res.status_code == 200
    assert res.json()["name"] == "Testing Raj"
    print("✓ Profile lookup by mobile working:", res.json()["name"])

    # 4. Authenticate Admin
    auth_payload = {
        "username": settings.DEFAULT_ADMIN_USERNAME,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    }
    res = client.post("/api/v1/auth/login-json", json=auth_payload)
    assert res.status_code == 200
    token = res.json()["access_token"]
    print("✓ Admin login validation working. Token generated.")

    headers = {"Authorization": f"Bearer {token}"}

    # 5. List Drivers (Admin action)
    res = client.get("/api/v1/drivers", headers=headers)
    assert res.status_code == 200
    print("✓ Admin driver database listing accessible. Total drivers:", len(res.json()))

    # 6. Admin stats check
    res = client.get("/api/v1/admin-panel/stats", headers=headers)
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_drivers"] > 0
    print("✓ Admin analytics dashboard operational. Total drivers counted:", stats["total_drivers"])

    # 7. Post a Job (Admin action)
    job_payload = {
        "company_name": "Test Express Logistics",
        "vehicle_type": "Container",
        "location": "Mumbai, Maharashtra",
        "salary": "₹32,000 / month",
        "trip_type": "Single Driver",
        "experience_required": 3,
        "description": "Verification test job description."
    }
    res = client.post("/api/v1/jobs", json=job_payload, headers=headers)
    assert res.status_code == 201
    job_id = res.json()["id"]
    print("✓ Job publishing operational. Job ID:", job_id)

    # 8. Apply for job
    res = client.post(f"/api/v1/jobs/{job_id}/apply?driver_mobile=9999988888")
    assert res.status_code == 201
    print("✓ Job application mechanism working.")

    # 9. Verify exports (CSV, XLSX, PDF)
    res = client.get("/api/v1/drivers/export/csv", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    print("✓ CSV export generation working.")

    res = client.get("/api/v1/drivers/export/xlsx", headers=headers)
    assert res.status_code == 200
    assert "openxmlformats-officedocument" in res.headers["content-type"]
    print("✓ Excel export generation working.")

    res = client.get("/api/v1/drivers/export/pdf", headers=headers)
    assert res.status_code == 200
    assert "application/pdf" in res.headers["content-type"]
    print("✓ PDF report directory generation working.")

    print("\n--- ALL BACKEND TEST ASSERTIONS COMPLETED SUCCESSFULLY ---")

if __name__ == "__main__":
    import traceback
    try:
        test_api()
    except AssertionError as e:
        print("✗ VERIFICATION FAILED: Assertion Error", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        print(f"✗ VERIFICATION FAILED: Exception: {e}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)
