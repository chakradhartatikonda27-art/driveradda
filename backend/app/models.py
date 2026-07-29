import uuid
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# Helper to support UUID across both SQLite and PostgreSQL
def generate_uuid():
    return str(uuid.uuid4())

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    mobile = Column(String(15), unique=True, nullable=False, index=True)
    working_state = Column(String(50), nullable=False, index=True)
    registered_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="unverified") # 'verified', 'unverified', 'blacklisted'

    # Relationships
    applications = relationship("JobApplication", back_populates="driver", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_name = Column(String(100), nullable=False)
    vehicle_type = Column(String(50), nullable=False) # 'Lorry', 'Trailer', 'Container', 'Heavy Truck', 'Commercial'
    location = Column(String(100), nullable=False)
    salary = Column(String(50), nullable=False)
    trip_type = Column(String(50), nullable=False) # 'Single Driver', 'Double Driver', 'Local', 'Long Route'
    experience_required = Column(Integer, nullable=False) # in years
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    driver_id = Column(String(36), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    driver = relationship("Driver", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class AdminUser(Base):
    __tablename__ = "admins"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
