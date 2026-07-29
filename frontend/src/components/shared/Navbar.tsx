"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Truck, Key } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center shadow-md">
                <Truck className="h-6 w-6 transform -scale-x-100" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-dark">
                Driver<span className="text-primary">Adda</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              Find Jobs
            </Link>
            <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors flex items-center space-x-1">
              <span>Driver Dashboard</span>
            </Link>
            <Link 
              href="/#register" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-secondary hover:bg-secondary-hover rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100/50 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-all"
          >
            Find Jobs
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-all"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-all"
          >
            Contact
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-all"
          >
            Driver Dashboard
          </Link>
          <div className="pt-2 px-4">
            <Link
              href="/#register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 px-5 text-base font-bold text-white bg-secondary hover:bg-secondary-hover rounded-xl shadow-md transition-all"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
