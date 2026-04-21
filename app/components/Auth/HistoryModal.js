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
                    className="absolute inset-0 bg-black/40"
                    onClick={onClose}
                />

                {/* Modal Box */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 max-w-3xl w-full bg-surface border border-border-col text-text rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
                    style={{ boxShadow: '0px 4px 12px 2px rgba(0,0,0,0.15), 0px 2px 6px 0px rgba(0,0,0,0.2)' }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-5 text-muted hover:text-primary text-xl transition-colors duration-200"
                    >
                        &times;
                    </button>

                    <h2 className="text-2xl font-semibold text-primary mb-4">📄 Cover Letter</h2>

                    <div className="text-sm font-medium text-text mb-2">Job Description:</div>
                    <div className="text-sm bg-bg p-4 rounded-xl text-text whitespace-pre-wrap mb-6 max-h-40 overflow-y-auto border border-border-col">
                        {jd}
                    </div>

                    <div className="text-sm font-medium text-text mb-2">Generated Letter:</div>
                    <div className="text-sm bg-bg p-4 rounded-xl text-text whitespace-pre-wrap max-h-64 overflow-y-auto border border-border-col">
                        {letter}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
