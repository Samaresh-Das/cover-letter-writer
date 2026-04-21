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
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">Hiring Manager Name <span className="text-gray-400 font-normal">(optional)</span></span>
                <input
                    type="text"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    className="block w-full rounded-lg bg-white text-gray-900 px-4 py-2.5 border border-gray-300 outline-none transition-all duration-200 placeholder:text-gray-400"
                    placeholder="e.g. John Doe"
                />
            </label>

            <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">Resume Link</span>
                <input
                    type="url"
                    // value={resumeLink}
                    onChange={e => setResumeLink(e.target.value)}
                    placeholder={resumeLink}
                    className="block w-full rounded-lg bg-white text-gray-900 px-4 py-2.5 border border-gray-300 outline-none transition-all duration-200 placeholder:text-gray-400"
                />
            </label>

            <div className="block">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">Generation Model</span>
                <CustomDropdown model={model} setModel={setModel} />
            </div>

            <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1.5 block">Custom Instruction <span className="text-gray-400 font-normal">(optional)</span></span>
                <textarea
                    rows={3}
                    value={customInstr}
                    onChange={e => setCustomInstr(e.target.value)}
                    placeholder="Override the default prompt…"
                    className="block w-full rounded-lg bg-white text-gray-900 px-4 py-2.5 border border-gray-300 outline-none transition-all duration-200 resize-y placeholder:text-gray-400"
                />
            </label>
        </div>
    );
}
