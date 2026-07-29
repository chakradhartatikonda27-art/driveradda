"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import JobCard from "@/components/shared/JobCard";
import { Job, api } from "@/lib/api";
import { Search, SlidersHorizontal, RotateCcw, HelpCircle } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");

  const states = [
    "Maharashtra", "Punjab", "Haryana", "Bihar", "Uttar Pradesh", 
    "Tamil Nadu", "Gujarat", "Karnataka", "West Bengal", "Rajasthan"
  ];
  const vehicles = ["Trailer", "Container", "Lorry", "Heavy Truck", "Commercial"];
  const trips = ["Single Driver", "Double Driver", "Local Transport", "Long Route"];

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        state: selectedState || undefined,
        vehicle_type: selectedVehicle || undefined,
        trip_type: selectedTrip || undefined
      });
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs, using mock fallback", err);
      // Fallback mocks
      const mockJobs: Job[] = [
        {
          id: "1",
          company_name: "VRL Logistics Ltd.",
          vehicle_type: "Trailer",
          location: "Hubli, Karnataka",
          salary: "₹35,000 - ₹42,000 / month",
          trip_type: "Long Route",
          experience_required: 5,
          description: "Urgent requirement for multi-axle trailer driver for Bangalore-Mumbai corridor. Double driver system. Fuel mileage bonus and allowances.",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          company_name: "SafeExpress Cargo",
          vehicle_type: "Container",
          location: "Pune, Maharashtra",
          salary: "₹28,000 - ₹32,000 / month",
          trip_type: "Long Route",
          experience_required: 3,
          description: "Looking for container driver for Pune-Delhi transit. Single driver route with scheduled night stops.",
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          company_name: "Tata Supply Chain Solutions",
          vehicle_type: "Lorry",
          location: "Jamshedpur, Jharkhand",
          salary: "₹30,000 - ₹36,000 / month",
          trip_type: "Local Transport",
          experience_required: 4,
          description: "Tipper lorry drivers required for plant operations. Safe driving track record is mandatory.",
          created_at: new Date().toISOString()
        },
        {
          id: "4",
          company_name: "Gati KWE Logistics",
          vehicle_type: "Heavy Truck",
          location: "Chennai, Tamil Nadu",
          salary: "₹25,000 - ₹30,000 / month",
          trip_type: "Local Transport",
          experience_required: 2,
          description: "Heavy commercial vehicle driver for city transport daily return trips around Chennai hubs.",
          created_at: new Date().toISOString()
        },
        {
          id: "5",
          company_name: "Delhivery Cargo Services",
          vehicle_type: "Heavy Truck",
          location: "Gurugram, Haryana",
          salary: "₹32,000 - ₹38,000 / month",
          trip_type: "Long Route",
          experience_required: 3,
          description: "Hiring truck drivers for express cargo routes. GPS-monitored vehicles, comfortable cabins.",
          created_at: new Date().toISOString()
        }
      ];
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [selectedState, selectedVehicle, selectedTrip]);

  const handleResetFilters = () => {
    setSelectedState("");
    setSelectedVehicle("");
    setSelectedTrip("");
    setSearch("");
  };

  // Client side text search filter
  const filteredJobs = jobs.filter((j) => {
    const term = search.toLowerCase();
    return (
      j.company_name.toLowerCase().includes(term) ||
      j.location.toLowerCase().includes(term) ||
      j.vehicle_type.toLowerCase().includes(term) ||
      (j.description && j.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="text-center sm:text-left mb-10 space-y-2">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
            Available Driving Jobs
          </h1>
          <p className="text-sm text-gray-500">
            Find the perfect matching routes, trucks, and competitive salaries across India.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-grow max-w-lg">
              <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center h-full text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs by company, location, or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>

            {/* Reset Button */}
            {(selectedState || selectedVehicle || selectedTrip || search) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center py-3 px-5 text-sm font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent transition-all space-x-1 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Quick Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
            {/* State Filter */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Location (State)
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="">All India States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Vehicle Type
              </label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Trip Type Filter */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Trip / Shift Type
              </label>
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                <option value="">All Shifts</option>
                {trips.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApplySuccess={loadJobs} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="inline-flex p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
              <SlidersHorizontal className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-dark">No Jobs Match Your Filters</h3>
              <p className="text-sm text-gray-500 mt-1">
                Try widening your search terms or resetting filters to see more assignments.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="py-2.5 px-6 font-bold bg-primary text-white hover:bg-primary-hover rounded-xl shadow-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
