"use client";

import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "../components/Navbar";

const TYPE_CONFIG = {
    generation:         { icon: "✨", color: "text-amber-600",  bg: "bg-amber-50",  label: "Generation" },
    jd_extraction:      { icon: "📋", color: "text-blue-600",   bg: "bg-blue-50",   label: "JD Extract" },
    razorpay_payment:   { icon: "💳", color: "text-green-600",  bg: "bg-green-50",  label: "Purchase" },
    subscription_reset: { icon: "🔄", color: "text-purple-600", bg: "bg-purple-50", label: "Reset" },
    refund:             { icon: "↩️", color: "text-teal-600",   bg: "bg-teal-50",   label: "Refund" },
    plan_expired:       { icon: "⏰", color: "text-red-600",    bg: "bg-red-50",    label: "Expired" },
    bonus:              { icon: "🎁", color: "text-pink-600",   bg: "bg-pink-50",   label: "Bonus" },
};

function TransactionRow({ tx, index }) {
    const cfg = TYPE_CONFIG[tx.type] || { icon: "•", color: "text-slate-500", bg: "bg-slate-50", label: tx.type };
    const isCredit = tx.amount > 0;
    const date = new Date(tx.createdAt);
    const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors items-center"
        >
            {/* Type */}
            <div className="col-span-1 flex items-center gap-2.5">
                <span className={`w-9 h-9 flex items-center justify-center rounded-xl text-base ${cfg.bg} shadow-sm`}>{cfg.icon}</span>
                <span className={`md:hidden text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
            </div>
            {/* Description */}
            <div className="col-span-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{tx.description || cfg.label}</p>
            </div>
            {/* Source */}
            <div className="col-span-2 flex justify-center">
                {tx.usedPlan ? (
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        tx.usedPlan === "pro" ? "bg-purple-50 text-purple-600 border border-purple-200" :
                        tx.usedPlan === "free" ? "bg-slate-100 text-slate-500 border border-slate-200" :
                        "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}>
                        {tx.usedPlan}
                        {tx.sourceRemaining != null && (
                            <span className="ml-1 opacity-70">({tx.sourceRemaining} left)</span>
                        )}
                    </span>
                ) : (
                    <span className="text-[10px] text-slate-300">—</span>
                )}
            </div>
            {/* Credits */}
            <div className="col-span-2 text-center">
                <span className={`text-sm font-black ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : ""}{tx.amount}
                </span>
            </div>
            {/* Date */}
            <div className="col-span-3 text-right">
                <span className="text-[11px] text-slate-400 font-medium">{dateStr}, {timeStr}</span>
            </div>
        </motion.div>
    );
}

export default function UsagePage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 20;

    const fetchUsage = useCallback(async (p) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
                return;
            }
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/usage?page=${p}&limit=${limit}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
                setPage(data.page || 1);
            }
        } catch (err) {
            console.error("Failed to fetch usage", err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchUsage(1);
    }, [fetchUsage]);

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        fetchUsage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-slate-900"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                            📊 Credit Usage
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm">
                            Full transparency — every credit earned, spent, and refunded.
                            {totalCount > 0 && <span className="ml-2 font-semibold text-slate-500">{totalCount} total transactions</span>}
                        </p>
                    </motion.div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <p className="text-slate-400 text-sm mt-4">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm"
                        >
                            <p className="text-5xl mb-4">📭</p>
                            <p className="text-slate-500 font-semibold">No transactions yet</p>
                            <p className="text-slate-400 text-sm mt-1">Generate a cover letter to see your first transaction here.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden"
                        >
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-1">Type</div>
                                <div className="col-span-4">Description</div>
                                <div className="col-span-2 text-center">Source</div>
                                <div className="col-span-2 text-center">Credits</div>
                                <div className="col-span-3 text-right">Date</div>
                            </div>
                            {/* Rows */}
                            <div className="divide-y divide-slate-100">
                                {transactions.map((tx, i) => (
                                    <TransactionRow key={tx._id || i} tx={tx} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-2 mt-8"
                        >
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <FaChevronLeft className="w-3 h-3" />
                            </button>

                            {getPageNumbers().map((p) => (
                                <button
                                    key={p}
                                    onClick={() => goToPage(p)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition cursor-pointer ${
                                        p === page
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= totalPages}
                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <FaChevronRight className="w-3 h-3" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>
        </>
    );
}
