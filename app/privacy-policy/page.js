import React from 'react';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Privacy Policy | CovGen',
  description: 'Learn how CovGen collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Privacy Policy
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <p className="text-sm text-slate-500 italic">Last Updated: April 27, 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1. Introduction</h2>
            <p>
              Welcome to CovGen. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at support@covgen.ai.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>2. Data We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, and authentication data (Google ID).</li>
              <li><strong>Usage Content:</strong> Resume content, professional experience, and job descriptions you provide for AI generation.</li>
              <li><strong>Payment Data:</strong> We collect data necessary to process your payment if you make purchases, such as your payment instrument number. All payment data is stored by our payment processor (e.g., Razorpay/Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>3. How We Use Your Data</h2>
            <p>We use personal information collected via our App for a variety of business purposes described below:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To provide the AI cover letter generation service.</li>
              <li>To manage user accounts and provide customer support.</li>
              <li>To process transactions and manage credit balances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4. Data Storage and Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any type of misuse or interception.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>5. We Do Not Sell Your Data</h2>
            <p>
              We do not share, sell, rent, or trade any of your information with third parties for their promotional purposes. Your data is used exclusively to provide and improve the CovGen service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>6. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <strong>support@covgen.ai</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
