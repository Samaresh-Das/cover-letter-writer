'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaChevronDown, FaRocket, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        
        const loadUser = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            } else {
                setUser(null);
            }
        };

        const syncUserWithServer = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        setUser(data.user);
                        window.dispatchEvent(new Event("userUpdated"));
                    }
                }
            } catch (err) {
                console.error("Background sync failed", err);
            }
        };

        loadUser();
        syncUserWithServer();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('userUpdated', loadUser);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('userUpdated', loadUser);
        };
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        setUser(null);
        setIsDropdownOpen(false);
        window.location.href = '/';
    };

    if (pathname === '/' || pathname === '') return null;

    const isAuthPage = pathname === '/auth';

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(59,130,246,0.08)] border-b border-blue-100/50 py-2' 
                    : 'bg-white border-b border-gray-100 py-3'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center relative">
                {/* Logo Section */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Cov<span className="gradient-text">Gen</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation Section (Centered - Desktop Only) */}
                {!isAuthPage && (
                    <div className="hidden md:flex flex-shrink-0 justify-center">
                        {user ? (
                            <nav className="flex gap-8 text-sm font-medium text-slate-600">
                                <Link href="/dashboard" className={`hover:text-blue-600 transition-colors ${pathname === '/dashboard' ? 'text-blue-600 font-semibold' : ''}`}>Dashboard</Link>
                                <Link href="/profile" className={`hover:text-blue-600 transition-colors ${pathname === '/profile' ? 'text-blue-600 font-semibold' : ''}`}>Profile</Link>
                            </nav>
                        ) : (
                            <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
                                <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
                                <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
                                <Link href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
                            </nav>
                        )}
                    </div>
                )}

                {/* Actions Section */}
                {!isAuthPage && (
                    <div className="flex-1 flex justify-end items-center gap-4">
                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <>
                                    <motion.button 
                                        onClick={() => window.dispatchEvent(new Event("open-v2-modal"))}
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 cursor-pointer"
                                    >
                                        <FaRocket className="animate-bounce" />
                                        What&apos;s coming in v2.0
                                    </motion.button>

                                    {pathname !== '/dashboard' && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
                                            <span className="text-xs font-bold text-slate-600">Credits:</span>
                                            <span className="text-sm font-black text-blue-600">{user.credits}</span>
                                        </div>
                                    )}

                                    <Link 
                                        href="/pricing" 
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300 active:scale-95"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        Buy Credits
                                    </Link>
                                </>
                            ) : (
                                <Link href="/auth">
                                    <button className="btn-primary-landing text-sm py-2 px-5 cursor-pointer">
                                        Get Started
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Hamburger / Profile Trigger (Mobile + Desktop User) */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all cursor-pointer group"
                            >
                                {user ? (
                                    <div className="flex items-center gap-2 pr-1">
                                        <div className="relative">
                                            {user?.picture ? (
                                                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm">
                                                    <Image src={user.picture} alt={user.name} width={36} height={36} className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                                                    {user?.name?.charAt(0) || <FaUser className="w-4 h-4" />}
                                                </div>
                                            )}
                                        </div>
                                        <FaChevronDown className={`hidden md:block w-3 h-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        <FaBars className="md:hidden w-5 h-5 text-slate-600 ml-1" />
                                    </div>
                                ) : (
                                    <div className="md:hidden p-2 rounded-xl bg-blue-50 text-blue-600">
                                        {isDropdownOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                                    </div>
                                )}
                            </button>

                            {/* Integrated Dropdown (Glassmorphism) */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 md:w-56 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.15)] border border-white/20 py-3 overflow-hidden z-[100]"
                                    >
                                        {user && (
                                            <div className="px-5 py-4 border-b border-slate-100/50 mb-2 bg-blue-50/30">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Guest User'}</p>
                                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits:</span>
                                                    <span className="text-xs font-black text-blue-600">{user.credits}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1 px-2">
                                            {/* Mobile-only Nav Links */}
                                            <div className="md:hidden space-y-1">
                                                {user ? (
                                                    <>
                                                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 rounded-2xl transition-all">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                            Dashboard
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href="/#features" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 rounded-2xl transition-all">Features</Link>
                                                        <Link href="/#how-it-works" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 rounded-2xl transition-all">How it Works</Link>
                                                        <Link href="/#pricing" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 rounded-2xl transition-all">Pricing</Link>
                                                    </>
                                                )}
                                                
                                                <button 
                                                    onClick={() => { window.dispatchEvent(new Event("open-v2-modal")); setIsDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                                >
                                                    <FaRocket className="w-4 h-4" />
                                                    What&apos;s coming in v2.0
                                                </button>

                                                <Link href="/pricing" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-2xl transition-all">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                                    Buy Credits
                                                </Link>
                                            </div>

                                            {/* Shared Links */}
                                            {user ? (
                                                <>
                                                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 rounded-2xl transition-all">
                                                        <FaUser className="w-4 h-4" />
                                                        My Profile
                                                    </Link>
                                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer">
                                                        <FaSignOutAlt className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </>
                                            ) : (
                                                <Link href="/auth" onClick={() => setIsDropdownOpen(false)} className="md:hidden flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all mx-2 text-center justify-center">
                                                    Get Started
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
