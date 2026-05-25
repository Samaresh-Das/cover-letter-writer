"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaFileUpload, FaRegFileAlt, FaTrash } from "react-icons/fa";
import ResumePageShell from "../components/resumes/ResumePageShell";
import { fetchJson } from "../../lib/resumes/api";

/**
 * Resume Dashboard route: /resumes
 *
 * Backend routes hit from this page:
 * - useEffect() calls GET /api/resumes through lib/resumes/api.js -> fetchJson().
 *
 * Navigation emitted from this page:
 * - "Upload Resume" link routes to /resumes/upload.
 * - Each source resume card routes to /resumes/:resumeId/analysis.
 * - Each tailored resume card routes to /resumes/preview/:generatedResumeId.
 *
 * Components called:
 * - ResumePageShell from app/components/resumes/ResumePageShell.js receives the
 *   page title/copy/action and wraps the dashboard content.
 */
export default function ResumeDashboardPage() {
  // data owns both dashboard lists returned by GET /api/resumes:
  // - resumes: original parsed resume assets from covgen-server/models/resume.js.
  // - generatedResumes: JD-tailored outputs from covgen-server/models/generated-resume.js.
  const [data, setData] = useState({ resumes: [], generatedResumes: [] });
  // loading controls the first-load placeholder while the dashboard API request is in flight.
  const [loading, setLoading] = useState(true);
  // error stores the normalized message thrown by fetchJson() if the backend rejects/fails.
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleDeleteTailored = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tailored resume?")) return;
    try {
      await fetchJson(`/api/resumes/generated/${id}`, { method: "DELETE" });
      setData(prev => {
        const newGenerated = prev.generatedResumes.filter(r => r._id !== id);
        // Adjust pagination if deleting the last item on the current page
        const newTotal = newGenerated.length;
        if (currentPage > 1 && newTotal <= (currentPage - 1) * ITEMS_PER_PAGE) {
          setCurrentPage(prevPage => prevPage - 1);
        }
        return { ...prev, generatedResumes: newGenerated };
      });
    } catch (err) {
      alert(err.message || "Failed to delete resume");
    }
  };

  const totalPages = Math.ceil(data.generatedResumes.length / ITEMS_PER_PAGE);
  const paginatedResumes = data.generatedResumes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * Loads the authenticated user's resume workspace once when /resumes mounts.
   *
   * Cross-file call path:
   * - app/resumes/page.js useEffect()
   * - lib/resumes/api.js fetchJson("/api/resumes")
   * - covgen-server/routes/resume-routes.js router.get("/")
   * - covgen-server/controllers/resume-controller.js listResumes()
   */
  useEffect(() => {
    fetchJson("/api/resumes")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ResumePageShell
      eyebrow="Resume Optimization"
      title="Resume Dashboard"
      description="Upload once, keep structured resume JSON, tailor it to job descriptions, and export controlled ATS-aware PDFs."
      action={
        <Link href="/resumes/upload" className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-700">
          <FaFileUpload /> Upload Resume
        </Link>
      }
    >
      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-orange-100 bg-white/95 p-8 text-slate-500 shadow-[0_20px_70px_rgba(249,115,22,0.06)]">Loading resume workspace...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Source Resumes</h2>
              <span className="text-sm text-slate-500">{data.resumes.length} saved</span>
            </div>
            <div className="space-y-3">
              {data.resumes.length === 0 && <p className="rounded-lg border border-orange-100 bg-white p-4 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(249,115,22,0.10)]">No resumes yet. Upload a selectable PDF or DOCX to start.</p>}
              {data.resumes.map((resume) => {
                const info = resume.structured?.personalInfo || {};
                return (
                  <Link key={resume._id} href={`/resumes/${resume._id}/analysis`} className="block rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.03)] transition hover:border-orange-300 hover:shadow-[0_12px_34px_rgba(249,115,22,0.10)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{info.name || resume.originalFile?.filename || "Untitled resume"}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{resume.structured?.summary || "Structured resume ready for JD tailoring."}</p>
                        <p className="mt-2 text-xs uppercase tracking-wide text-orange-600">{resume.parsing?.status === "needs_review" ? "Needs review" : "Parsed"}</p>
                      </div>
                      <FaArrowRight className="mt-1 text-orange-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Tailored Resumes</h2>
              <span className="text-sm text-slate-500">{data.generatedResumes.length} generated</span>
            </div>
            <div className="space-y-3">
              {data.generatedResumes.length === 0 && <p className="rounded-lg border border-slate-100 bg-white p-4 text-sm text-slate-600">JD-tailored resumes will appear here.</p>}
              {paginatedResumes.map((item) => (
                <div key={item._id} className="group relative flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.03)] hover:border-orange-300 hover:shadow-[0_12px_34px_rgba(249,115,22,0.10)] transition-all">
                  <Link href={`/resumes/preview/${item._id}`} className="flex-1">
                    <div>
                      <p className="font-semibold text-slate-900">{item.jobDescription?.title || (item.generationType === "general" ? "General Optimized Resume" : "Tailored Resume")}</p>
                      <p className="text-sm text-slate-500">{item.jobDescription?.company || item.template}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                      <FaRegFileAlt />
                      {item.atsAnalysis?.matchScore ?? item.atsAnalysis?.atsScore ?? 0}%
                    </div>
                    <button
                      onClick={() => handleDeleteTailored(item._id)}
                      className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete tailored resume"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </ResumePageShell>
  );
}
