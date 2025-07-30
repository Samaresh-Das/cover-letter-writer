"use client";

import { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import HistoryModal from "./HistoryModal";

const dummyProfile = {
    name: "Samaresh Das",
    resumeLink: "https://your-resume-link.com",
    defaultPrompt:
        "Write a confident, personalized, and concise 3-paragraph cover letter tailored to the job description.",
    linkedin: "https://www.linkedin.com/in/samareshdas",
    image: "https://img.icons8.com/color/96/user-male-circle--v1.png",
    letters: [
        {
            id: 1,
            title: "Frontend Developer at Google",
            jd: "Looking for a frontend developer with strong React and UI skills...",
            coverLetter:
                "Dear Hiring Manager,\n\nI’m excited to apply for the Frontend Developer role at Google. With 3 years of experience building scalable React apps...\n\nBest,\nSamaresh Das",
        },
        {
            id: 2,
            title: "AI Intern at OpenAI",
            jd: "You will contribute to language model research and deployment...",
            coverLetter:
                "Dear OpenAI Team,\n\nThe opportunity to contribute to foundational research excites me deeply. My academic background in NLP and passion for open-source AI...\n\nSincerely,\nSamaresh Das",
        },
    ],
};

export default function Profile() {
    const [modalData, setModalData] = useState(null);
    const [resumeLink, setResumeLink] = useState(dummyProfile.resumeLink);

    return (
        <main className="min-h-screen bg-bg text-text px-4 py-12 md:px-10">
            {/* Background Gradient Blobs */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.2),_transparent)] blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.2),_transparent)] blur-3xl" />
            </div>

            {/* Profile Card */}
            <section className="max-w-5xl mx-auto bg-surface/40 border border-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl space-y-4 mb-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={dummyProfile.image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-primary shadow-lg"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-primaryLight">
                            👋 Hello, {dummyProfile.name}
                        </h1>
                        <a
                            href={dummyProfile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                        >
                            <FaLinkedin className="text-blue-400 text-lg" />
                            LinkedIn Profile
                        </a>
                    </div>
                </div>

                <div className="space-y-3 mt-6">
                    <div>
                        <label className="block text-sm text-muted mb-1">Resume Link</label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/20 text-white"
                            value={resumeLink}
                            onChange={(e) => setResumeLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-1">Default Prompt</label>
                        <textarea
                            readOnly
                            className="w-full min-h-[100px] px-4 py-2 rounded-lg bg-black/20 border border-white/20 text-white"
                            value={dummyProfile.defaultPrompt}
                        />
                    </div>
                </div>
            </section>

            {/* Cover Letters */}
            <section className="max-w-6xl mx-auto space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold text-primary">📄 Saved Cover Letters</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {dummyProfile.letters.map((letter) => (
                        <div
                            key={letter.id}
                            className="bg-surface/30 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-lg transition-all hover:scale-[1.015]"
                            onClick={() => setModalData(letter)}
                        >
                            <h3 className="text-lg font-semibold text-primary mb-2">{letter.title}</h3>
                            <div className="text-xs text-muted mb-3 line-clamp-2">
                                <strong>JD:</strong> {letter.jd}
                            </div>
                            <div className="bg-black/10 text-sm text-white whitespace-pre-wrap p-4 rounded-lg max-h-48 overflow-y-auto">
                                {letter.coverLetter}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="mt-16 text-center text-sm text-muted">
                Built with ❤️ by Samaresh · Glassy theme + violet accents
            </footer>


            <HistoryModal
                open={!!modalData}
                onClose={() => setModalData(null)}
                jd={modalData?.jd}
                letter={modalData?.coverLetter}
            />

        </main>
    );
}
