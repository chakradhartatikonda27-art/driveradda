# Driver Adda — India's Trusted Driver Job Platform

Driver Adda is a modern, premium, mobile-first logistics recruitment platform designed specifically for truck, trailer, container, and commercial vehicle drivers in India. 

The application is structured into a containerized **FastAPI** backend (managing a secured PostgreSQL driver database, reporting metrics, and Excel/PDF/CSV exports) and a modern **Next.js 15** frontend (using Tailwind CSS, Framer Motion, and Lucide icons).

---

## 1. Executive Summary & UX Strategy

Logistics operators in India face huge friction in sourcing and verifying commercial truck drivers. Conversely, professional drivers struggle with commissions and lack direct access to employers. 

Driver Adda provides a **zero-middlemen registry**:
* **Driver Goal**: Register in <30 seconds via a 3-field mobile form.
* **Transport Goal**: Access a secure, state-filtered database of verified driver candidates.

### Information Architecture

* **Landing Page**: Features a highway hero graphic, marketing QR Code scanner simulation, hot driving openings list, FAQs, and a prominent registration CTA.
* **Driver Registration Form**: Mobile-first entry (Name, Mobile, State). No email, no resume uploads.
* **Driver Dashboard**: Allows drivers to see their verification status and track jobs they've applied for.
* **Admin Portal**: Fully secure. Includes aggregated state analytics (represented via SVG charts), a driver data table with pagination and search, verification toggle triggers, and data downloads (Excel, PDF, CSV).

---

## 2. Technical Stack

* **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons, Canvas Confetti.
* **Backend**: FastAPI (Python 3.10), SQLAlchemy (ORM), JWT, SQLite (default fallback) / PostgreSQL (via `DATABASE_URL`).
* **Exports**: Pandas & Openpyxl (Excel), ReportLab (PDF), python-csv (CSV).
* **Infrastructure**: Docker, Docker Compose, Nginx.

---

## 3. Database Schema

### Table: `drivers`
* `id` (UUID, Primary Key)
* `name` (VARCHAR)
* `mobile` (VARCHAR, Unique, Indexed)
* `working_state` (VARCHAR, Indexed)
* `registered_at` (TIMESTAMP)
* `status` (VARCHAR - `'verified' | 'unverified' | 'blacklisted'`)

### Table: `jobs`
* `id` (UUID, Primary Key)
* `company_name` (VARCHAR)
* `vehicle_type` (VARCHAR - `'Trailer' | 'Container' | 'Lorry' | 'Heavy Truck'`)
* `location` (VARCHAR)
* `salary` (VARCHAR)
* `trip_type` (VARCHAR - `'Single Driver' | 'Double Driver' | 'Local' | 'Long Route'`)
* `experience_required` (INTEGER)
* `description` (TEXT)
* `created_at` (TIMESTAMP)

### Table: `job_applications`
* `id` (UUID, Primary Key)
* `driver_id` (UUID, Foreign Key)
* `job_id` (UUID, Foreign Key)
* `applied_at` (TIMESTAMP)

---

## 4. API Endpoints Reference

### Authentication
* `POST /api/v1/auth/login-json`: Admin JSON auth (Returns JWT token).

### Drivers Registry
* `POST /api/v1/drivers/register`: Public driver sign-up.
* `GET /api/v1/drivers/me/{mobile}`: Public driver profile verification.
* `GET /api/v1/drivers`: List all drivers (Requires Admin JWT).
* `PUT /api/v1/drivers/{driver_id}`: Edit status/info (Requires Admin JWT).
* `DELETE /api/v1/drivers/{driver_id}`: Delete driver (Requires Admin JWT).

### Jobs Directory
* `GET /api/v1/jobs`: List open roles (supports state, vehicle, and trip filters).
* `POST /api/v1/jobs`: Create job posting (Requires Admin JWT).
* `DELETE /api/v1/jobs/{job_id}`: Delete job posting (Requires Admin JWT).
* `POST /api/v1/jobs/{job_id}/apply`: Apply to a job using mobile number.
* `GET /api/v1/jobs/applications/{driver_mobile}`: Fetch applied jobs for a driver.

### Analytics & Exports
* `GET /api/v1/admin-panel/stats`: Metrics & state-wise aggregates (Requires Admin JWT).
* `GET /api/v1/drivers/export/csv`: Download CSV database (Requires Admin JWT).
* `GET /api/v1/drivers/export/xlsx`: Download Excel database (Requires Admin JWT).
* `GET /api/v1/drivers/export/pdf`: Download PDF directory (Requires Admin JWT).

---

## 5. Development & Execution Guide

### Local Running (No Docker)

1. **Launch Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python -m app.main
   ```
   * The API server runs at `http://localhost:8000`.
   * On startup, the database seeds default admin (`admin` / `DriverAdda2026!`), mock jobs, and mock drivers automatically.

2. **Launch Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   * The Next.js frontend runs at `http://localhost:3000`.

### Containerized Deployment (Docker Compose)

Launch database, backend API, and Next.js portal with one command:
```bash
docker-compose up --build
```
* **Frontend Portal**: `http://localhost:3000`
* **API Documentation**: `http://localhost:8000/docs` (Swagger Panel)

---

## 6. Accessibility & Mobile Optimization Guidelines

To support truck drivers operating on low-end smartphones under changing lighting conditions:
1. **Interactive Tap Targets**: Ensure buttons (e.g. Register, Apply) have a minimum tap size of `48px` with clear spacing.
2. **Text Contrast**: Use high-contrast slates (`#111827`) and vivid blues/oranges to stay visible under outdoor glares.
3. **PWA-Ready**: Layout is structured with viewport settings for seamless mobile browser navigation without horizontal scrolling.
