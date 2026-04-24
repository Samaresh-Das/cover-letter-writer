import React from 'react'

const Header = () => {
    return (
        <header className="max-w-3xl w-full mb-12 z-10 text-center pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="gradient-text">CovGen</span> Workspace
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Paste a job description, and I&apos;ll craft a tailored cover letter based on your real experience in seconds.
            </p>
        </header>
    )
}

export default Header