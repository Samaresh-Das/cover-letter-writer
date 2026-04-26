"use client";

import { useState, useEffect } from "react";
import { FaLinkedin, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import HistoryModal from "./HistoryModal";
import { useRouter } from "next/navigation";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [resumeLink, setResumeLink] = useState("");
    const [customInstr, setCustomInstr] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setResumeLink(userData.resumeLink || "");
                setCustomInstr(userData.customInstructions || "");
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear the auth cookie so middleware stops redirecting to dashboard
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        router.push('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-bg text-text px-4 py-24 md:px-10">
            {/* Profile Card */}
            <section className="max-w-5xl mx-auto bg-surface border border-border-col rounded-2xl p-8 shadow-card space-y-4 mb-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {user.picture ? (
                        <Image
                            src={user.picture}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full border-4 border-primary-light shadow-sm object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-primary-light shadow-sm">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-text">
                                    👋 Hello, {user.name}
                                </h1>
                                <p className="text-muted text-sm mt-1">{user.email}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl font-medium transition-colors cursor-pointer"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Resume Link</label>
                        <input
                            type="url"
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-bg border border-border-col text-muted outline-none cursor-not-allowed"
                            value={resumeLink}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Default Instructions</label>
                        <textarea
                            readOnly
                            className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-bg border border-border-col text-muted outline-none cursor-not-allowed"
                            value={customInstr}
                        />
                    </div>
                </div>
            </section>

            {/* Cover Letters (Currently Placeholder for Real Data) */}
            <section className="max-w-6xl mx-auto space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold text-text">📄 Saved Cover Letters</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-full py-12 text-center bg-surface border border-dashed border-border-col rounded-2xl text-muted">
                        No saved cover letters found in your history yet.
                    </div>
                </div>
            </section>

            <footer className="mt-16 text-center text-sm text-muted">
                Built with ❤️ by Samaresh
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
