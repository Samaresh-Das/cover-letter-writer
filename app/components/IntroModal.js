"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
    {
        title: "🚧 Welcome to CovGen Beta",
        description:
            "This app is still under active development. You’re using the core functionality — cover letter generation based on AI. Some components are placeholders, but the heart is working! 💜",
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
        // Only show once per session
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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md w-full mx-4 bg-surface/80 backdrop-blur-lg border border-primary/20 rounded-2xl p-6 shadow-lg text-text relative z-10"
                >
                    <h2 className="text-xl font-semibold mb-2 text-primaryLight">
                        {slides[slide].title}
                    </h2>
                    <p className="text-muted text-sm">{slides[slide].description}</p>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setSlide((s) => Math.max(0, s - 1))}
                            disabled={slide === 0}
                            className="px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 transition"
                        >
                            ⬅ Prev
                        </button>
                        {slide < slides.length - 1 ? (
                            <button
                                onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
                                className="px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition"
                            >
                                Next ➡
                            </button>
                        ) : (
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 rounded-lg text-sm bg-primary text-white hover:opacity-90 transition"
                            >
                                Let’s Go 🚀
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
