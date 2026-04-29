"use client";

import { useState } from "react";
import LeftOptions from "./LeftOptions";
import RightJDInput from "./RightJDInput";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";

export default function Controls({
    manager, setManager,
    resumeLink, setResumeLink,
    model, setModel,
    customInstr, setCustomInstr,
    defaultUserInstr,
    userPlan,
    jd, setJd,
    onGenerate, loading, error,
}) {
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);

    return (
        <section className="w-full mb-12 z-20 flex flex-col xl:flex-row gap-6 items-start">
            {/* Main Form Area */}
            <div className="clay-card p-6 md:p-10 lg:p-12 flex-1 w-full">
                <div className="flex flex-col lg:flex-row gap-10">
                    <LeftOptions
                        manager={manager} setManager={setManager}
                        resumeLink={resumeLink} setResumeLink={setResumeLink}
                        model={model} setModel={setModel}
                        customInstr={customInstr} setCustomInstr={setCustomInstr}
                        userPlan={userPlan}
                    />
                    <div className="hidden lg:block w-px bg-blue-100/50 my-4" /> {/* Divider */}
                    <RightJDInput
                        jd={jd} setJd={setJd}
                        onGenerate={onGenerate}
                        loading={loading}
                        error={error}
                        setManager={setManager}
                        setCustomInstr={setCustomInstr}
                    />
                </div>
            </div>

            {/* Sidebar - Default Instruction */}
            <aside className="w-full xl:w-[320px] shrink-0">
                <div className="clay-card p-6 flex flex-col bg-slate-50/50">
                    <div 
                        className="flex justify-between items-center cursor-pointer xl:cursor-default" 
                        onClick={() => setIsInstructionOpen(!isInstructionOpen)}
                    >
                        <h3 className="text-sm font-bold text-slate-900 mb-0 xl:mb-3 uppercase tracking-widest text-blue-600">
                            Default Instruction
                        </h3>
                        <span className="xl:hidden text-blue-600">
                            {isInstructionOpen ? "▲" : "▼"}
                        </span>
                    </div>
                    
                    <div className={`mt-4 xl:mt-0 ${isInstructionOpen ? "block" : "hidden"} xl:block flex-col h-full`}>
                        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                            This is the base system prompt. Any input in the Custom Instruction box will completely replace this.
                        </p>
                        <div className="flex-1 rounded-xl bg-white border border-slate-200 p-4 overflow-y-auto" style={{ maxHeight: "400px", scrollbarWidth: "thin", scrollbarColor: "#93C5FD transparent" }}>
                            <pre className="text-[11px] text-slate-600 font-mono whitespace-pre-wrap break-words leading-relaxed">
                                {customInstr || defaultUserInstr || DEFAULT_SYSTEM_INSTRUCTION}
                            </pre>
                        </div>
                    </div>
                </div>
            </aside>
        </section>
    );
}
