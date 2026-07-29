import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional

# Export tools
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table as RLTable, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from ..database import get_db
from ..models import Driver, AdminUser
from ..schemas import DriverCreate, DriverResponse, DriverUpdate
from ..auth import get_current_admin

router = APIRouter(prefix="/drivers", tags=["drivers"])

@router.post("/register", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
def register_driver(driver_in: DriverCreate, db: Session = Depends(get_db)):
    # Check if mobile already exists
    existing = db.query(Driver).filter(Driver.mobile == driver_in.mobile).first()
    if existing:
        # Instead of throwing a 400 error which breaks the flow, we return the existing driver
        # so the driver flows smoothly into the dashboard, preventing duplicate registration errors.
        return existing
        
    db_driver = Driver(
        name=driver_in.name,
        mobile=driver_in.mobile,
        working_state=driver_in.working_state,
        status="unverified"
    )
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

@router.get("/me/{mobile}", response_model=DriverResponse)
def get_driver_by_mobile(mobile: str, db: Session = Depends(get_db)):
    driver = db.query(Driver).filter(Driver.mobile == mobile).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.get("", response_model=List[DriverResponse])
def get_drivers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    query = db.query(Driver)
    if search:
        query = query.filter(
            (Driver.name.ilike(f"%{search}%")) | (Driver.mobile.ilike(f"%{search}%"))
        )
    if state:
        query = query.filter(Driver.working_state == state)
    if status:
        query = query.filter(Driver.status == status)
        
    return query.order_by(Driver.registered_at.desc()).offset(skip).limit(limit).all()

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: str,
    driver_in: DriverUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    update_data = driver_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)
        
    db.commit()
    db.refresh(driver)
    return driver

@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_driver(
    driver_id: str,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    db.delete(driver)
    db.commit()
    return

# --- EXPORT ROUTES ---

def get_filtered_drivers_query(db: Session, search: Optional[str] = None, state: Optional[str] = None, status_filter: Optional[str] = None):
    query = db.query(Driver)
    if search:
        query = query.filter(
            (Driver.name.ilike(f"%{search}%")) | (Driver.mobile.ilike(f"%{search}%"))
        )
    if state:
        query = query.filter(Driver.working_state == state)
    if status_filter:
        query = query.filter(Driver.status == status_filter)
    return query.order_by(Driver.registered_at.desc()).all()

@router.get("/export/csv")
def export_drivers_csv(
    search: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    drivers = get_filtered_drivers_query(db, search, state, status)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Driver Name", "Mobile Number", "Working State", "Registered At", "Status"])
    
    for d in drivers:
        writer.writerow([
            d.id,
            d.name,
            d.mobile,
            d.working_state,
            d.registered_at.strftime("%Y-%m-%d %H:%M:%S") if d.registered_at else "",
            d.status
        ])
        
    output.seek(0)
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=driver_adda_export.csv"
    return response

@router.get("/export/xlsx")
def export_drivers_xlsx(
    search: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    drivers = get_filtered_drivers_query(db, search, state, status)
    
    data = []
    for d in drivers:
        data.append({
            "Driver Name": d.name,
            "Mobile Number": d.mobile,
            "Working State": d.working_state,
            "Registered At": d.registered_at.strftime("%Y-%m-%d %H:%M:%S") if d.registered_at else "",
            "Status": d.status.upper()
        })
        
    df = pd.DataFrame(data)
    
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Drivers", index=False)
        
    output.seek(0)
    response = StreamingResponse(io.BytesIO(output.read()), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response.headers["Content-Disposition"] = "attachment; filename=driver_adda_export.xlsx"
    return response

@router.get("/export/pdf")
def export_drivers_pdf(
    search: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    drivers = get_filtered_drivers_query(db, search, state, status)
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    
    # Custom styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        name="TitleStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=colors.HexColor("#0B5FFF"),
        spaceAfter=10
    )
    subtitle_style = ParagraphStyle(
        name="SubtitleStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=20
    )
    
    story.append(Paragraph("Driver Adda — Verified Driver Directory", title_style))
    story.append(Paragraph(f"Export Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Total Drivers: {len(drivers)}", subtitle_style))
    story.append(Spacer(1, 10))
    
    # Table data
    data = [["Name", "Mobile", "Working State", "Registered Date", "Status"]]
    for d in drivers:
        data.append([
            d.name,
            d.mobile,
            d.working_state,
            d.registered_at.strftime("%Y-%m-%d") if d.registered_at else "",
            d.status.upper()
        ])
        
    t = RLTable(data, colWidths=[130, 100, 120, 110, 80])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0B5FFF")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F9FAFB")),
        ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor("#1F2937")),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F3F4F6")]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,1), (-1,-1), 6),
        ('TOPPADDING', (0,1), (-1,-1), 6),
    ]))
    
    story.append(t)
    doc.build(story)
    
    buffer.seek(0)
    response = StreamingResponse(io.BytesIO(buffer.read()), media_type="application/pdf")
    response.headers["Content-Disposition"] = "attachment; filename=driver_adda_export.pdf"
    return response
