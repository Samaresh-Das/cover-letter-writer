import React, { useEffect, useState } from 'react'
import Image from 'next/image';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user", e);
            }
        }
    }, []);

    return (
        <header className="max-w-4xl w-full mb-12 z-10 flex flex-col items-center text-center pt-8">
            <div className="flex items-center justify-between w-full mb-8">
                <div className="flex items-center gap-3">
                    {user?.picture ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                            <Image src={user.picture} alt={user.name} width={40} height={40} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div className="text-left">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm font-semibold text-slate-700">{user?.name || 'Guest User'}</p>
                    </div>
                </div>

                <div className="bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-50 shadow-sm flex items-center gap-2">
                    <span className="text-yellow-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-600">Credits: {user?.credits ?? 3}</span>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="gradient-text">Cov<span className="text-blue-600">Gen</span></span> Workspace
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Paste a job description, and I&apos;ll craft a tailored cover letter based on your real experience in seconds.
            </p>
        </header>
    )
}

export default Header