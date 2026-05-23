"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaDownload, FaSave } from "react-icons/fa";
import ResumePageShell from "../../../components/resumes/ResumePageShell";
import ResumeTemplate from "../../../components/resumes/ResumeTemplate";
import { fetchJson, downloadResumePdf } from "../../../../lib/resumes/api";

/**
 * Resume Preview route: /resumes/preview/:id
 *
 * Backend routes hit from this page:
 * - useEffect() calls GET /api/resumes/generated/:id to load final preview data.
 * - "Save Resume State" button calls PATCH /api/resumes/generated/:id with PDF
 *   metadata.
 * - "Download PDF" button calls POST /api/resumes/generated/:id/pdf which
 *   triggers Puppeteer-based backend rendering (replaces html2canvas/jsPDF).
 *
 * Components called:
 * - ResumePageShell wraps the page.
 * - ResumeTemplate renders generatedResume.optimizedResume for live preview only.
 *   PDF rendering is done entirely on the backend via resume-pdf-service.js.
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
  // downloadingPdf controls the "Download PDF" button while the backend
  // Puppeteer render is in flight.
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  // pageCount: how many A4 pages the resume content occupies.
  // Measured from the actual rendered height of the resume DOM.
  const [pageCount, setPageCount] = useState(1);
  // Hidden offscreen ref used to measure the true resume content height.
  const measureRef = useRef(null);

  /**
   * A4 content height in pixels (at 96dpi):
   *   A4 = 297mm, @page margin = 0.62in top + 0.62in bottom = 31.5mm
   *   Content height = 297 - 31.5 = 265.5mm = 265.5 * 96/25.4 ≈ 1003.65px
   */
  const PAGE_CONTENT_PX = 265.5 * (96 / 25.4);

  /**
   * 0.62in in pixels at 96dpi = 59.52px.
   * Used to subtract .resume-paper padding from the measured scrollHeight
   * since the hidden measurement div renders .resume-paper with its normal
   * padding, but the page cards strip it and provide their own.
   */
  const PADDING_PX = 0.62 * 96;

  /**
   * Measures the true rendered content height (minus padding) and calculates
   * how many A4 pages are needed.
   */
  const measurePages = useCallback(() => {
    if (!measureRef.current) return;
    requestAnimationFrame(() => {
      if (!measureRef.current) return;
      const rawHeight = measureRef.current.scrollHeight;
      // Subtract top + bottom padding of .resume-paper (rendered with padding
      // in the hidden div) to get pure content height.
      const contentHeight = rawHeight - 2 * PADDING_PX;
      const pages = Math.max(1, Math.ceil(contentHeight / PAGE_CONTENT_PX));
      setPageCount(pages);
    });
  }, [PAGE_CONTENT_PX, PADDING_PX]);

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

  /**
   * Triggers backend Puppeteer PDF generation and downloads the result.
   *
   * Call path:
   * - downloadResumePdf() in lib/resumes/api.js
   * - POST /api/resumes/generated/:id/pdf
   * - covgen-server/controllers/resume-pdf-controller.js generateResumePdfHandler()
   * - covgen-server/services/resume-pdf-service.js generateResumePdf()
   *
   * The browser print dialog, html2canvas, and jsPDF are no longer used.
   * Puppeteer renders the resume server-side from a self-contained HTML template
   * with inline CSS, ensuring A4 pagination, no overflow clipping, and
   * consistent print quality across all platforms.
   */
  const printResume = async () => {
    setDownloadingPdf(true);
    setError("");
    try {
      await saveMarker().catch(() => {});
      await downloadResumePdf(id);
    } catch (err) {
      setError(err.message || "PDF generation failed. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const analysis = generatedResume?.atsAnalysis || {};
  const jd = generatedResume?.jobDescription || {};
  const keywordList = analysis.missingKeywords || analysis.keywordGaps || [];
  const suggestionList = analysis.atsOptimizationSuggestions || analysis.importantSuggestions || [];
  // displayedResume must be declared before the useEffect that measures it.
  const displayedResume = editResume || generatedResume?.optimizedResume;

  // Re-measure page count whenever the displayed resume content changes.
  useEffect(() => {
    measurePages();
  }, [displayedResume, editing, measurePages]);

  return (
    <ResumePageShell
      eyebrow="Step 4"
      title="Resume Preview"
      description="Review ATS suggestions, then use browser print/download to export a clean PDF for MVP validation."
      action={
        <>
          {generatedResume && <Link href={`/resumes/${generatedResume.resume?._id || generatedResume.resume}/templates?generated=${id}`} className="rounded-lg border border-orange-100 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(249,115,22,0.08)]">Templates</Link>}
          <button
            onClick={printResume}
            disabled={!generatedResume || downloadingPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaDownload />
            {downloadingPdf ? "Generating PDF…" : "Download PDF"}
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
          <div className="resume-print-stage overflow-auto rounded-xl print:overflow-visible print:border-0 print:bg-white print:p-0 print:shadow-none">
            {/* Hidden offscreen copy for measuring true content height.
                Renders with normal .resume-paper padding so we can measure
                scrollHeight and subtract padding to get pure content height. */}
            <div
              ref={measureRef}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', visibility: 'hidden' }}
            >
              <ResumeTemplate resume={displayedResume} template={generatedResume.template} />
            </div>

            {/* Multi-page view: scrollable container with discrete A4 page cards.
                Each card has 0.62in padding (simulating @page margins) and a
                clip div that shows only 265.5mm of content per page. */}
            <div className="resume-page-view">
              {Array.from({ length: pageCount }, (_, i) => (
                <div key={i} className="resume-page-card">
                  <div className="resume-page-clip">
                    <div style={{ marginTop: `${-i * PAGE_CONTENT_PX}px` }}>
                      <ResumeTemplate
                        resume={displayedResume}
                        template={generatedResume.template}
                        isEditing={editing && i === 0}
                        onFieldChange={i === 0 ? handleResumeChange : undefined}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-orange-100/80 bg-white/95 p-8 text-slate-500 shadow-[0_20px_70px_rgba(249,115,22,0.06)]">Loading preview...</div>
      )}
    </ResumePageShell>
  );
}
