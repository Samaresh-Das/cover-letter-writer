'use client';
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="relative z-20">
            {/* Gradient Blob Behind Footer */}
            {/* Footer Blob */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[400px] md:w-[700px] md:h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.25),_transparent)] blur-3xl z-0" />


            {/* Footer Content */}
            <div className="relative z-10 bg-surface/60 backdrop-blur-5xl border-t border-primary/20 text-text">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Branding */}
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 text-transparent bg-clip-text drop-shadow-md">
                            CoverLetterGen
                        </h2>
                        <p className="mt-2 text-sm text-muted leading-relaxed italic">
                            Elevate your applications with AI-crafted, job-specific cover letters — styled for impact.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-md font-semibold mb-3 text-primaryLight">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <a href="/" className="hover:text-[#f72585] hover:font-bold transition">Home</a>
                            <a href="/about" className="hover:text-primary transition hover:text-[#f72585] hover:font-bold">About</a>
                            <a href="/contact" className="hover:text-primary transition hover:text-[#f72585] hover:font-bold">Contact Me</a>
                            <a href="/privacy" className="hover:text-primary transition hover:text-[#f72585] hover:font-bold">Privacy Policy</a>
                            <a href="/terms" className="hover:text-primary transition hover:text-[#f72585] hover:font-bold">Terms</a>
                            <a href="/faq" className="hover:text-primary transition hover:text-[#f72585] hover:font-bold">FAQ</a>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-md font-semibold mb-3 text-primaryLight">Socials</h3>
                        <div className="flex space-x-5 text-xl">
                            <motion.a
                                href="https://www.instagram.com/samareshthedev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: 3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-pink-400 hover:text-pink-500 transition"
                            >
                                <FaInstagram />
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/samaresh-d-ab9621212"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: -3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-blue-400 hover:text-blue-500 transition"
                            >
                                <FaLinkedin />
                            </motion.a>
                            <motion.a
                                href="https://portfolio-2-tau-sable.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-purple-300 hover:text-purple-400 transition"
                            >
                                <FaGlobe />
                            </motion.a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-muted py-4">
                    © {new Date().getFullYear()} Samaresh Das. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
