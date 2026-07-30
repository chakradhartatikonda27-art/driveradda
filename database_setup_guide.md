# Driver Adda — Cloud Database Setup Guide (Supabase, Render & Vercel)

This guide outlines the steps to connect the **Driver Adda** frontend on Vercel to a live Python FastAPI backend hosted on Render, which stores driver registrations and job listings in your **Supabase PostgreSQL database**.

---

## Architecture Overview

```mermaid
graph LR
    User[Mobile Phone / QR Scan] -->|HTTPS Requests| Vercel[Vercel Frontend]
    Vercel -->|REST API Calls| Render[Render FastAPI Backend]
    Render -->|SQL Database Queries| Supabase[Supabase PostgreSQL DB]
```

---

## Step 1: Get Your Supabase Connection String

1. Sign in to your [Supabase Dashboard](https://supabase.com/).
2. Select your project.
3. Click the **Settings** gear icon in the sidebar, then navigate to **Database**.
4. Scroll down to the **Connection string** section.
5. Select the **URI** tab and copy the connection string. It will look like this:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
   > [!IMPORTANT]
   > Make sure to replace `[YOUR-PASSWORD]` with the actual database password you chose when creating the Supabase project.

---

## Step 2: Deploy FastAPI Backend to Render (Free)

Render will host the FastAPI server and expose a secure public `https://` endpoint for the frontend.

1. Go to [Render.com](https://render.com/) and sign up / sign in using your GitHub account.
2. Click the **New +** button in the dashboard and select **Web Service**.
3. Connect your GitHub repository: `chakradhartatikonda27-art/driveradda`.
4. Enter the following build settings:
   * **Name**: `driver-adda-backend`
   * **Environment**: `Python`
   * **Root Directory**: *Leave empty* (or set to `backend` if you want it to run directly from the subfolder)
   * **Build Command**: `pip install -r backend/requirements.txt`
   * **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Scroll down and click **Advanced** to add **Environment Variables**:
   * **DATABASE_URL**: `[Paste your Supabase URI connection string from Step 1]`
6. Click **Create Web Service**.

Once deployed, Render will show your service as `Live` and provide a URL at the top, such as:
`https://driver-adda-backend.onrender.com`

---

## Step 3: Link Vercel Frontend to the Hosted Backend

Now we need to tell the Vercel-hosted frontend to send API calls to the live Render backend instead of `localhost`.

1. Go to your [Vercel Dashboard](https://vercel.com/) and select your frontend project.
2. Navigate to **Settings** > **Environment Variables**.
3. Create a new environment variable:
   * **Key**: `NEXT_PUBLIC_API_URL`
   * **Value**: `https://[your-render-backend-url]/api/v1` (e.g., `https://driver-adda-backend.onrender.com/api/v1`)
4. Go to the **Deployments** tab.
5. Click on the three dots next to your latest deployment and select **Redeploy** (ensure you check the box to build with the updated environment variables).

---

## Verification Checklist

- [ ] **Scan the QR Code**: Open the website on your phone via the Vercel link.
- [ ] **Submit Registration**: Enter a driver profile.
- [ ] **Verify Success**: Ensure the success message pops up and redirects back to the Home page.
- [ ] **Check Supabase**: Log into Supabase, go to the **Table Editor**, click on the `drivers` table, and confirm your registered driver record is saved securely.
