'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaCreditCard, FaCoins } from 'react-icons/fa';
import { Navbar } from '../../components/Navbar';

/**
 * ── SuccessContent Component ──
 * 
 * This component handles the core visualization and client-side database synchronization 
 * for a successful transaction.
 * 
 * CRITICAL FLOW OVERVIEW:
 * 1. The user gets redirected here by the backend (redirectCallback) after successful signature verification.
 * 2. The URL contains `orderId` (our DB's payment link ID) and `paymentId`.
 * 3. Immediately upon mounting, the component hits the `/api/users/profile` endpoint to fetch
 *    the user's updated profile (which triggers syncing of the newly bought credits in local storage).
 * 4. It fires a custom event `userUpdated` to notify global state listeners (like Navbar credit counters).
 */
function SuccessContent() {
    // Extract query params passed back from our backend redirect
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || 'N/A';
    const paymentId = searchParams.get('paymentId') || 'N/A';
    
    // UI state for total available user credits and API load state
    const [userCredits, setUserCredits] = useState(null);
    const [loadingSync, setLoadingSync] = useState(true);

    useEffect(() => {
        /**
         * syncUser
         * 
         * Connects with the backend profile API to refresh our client-side state.
         * Without this step, the user's header/credits display wouldn't show their
         * new credits until they manually reloaded the page!
         */
        const syncUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoadingSync(false);
                return;
            }
            try {
                // Fetch the updated profile to sync the credits immediately after payment redirect
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        // 1. Update the local storage with the new user object (with incremented credits)
                        localStorage.setItem('user', JSON.stringify(data.user));
                        // 2. Set state to render the exact newly available credit balance
                        setUserCredits(data.user.credits);
                        // 3. Dispatch global custom event so Navbar, etc., update their credit pill UI instantly
                        window.dispatchEvent(new Event("userUpdated"));
                    }
                }
            } catch (err) {
                console.error("Failed to sync user on success page:", err);
            } finally {
                setLoadingSync(false);
            }
        };

        syncUser();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 relative overflow-hidden text-center"
        >
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 text-green-500 mb-6 shadow-inner"
            >
                <FaCheckCircle className="h-12 w-12" />
            </motion.div>

            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Payment Successful!
            </h1>
            <p className="text-slate-600 mb-8 text-sm">
                Thank you for your purchase! Your order has been successfully processed and your credits have been loaded into your account.
            </p>

            {/* Receipt Details Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mb-8 text-left space-y-3.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction Details</h3>
                
                {/* Display Payment ID */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                        <FaCreditCard className="text-slate-400" />
                        Payment ID
                    </span>
                    <span className="font-mono text-slate-800 font-medium break-all select-all">{paymentId}</span>
                </div>

                {/* Display Order / Link ID */}
                <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
                    <span className="text-slate-500 flex items-center gap-2">
                        <FaCoins className="text-slate-400" />
                        Order ID
                    </span>
                    <span className="font-mono text-slate-800 font-medium break-all select-all">{orderId}</span>
                </div>

                {/* Credit Sync Indicator */}
                {loadingSync ? (
                    <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    userCredits !== null && (
                        <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
                            <span className="text-slate-500 font-semibold">Total Credits Available</span>
                            <span className="text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full text-xs">
                                {userCredits} Credits
                            </span>
                        </div>
                    )
                )}
            </div>

            {/* Navigation Actions */}
            <div className="space-y-3">
                <Link href="/dashboard">
                    <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                        Go to Dashboard
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
                
                <Link href="/contact">
                    <button className="w-full py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all duration-300 cursor-pointer">
                        Need Help?
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}

/**
 * ── PaymentSuccessPage Page Wrapper ──
 * 
 * Next.js page component.
 * Evaluates in a `<Suspense>` boundary since search parameter retrieval (`useSearchParams`) 
 * depends on client-side routing and queries.
 */
export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between">
            <Navbar />

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={
                    <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-500 text-sm">Loading transaction details...</p>
                    </div>
                }>
                    <SuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
