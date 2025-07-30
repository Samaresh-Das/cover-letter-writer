"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryModal({ open, onClose, jd, letter }) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0  backdrop-blur-sm"
                    onClick={onClose}
                />


                {/* Modal Box */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 max-w-3xl w-full bg-transparent/70 border border-primary/20 text-text backdrop-blur-lg rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-muted hover:text-primary text-xl"
                    >
                        &times;
                    </button>

                    <h2 className="text-2xl font-semibold text-primary mb-4">📄 Cover Letter</h2>

                    <div className="text-sm text-muted mb-2">Job Description:</div>
                    <div className="text-sm bg-black/20 p-4 rounded-lg text-white whitespace-pre-wrap mb-6 max-h-40 overflow-y-auto">
                        {jd}
                    </div>

                    <div className="text-sm text-muted mb-2">Generated Letter:</div>
                    <div className="text-sm bg-black/30 p-4 rounded-lg text-white whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {letter}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
