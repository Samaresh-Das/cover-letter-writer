"use client";

import CustomDropdown from "./ModelDropdown";

export default function LeftOptions({
    manager, setManager,
    resumeLink, setResumeLink,
    model, setModel,
    customInstr, setCustomInstr,
}) {
    return (
        <div className="flex-1 space-y-5">
            <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">Hiring Manager Name <span className="text-slate-400 font-normal">(optional)</span></span>
                <input
                    type="text"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    className="block w-full rounded-xl bg-slate-50/80 text-slate-900 px-4 py-3 border border-blue-100 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    placeholder="e.g. John Doe"
                />
            </label>

            <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">Resume Link</span>
                <input
                    type="url"
                    // value={resumeLink}
                    onChange={e => setResumeLink(e.target.value)}
                    placeholder={resumeLink}
                    className="block w-full rounded-xl bg-slate-50/80 text-slate-900 px-4 py-3 border border-blue-100 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
            </label>

            <div className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">Generation Model</span>
                <CustomDropdown model={model} setModel={setModel} />
            </div>

            <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">Custom Instruction <span className="text-slate-400 font-normal">(optional)</span></span>
                <textarea
                    rows={3}
                    value={customInstr}
                    onChange={e => setCustomInstr(e.target.value)}
                    placeholder="Override the default prompt…"
                    className="block w-full rounded-xl bg-slate-50/80 text-slate-900 px-4 py-3 border border-blue-100 outline-none transition-all duration-200 resize-y placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
            </label>
        </div>
    );
}
