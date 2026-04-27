'use client';
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/" || pathname === "") return null;

    return (
        <footer className="relative z-20 w-full">
            <div className="bg-white border-t border-gray-200 text-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Branding */}
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">
                            CovGen
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                            Elevate your applications with AI-crafted, job-specific cover letters.
                        </p>
                        <p className="mt-4 text-xs text-gray-400">
                            CovGen is operated by <strong>Samaresh Das</strong> (Individual/Sole Proprietor).
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Address: Uttar Fatak Raj Bari, B.C.ROAD. Burdwan, West Bengal, INDIA
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-wide">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                            <Link href="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
                            <Link href="/about" className="hover:text-blue-600 transition-colors duration-200">About</Link>
                            <Link href="/contact" className="hover:text-blue-600 transition-colors duration-200">Contact</Link>
                            <Link href="/pricing" className="hover:text-blue-600 transition-colors duration-200">Pricing</Link>
                            <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors duration-200">Privacy Policy</Link>
                            <Link href="/terms-and-conditions" className="hover:text-blue-600 transition-colors duration-200">Terms & Conditions</Link>
                            <Link href="/refund-policy" className="hover:text-blue-600 transition-colors duration-200">Refund Policy</Link>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-wide">Socials</h3>
                        <div className="flex space-x-4 text-xl">
                            <motion.a
                                href="https://www.instagram.com/samareshthedev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
                            >
                                <FaInstagram />
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/samaresh-d-ab9621212"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                                <FaLinkedin />
                            </motion.a>
                            <motion.a
                                href="https://portfolio-2-tau-sable.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                                <FaGlobe />
                            </motion.a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
                    © {new Date().getFullYear()} CovGen. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
