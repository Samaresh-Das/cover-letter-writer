"use client";

import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";

export default function RightJDInput({
    jd, setJd,
    onGenerate,
    loading,
    error,
    setManager,
    setCustomInstr,
}) {
    return (
        <div className="flex-1 space-y-4">
            <label className="block">
                <span className="text-sm text-muted">Job Description</span>
                <textarea
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                    className="mt-1 block w-full rounded bg-surface/70 text-text p-4 h-[300px] md:h-[250px]"
                    placeholder="Paste JD here…"
                />

            </label>

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={onGenerate}
                    disabled={loading || !jd.trim()}
                    className={`bg-primary ${loading ? "text-gray-400" : "text-white"} px-6 py-2 rounded-4xl hover:scale-105 transition bg-white/10 backdrop-blur-md border border-white/20 shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? "Generating…" : "Generate"}
                </button>
                <button
                    onClick={() => { setManager(""); setCustomInstr(""); setJd("") }}
                    disabled={loading && !jd.trim()}
                    className="bg-muted text-text px-6 py-2 hover:cursor-pointer hover:scale-105 transition border-1 rounded-4xl border-white/20 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear
                </button>
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <details className="group bg-surface/70 backdrop-blur rounded-lg border border-primary/20">
                <summary className="px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-surface/80 transition">
                    <span className="text-sm text-text font-medium">View Default Instruction</span>
                    <svg className="w-4 h-4 text-muted group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <pre className="px-4 py-3 text-xs text-text whitespace-pre-wrap border-t border-primary/20">
                    {DEFAULT_SYSTEM_INSTRUCTION}
                </pre>
            </details>
        </div>
    );
}
