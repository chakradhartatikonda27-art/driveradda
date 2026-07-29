"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Truck, ChevronLeft, ShieldCheck, ArrowRight, User } from "lucide-react";
import confetti from "canvas-confetti";

export default function Register() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Core list of Indian States
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Input Validations
    if (name.trim().length < 2) {
      setError("Please enter a valid name (at least 2 letters)");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!state) {
      setError("Please select your current working state");
      return;
    }

    setLoading(true);

    try {
      const driver = await api.registerDriver(name.trim(), mobile, state);
      
      // Store driver mobile details locally to emulate "login session"
      localStorage.setItem("driver_mobile", driver.mobile);
      
      // Fire celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccess(true);
      
      // Redirect after 1.5 seconds to home page
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-80 w-80 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-white p-3.5 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
            <Truck className="h-8 w-8 transform -scale-x-100" />
          </div>
        </div>
        
        <h2 className="text-center font-display font-extrabold text-3xl tracking-tight text-white">
          Join <span className="text-primary">Driver Adda</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          India's trusted registry for professional vehicle drivers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-dark border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {!success ? (
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Name field */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Name (पूरा नाम)
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all"
                />
              </div>

              {/* Mobile number field */}
              <div className="space-y-1">
                <label htmlFor="mobile" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-semibold text-base select-none">
                    +91
                  </span>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base font-semibold tracking-wide transition-all"
                  />
                </div>
              </div>

              {/* Working State field */}
              <div className="space-y-1">
                <label htmlFor="state" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Working State (राज्य)
                </label>
                <select
                  id="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-600">Select state where you work</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-400 text-xs font-semibold bg-red-950/40 border border-red-900 p-3 rounded-xl text-center">
                  {error}
                </p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Registering..." : "Submit Registration (दर्ज करें)"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto h-16 w-16 bg-success/15 border border-success/30 rounded-2xl flex items-center justify-center text-success animate-bounce">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-2xl text-white">Success! (सफलता)</h3>
                <p className="text-sm text-slate-400">
                  Profile registered. Redirecting to home page...
                </p>
              </div>
            </div>
          )}

          {/* Guarantee context */}
          <div className="border-t border-slate-800/80 pt-4 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
              <span>We never share your phone number publicly. Only verified employers can reach you.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
