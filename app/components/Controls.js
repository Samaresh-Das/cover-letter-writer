import LeftOptions from "./LeftOptions";
import RightJDInput from "./RightJDInput";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";

export default function Controls({
    manager, setManager,
    resumeLink, setResumeLink,
    model, setModel,
    customInstr, setCustomInstr,
    jd, setJd,
    onGenerate, loading, error,
}) {
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
                <div className="clay-card p-6 flex flex-col h-full bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest text-blue-600">Default Instruction</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                        This is the base system prompt used to guide the AI. Your custom instructions (if any) are appended to this.
                    </p>
                    <div className="flex-1 rounded-xl bg-white border border-slate-200 p-4 overflow-y-auto" style={{ maxHeight: "400px", scrollbarWidth: "thin", scrollbarColor: "#93C5FD transparent" }}>
                        <pre className="text-[11px] text-slate-600 font-mono whitespace-pre-wrap break-words leading-relaxed">
                            {customInstr || DEFAULT_SYSTEM_INSTRUCTION}
                        </pre>
                    </div>
                </div>
            </aside>
        </section>
    );
}
