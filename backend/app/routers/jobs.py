from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Job, JobApplication, Driver, AdminUser
from ..schemas import JobCreate, JobResponse, JobApplicationResponse
from ..auth import get_current_admin

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    state: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    trip_type: Optional[str] = None,
    min_experience: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if state:
        query = query.filter(Job.location.ilike(f"%{state}%"))
    if vehicle_type:
        query = query.filter(Job.vehicle_type == vehicle_type)
    if trip_type:
        query = query.filter(Job.trip_type == trip_type)
    if min_experience is not None:
        query = query.filter(Job.experience_required <= min_experience)
        
    return query.order_by(Job.created_at.desc()).all()

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    db_job = Job(
        company_name=job_in.company_name,
        vehicle_type=job_in.vehicle_type,
        location=job_in.location,
        salary=job_in.salary,
        trip_type=job_in.trip_type,
        experience_required=job_in.experience_required,
        description=job_in.description
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return

@router.post("/{job_id}/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    job_id: str,
    driver_mobile: str = Query(..., description="Mobile number of the driver applying"),
    db: Session = Depends(get_db)
):
    # Verify the job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # Verify the driver is registered
    driver = db.query(Driver).filter(Driver.mobile == driver_mobile).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Driver mobile is not registered. Please register first."
        )
        
    # Check if application already exists
    existing = db.query(JobApplication).filter(
        JobApplication.driver_id == driver.id,
        JobApplication.job_id == job_id
    ).first()
    if existing:
        return existing
        
    app = JobApplication(
        driver_id=driver.id,
        job_id=job_id
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.get("/applications/{driver_mobile}", response_model=List[JobApplicationResponse])
def get_driver_applications(driver_mobile: str, db: Session = Depends(get_db)):
    driver = db.query(Driver).filter(Driver.mobile == driver_mobile).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    apps = db.query(JobApplication).filter(JobApplication.driver_id == driver.id).all()
    return apps
