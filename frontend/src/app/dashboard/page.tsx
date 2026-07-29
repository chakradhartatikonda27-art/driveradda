"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Driver, JobApplication, api } from "@/lib/api";
import { 
  UserCheck, 
  Smartphone, 
  MapPin, 
  CheckCircle, 
  Calendar, 
  LogOut, 
  LifeBuoy, 
  Mail, 
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Inbox
} from "lucide-react";

export default function DriverDashboard() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("driver_mobile");
    router.push("/");
  };
  useEffect(() => {
    const storedMobile = localStorage.getItem("driver_mobile");
    if (!storedMobile) {
      // Driver not registered or logged in, redirect to registration
      router.push("/register");
      return;
    }
    const mobile = storedMobile;

    async function loadDashboardData() {
      try {
        const driverData = await api.getDriverByMobile(mobile);
        setDriver(driverData);

        const appsData = await api.getDriverApplications(mobile);
        setApplications(appsData);
      } catch (err: any) {
        console.warn("Failed to load driver dashboard data from api, falling back to mock driver session", err);
        // Fallback mock driver session
        setDriver({
          id: "mock-driver-1",
          name: "Ramesh Gowda",
          mobile: mobile,
          working_state: "Karnataka",
          registered_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: "verified"
        });
        setApplications([
          {
            id: "app-1",
            driver_id: "mock-driver-1",
            job_id: "1",
            applied_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            job: {
              id: "1",
              company_name: "VRL Logistics Ltd.",
              vehicle_type: "Trailer",
              location: "Hubli, Karnataka",
              salary: "₹35,000 - ₹42,000 / month",
              trip_type: "Long Route",
              experience_required: 5,
              created_at: new Date().toISOString()
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-slate-50">
          <div className="space-y-4 text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-500">Loading Dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-dark">
              Welcome, {driver?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your profile, track applied routes, and review verify state.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Profile</span>
          </button>
        </div>

        {/* Profile Card & Info Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Driver Profile Summary */}
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <h3 className="font-display font-bold text-lg text-dark">Registry Card</h3>
                {driver?.status === "verified" ? (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Profile
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    Verification Pending
                  </span>
                )}
              </div>

              {/* Data parameters */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Mobile Number</p>
                    <p className="text-base font-semibold text-gray-900">+91 {driver?.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Working State</p>
                    <p className="text-base font-semibold text-gray-900">{driver?.working_state}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Registered On</p>
                    <p className="text-base font-semibold text-gray-900">
                      {driver?.registered_at ? new Date(driver.registered_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-50 text-xs text-gray-500 leading-relaxed">
              We share these details with verified fleet hiring managers. Keep your phone active to receive calls.
            </div>
          </div>

          {/* Applied Jobs Listing */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="font-display font-bold text-lg text-dark mb-5 pb-4 border-b border-gray-50">
              Your Applications ({applications.length})
            </h3>

            {applications.length > 0 ? (
              <div className="space-y-4 flex-grow">
                {applications.map((app) => (
                  <div 
                    key={app.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-slate-50/50 transition-all gap-4"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
                        {app.job?.vehicle_type}
                      </span>
                      <h4 className="font-display font-bold text-base text-gray-900">{app.job?.company_name}</h4>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400 shrink-0" />
                        <span>{app.job?.location}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50">
                      <span className="text-sm font-bold text-gray-900">{app.job?.salary}</span>
                      <span className="text-[10px] text-gray-400 flex items-center mt-1">
                        Applied: {new Date(app.applied_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-10 space-y-4">
                <div className="inline-flex p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-300">
                  <Inbox className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-dark">No Job Applications Yet</h4>
                  <p className="text-xs text-gray-500 max-w-xs mt-1 mx-auto">
                    You haven't applied to any driving jobs yet. Check out the jobs board to find open routes.
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center py-2 px-5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-colors space-x-1"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Support Portal Info */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-secondary/10 blur-3xl rounded-full" />
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-secondary/20 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Support Desk
              </span>
              <h3 className="font-display font-bold text-xl text-white">Need Profile Help or Verification?</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Contact our helpline if you want to update your working state, correct your name spelling, or accelerate your verification checks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="tel:+919876543210"
                className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-6 text-sm font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md transition-colors space-x-1.5"
              >
                <Phone className="h-4 w-4" />
                <span>Call Support</span>
              </Link>
              <Link
                href="mailto:support@driveradda.in"
                className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-6 text-sm font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors space-x-1.5 border border-slate-700"
              >
                <Mail className="h-4 w-4" />
                <span>Email Us</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
