from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, time
from typing import Dict, List

from ..database import get_db
from ..models import Driver, Job, AdminUser
from ..schemas import DashboardStats, DriverSimple
from ..auth import get_current_admin

router = APIRouter(prefix="/admin-panel", tags=["admin-panel"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    # Total drivers
    total_drivers = db.query(Driver).count()
    
    # Registrations today
    today_start = datetime.combine(datetime.utcnow().date(), time.min)
    registrations_today = db.query(Driver).filter(Driver.registered_at >= today_start).count()
    
    # Active jobs
    active_jobs = db.query(Job).count()
    
    # State-wise drivers count
    state_counts = db.query(
        Driver.working_state, func.count(Driver.id)
    ).group_by(Driver.working_state).all()
    
    state_wise_drivers = {state: count for state, count in state_counts if state}
    
    # Recent registrations (last 5)
    recent_drivers = db.query(Driver).order_by(Driver.registered_at.desc()).limit(5).all()
    
    return {
        "total_drivers": total_drivers,
        "registrations_today": registrations_today,
        "active_jobs": active_jobs,
        "state_wise_drivers": state_wise_drivers,
        "recent_registrations": recent_drivers
    }
