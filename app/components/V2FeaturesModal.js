"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRocket, FaFileAlt, FaMagic, FaDownload } from "react-icons/fa";

const features = [
    {
        icon: <FaMagic className="text-blue-500" />,
        title: "AI Resume Analysis",
        description: "Get instant feedback and insights to improve your resume."
    },
    {
        icon: <FaFileAlt className="text-purple-500" />,
        title: "JD-Based Resume Customization",
        description: "Automatically tailor your resume to match any job description using AI."
    },
    {
        icon: <FaDownload className="text-emerald-500" />,
        title: "Instant PDF Downloads",
        description: "Generate and download polished, ready-to-send resumes in seconds."
    }
];

export default function V2FeaturesModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-v2-modal', handleOpen);
        return () => window.removeEventListener('open-v2-modal', handleOpen);
    }, []);

    const onClose = () => setIsOpen(false);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <FaRocket />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Coming in v2.0
                            </h2>
                        </div>
                        <p className="text-slate-600 font-medium">
                            Smarter tools to level up your job applications.
                        </p>
                        
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Features List */}
                    <div className="p-8 space-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-slate-50 flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full tracking-wider uppercase">
                            Coming Soon
                        </span>
                        <button 
                            onClick={onClose}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
