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
                className={`w-full h-full rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden transition-all duration-500 ease-out ${isActive ? 'clay-card' : 'bg-white border border-slate-200 shadow-sm opacity-50'}`}
            >
                <header className="flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-widest mb-1 text-blue-600">
                            Draft
                        </span>
                        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Letter #{total - idx}
                        </h2>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(letter.text);
                            toast.success("Copied to clipboard");
                        }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${isActive
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 shadow-sm'
                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                            }`}
                    >
                        Copy Letter
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto pr-3 -mr-3"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#93C5FD transparent" }}
                >
                    <p className="whitespace-pre-wrap break-words text-[15px] md:text-base leading-relaxed text-slate-700 font-medium">
                        {letter.text}
                    </p>
                </div>

                <footer className="mt-5 pt-4 flex justify-between items-center text-[11px] uppercase tracking-widest font-bold text-slate-400 border-t border-slate-100">
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

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => {
        if (!sliderRef?.current) return;
        isDragging.current = true;
        sliderRef.current.classList.add('cursor-grabbing');
        sliderRef.current.classList.remove('snap-x', 'snap-mandatory');
        startX.current = e.pageX - sliderRef.current.offsetLeft;
        scrollLeft.current = sliderRef.current.scrollLeft;
    };

    const onMouseLeaveOrUp = () => {
        if (!isDragging.current || !sliderRef?.current) return;
        isDragging.current = false;
        sliderRef.current.classList.remove('cursor-grabbing');
        sliderRef.current.classList.add('snap-x', 'snap-mandatory');
    };

    const onMouseMove = (e) => {
        if (!isDragging.current || !sliderRef?.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <div className="w-full relative py-8 px-2 overflow-hidden">
            <div
                ref={sliderRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeaveOrUp}
                onMouseUp={onMouseLeaveOrUp}
                onMouseMove={onMouseMove}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 px-[15vw] md:px-[25vw] items-center pb-2 pt-2 cursor-grab"
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
