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
            <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>

            {/* JD Link Input */}
            <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">JD Share Link <span className="text-gray-400 font-normal">(Optional)</span></span>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={jdLink}
                        onChange={(e) => setJdLink(e.target.value)}
                        placeholder="Paste a JD link"
                        className="flex-1 px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 outline-none transition-all duration-200 placeholder:text-gray-400"
                    />
                    <button
                        onClick={fetchJDFromLink}
                        disabled={fetching}
                        className="bg-white text-blue-600 font-medium px-5 py-2.5 rounded-full border border-gray-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {fetching ? "Fetching…" : "Fetch"}
                    </button>
                </div>
            </label>
            
            <div className="flex items-center gap-4 py-1">
                <hr className="flex-1 border-gray-200" />
                <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">OR</span>
                <hr className="flex-1 border-gray-200" />
            </div>

            <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">Paste a JD here</span>
                <textarea
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                    className="w-full rounded-lg bg-white text-gray-900 px-4 py-3 h-[240px] border border-gray-300 outline-none transition-all duration-200 resize-y placeholder:text-gray-400"
                    placeholder="Paste JD here…"
                />
            </label>

            <div className="flex flex-wrap gap-3 pt-1">
                <button
                    onClick={onGenerate}
                    disabled={loading || !jd.trim()}
                    className="bg-blue-600 text-white font-medium px-7 py-2.5 rounded-full hover:bg-blue-700 hover:shadow-md transition-all duration-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {loading ? "Generating…" : "Generate Cover Letter"}
                </button>
                <button
                    onClick={() => { setManager(""); setCustomInstr(""); setJd("") }}
                    disabled={loading && !jd.trim()}
                    className="bg-white text-blue-600 border border-gray-300 px-6 py-2.5 rounded-full hover:bg-blue-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear All
                </button>
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden mt-2">
                <summary className="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 select-none outline-none">
                    <span className="text-sm text-gray-700 font-medium">View Default Instruction</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <pre className="px-4 py-3 text-xs text-gray-500 whitespace-pre-wrap border-t border-gray-100 bg-gray-50">
                    {DEFAULT_SYSTEM_INSTRUCTION}
                </pre>
            </details>
        </div>
    );
}
