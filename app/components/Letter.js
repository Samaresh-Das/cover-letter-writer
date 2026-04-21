"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "motion/react";

function LetterCard({ letter, idx, total, copyToClipboard, isActive }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0 w-[320px] md:w-[500px] lg:w-[600px] h-[600px] snap-center flex justify-center py-6"
            style={{
                transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isActive ? 1 : 0.45,
                transform: isActive ? "scale(1)" : "scale(0.94)",
            }}
        >
            <article
                className="w-full h-full rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden bg-white"
                style={{
                    border: isActive ? "2px solid #1a73e8" : "1px solid #e0e0e0",
                    boxShadow: isActive
                        ? "0 1px 3px rgba(26,115,232,0.12), 0 8px 24px rgba(26,115,232,0.08)"
                        : "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <header className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-1 text-blue-600">
                            Draft
                        </span>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Letter #{total - idx}
                        </h2>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(letter.text);
                            toast.success("Copied to clipboard");
                        }}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${isActive
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200'
                            : 'bg-gray-50 text-gray-400 border border-gray-200'
                            }`}
                    >
                        Copy
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto pr-3 -mr-3"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#dadce0 transparent" }}
                >
                    <p className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed text-gray-700">
                        {letter.text}
                    </p>
                </div>

                <footer className="mt-5 pt-4 flex justify-between items-center text-[10px] uppercase tracking-widest font-medium text-gray-400 border-t border-gray-100">
                    <span>Generated AI Content</span>
                    <span>{new Date(letter.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </footer>
            </article>
        </motion.div>
    );
}

export default function Letter({ letters, copyToClipboard, sliderRef }) {
    const [activeId, setActiveId] = useState(letters[0]?.id ?? null);
    const cardRefs = useRef({});

    useEffect(() => {
        if (letters.length > 0) {
            setActiveId(letters[0].id);
        }
    }, [letters]);

    useEffect(() => {
        const container = sliderRef?.current;
        if (!container) return;

        const visibilityMap = new Map();

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.dataset.letterId;
                    if (id) visibilityMap.set(id, entry.intersectionRatio);
                });

                let bestId = null;
                let maxRatio = 0;

                visibilityMap.forEach((ratio, id) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio;
                        bestId = id;
                    }
                });

                if (bestId && maxRatio > 0) {
                    setActiveId(bestId);
                }
            },
            {
                root: container,
                threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
            }
        );

        Object.values(cardRefs.current).forEach((el) => {
            if (el) obs.observe(el);
        });

        return () => obs.disconnect();
    }, [letters, sliderRef]);

    const setCardRef = useCallback((id, el) => {
        cardRefs.current[id] = el;
    }, []);

    return (
        <div className="w-full relative py-8 px-2 overflow-hidden">
            <div
                ref={sliderRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 px-[15vw] md:px-[25vw] items-center pb-2 pt-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {letters.map((letter, idx) => (
                    <div
                        key={letter.id}
                        ref={(el) => setCardRef(letter.id, el)}
                        data-letter-id={letter.id}
                        className="flex-shrink-0 w-[320px] md:w-[500px] lg:w-[600px] flex"
                    >
                        <LetterCard
                            letter={letter}
                            idx={idx}
                            total={letters.length}
                            copyToClipboard={copyToClipboard}
                            isActive={activeId === letter.id}
                        />
                    </div>
                ))}

                <div className="flex-shrink-0 w-[15vw] md:w-[25vw]" />
            </div>

            {/* Edge fade overlays — pure white */}
            <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }} />
        </div>
    );
}
