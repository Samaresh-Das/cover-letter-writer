'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PricingCard } from '../components/pricing/PricingCard';
import { toast } from 'react-hot-toast';

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        };
        loadUser();
        window.addEventListener('userUpdated', loadUser);
        return () => window.removeEventListener('userUpdated', loadUser);
    }, []);

    /**
     * ── initiateRazorpayPayment ──
     * 
     * Initiates the checkout process using Razorpay Hosted Checkout (Payment Links API).
     * 1. Fetches a secure payment link from our backend for the selected itemId (e.g. 'pack_40').
     * 2. If successful, redirects the user's browser (window.location.href) directly to
     *    the secure checkout page hosted by Razorpay.
     * 
     * @param {string} itemId - The ID of the item being purchased (e.g. 'pro', 'pack_40')
     */
    const initiateRazorpayPayment = async (itemId) => {
        // Retrieve JWT token for authorizing the order creation
        const token = localStorage.getItem('token');
        if (!token) return toast.error("Please login to make a purchase.");

        // Set local loading state to show loading spinner on the card button
        setIsLoading(prev => ({ ...prev, [itemId]: true }));

        try {
            // ── Step 1: Request Payment Link creation from Backend ──────
            // We pass the itemId. The backend acts as the single source of truth for
            // price values to prevent malicious client-side price tampering.
            const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ itemId })
            });
            const orderData = await orderRes.json();

            // Handle errors (e.g., database failures, auth errors, network timeouts)
            if (!orderRes.ok) {
                toast.error(orderData.message || "Failed to create order.");
                setIsLoading(prev => ({ ...prev, [itemId]: false }));
                return;
            }

            // ── Step 2: Redirect to Razorpay Hosted Checkout ────────────
            // The backend returns a pre-signed Payment Link URL (paymentLink.short_url).
            // We change the window location to this URL, taking the user away from our
            // app to complete the transaction safely on Razorpay's site.
            if (orderData.paymentLinkUrl) {
                window.location.href = orderData.paymentLinkUrl;
            } else {
                toast.error("Invalid payment link received.");
                setIsLoading(prev => ({ ...prev, [itemId]: false }));
            }
        } catch (err) {
            console.error("Payment initiation error:", err);
            toast.error("Network error. Please try again.");
        } finally {
            // Revert loading state regardless of outcome
            setIsLoading(prev => ({ ...prev, [itemId]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Simple, transparent pricing.
                    </h1>
                    <p className="text-lg text-slate-600">
                        Choose the plan that fits your job search needs. No hidden fees.
                    </p>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Subscription Plans</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <PricingCard
                            title="Free Plan"
                            price={0}
                            credits={10}
                            isSubscription={true}
                            features={[
                                "Standard model access",
                                "Basic cover letter generation",
                                "10 credits reset every month",
                                "Standard support"
                            ]}
                            buttonText={(!user?.plan || user?.plan === 'free') ? "Current Plan" : "Included"}
                            isCurrentPlan={!user?.plan || user?.plan === 'free'}
                            onAction={() => { }}
                            isPopular={false}
                        />
                        <PricingCard
                            title="Pro Plan"
                            price={299}
                            credits={200}
                            isSubscription={true}
                            features={[
                                "Access to Premium Models (2x cost)",
                                "Priority generation queue",
                                "200 credits auto-reset monthly",
                                "This is a recurring monthly subscription. You will be billed ₹299 every month until cancelled."
                            ]}
                            badge="Recommended"
                            buttonText={user?.plan === 'pro' ? "Current Plan" : "Upgrade to Pro"}
                            isCurrentPlan={user?.plan === 'pro'}
                            onAction={() => initiateRazorpayPayment('pro')}
                            isPopular={true}
                            isLoading={isLoading['pro']}
                        />
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Need more credits?</h2>
                    <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                        Buy one-time credit packs. Credits are added instantly and never expire.
                        <br className="hidden md:block" />
                        <span className="font-bold text-slate-800">1 standard generation = 1 credit.</span> No hidden charges.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <PricingCard
                            title="Starter Pack"
                            price={49}
                            credits={40}
                            features={[
                                "40 generations on standard model",
                                "Instant delivery",
                                "Never expires"
                            ]}
                            buttonText="Buy Now"
                            onAction={() => initiateRazorpayPayment('pack_40')}
                            isLoading={isLoading['pack_40']}
                        />
                        <PricingCard
                            title="Pro Pack"
                            price={99}
                            credits={100}
                            features={[
                                "100 generations on standard model",
                                "Access to premium models",
                                "Never expires"
                            ]}
                            badge="Most Popular"
                            buttonText="Buy Now"
                            onAction={() => initiateRazorpayPayment('pack_100')}
                            isPopular={true}
                            isLoading={isLoading['pack_100']}
                        />
                        <PricingCard
                            title="Ultra Pack"
                            price={199}
                            credits={250}
                            features={[
                                "250 generations on standard model",
                                "Best price per credit",
                                "Never expires"
                            ]}
                            badge="Best Value"
                            buttonText="Buy Now"
                            onAction={() => initiateRazorpayPayment('pack_250')}
                            isLoading={isLoading['pack_250']}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
