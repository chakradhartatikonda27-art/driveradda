import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.08),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="text-secondary text-xs font-bold uppercase tracking-wider bg-secondary/15 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              Contact Support
            </h1>
            <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
              We are available 24/7 for driver assistance, operator inquiries, and verification support.
            </p>
          </div>
        </section>

        {/* Contact Info grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-dark">Call Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect directly with our driver helpdesk. We support Telugu, Hindi, and English.
              </p>
            </div>
            <a 
              href="tel:+919876543210" 
              className="text-sm font-bold text-primary hover:underline"
            >
              +91 98765 43210
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-dark">Email Inquiries</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Send us partnership requests, verification documents, or general feedback.
              </p>
            </div>
            <a 
              href="mailto:support@driveradda.in" 
              className="text-sm font-bold text-primary hover:underline"
            >
              support@driveradda.in
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-dark">Corporate Office</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our main registration desk is located inside the Noida logistics hub.
              </p>
            </div>
            <span className="text-sm font-bold text-gray-900">
              Sector 62, Noida, Uttar Pradesh
            </span>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
