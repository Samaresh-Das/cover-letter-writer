"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaReceipt, FaCheckCircle, FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PurchasesPage() {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/auth");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch purchase history");
                }

                const data = await res.json();
                setHistory(data.history || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [router]);

    // Skeleton Loader Component
    const SkeletonRow = () => (
        <div className="p-5 border-b border-border-col animate-pulse bg-white/50">
            <div className="md:hidden flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="col-span-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="col-span-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="col-span-1">
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="col-span-2 flex justify-end">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-surface rounded-3xl shadow-xl border border-red-100 flex flex-col items-center max-w-md text-center"
                >
                    <p className="text-red-500 font-medium mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        Retry
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-bg text-text px-4 py-24 md:px-10">
            <section className="max-w-5xl mx-auto space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                            <FaHistory className="text-primary" />
                            Purchase History
                        </h1>
                        <p className="text-muted mt-2 font-medium">Your recent transactions and credit top-ups.</p>
                    </div>
                </motion.div>

                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-surface border border-border-col rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-slate-50/50 border-b border-border-col font-bold text-sm text-slate-500">
                            <div className="col-span-3">Date</div>
                            <div className="col-span-4">Description</div>
                            <div className="col-span-2">Credits</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </motion.div>
                ) : history.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="py-20 text-center bg-surface/50 backdrop-blur-xl border-2 border-dashed border-border-col rounded-3xl shadow-sm"
                    >
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <FaReceipt className="text-4xl text-blue-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-800">No purchases yet</h3>
                        <p className="text-muted mb-8 max-w-sm mx-auto">It looks like you haven&apos;t made any purchases. Top up your credits to supercharge your cover letters!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/pricing")}
                            className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 text-white rounded-full font-extrabold shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.4)] transition-all"
                        >
                            View Pricing Plans
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl"
                    >
                        {/* Desktop Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-slate-50/80 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
                            <div className="col-span-3">Date</div>
                            <div className="col-span-4">Description</div>
                            <div className="col-span-2">Credits Added</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {/* History Items */}
                        <div className="divide-y divide-slate-100">
                            {history.map((tx, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={tx._id} 
                                    className="p-5 hover:bg-slate-50/50 transition-colors group"
                                >
                                    {/* Mobile View Layout */}
                                    <div className="md:hidden flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-slate-800 leading-tight pr-4">{tx.description.split("—")[0]}</div>
                                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg whitespace-nowrap shadow-sm">
                                                <FaCheckCircle /> Paid
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm mt-1">
                                            <div className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">+{tx.amount} Cr</div>
                                            <div className="font-bold text-slate-700 flex items-center">
                                                <FaRupeeSign className="text-[10px] mr-0.5" />
                                                {tx.moneyAmount ? tx.moneyAmount : "N/A"}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end mt-2 pt-3 border-t border-slate-100">
                                            <div className="text-xs text-slate-500 font-medium">
                                                {new Date(tx.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })} • {new Date(tx.createdAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                                                {tx.razorpayPaymentId?.split("_")[1]?.substring(0, 8)}...
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop View Layout */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3">
                                            <div className="font-bold text-slate-700">
                                                {new Date(tx.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                            <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(tx.createdAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="font-bold text-slate-800 truncate" title={tx.description}>
                                                {tx.description.split("—")[0]}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ID: {tx.razorpayPaymentId}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="inline-flex items-center justify-center font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl shadow-sm">
                                                +{tx.amount}
                                            </span>
                                        </div>
                                        <div className="col-span-1">
                                            <span className="inline-flex items-center font-bold text-slate-700">
                                                <FaRupeeSign className="text-xs mr-0.5 text-slate-400" />
                                                {tx.moneyAmount ? tx.moneyAmount : "N/A"}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                                <FaCheckCircle className="w-3.5 h-3.5" />
                                                Paid
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </section>
        </main>
    );
}
