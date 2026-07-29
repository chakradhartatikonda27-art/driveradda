"use client";

import { useState } from "react";
import { QrCode, Smartphone, SmartphoneNfc, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function QRScanner() {
  const [showSimulateInfo, setShowSimulateInfo] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 max-w-2xl mx-auto">
      {/* Visual QR Code Represented as SVG */}
      <div className="relative group shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <svg
          className="h-32 w-32 text-slate-800"
          viewBox="0 0 29 29"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Outer Border Anchors */}
          <path d="M1 1h7v7H1zM21 1h7v7h-7zM1 21h7v7H1z" fill="currentColor" fillOpacity="0.1" />
          {/* Inner Anchor Dots */}
          <path d="M3 3h3v3H3zM23 3h3v3h-3zM3 23h3v3H3z" fill="currentColor" />
          
          {/* Random mock QR lines and pixels */}
          <path d="M10 2h3v1h-3zM16 1h2v3h-2zM12 5h4v1h-4zM10 7h2v2h-2z" fill="currentColor" />
          <path d="M2 10h4v1H2zM7 12h2v3H7zM1 16h4v1H1zM5 18h2v2H5z" fill="currentColor" />
          <path d="M11 11h3v2h-3zM16 10h4v1h-4zM22 11h2v3h-2z" fill="currentColor" />
          <path d="M10 16h2v4h-2zM15 15h4v1h-4zM22 17h4v2h-4z" fill="currentColor" />
          
          {/* Bottom section pixels */}
          <path d="M12 22h4v1h-4zM11 25h3v2h-3zM17 26h4v1h-4zM22 23h5v2h-5z" fill="currentColor" />
        </svg>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Info Context */}
      <div className="space-y-3 text-center md:text-left flex-1">
        <div className="flex items-center justify-center md:justify-start space-x-2">
          <span className="bg-secondary/15 text-secondary text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            Quick Scan Feature
          </span>
          <button 
            type="button"
            onClick={() => setShowSimulateInfo(!showSimulateInfo)} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="How does this work?"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        <h4 className="font-display font-bold text-lg text-dark">
          Scan to Register in 30 Seconds
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          Scanning this QR code from banners, trucks, or cards opens our registration form instantly on any mobile device.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all duration-150 space-x-1"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Simulate Scan (Go to Mobile Form)</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {showSimulateInfo && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-gray-500 animate-in slide-in-from-top-2 duration-200">
            <p className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
              <SmartphoneNfc className="h-3.5 w-3.5 text-primary" />
              How it works on the highway:
            </p>
            We print these QR codes on banners at highway toll plazas, transport hubs (Addas), and trucks. Drivers scan the code, fill 3 simple fields, and instantly join India's largest verified driver pool.
          </div>
        )}
      </div>
    </div>
  );
}
