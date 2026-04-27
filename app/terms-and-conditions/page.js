import React from 'react';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Terms & Conditions | CovGen',
  description: 'Review the terms and conditions for using the CovGen AI cover letter generator.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Terms & Conditions
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <p className="text-sm text-slate-500 italic">Last Updated: April 27, 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1. Agreement to Terms</h2>
            <p>
              By accessing or using CovGen, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>2. Description of Service</h2>
            <p>
              CovGen provides an AI-powered tool designed to help users generate professional cover letters based on provided job descriptions and personal input. The service is provided "as is" and intended to assist in the job application process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>3. No Guarantee of Success</h2>
            <p>
              While CovGen aims to provide high-quality cover letters, we do not guarantee job interviews, employment, or any specific outcome from using the generated content. Success in job applications depends on many factors outside the scope of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4. User Responsibility</h2>
            <p>
              Users are solely responsible for the accuracy and appropriateness of the information they provide to the service. You must review and edit all AI-generated content before submission to employers to ensure it accurately reflects your qualifications and experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>5. Account Usage</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. Malicious use, automated scraping, or attempts to bypass credit limits are strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>6. Limitation of Liability</h2>
            <p>
              In no event shall CovGen or its founder be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CovGen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these terms at any time. It is your responsibility to check this page periodically for changes.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
