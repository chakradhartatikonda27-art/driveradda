"use client";

import { useState } from "react";
import { Job, api } from "@/lib/api";
import { MapPin, Briefcase, IndianRupee, Users, Calendar, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface JobCardProps {
  job: Job;
  onApplySuccess?: () => void;
}

export default function JobCard({ job, onApplySuccess }: JobCardProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.applyToJob(job.id, mobileNumber);
      setApplied(true);
      
      // Store current driver's mobile locally so they stay logged in
      localStorage.setItem("driver_mobile", mobileNumber);
      
      // Visual feedback
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });

      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to apply. Make sure you are registered.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    // Check if driver mobile is already stored locally
    const storedMobile = localStorage.getItem("driver_mobile");
    if (storedMobile) {
      setMobileNumber(storedMobile);
    }
    setShowApplyModal(true);
    setError("");
    setApplied(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase mb-2">
              {job.vehicle_type}
            </span>
            <h3 className="font-display font-bold text-xl text-dark group-hover:text-primary transition-colors">
              {job.company_name}
            </h3>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(job.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-primary shrink-0 mr-2" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-4 w-4 text-secondary shrink-0 mr-2" />
            <span className="font-semibold text-gray-900">{job.salary}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-primary shrink-0 mr-2" />
            <span>{job.trip_type}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 text-secondary shrink-0 mr-2" />
            <span>{job.experience_required}+ Years Exp</span>
          </div>
        </div>

        {job.description && (
          <p className="text-gray-500 text-xs leading-relaxed mb-6 border-t border-gray-50 pt-4 line-clamp-2">
            {job.description}
          </p>
        )}
      </div>

      <button
        onClick={openModal}
        className="w-full py-3 px-4 text-sm font-bold rounded-xl text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all duration-200 border border-primary/10 hover:border-transparent flex items-center justify-center space-x-1.5"
      >
        <span>Apply Now</span>
      </button>

      {/* Slide-in Apply Dialog */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ×
            </button>

            {!applied ? (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="text-center pb-2">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">Job Application</span>
                  <h3 className="font-display font-extrabold text-xl text-gray-900 mt-1">
                    Apply for {job.company_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your registered mobile to send your profile
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Your Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-semibold tracking-wide"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-all duration-150 disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Confirm & Send Profile"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-success animate-bounce" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-gray-900">Application Sent!</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your verified details have been successfully shared with {job.company_name}.
                  </p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
