import React from 'react'

const Header = () => {
    return (
        <header className="max-w-3xl w-full mb-10 z-10 text-center">
            <h1 className="text-3xl font-bold text-primaryLight mb-2">Cover Letter Writer</h1>
            <p className="text-muted">
                Paste a job description, and I’ll craft a 3-paragraph cover letter tailored to your skills.
            </p>
        </header>
    )
}

export default Header