"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import JobCard from "@/components/shared/JobCard";
import QRScanner from "@/components/shared/QRScanner";
import { Job, api } from "@/lib/api";
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Truck,
  TrendingUp,
  Map,
  Coins,
  MousePointerClick,
  Monitor,
  LayoutDashboard
} from "lucide-react";

const heroImages = [
  "/images/background.jpg",
  "/images/hero.jpg",
  "/images/transit.jpg"
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regState, setRegState] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // --- INTERACTIVE MODULE 1: SALARY CALCULATOR STATE ---
  const [calcExp, setCalcExp] = useState(3);
  const [calcVehicle, setCalcVehicle] = useState("Trailer");

  const calculateSalary = () => {
    let base = 20000;
    if (calcVehicle === "Trailer") base = 32000;
    else if (calcVehicle === "Container") base = 28000;
    else if (calcVehicle === "Heavy Truck") base = 25000;
    else if (calcVehicle === "Lorry") base = 22000;
    
    const increment = calcExp * 1200;
    const total = base + increment;
    return `₹${total.toLocaleString("en-IN")} - ₹${(total + 5000).toLocaleString("en-IN")}`;
  };

  // --- INTERACTIVE MODULE 2: RECRUITMENT TERMINAL TOGGLE STATE ---
  const [terminalView, setTerminalView] = useState<"driver" | "recruiter">("driver");

  // Indian States
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const statesServed = [
    "Maharashtra", "Punjab", "Haryana", "Bihar", "Uttar Pradesh", 
    "Tamil Nadu", "Gujarat", "Karnataka", "West Bengal", "Rajasthan"
  ];

  const faqs = [
    {
      q: "Is driver registration free?",
      a: "Yes, registration for professional drivers is 100% free. We will never ask you for money to register or apply for jobs."
    },
    {
      q: "What details do I need to register?",
      a: "Only three things: your Name, your Mobile Number, and the State you want to work in. It takes less than 30 seconds."
    },
    {
      q: "How do transport companies find me?",
      a: "Once you register, your profile goes into our secure database. Verified transport companies search this database by state and vehicle type and contact you directly."
    },
    {
      q: "How do I apply for jobs?",
      a: "You can browse active jobs on our portal, filter by your state or vehicle type, and click 'Apply'. You only need to verify your registered mobile number."
    }
  ];

  // Listen to #register hash to open modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#register") {
        setShowRegisterModal(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegName("");
    setRegMobile("");
    setRegState("");
    setRegError("");
    setRegSuccess(false);
    if (window.location.hash === "#register") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regName.trim().length < 2) {
      setRegError("Please enter your full name (at least 2 characters)");
      return;
    }
    if (!/^\d{10}$/.test(regMobile)) {
      setRegError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!regState) {
      setRegError("Please select your working state");
      return;
    }

    setRegLoading(true);

    try {
      const driver = await api.registerDriver(regName.trim(), regMobile, regState);
      localStorage.setItem("driver_mobile", driver.mobile);
      
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setRegSuccess(true);
      
      setTimeout(() => {
        closeRegisterModal();
        window.location.href = "/";
      }, 1500);
      
    } catch (err: any) {
      setRegError(err.message || "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await api.getJobs();
        setJobs(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load jobs", err);
        setJobs([
          {
            id: "1",
            company_name: "VRL Logistics Ltd.",
            vehicle_type: "Trailer",
            location: "Hubli, Karnataka",
            salary: "₹35,000 - ₹42,000 / month",
            trip_type: "Long Route",
            experience_required: 5,
            description: "Requirement for multi-axle trailer driver Bangalore-Mumbai corridor. Fuel bonus and allowances provided.",
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 3D Premium Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-36">
        {/* Background Slider Slides */}
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                idx === currentImageIdx ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>

        {/* Dark Vignette Overlays for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:40px_40px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side Tagline and Action */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>India's Dedicated Driver Portal</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-white">
                Drive Direct. <br />
                Earn <span className="text-primary">More</span>. No Agents.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-350 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with transport companies. Zero commissions. Search verified jobs or register your profile in 30 seconds to receive calls.
              </p>

              {/* Unique Interactive Driver Prompt Banner */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">Driver Onboarding</p>
                  <p className="text-sm text-slate-200">No email required. Register using mobile number.</p>
                </div>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 text-center transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <MousePointerClick className="h-4.5 w-4.5" />
                  <span>Start Sign Up Now</span>
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800 max-w-md mx-auto lg:mx-0 text-slate-350">
                <div>
                  <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-white">50,000+</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Verified Drivers</p>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-white">250+</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Logistics Fleets</p>
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-white">100%</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Direct Calling</p>
                </div>
              </div>
            </div>

            {/* Right Side 3D Interactive Parallax Card */}
            <div className="lg:col-span-5 flex justify-center perspective-1000">
              <div className="relative w-full max-w-md h-80 rounded-3xl group border border-slate-800/40 tilt-3d preserve-3d cursor-pointer">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <img 
                  src="/images/hero.jpg" 
                  alt="Lorry fleet background" 
                  className="w-full h-full object-cover rounded-3xl transform scale-100 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent rounded-3xl" />
                
                {/* Parallax elements */}
                <div className="absolute top-4 left-4 translate-z-40 bg-primary/95 text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-1.5 transition-all">
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary animate-pulse" />
                  <span>Direct Registry</span>
                </div>

                <div className="absolute top-4 right-4 translate-z-20 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg border border-white/5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Verification</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-z-60 bg-slate-950/85 backdrop-blur-lg border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                      Scan to Register
                    </h4>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      Open registry card instantly on mobile
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-white p-2.5 rounded-xl cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-md"
                  >
                    <svg className="w-10 h-10 text-slate-900" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M1 1h7v7H1zM21 1h7v7h-7zM1 21h7v7H1z" fill="currentColor" fillOpacity="0.1" />
                      <path d="M3 3h3v3H3zM23 3h3v3h-3zM3 23h3v3H3z" fill="currentColor" />
                      <path d="M10 2h3v1h-3zM16 1h2v3h-2z" fill="currentColor" />
                      <path d="M2 10h4v1H2zM7 12h2v3H7z" fill="currentColor" />
                      <path d="M11 11h3v2h-3z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- UNIQUE MODULE 1: INTERACTIVE SALARY CALCULATOR --- */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                Market Insights
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
                Check Your Earning Potential
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                Driver salaries vary based on experience and vehicle class. Use our interactive estimator to see what verified logistics companies are paying on the Driver Adda board.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span><strong>Trailer Drivers</strong> earn premium allowances on long routes.</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span><strong>Container Drivers</strong> are highly demanded in port states.</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-secondary/5 blur-3xl rounded-full" />
                
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-secondary" />
                  Salary Estimator
                </h3>

                {/* 1. Vehicle Selection row */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Select Vehicle Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Trailer", "Container", "Heavy Truck", "Lorry"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setCalcVehicle(v)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          calcVehicle === v 
                            ? "bg-primary border-primary text-white" 
                            : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Experience Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Experience Level</span>
                    <span className="text-white font-mono">{calcExp === 10 ? "10+ Years" : `${calcExp} Years`}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={calcExp}
                    onChange={(e) => setCalcExp(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 Year</span>
                    <span>5 Years</span>
                    <span>10+ Years</span>
                  </div>
                </div>

                {/* 3. Output Display */}
                <div className="bg-slate-850/80 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Salary</p>
                  <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
                    {calculateSalary()}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    *Excluding trip allowances, mileage bonuses, and ESIC/PF packages.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- UNIQUE MODULE 2: INTERACTIVE LOGISTICS TERMINAL PREVIEW --- */}
      <section className="py-20 bg-slate-50 border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-secondary text-xs font-bold uppercase tracking-wider bg-secondary/15 px-3 py-1 rounded-full">
              Interactive Preview
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark">
              How Driver Adda Connects You
            </h2>
            <p className="text-gray-500 text-sm">
              Toggle the view below to preview the custom terminal interface built for drivers and transport coordinators.
            </p>

            {/* Toggle Row */}
            <div className="inline-flex bg-white border border-gray-200 p-1.5 rounded-2xl shadow-sm gap-2">
              <button
                onClick={() => setTerminalView("driver")}
                className={`py-2 px-5 rounded-xl font-display font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  terminalView === "driver" 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                Driver Mobile Interface
              </button>
              <button
                onClick={() => setTerminalView("recruiter")}
                className={`py-2 px-5 rounded-xl font-display font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  terminalView === "recruiter" 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                Fleet Recruiter Interface
              </button>
            </div>
          </div>

          {/* Terminal Screen Shell */}
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden animate-in fade-in duration-300">
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary/5 blur-3xl rounded-full" />
            
            {/* Top terminal controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="ml-2">terminal-session-live.sh</span>
              </span>
              <span>SECURE JWT TERMINAL</span>
            </div>

            {/* 1. Driver View Mockup */}
            {terminalView === "driver" ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
                {/* Left col: Mobile Mock profile card */}
                <div className="sm:col-span-5 bg-slate-850/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-850">
                    <div className="h-10 w-10 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center font-bold">
                      JS
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Jagdish Singh</h4>
                      <p className="text-[10px] text-success font-bold uppercase tracking-wider">Verified Registry</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-400">
                    <p><strong>Mobile:</strong> +91 98765 XXXXX</p>
                    <p><strong>Preferred State:</strong> Punjab</p>
                    <p><strong>Category:</strong> Multi-axle Trailer</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold p-2.5 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Hiring managers can call you directly</span>
                  </div>
                </div>

                {/* Right col: Applied jobs log */}
                <div className="sm:col-span-7 bg-slate-850/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <h4 className="font-display font-bold text-sm mb-3">Live Application Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                      <div>
                        <p className="text-xs font-bold">VRL Logistics Ltd.</p>
                        <p className="text-[9px] text-slate-500">Route: Bangalore-Mumbai</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Applied</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                      <div>
                        <p className="text-xs font-bold">SafeExpress Cargo</p>
                        <p className="text-[9px] text-slate-500">Route: Pune-Delhi Transit</p>
                      </div>
                      <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">Called</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-4 text-center">
                    Notifications are pushed instantly to your mobile browser.
                  </p>
                </div>
              </div>
            ) : (
              // 2. Recruiter View Mockup
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <h4 className="font-display font-bold text-sm">Verified Driver Registry Directory</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">Filter: Punjab</span>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">Vehicle: Trailer</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Driver row 1 */}
                  <div className="flex items-center justify-between p-3 bg-slate-850/60 hover:bg-slate-850 border border-slate-800/80 rounded-xl transition-all">
                    <div>
                      <p className="font-bold text-white">Jagdish Singh</p>
                      <p className="text-[9px] text-slate-400">Exp: 8 Years | License HMV verified</p>
                    </div>
                    <a 
                      href="tel:+919876543299" 
                      className="py-1.5 px-3 bg-primary hover:bg-primary-hover text-[10px] font-bold text-white rounded-lg shadow-sm transition-all"
                    >
                      Call Driver
                    </a>
                  </div>
                  {/* Driver row 2 */}
                  <div className="flex items-center justify-between p-3 bg-slate-850/60 hover:bg-slate-850 border border-slate-800/80 rounded-xl transition-all">
                    <div>
                      <p className="font-bold text-white">Sandeep Singh</p>
                      <p className="text-[9px] text-slate-400">Exp: 6 Years | License HMV verified</p>
                    </div>
                    <a 
                      href="tel:+919988776655" 
                      className="py-1.5 px-3 bg-primary hover:bg-primary-hover text-[10px] font-bold text-white rounded-lg shadow-sm transition-all"
                    >
                      Call Driver
                    </a>
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-500 text-center pt-2">
                  *Only verified and logged-in recruiters can access calling parameters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Driver Story Section with 3D Card */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image Column (3D Interactive Parallax Card) */}
            <div className="lg:col-span-5 flex justify-center perspective-1000">
              <div className="relative w-full max-w-sm h-80 rounded-3xl group border border-gray-255 tilt-3d preserve-3d cursor-pointer bg-white p-3">
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-secondary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main Driver Image */}
                <img 
                  src="/images/driver.jpg" 
                  alt="Verified professional Indian truck driver smiling"
                  className="w-full h-full object-cover rounded-2xl transform scale-100 group-hover:scale-[1.01] transition-transform duration-500"
                />
                
                {/* Floating Verified Badge */}
                <div className="absolute bottom-6 left-6 right-6 translate-z-40 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl text-center shadow-lg transition-all">
                  <span className="text-[10px] font-extrabold text-success flex items-center justify-center gap-1.5 uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 animate-pulse" />
                    Verified Driver Profile
                  </span>
                </div>
              </div>
            </div>

            {/* Description Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-secondary text-xs font-bold uppercase tracking-wider bg-secondary/15 px-3 py-1 rounded-full">
                Direct Channels
              </span>
              <h2 className="font-display font-extrabold text-3xl text-dark">
                Get Hired Directly by Top Logistics Fleets
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                Driver Adda cuts out middle agency margins. Once registered, your state preferences are matched automatically with active transport coordinators looking for heavy lorry and container drivers. No fees, no resumes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-6 py-3.5 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Create Driver Profile
                </button>
                <Link
                  href="/jobs"
                  className="px-6 py-3.5 font-bold text-gray-700 bg-white border border-gray-200 hover:bg-slate-50 rounded-xl transition-all text-center"
                >
                  View Active Jobs
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Available Driver Jobs Section */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div className="text-center sm:text-left space-y-2 mb-6 sm:mb-0">
              <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                Active Listings
              </span>
              <h2 className="font-display font-extrabold text-3xl text-dark">
                Hot Driving Openings
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View All Driving Jobs</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white border border-gray-150 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* States We Serve */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-secondary text-xs font-bold uppercase tracking-wider bg-secondary/15 px-3 py-1 rounded-full">
              Operational Footprint
            </span>
            <h2 className="font-display font-extrabold text-3xl text-dark">
              States We Serve
            </h2>
            <p className="text-gray-500 text-sm">
              We connect fleet operators with drivers in all major commercial hubs and transportation networks across India.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {statesServed.map((state) => (
              <div
                key={state}
                className="bg-slate-50 border border-gray-250 px-5 py-3 rounded-xl shadow-sm text-sm font-bold text-slate-700 flex items-center space-x-2 hover:bg-white hover:border-primary transition-all duration-200"
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Section */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="font-display font-extrabold text-3xl text-dark">Get Your Marketing QR</h2>
            <p className="text-gray-500 text-sm">
              Simulate scanning the QR code that connects drivers to the database.
            </p>
          </div>
          <QRScanner />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-3xl text-center text-dark mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-100/50 transition-colors"
                >
                  <span className="font-display font-bold text-base text-dark">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${activeFaq === idx ? "transform rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-gray-500 border-t border-gray-200 pt-4 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-extrabold text-3xl text-dark">Have Questions or Need Help?</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Our support desk is operational 24/7 for transport managers and commercial vehicle drivers. Call us or send us a message.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="tel:+919876543210"
              className="py-3.5 px-6 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-md transition-colors"
            >
              Call Support: +91 98765 43210
            </Link>
            <Link
              href="mailto:support@driveradda.in"
              className="py-3.5 px-6 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-slate-150 transition-colors bg-white"
            >
              Email support@driveradda.in
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal Dialog Overlay with Live-Filling Digital ID Card */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Background glow decoration */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            
            <button
              onClick={closeRegisterModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl cursor-pointer z-20"
            >
              ×
            </button>

            {/* Left Column: Live-Filling Digital ID Card Preview (Stunning Custom Feature) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider text-center">Your Live Driver ID Card</p>
              
              {/* The Physical Card Layout */}
              <div className="w-full max-w-[280px] aspect-[1.58/1] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
                {/* Chip and logo overlay */}
                <div className="absolute -top-12 -right-12 h-24 w-24 bg-primary/5 rounded-full blur-xl" />
                
                {/* Card Branding */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4 text-primary transform -scale-x-100" />
                    <span className="font-display font-extrabold text-[11px] tracking-tight text-white">
                      Driver<span className="text-primary">Adda</span>
                    </span>
                  </div>
                  <span className="text-[7px] font-bold text-success bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">
                    Digital Pass
                  </span>
                </div>

                {/* Driver parameters */}
                <div className="space-y-1.5 mt-2">
                  <div>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-wide">Driver Name</p>
                    <p className="text-xs font-bold text-white tracking-wide truncate">
                      {regName.trim() || "YOUR NAME"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-850">
                    <div>
                      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-wide">Mobile</p>
                      <p className="text-[10px] font-mono text-slate-300">
                        {regMobile ? `+91 ${regMobile}` : "+91 XXXXX XXXXX"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-wide">State</p>
                      <p className="text-[10px] font-bold text-primary truncate">
                        {regState || "NOT SELECTED"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Chip simulation */}
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-850">
                  <div className="h-3 w-4 bg-yellow-600/35 border border-yellow-600/50 rounded-sm" />
                  <span className="text-[6px] font-mono text-slate-600">ID-SYS-2026</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center max-w-xs">
                As you type in the form, your Digital Driver ID updates in real-time.
              </p>
            </div>

            {/* Right Column: Registration Form */}
            <div className="md:col-span-7 relative z-10">
              {!regSuccess ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="text-center md:text-left pb-2 border-b border-slate-800">
                    <h3 className="font-display font-extrabold text-2xl text-white">Create Profile</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No credentials, no paperwork. Complete in 30 seconds.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="reg-name" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      Full Name (पूरा नाम)
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label htmlFor="reg-mobile" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      Mobile Number (मोबाइल नंबर)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-semibold text-sm select-none">
                        +91
                      </span>
                      <input
                        id="reg-mobile"
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter 10 digits"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-semibold tracking-wide transition-all"
                      />
                    </div>
                  </div>

                  {/* Working State */}
                  <div className="space-y-1">
                    <label htmlFor="reg-state" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      Working State (राज्य)
                    </label>
                    <select
                      id="reg-state"
                      required
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-500">Select state where you work</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {regError && (
                    <p className="text-red-400 text-xs font-semibold bg-red-950/40 border border-red-900 p-2.5 rounded-xl text-center">
                      {regError}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3.5 px-4 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all duration-150 flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{regLoading ? "Registering..." : "Submit Registration"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 relative z-10 animate-in zoom-in-95 duration-300">
                  <div className="mx-auto h-14 w-14 bg-success/15 border border-success/30 rounded-2xl flex items-center justify-center text-success animate-bounce">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-xl text-white">Success! (सफलता)</h3>
                    <p className="text-xs text-slate-400">
                      Your profile is created. Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
