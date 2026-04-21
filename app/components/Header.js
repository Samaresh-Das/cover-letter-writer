import React from 'react'

const Header = () => {
    return (
        <header className="max-w-3xl w-full mb-10 z-10 text-center pt-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Cover Letter Writer</h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                Paste a job description, and I'll craft a 3-paragraph cover letter tailored to your skills.
            </p>
        </header>
    )
}

export default Header