"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Truck, ShieldAlert, Key, User, ChevronLeft } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all credentials");
      return;
    }

    setLoading(true);

    try {
      await api.loginAdmin(username, password);
      // Success: redirect to Admin Dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,95,255,0.08),transparent_50%)] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-white transition-colors space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Site</span>
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
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in to access driver registry & analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-dark border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start space-x-2 bg-red-950/40 border border-red-900 p-3 rounded-xl">
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs font-semibold">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all duration-150 flex items-center justify-center disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            </button>

          </form>

          <div className="border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[10px] text-slate-600">
              Authorized personnel access only. Actions are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
