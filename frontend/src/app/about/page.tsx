import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Truck, ShieldCheck, MapPin, Users, Target, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,95,255,0.1),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
              Our Journey
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
              About Driver Adda
            </h1>
            <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
              We are India's trusted registry and recruitment platform dedicated strictly to professional heavy vehicle, lorry, and trailer drivers.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-dark">
              Connecting India's Logistics Backbone
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              India's transportation and logistics fleets are growing rapidly, yet finding qualified, verified drivers remains one of the largest challenges for fleet managers. Drivers, on the other hand, face commissions and lack direct access to reputable employers.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Driver Adda was created as a zero-middlemen solution. By simplifying registration down to under 30 seconds (no email, no complex resumes required), we help drivers showcase their state preferences and phone numbers directly to major logistics networks.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-150">
              <div className="flex items-start space-x-2.5">
                <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-dark">Our Mission</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Build India's largest verified registry of logistics drivers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Trophy className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-dark">Our Goal</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Empower truck drivers with better routes, transparent pay, and zero fees.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Container Graphic */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-3xl rounded-full" />
            <div className="relative space-y-6">
              <div className="inline-flex p-3 bg-primary/15 rounded-2xl text-primary">
                <Truck className="h-8 w-8 transform -scale-x-100" />
              </div>
              <h3 className="font-display font-extrabold text-xl">Platform Core Pillars</h3>
              
              <ul className="space-y-4 text-xs text-slate-350">
                <li className="flex items-start space-x-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Driver Verification:</strong> We perform licensing checks to ensure safety compliance and road safety records.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Users className="h-4.5 w-4.5 text-secondary shrink-0 mt-0.5" />
                  <span><strong>Recruitment Transparency:</strong> Drivers deal directly with logistics companies. No commissions or recruitment agencies.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <MapPin className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>National Reach:</strong> Serving all national corridors from East-West transit routes to South-North shipping lanes.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
