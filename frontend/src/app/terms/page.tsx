import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display font-extrabold text-3xl text-dark mb-6">Terms & Conditions</h1>
        <p className="text-xs text-gray-400 mb-8">Last Updated: July 28, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <p>
            Welcome to <strong>Driver Adda</strong>! These terms and conditions outline the rules and regulations for the use of Driver Adda's Website, located at driveradda.in.
          </p>

          <h2 className="font-display font-bold text-lg text-dark pt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Driver Adda if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="font-display font-bold text-lg text-dark pt-4">2. Driver Eligibility</h2>
          <p>
            Registration is strictly restricted to professional heavy vehicle, lorry, container, and commercial driver individuals. You must possess a valid Indian Heavy Motor Vehicle (HMV) or commercial driving license to offer your services to transport companies on our platform.
          </p>

          <h2 className="font-display font-bold text-lg text-dark pt-4">3. Accuracy of Registry Information</h2>
          <p>
            By registering, you guarantee that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The mobile number provided is active and belongs to you.</li>
            <li>Your name matches your license record.</li>
            <li>You will maintain a high standard of professional driving integrity.</li>
          </ul>

          <h2 className="font-display font-bold text-lg text-dark pt-4">4. Limitation of Liability</h2>
          <p>
            Driver Adda acts as a registry database matching platform. We are not direct employers and do not act as transport agencies. We are not liable for dispute settlements, vehicle damages, or salary payment negotiations between drivers and logistics companies.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
