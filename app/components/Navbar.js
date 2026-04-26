'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

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
        
        /**
         * Loads user data from local storage for fast initial UI.
         */
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

        /**
         * Fetches latest user data from server to keep local storage in sync.
         */
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
                        window.dispatchEvent(new Event("userUpdated")); // Tell Header to update too
                    }
                }
            } catch (err) {
                console.error("Background sync failed", err);
            }
        };

        loadUser();
        syncUserWithServer();

        // Close dropdown when clicking outside
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
    }, [pathname]); // Re-load user on navigation just in case

    /**
     * Clears authentication data and redirects to landing page.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsDropdownOpen(false);
        router.push('/');
    };

    // Don't show this navbar on the landing page
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
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

                {/* Navigation (Hidden on Auth Page) */}
                {!isAuthPage && (
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <Link href="/dashboard" className={`hover:text-blue-600 transition-colors ${pathname === '/dashboard' ? 'text-blue-600 font-semibold' : ''}`}>Dashboard</Link>
                        <Link href="/profile" className={`hover:text-blue-600 transition-colors ${pathname === '/profile' ? 'text-blue-600 font-semibold' : ''}`}>Profile</Link>
                    </nav>
                )}

                {/* Profile Icon & Dropdown (Hidden on Auth Page) */}
                {!isAuthPage && (
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/pricing" 
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300 active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            Buy Credits
                        </Link>

                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
                            >
                            <div className="relative">
                                {user?.picture ? (
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm">
                                        <Image 
                                            src={user.picture} 
                                            alt={user.name} 
                                            width={36} 
                                            height={36} 
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 duration-200">
                                        {user?.name?.charAt(0) || <FaUser className="w-4 h-4" />}
                                    </div>
                                )}
                            </div>
                            <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Guest User'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                                
                                <Link 
                                    href="/profile" 
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                >
                                    <FaUser className="w-4 h-4" />
                                    My Profile
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <FaSignOutAlt className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </header>
    );
};
