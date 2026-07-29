from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional, Dict

# Driver schemas
class DriverCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Ramesh Kumar"])
    mobile: str = Field(..., pattern=r"^\d{10}$", examples=["9876543210"])
    working_state: str = Field(..., min_length=2, max_length=50, examples=["Maharashtra"])

class DriverResponse(BaseModel):
    id: str
    name: str
    mobile: str
    working_state: str
    registered_at: datetime
    status: str

    class Config:
        from_attributes = True

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    working_state: Optional[str] = None
    status: Optional[str] = None

# Job schemas
class JobCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    vehicle_type: str = Field(..., min_length=2, max_length=50) # e.g. Lorry, Trailer, Heavy Truck
    location: str = Field(..., min_length=2, max_length=100)
    salary: str = Field(..., min_length=2, max_length=50)
    trip_type: str = Field(..., min_length=2, max_length=50) # Single Driver, Double Driver, Local
    experience_required: int = Field(..., ge=0)
    description: Optional[str] = None

class JobResponse(BaseModel):
    id: str
    company_name: str
    vehicle_type: str
    location: str
    salary: str
    trip_type: str
    experience_required: int
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Job Application schemas
class JobApplicationCreate(BaseModel):
    driver_id: str
    job_id: str

class JobApplicationResponse(BaseModel):
    id: str
    driver_id: str
    job_id: str
    applied_at: datetime
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True

# Admin Auth schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Dashboard Analytics schemas
class DriverSimple(BaseModel):
    id: str
    name: str
    mobile: str
    working_state: str
    registered_at: datetime
    status: str

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_drivers: int
    registrations_today: int
    active_jobs: int
    state_wise_drivers: Dict[str, int]
    recent_registrations: List[DriverSimple]
