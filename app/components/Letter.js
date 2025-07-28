"use client";
import toast, { Toaster } from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function Letter({ letters, copyToClipboard }) {
    return (
        <div className="w-full md:max-w-6xl py-12 z-10 md:mx-auto md:p-10">
            <Swiper
                modules={[EffectCoverflow, Navigation]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                loop={false}
                // navigation={true}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1.5,
                    slideShadows: false,
                }}
                className="py-8"
            >
                {letters.map((letter, idx) => (
                    <SwiperSlide
                        key={letter.id}
                        className="md:!w-[500px] lg:!w-[600px]  !w-300px !h-[600px] flex justify-center md:mx-auto"
                    >
                        <article className="w-full h-full bg-surface/70 backdrop-blur-lg border border-primary/20 rounded-2xl p-6 shadow-card flex flex-col mx-auto">
                            <header className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    Letter #{letters.length - idx}
                                </h2>
                                <button
                                    onClick={() => { copyToClipboard(letter.text); toast.success("Copied to clipboard"); }}
                                    className="text-sm px-3 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-transform hover:scale-105"
                                >
                                    Copy
                                </button>
                            </header>
                            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary scrollbar-track-surface/50 pr-2">
                                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                    {letter.text}
                                </p>

                            </div>

                            <footer className="mt-4 text-xs text-muted text-right">
                                {new Date(letter.createdAt).toLocaleTimeString()}
                            </footer>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
