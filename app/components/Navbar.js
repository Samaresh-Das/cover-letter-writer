import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
    return (
        <header className="w-full z-50 px-4 py-2.5 sm:px-6 md:px-12 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <Image src="/favicon.ico" alt="CovGen Logo" width={32} height={32} />
                    <span className="text-xl font-semibold text-gray-800 tracking-tight">CovGen</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Home</Link>
                    <Link href="/features" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Features</Link>
                    <Link href="/docs" className="hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Docs</Link>
                </nav>

                {/* Profile Icon */}
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href="/profile">
                        <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
