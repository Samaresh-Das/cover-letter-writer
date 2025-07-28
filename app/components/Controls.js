import LeftOptions from "./LeftOptions";
import RightJDInput from "./RightJDInput";

export default function Controls({
    manager, setManager,
    resumeLink, setResumeLink,
    model, setModel,
    customInstr, setCustomInstr,
    jd, setJd,
    onGenerate, loading, error,
}) {
    return (
        <section className="max-w-5xl w-full mb-8 z-20 md:p-20 lg:p-auto">
            <div className="flex flex-col lg:flex-row gap-8">
                <LeftOptions
                    manager={manager} setManager={setManager}
                    resumeLink={resumeLink} setResumeLink={setResumeLink}
                    model={model} setModel={setModel}
                    customInstr={customInstr} setCustomInstr={setCustomInstr}
                />
                <RightJDInput
                    jd={jd} setJd={setJd}
                    onGenerate={onGenerate}
                    loading={loading}
                    error={error}
                    setManager={setManager}
                    setCustomInstr={setCustomInstr}
                />
            </div>
        </section>
    );
}
