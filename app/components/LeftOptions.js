"use client";

import CustomDropdown from "./ModelDropdown";

export default function LeftOptions({
    manager, setManager,
    resumeLink, setResumeLink,
    model, setModel,
    customInstr, setCustomInstr,
}) {
    return (
        <div className="flex-1 space-y-4">
            <label className="block">
                <span className="text-sm text-muted">Hiring Manager Name (optional)</span>
                <input
                    type="text"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    className="mt-1 block w-full rounded bg-surface/70 text-text p-2"
                    placeholder="e.g. John Doe"
                />
            </label>

            <label className="block">
                <span className="text-sm text-muted">Resume Link</span>
                <input
                    type="url"
                    // value={resumeLink}
                    onChange={e => setResumeLink(e.target.value)}
                    placeholder={resumeLink}
                    className="mt-1 block w-full rounded bg-surface/70 text-text p-2"
                />
            </label>

            <CustomDropdown model={model} setModel={setModel} />

            <label className="block">
                <span className="text-sm text-muted">Custom Instruction (optional)</span>
                <textarea
                    rows={3}
                    value={customInstr}
                    onChange={e => setCustomInstr(e.target.value)}
                    placeholder="Override the default prompt…"
                    className="mt-1 block w-full rounded-2xl bg-surface/70 text-text p-2 border-1 border-gray-800 transparent focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
            </label>
        </div>
    );
}
