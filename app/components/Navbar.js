'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    FaBars,
    FaChevronDown,
    FaCreditCard,
    FaChartBar,
    FaFileAlt,
    FaFileSignature,
    FaHistory,
    FaIdCard,
    FaSignOutAlt,
    FaTimes,
    FaUser,
    FaWallet,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    {
        href: '/dashboard',
        label: 'Cover Letters',
        description: 'Generate tailored cover letters',
        icon: FaFileSignature,
    },
    {
        href: '/resumes',
        label: 'Resumes',
        description: 'Optimize resumes for job descriptions',
        icon: FaFileAlt,
    },
    {
        href: '/profile',
        label: 'Profile',
        description: 'Manage saved links and preferences',
        icon: FaIdCard,
    },
];

function isActivePath(pathname, href) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavItem({ item, pathname }) {
    const Icon = item.icon;
    const active = isActivePath(pathname, item.href);

    return (
        <Link
            href={item.href}
            className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
            title={item.description}
        >
            <Icon className={`h-3.5 w-3.5 ${active ? 'text-orange-300' : 'text-slate-400 group-hover:text-orange-500'}`} />
            {item.label}
        </Link>
    );
}

function MenuLink({ href, icon: Icon, label, description, tone = 'slate', onClick }) {
    const toneClass = tone === 'orange' ? 'hover:bg-orange-50' : 'hover:bg-slate-50';

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex gap-3 rounded-2xl px-3 py-3 transition ${toneClass}`}
        >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">{label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
            </span>
        </Link>
    );
}

export const Navbar = () => {
    const pathname = usePathname();
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
                    console.error('Error parsing user data', e);
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
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        setUser(data.user);
                        window.dispatchEvent(new Event('userUpdated'));
                    }
                }
            } catch (err) {
                console.error('Background sync failed', err);
            }
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        loadUser();
        syncUserWithServer();
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
            className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-slate-200 bg-white/90 py-2 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'
                    : 'border-slate-100 bg-white py-3'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center gap-2.5">
                    <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <Image
                            src="/logo.jpg"
                            alt="CovGen Logo"
                            width={44}
                            height={44}
                            quality={100}
                            unoptimized={true}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-950" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Cov<span className="text-blue-600">Gen</span>
                    </span>
                </Link>

                {!isAuthPage && user && (
                    <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <DesktopNavItem key={item.href} item={item} pathname={pathname} />
                        ))}
                    </nav>
                )}

                {!isAuthPage && !user && (
                    <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-slate-600 md:flex">
                        <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
                        <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
                        <Link href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
                    </nav>
                )}

                <div className="ml-auto flex items-center gap-3">
                    {!isAuthPage && user && (
                        <div className="hidden items-center gap-3 md:flex">
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                                <FaWallet className="h-3.5 w-3.5 text-orange-500" />
                                <span className="font-semibold text-slate-600">Credits</span>
                                <span className="font-black text-slate-950">{user.credits ?? 0}</span>
                            </div>
                            <Link
                                href="/pricing"
                                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Upgrade
                            </Link>
                        </div>
                    )}

                    {!isAuthPage && !user && (
                        <Link href="/auth" className="hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 md:inline-flex">
                            Get Started
                        </Link>
                    )}

                    {!isAuthPage && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                aria-label={user ? 'Open account menu' : 'Open navigation menu'}
                            >
                                {user ? (
                                    <>
                                        {user?.picture ? (
                                            <div className="h-9 w-9 overflow-hidden rounded-lg">
                                                <Image src={user.picture} alt={user.name || 'User'} width={36} height={36} className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                                                {user?.name?.charAt(0) || <FaUser className="h-4 w-4" />}
                                            </div>
                                        )}
                                        <div className="hidden max-w-[150px] text-left lg:block">
                                            <p className="truncate text-sm font-bold leading-4 text-slate-950">{user?.name || 'Account'}</p>
                                            <p className="truncate text-xs leading-4 text-slate-500">{user?.plan || 'free'} plan</p>
                                        </div>
                                        <FaChevronDown className={`hidden h-3 w-3 text-slate-400 transition md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        <FaBars className="h-4 w-4 text-slate-500 md:hidden" />
                                    </>
                                ) : (
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden">
                                        {isDropdownOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.16 }}
                                        className="absolute right-0 mt-3 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
                                    >
                                        {user ? (
                                            <>
                                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                                                    <p className="truncate text-sm font-black text-slate-950">{user?.name || 'Account'}</p>
                                                    <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
                                                    {user?.plan === 'pro' && user?.proPlanExpiry && (
                                                        <p className="mt-1 text-[11px] font-semibold text-blue-500">
                                                            Pro plan expires in {Math.max(0, Math.ceil((new Date(user.proPlanExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                                                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                            <FaWallet className="text-orange-500" /> Credits
                                                        </span>
                                                        <span className="text-sm font-black text-slate-950">{user.credits ?? 0}</span>
                                                    </div>
                                                </div>

                                                <div className="p-2 md:hidden">
                                                    {navItems.map((item) => (
                                                        <MenuLink
                                                            key={item.href}
                                                            href={item.href}
                                                            icon={item.icon}
                                                            label={item.label}
                                                            description={item.description}
                                                            tone={item.href === '/resumes' ? 'orange' : 'slate'}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="border-t border-slate-100 p-2">
                                                    <MenuLink
                                                        href="/pricing"
                                                        icon={FaCreditCard}
                                                        label="Billing and credits"
                                                        description="Buy credits or upgrade your plan"
                                                        tone="orange"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    />
                                                    <MenuLink
                                                        href="/purchases"
                                                        icon={FaHistory}
                                                        label="Purchase history"
                                                        description="Review previous payments and credit packs"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    />
                                                    <MenuLink
                                                        href="/usage"
                                                        icon={FaChartBar}
                                                        label="Credit usage"
                                                        description="Full transparency on all transactions"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    />
                                                </div>

                                                <div className="border-t border-slate-100 p-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-red-50"
                                                    >
                                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500">
                                                            <FaSignOutAlt className="h-4 w-4" />
                                                        </span>
                                                        <span>
                                                            <span className="block text-sm font-bold text-red-600">Sign out</span>
                                                            <span className="mt-0.5 block text-xs leading-5 text-red-400">End this session on this device</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-2 md:hidden">
                                                <MenuLink href="/#features" icon={FaFileSignature} label="Features" description="See what CovGen helps you create" onClick={() => setIsDropdownOpen(false)} />
                                                <MenuLink href="/#how-it-works" icon={FaFileAlt} label="How it works" description="Understand the generation workflow" onClick={() => setIsDropdownOpen(false)} />
                                                <MenuLink href="/#pricing" icon={FaCreditCard} label="Pricing" description="Compare plans and credit packs" onClick={() => setIsDropdownOpen(false)} />
                                                <Link
                                                    href="/auth"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="mt-2 flex justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                                                >
                                                    Get Started
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
