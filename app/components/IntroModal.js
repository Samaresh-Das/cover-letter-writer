"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
    {
        title: "🚧 Welcome to CovGen Beta",
        description:
            "This app is still under active development. You're using the core functionality — cover letter generation based on AI. Some components are placeholders, but the heart is working!",
    },
    {
        title: "🛠 Upcoming Features",
        description:
            "Soon, you'll see user profiles, saved letters, mobile apps, voice-to-cover-letter input, and more! Stay tuned and be part of this journey 🚀",
    },
];

export default function IntroModal() {
    const [show, setShow] = useState(false);
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined" && !sessionStorage.getItem("intro_shown")) {
            setShow(true);
            sessionStorage.setItem("intro_shown", "true");
        }
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="max-w-md w-full mx-4 bg-white rounded-2xl p-8 text-gray-900 relative z-10 shadow-2xl"
                >
                    <h2 className="text-xl font-semibold mb-3 text-gray-900">
                        {slides[slide].title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{slides[slide].description}</p>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setSlide((s) => Math.max(0, s - 1))}
                            disabled={slide === 0}
                            className="px-5 py-2 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-all duration-200"
                        >
                            ⬅ Prev
                        </button>
                        {slide < slides.length - 1 ? (
                            <button
                                onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
                                className="px-5 py-2 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            >
                                Next ➡
                            </button>
                        ) : (
                            <button
                                onClick={() => setShow(false)}
                                className="px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                            >
                                Let's Go 🚀
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
