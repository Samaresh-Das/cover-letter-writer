'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaUndoAlt, FaLifeRing } from 'react-icons/fa';
import { Navbar } from '../../components/Navbar';

/**
 * ── FailedContent Component ──
 * 
 * Handles the display of transaction failures.
 * 
 * CRITICAL FLOW OVERVIEW:
 * 1. The user gets redirected here by our backend's `redirectCallback` if verification fails.
 * 2. The URL query parameter `reason` contains the specific error encountered (e.g., `signature_mismatch`).
 * 3. We map the error reason to an understandable message to guide the customer.
 */
function FailedContent() {
    const searchParams = useSearchParams();
    // Parse the reason passed from the backend query parameters
    const reason = searchParams.get('reason') || 'unknown';

    /**
     * getReasonMessage
     * 
     * Translates backend error identifiers into human-friendly explanations.
     * Prevents displaying scary system error logs while still remaining transparent.
     */
    const getReasonMessage = (code) => {
        switch (code) {
            case 'signature_mismatch':
                return 'Payment verification failed due to a security signature mismatch. If your money was debited, it will be refunded automatically within 3-5 business days.';
            case 'order_not_found':
                return 'The corresponding order could not be located in our system. Please check your transaction status or contact support.';
            case 'missing_params':
                return 'The payment response was missing crucial transaction identifiers. Please try again.';
            case 'user_not_found':
                return 'Authentication context was lost during redirection. Please login and try again.';
            case 'server_error':
                return 'Our servers encountered an issue while validating your transaction. If money was debited, it is safe and will be credited/refunded shortly.';
            default:
                return 'The transaction was cancelled or declined by the bank/payment gateway. No charges were made.';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 relative overflow-hidden text-center"
        >
            {/* Background red glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Red Error Mark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 text-red-500 mb-6 shadow-inner"
            >
                <FaTimesCircle className="h-12 w-12" />
            </motion.div>

            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Payment Failed
            </h1>
            
            {/* Error Code Pill */}
            <span className="inline-block bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full text-xs mb-6 uppercase tracking-wider">
                Error Code: {reason}
            </span>

            {/* Descriptive message mapping the failure reason */}
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                {getReasonMessage(reason)}
            </p>

            {/* Safety Guarantee Callout Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-8 text-left text-xs text-slate-500 flex items-start gap-3">
                <span className="text-base">🛡️</span>
                <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Your Money is Safe</span>
                    If any money was debited from your account, it is completely secure and will be automatically reverted back by your bank within a few days.
                </div>
            </div>

            {/* User Action Options */}
            <div className="space-y-3">
                {/* 1. Retry Checkout (sends them back to pricing page to start again) */}
                <Link href="/pricing">
                    <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-xl shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                        <FaUndoAlt className="group-hover:-rotate-45 transition-transform" />
                        Retry Payment
                    </button>
                </Link>
                
                {/* 2. Direct Support Link */}
                <Link href="/contact">
                    <button className="w-full py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                        <FaLifeRing />
                        Contact Support
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}

/**
 * ── PaymentFailedPage Wrapper ──
 * 
 * Next.js page component.
 * Evaluates in a `<Suspense>` boundary since search parameter retrieval (`useSearchParams`) 
 * depends on client-side routing and queries.
 */
export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
            <Navbar />

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={
                    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
                        <p className="text-slate-500 text-sm">Loading failure details...</p>
                    </div>
                }>
                    <FailedContent />
                </Suspense>
            </main>
        </div>
    );
}
