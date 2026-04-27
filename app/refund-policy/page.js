import React from 'react';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Refund Policy | CovGen',
  description: 'Review the refund and cancellation policy for CovGen credits and subscriptions.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Refund & Cancellation Policy
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <p className="text-sm text-slate-500 italic">Last Updated: April 27, 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>1. Credit-Based System</h2>
            <p>
              CovGen operates on a credit-based system where users purchase credits to generate AI-powered cover letters. One credit is consumed per standard generation, and two credits are consumed for premium model generations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>2. Refund Eligibility</h2>
            <p>
              Due to the digital nature of our service and the immediate consumption of AI processing resources, <strong>all credit pack purchases are final and non-refundable</strong> once any portion of the credits has been used.
            </p>
            <p className="mt-4">
              If you have purchased credits and have not used any of them, you may request a refund within 7 days of purchase by contacting us at support@covgen.ai.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>3. Subscriptions</h2>
            <p>
              Subscriptions (such as the Pro Plan) provide a recurring allocation of credits each month. You can cancel your subscription at any time via your account settings. Upon cancellation, you will continue to have access to your subscription benefits until the end of your current billing cycle.
            </p>
            <p className="mt-4">
              Refunds for subscription payments are handled on a case-by-case basis and are typically only granted in the event of technical failure of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4. Billing Errors</h2>
            <p>
              If you believe you have been charged incorrectly, please reach out to us immediately at <strong>support@covgen.ai</strong>. We will review your transaction and process any necessary corrections as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>5. Contact for Billing</h2>
            <p>
              For all refund requests or billing-related inquiries, please email <strong>support@covgen.ai</strong> with your account email and transaction details.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
