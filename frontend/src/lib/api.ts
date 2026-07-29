const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  working_state: string;
  registered_at: string;
  status: string;
}

export interface Job {
  id: string;
  company_name: string;
  vehicle_type: string;
  location: string;
  salary: string;
  trip_type: string;
  experience_required: number;
  description?: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  driver_id: string;
  job_id: string;
  applied_at: string;
  job?: Job;
}

export interface DashboardStats {
  total_drivers: number;
  registrations_today: number;
  active_jobs: number;
  state_wise_drivers: { [key: string]: number };
  recent_registrations: Driver[];
}

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token") || "";
  }
  return "";
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }
};

const getHeaders = (authRequired = false) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (authRequired) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Public Driver registration
  async registerDriver(name: string, mobile: string, working_state: string): Promise<Driver> {
    const res = await fetch(`${API_BASE_URL}/drivers/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, mobile, working_state }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Registration failed");
    }
    return res.json();
  },

  // Get driver details by mobile
  async getDriverByMobile(mobile: string): Promise<Driver> {
    const res = await fetch(`${API_BASE_URL}/drivers/me/${mobile}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Driver profile not found");
    }
    return res.json();
  },

  // Public Jobs listing
  async getJobs(filters: { state?: string; vehicle_type?: string; trip_type?: string; min_experience?: number } = {}): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters.state) params.append("state", filters.state);
    if (filters.vehicle_type) params.append("vehicle_type", filters.vehicle_type);
    if (filters.trip_type) params.append("trip_type", filters.trip_type);
    if (filters.min_experience !== undefined) params.append("min_experience", String(filters.min_experience));

    const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return res.json();
  },

  // Fetch job details by ID
  async getJobById(jobId: string): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Job not found");
    }
    return res.json();
  },

  // Apply to a job
  async applyToJob(jobId: string, driverMobile: string): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply?driver_mobile=${encodeURIComponent(driverMobile)}`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to apply" }));
      throw new Error(err.detail || "Failed to apply");
    }
    return res.json();
  },

  // Fetch applied jobs for a driver
  async getDriverApplications(driverMobile: string): Promise<JobApplication[]> {
    const res = await fetch(`${API_BASE_URL}/jobs/applications/${encodeURIComponent(driverMobile)}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch applications");
    }
    return res.json();
  },

  // Admin auth
  async loginAdmin(username: string, password: string): Promise<{ access_token: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/login-json`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Incorrect username or password");
    }
    const data = await res.json();
    setAuthToken(data.access_token);
    return data;
  },

  // Admin Dashboard stats
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin-panel/stats`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch stats. Session might be expired.");
    }
    return res.json();
  },

  // Admin Drivers list
  async getAdminDrivers(filters: { search?: string; state?: string; status?: string; skip?: number; limit?: number } = {}): Promise<Driver[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.state) params.append("state", filters.state);
    if (filters.status) params.append("status", filters.status);
    if (filters.skip !== undefined) params.append("skip", String(filters.skip));
    if (filters.limit !== undefined) params.append("limit", String(filters.limit));

    const res = await fetch(`${API_BASE_URL}/drivers?${params.toString()}`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch drivers list");
    }
    return res.json();
  },

  // Admin update driver (status)
  async updateDriver(driverId: string, updates: Partial<Driver>): Promise<Driver> {
    const res = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error("Failed to update driver");
    }
    return res.json();
  },

  // Admin delete driver
  async deleteDriver(driverId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to delete driver");
    }
  },

  // Admin publish a job
  async publishJob(job: Omit<Job, "id" | "created_at">): Promise<Job> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(job),
    });
    if (!res.ok) {
      throw new Error("Failed to publish job");
    }
    return res.json();
  },

  // Admin remove job
  async deleteJob(jobId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to delete job");
    }
  },

  // Export URLs
  getExportUrl(format: "csv" | "xlsx" | "pdf", filters: { search?: string; state?: string; status?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.state) params.append("state", filters.state);
    if (filters.status) params.append("status", filters.status);
    params.append("token", getAuthToken()); // For query authentication in downloads if needed, but our routes require token in header. To make standard downloads simple, we let the client fetch with Authorization header or use a browser-download with auth.
    return `${API_BASE_URL}/drivers/export/${format}?${params.toString()}`;
  },

  // Standard fetch for exports to handle auth headers cleanly
  async downloadExport(format: "csv" | "xlsx" | "pdf", filters: { search?: string; state?: string; status?: string } = {}): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.state) params.append("state", filters.state);
    if (filters.status) params.append("status", filters.status);
    
    const res = await fetch(`${API_BASE_URL}/drivers/export/${format}?${params.toString()}`, {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      throw new Error(`Export to ${format.toUpperCase()} failed`);
    }
    return res.blob();
  }
};
