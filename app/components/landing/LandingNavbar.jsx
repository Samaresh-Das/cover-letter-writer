'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaHref, setCtaHref] = useState('/auth');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));
    if (hasToken) setCtaHref('/dashboard');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4"
      >
        <nav
          className={`w-full max-w-5xl flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ease-out ${
            scrolled
              ? 'bg-white/80 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-slate-200/60'
              : 'bg-white/40 backdrop-blur-md border border-white/20'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200/50 transition-all duration-300 group-hover:ring-amber-300/50 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.15)]">
              <Image
                src="/logo.jpg"
                alt="CovGen Logo"
                width={36}
                height={36}
                quality={100}
                unoptimized={true}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Cov<span className="gradient-text">Gen</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100/60 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              href={ctaHref}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {ctaHref === '/dashboard' ? 'Dashboard' : 'Get Started'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100/60 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-0.5 w-5 bg-slate-700 rounded-full origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block h-0.5 w-5 bg-slate-700 rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block h-0.5 w-5 bg-slate-700 rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[99] bg-slate-950/20 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-[100] bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200/60 shadow-xl p-4 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Link
                  href={ctaHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-950 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {ctaHref === '/dashboard' ? 'Go to Dashboard' : 'Get Started'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
