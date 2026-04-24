"use client";

import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import { useState } from "react";

export default function RightJDInput({
    jd, setJd,
    onGenerate,
    loading,
    error,
    setManager,
    setCustomInstr,
}) {
    const [jdLink, setJdLink] = useState("");
    const [fetching, setFetching] = useState(false);

    const fetchJDFromLink = async () => {
        if (!jdLink.trim()) return;
        setFetching(true);

        try {
            const res = await fetch("/api/fetch-jd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: jdLink.trim() }),
            });

            const data = await res.json();
            if (data.jd) {
                setJd(data.jd);
            } else {
                alert("Could not extract JD: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            alert("Error fetching JD");
            console.error(err);
        }

        setFetching(false);
    };

    return (
        <div className="flex-1 space-y-5">
            <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Job Description</h3>

            {/* JD Link Input */}
            <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">LinkedIn Job URL <span className="text-slate-400 font-normal">(Auto-extracts JD)</span></span>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={jdLink}
                        onChange={(e) => setJdLink(e.target.value)}
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50/80 text-slate-900 border border-blue-100 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                    <button
                        onClick={fetchJDFromLink}
                        disabled={fetching}
                        className="bg-blue-50 text-blue-700 font-semibold px-6 py-3 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {fetching ? "Extracting…" : "Extract"}
                    </button>
                </div>
            </label>
            
            <div className="flex items-center gap-4 py-1">
                <hr className="flex-1 border-gray-200" />
                <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">OR</span>
                <hr className="flex-1 border-gray-200" />
            </div>

            <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">Or paste Job Description manually</span>
                <textarea
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                    className="w-full rounded-xl bg-slate-50/80 text-slate-900 px-4 py-4 h-[240px] border border-blue-100 outline-none transition-all duration-200 resize-y placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    placeholder="Paste the full job description here…"
                />
            </label>

            <div className="flex flex-wrap gap-4 pt-2">
                <button
                    onClick={onGenerate}
                    disabled={loading || !jd.trim()}
                    className="btn-primary-landing w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            Generate Cover Letter
                            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </>
                    )}
                </button>
                <button
                    onClick={() => { setManager(""); setCustomInstr(""); setJd(""); setJdLink(""); }}
                    disabled={loading && !jd.trim()}
                    className="btn-secondary-landing w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear All
                </button>
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        </div>
    );
}
