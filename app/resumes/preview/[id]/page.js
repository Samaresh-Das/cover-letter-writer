"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaDownload, FaSave } from "react-icons/fa";
import ResumePageShell from "../../../components/resumes/ResumePageShell";
import ResumeTemplate from "../../../components/resumes/ResumeTemplate";
import { fetchJson } from "../../../../lib/resumes/api";

/**
 * Resume Preview route: /resumes/preview/:id
 *
 * Backend routes hit from this page:
 * - useEffect() calls GET /api/resumes/generated/:id to load final preview data.
 * - "Save Resume State" button calls PATCH /api/resumes/generated/:id with PDF
 *   metadata.
 * - "Download PDF" button calls the same PATCH through saveMarker(), then runs
 *   window.print() for browser PDF export.
 *
 * Components called:
 * - ResumePageShell wraps the page.
 * - ResumeTemplate renders generatedResume.optimizedResume with the persisted
 *   generatedResume.template.
 */
export default function ResumePreviewPage() {
  // id is the GeneratedResume MongoDB ObjectId from the preview route segment.
  const { id } = useParams();
  // generatedResume stores the populated generated resume payload returned by
  // getGeneratedResume(): optimized content, template, ATS analysis, source
  // resume reference, and job description.
  const [generatedResume, setGeneratedResume] = useState(null);
  // editResume owns the mutable structured resume JSON shown in the editor.
  // It starts as generatedResume.optimizedResume and is saved back through
  // PATCH /api/resumes/generated/:id with { optimizedResume }.
  const [editResume, setEditResume] = useState(null);
  // editing toggles the sidebar between ATS suggestions and editable fields.
  const [editing, setEditing] = useState(false);
  // savingEdit controls the "Save edits" button while PATCH is in flight.
  const [savingEdit, setSavingEdit] = useState(false);
  // error stores load/save failures from fetchJson().
  const [error, setError] = useState("");

  /**
   * Loads the generated resume preview payload when /resumes/preview/:id mounts.
   *
   * Cross-file call path:
   * - app/resumes/preview/[id]/page.js useEffect()
   * - lib/resumes/api.js fetchJson(`/api/resumes/generated/${id}`)
   * - covgen-server/routes/resume-routes.js router.get("/generated/:id")
   * - covgen-server/controllers/resume-controller.js getGeneratedResume()
   */
  useEffect(() => {
    fetchJson(`/api/resumes/generated/${id}`)
      .then((data) => {
        setGeneratedResume(data.generatedResume);
        setEditResume(data.generatedResume.optimizedResume);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  /**
   * Saves lightweight PDF metadata to the generated resume document.
   *
   * Button wiring:
   * - "Save Resume State" calls saveMarker() directly.
   * - "Download PDF" calls printResume(), which calls saveMarker() before
   *   opening the browser print dialog.
   *
   * Backend route:
   * - PATCH /api/resumes/generated/:id
   * - Handled by covgen-server/controllers/resume-controller.js
   *   updateGeneratedResume().
   */
  const saveMarker = async () => {
    await fetchJson(`/api/resumes/generated/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ pdf: { generatedAt: new Date().toISOString() } }),
    });
  };

  /**
   * Updates a top-level field on the editable resume JSON.
   *
   * Called by:
   * - Summary textarea.
   * - Skills/Achievements textareas after splitting line-based input.
   */
  const updateResumeField = (field, value) => {
    setEditResume((current) => ({ ...(current || {}), [field]: value }));
  };

  /**
   * Updates resume fields with path support for nested edits.
   *
   * Called by:
   * - ResumeTemplate inline edits (through onFieldChange prop).
   */
  const handleResumeChange = (field, value, path) => {
    setEditResume((current) => {
      const updated = { ...(current || {}) };

      if (field === "name") {
        // Handle name field which updates personalInfo.name
        updated.personalInfo = { ...(updated.personalInfo || {}), name: value };
      } else if (path) {
        // Handle nested paths like "0.role" or "0.bullets" for experience/projects/education items
        const pathParts = path.split(".");
        const index = parseInt(pathParts[0], 10);
        const nestedField = pathParts[1];

        if (nestedField) {
          if (field === "experience") {
            const nextExperience = [...(updated.experience || [])];
            nextExperience[index] = { ...nextExperience[index], [nestedField]: value };
            updated.experience = nextExperience;
          } else if (field === "projects") {
            const nextProjects = [...(updated.projects || [])];
            nextProjects[index] = { ...nextProjects[index], [nestedField]: value };
            updated.projects = nextProjects;
          } else if (field === "education") {
            const nextEducation = [...(updated.education || [])];
            nextEducation[index] = { ...nextEducation[index], [nestedField]: value };
            updated.education = nextEducation;
          }
        }
      } else if (field === "skills") {
        // Handle skills array split
        updated.skills = Array.isArray(value) ? value : value.split("\n").filter(Boolean);
      } else if (field === "achievements") {
        // Handle achievements array split
        updated.achievements = Array.isArray(value) ? value : value.split("\n").filter(Boolean);
      } else {
        // Simple field update
        updated[field] = value;
      }

      return updated;
    });
  };

  /**
   * Persists edited resume content.
   *
   * Button wiring:
   * - "Save edits" calls saveResumeEdits().
   *
   * Backend route:
   * - PATCH /api/resumes/generated/:id with { optimizedResume: editResume }.
   * - Handled by covgen-server/controllers/resume-controller.js
   *   updateGeneratedResume().
   */
  const saveResumeEdits = async () => {
    setSavingEdit(true);
    setError("");
    try {
      const data = await fetchJson(`/api/resumes/generated/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ optimizedResume: editResume }),
      });
      setGeneratedResume((current) => ({ ...(current || data.generatedResume), optimizedResume: editResume }));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const printResume = async () => {
    await saveMarker().catch(() => { });
    
    // Dynamically import PDF generation libraries to avoid SSR issues
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const element = document.querySelector(".resume-print-stage .resume-paper");
    if (!element) return;

    // Temporarily force strict single-page dimensions and remove shadows for capture
    const originalHeight = element.style.height;
    const originalMinHeight = element.style.minHeight;
    const originalOverflow = element.style.overflow;
    const originalBoxShadow = element.style.boxShadow;
    const originalTransform = element.style.transform;
    
    element.style.height = "11in";
    element.style.minHeight = "11in";
    element.style.overflow = "hidden";
    element.style.boxShadow = "none";
    element.style.transform = "none";

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });
      
      pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
      
      const fileName = jd?.company ? `${jd.company.replace(/\s+/g, '_')}_Resume.pdf` : "Resume.pdf";
      pdf.save(fileName);
    } finally {
      // Restore original element styles
      element.style.height = originalHeight;
      element.style.minHeight = originalMinHeight;
      element.style.overflow = originalOverflow;
      element.style.boxShadow = originalBoxShadow;
      element.style.transform = originalTransform;
    }
  };

  const analysis = generatedResume?.atsAnalysis || {};
  const jd = generatedResume?.jobDescription || {};
  const keywordList = analysis.missingKeywords || analysis.keywordGaps || [];
  const suggestionList = analysis.atsOptimizationSuggestions || analysis.importantSuggestions || [];
  const displayedResume = editResume || generatedResume?.optimizedResume;

  return (
    <ResumePageShell
      eyebrow="Step 4"
      title="Resume Preview"
      description="Review ATS suggestions, then use browser print/download to export a clean PDF for MVP validation."
      action={
        <>
          {generatedResume && <Link href={`/resumes/${generatedResume.resume?._id || generatedResume.resume}/templates?generated=${id}`} className="rounded-lg border border-orange-100 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(249,115,22,0.08)]">Templates</Link>}
          <button onClick={printResume} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700">
            <FaDownload /> Download PDF
          </button>
        </>
      }
    >
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {generatedResume ? (
        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <aside className="print:hidden space-y-4">
            <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)] backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">ATS Match</p>
              <div className="mt-3 text-5xl font-black text-slate-950">{analysis.matchScore ?? analysis.atsScore ?? 0}%</div>
              <p className="mt-2 text-sm text-slate-600">{jd.title || "Tailored resume"} {jd.company ? `at ${jd.company}` : ""}</p>
            </section>
            <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)] backdrop-blur">
              <h2 className="font-bold">{generatedResume.generationType === "general" ? "Keyword Gaps" : "Missing Keywords"}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {keywordList.slice(0, 14).map((keyword) => <span key={keyword} className="rounded-full border border-orange-100 bg-white px-3 py-1 text-xs font-semibold text-orange-700 shadow-[0_6px_18px_rgba(249,115,22,0.08)]">{keyword}</span>)}
              </div>
            </section>
            <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)] backdrop-blur">
              <h2 className="font-bold">Suggestions</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                {suggestionList.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section className="rounded-xl border border-slate-100 bg-white/95 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold">Edit Generated Resume</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Change summary, skills, and bullets before PDF export.</p>
                </div>
                <button onClick={() => setEditing((value) => !value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                  {editing ? "Close" : "Edit"}
                </button>
              </div>

              {editing && editResume && (
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Summary</span>
                    <textarea value={editResume.summary || ""} onChange={(event) => updateResumeField("summary", event.target.value)} className="min-h-[110px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6" />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Skills, one per line</span>
                    <textarea value={(editResume.skills || []).join("\n")} onChange={(event) => updateResumeField("skills", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} className="min-h-[120px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6" />
                  </label>

                  {(editResume.experience || []).map((item, index) => (
                    <div key={`${item.company}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <input value={item.role || ""} onChange={(event) => handleResumeChange("experience", event.target.value, `${index}.role`)} className="mb-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold" placeholder="Role" />
                      <input value={item.company || ""} onChange={(event) => handleResumeChange("experience", event.target.value, `${index}.company`)} className="mb-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Company" />
                      <div className="mb-2 grid gap-2 sm:grid-cols-2">
                        <input value={item.startDate || ""} onChange={(event) => handleResumeChange("experience", event.target.value, `${index}.startDate`)} className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Start date" />
                        <input value={item.endDate || ""} onChange={(event) => handleResumeChange("experience", event.target.value, `${index}.endDate`)} className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="End date" />
                      </div>
                      <textarea value={(item.bullets || []).join("\n")} onChange={(event) => handleResumeChange("experience", event.target.value.split("\n").map((bullet) => bullet.trim()).filter(Boolean), `${index}.bullets`)} className="min-h-[130px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm leading-6" placeholder="One bullet per line" />
                    </div>
                  ))}

                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Achievements, one per line</span>
                    <textarea value={(editResume.achievements || []).join("\n")} onChange={(event) => updateResumeField("achievements", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6" />
                  </label>

                  <button onClick={saveResumeEdits} disabled={savingEdit} className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60">
                    {savingEdit ? "Saving edits..." : "Save edits"}
                  </button>
                </div>
              )}
            </section>
            <button onClick={saveMarker} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
              <FaSave /> Save Resume State
            </button>
          </aside>
          <div className="resume-print-stage overflow-auto rounded-xl border border-orange-100/80 bg-white p-4 shadow-[0_22px_70px_rgba(249,115,22,0.08)] print:overflow-visible print:border-0 print:bg-white print:p-0 print:shadow-none">
            <ResumeTemplate resume={displayedResume} template={generatedResume.template} isEditing={editing} onFieldChange={handleResumeChange} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-orange-100/80 bg-white/95 p-8 text-slate-500 shadow-[0_20px_70px_rgba(249,115,22,0.06)]">Loading preview...</div>
      )}
    </ResumePageShell>
  );
}
