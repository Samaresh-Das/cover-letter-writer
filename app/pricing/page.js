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

    const handlePurchasePack = async (packId) => {
        const token = localStorage.getItem('token');
        if (!token) return toast.error("Please login to purchase credits.");

        setIsLoading({ ...isLoading, [packId]: true });
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pricing/purchase-pack`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ packId })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(`Purchased! You now have ${data.creditsRemaining} credits.`);
                // Update local user state
                if (user) {
                    const updatedUser = { ...user, credits: data.creditsRemaining };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    window.dispatchEvent(new Event("userUpdated"));
                }
            } else {
                toast.error(data.message || "Purchase failed.");
            }
        } catch (err) {
            toast.error("Network error during purchase.");
        } finally {
            setIsLoading({ ...isLoading, [packId]: false });
        }
    };

    const handleSubscribe = async () => {
        const token = localStorage.getItem('token');
        if (!token) return toast.error("Please login to subscribe.");

        setIsLoading({ ...isLoading, 'pro': true });
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pricing/subscribe`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success("Welcome to Pro Plan! You now have 200 credits.");
                if (user) {
                    const updatedUser = { ...user, credits: data.creditsRemaining, plan: data.plan };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    window.dispatchEvent(new Event("userUpdated"));
                }
            } else {
                toast.error(data.message || "Subscription failed.");
            }
        } catch (err) {
            toast.error("Network error during subscription.");
        } finally {
            setIsLoading({ ...isLoading, 'pro': false });
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
                            onAction={() => {}}
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
                            onAction={handleSubscribe}
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
                            onAction={() => handlePurchasePack('pack_40')}
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
                            onAction={() => handlePurchasePack('pack_100')}
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
                            onAction={() => handlePurchasePack('pack_250')}
                            isLoading={isLoading['pack_250']}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
