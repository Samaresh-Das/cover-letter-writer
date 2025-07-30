import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
    return (
        <header className="w-full z-50 px-4 py-3 sm:px-6 md:px-12 bg-surface/80 backdrop-blur border-b border-white/10 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 text-primary font-semibold text-xl">
                    <span className="text-2xl"><Image src="/favicon.ico" alt="CovGen Logo" width={32} height={32} /></span>
                    <span className="tracking-tight">CovGen</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-muted">
                    <Link href="/" className="hover:text-primary transition">Home</Link>
                    <Link href="/features" className="hover:text-primary transition">Features</Link>
                    <Link href="/docs" className="hover:text-primary transition">Docs</Link>
                </nav>

                {/* Profile Icon */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-muted hover:text-primary">
                        {/* Hamburger menu for mobile */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition">
                        {/* Profile icon (not signed in yet) */}
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>

    )
}
