import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display font-extrabold text-3xl text-dark mb-6">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: July 28, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>
            At <strong>Driver Adda</strong>, accessible from driveradda.in, one of our main priorities is the privacy of our visitors and registered drivers. This Privacy Policy document contains types of information that is collected and recorded by Driver Adda and how we use it.
          </p>

          <h2 className="font-display font-bold text-lg text-dark pt-4">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide voluntarily when registering on our platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Driver Name</strong>: To identify you to logistics employers.</li>
            <li><strong>Mobile Number</strong>: So transport managers can call you directly for driving assignments.</li>
            <li><strong>Working State</strong>: To match you with relevant transport corridors and jobs in your preferred state.</li>
          </ul>

          <h2 className="font-display font-bold text-lg text-dark pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide, operate, and maintain our driver database and matching service.</li>
            <li>Enable verified logistics partners to search and connect with you for driver recruitment.</li>
            <li>Improve the functionality and safety of the Driver Adda platform.</li>
            <li>Communicate with you for helpline support.</li>
          </ul>

          <h2 className="font-display font-bold text-lg text-dark pt-4">3. Database Security & Sharing</h2>
          <p>
            We implement strict technical security measures (including JWT auth and DB row-level controls) to ensure your driver registry card is never exposed publicly. Your phone number is only shared with background-verified transport and logistics companies who are logged in to our secure recruitment terminal.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
