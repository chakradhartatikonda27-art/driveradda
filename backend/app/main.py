import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .routers import auth, drivers, jobs, admin
from .models import AdminUser, Job, Driver
from .auth import get_password_hash
from sqlalchemy.orm import Session
from .database import SessionLocal

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Driver Adda - Recruitment Platform",
    version="1.0.0"
)

# CORS Middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock this down to specific frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(drivers.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Database seeding logic
    db = SessionLocal()
    try:
        # 1. Seed Default Admin User
        admin_exists = db.query(AdminUser).filter(AdminUser.username == settings.DEFAULT_ADMIN_USERNAME).first()
        if not admin_exists:
            hashed_pwd = get_password_hash(settings.DEFAULT_ADMIN_PASSWORD)
            default_admin = AdminUser(
                username=settings.DEFAULT_ADMIN_USERNAME,
                password_hash=hashed_pwd,
                role="admin"
            )
            db.add(default_admin)
            db.commit()
            print("Admin user seeded successfully!")

        # 2. Seed Mock Jobs (if database is empty of jobs)
        jobs_count = db.query(Job).count()
        if jobs_count == 0:
            mock_jobs = [
                Job(
                    company_name="VRL Logistics Ltd.",
                    vehicle_type="Trailer",
                    location="Hubli, Karnataka",
                    salary="₹35,000 - ₹42,000 / month",
                    trip_type="Long Route",
                    experience_required=5,
                    description="Urgent requirement for multi-axle trailer driver for Bangalore-Mumbai corridor. Double driver system. Fuel mileage bonus and driver allowances provided."
                ),
                Job(
                    company_name="SafeExpress Cargo",
                    vehicle_type="Container",
                    location="Pune, Maharashtra",
                    salary="₹28,000 - ₹32,000 / month",
                    trip_type="Long Route",
                    experience_required=3,
                    description="Looking for container driver for Pune-Delhi transit. Must have experience with Volvo heavy trucks. Single driver route with scheduled night stops."
                ),
                Job(
                    company_name="Gati KWE Logistics",
                    vehicle_type="Heavy Truck",
                    location="Chennai, Tamil Nadu",
                    salary="₹25,000 - ₹30,000 / month",
                    trip_type="Local Transport",
                    experience_required=2,
                    description="Heavy commercial vehicle driver for city transport and regional hubs around Chennai. Daily return trip, fixed shift timings. ESIC + PF benefits included."
                ),
                Job(
                    company_name="Tata Supply Chain Solutions",
                    vehicle_type="Lorry",
                    location="Jamshedpur, Jharkhand",
                    salary="₹30,000 - ₹36,000 / month",
                    trip_type="Local Transport",
                    experience_required=4,
                    description="Experienced tipper/dumper lorry drivers required for plant operations. Safe driving track record is mandatory. Double driver shift rotation."
                ),
                Job(
                    company_name="Delhivery Cargo Services",
                    vehicle_type="Heavy Truck",
                    location="Gurugram, Haryana",
                    salary="₹32,000 - ₹38,000 / month",
                    trip_type="Long Route",
                    experience_required=3,
                    description="Hiring truck drivers for express cargo routes (Delhi-Kolkata). GPS-monitored vehicles, comfortable cabins, incentive on timely delivery."
                )
            ]
            db.bulk_save_objects(mock_jobs)
            db.commit()
            print("Mock jobs seeded successfully!")

        # 3. Seed Mock Drivers (if database is empty of drivers)
        drivers_count = db.query(Driver).count()
        if drivers_count == 0:
            mock_drivers = [
                Driver(name="Raju Prasad", mobile="9876543210", working_state="Bihar", status="verified"),
                Driver(name="Sandeep Singh", mobile="9988776655", working_state="Punjab", status="verified"),
                Driver(name="Karan Yadav", mobile="8877665544", working_state="Uttar Pradesh", status="unverified"),
                Driver(name="Muthu Kumar", mobile="7766554433", working_state="Tamil Nadu", status="verified"),
                Driver(name="Sanjay Patil", mobile="9123456780", working_state="Maharashtra", status="unverified"),
                Driver(name="Gurpreet Singh", mobile="9234567890", working_state="Punjab", status="verified"),
                Driver(name="Jitendra Patel", mobile="9345678901", working_state="Gujarat", status="unverified"),
                Driver(name="Ramesh Gowda", mobile="9456789012", working_state="Karnataka", status="verified"),
                Driver(name="Anil Verma", mobile="9567890123", working_state="Madhya Pradesh", status="verified"),
                Driver(name="Vijay Das", mobile="9678901234", working_state="West Bengal", status="unverified")
            ]
            db.bulk_save_objects(mock_drivers)
            db.commit()
            print("Mock drivers seeded successfully!")
            
    except Exception as e:
        print(f"Error during startup seeding: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Driver Adda API Gateway", "status": "online"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
