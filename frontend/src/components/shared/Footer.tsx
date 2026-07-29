import Link from "next/link";
import { Truck, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 transform -scale-x-100" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Driver<span className="text-primary">Adda</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              India's Trusted Driver Job Platform. Dedicated to connecting professional heavy truck, container, and commercial drivers with top transport fleets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold font-display mb-4 tracking-wide text-sm uppercase">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">Find Driving Jobs</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Driver Registration</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Driver Dashboard</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold font-display mb-4 tracking-wide text-sm uppercase">Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <span>support@driveradda.in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-secondary shrink-0" />
                <span>Logistics Hub, Sector 62, Noida, UP</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Admin */}
          <div>
            <h3 className="text-white font-semibold font-display mb-4 tracking-wide text-sm uppercase">Legal & Security</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li className="pt-4 border-t border-slate-800">
                <Link href="/admin/login" className="inline-flex items-center text-xs text-slate-500 hover:text-white transition-colors space-x-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Admin Login Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Driver Adda. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center space-x-1">
            <span>Made for Transport & Logistics Fleet Recruitment</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
