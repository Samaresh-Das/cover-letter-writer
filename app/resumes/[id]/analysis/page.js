"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowRight, FaBolt, FaChartLine, FaUsers } from "react-icons/fa";
import ResumePageShell from "../../../components/resumes/ResumePageShell";
import { fetchJson } from "../../../../lib/resumes/api";

/**
 * General Resume Analysis route: /resumes/:id/analysis
 *
 * Backend routes hit from this page:
 * - useEffect() calls GET /api/resumes/:id to load the parsed source resume and
 *   generalAnalysis generated during upload.
 * - "Apply General Improvements" button calls POST /api/resumes/:id/apply-general.
 *
 * Navigation emitted from this page:
 * - Apply general improvements -> /resumes/:id/templates?generated=:generatedId.
 * - Tailor for a JD -> /resumes/:id/tailor.
 */
export default function ResumeAnalysisPage() {
  // id is the source Resume MongoDB ObjectId from the dynamic route segment [id].
  const { id } = useParams();
  const router = useRouter();
  // resume stores the source resume document returned by GET /api/resumes/:id.
  // The general report reads resume.generalAnalysis and resume.structured.
  const [resume, setResume] = useState(null);
  // loading controls the first page fetch placeholder.
  const [loading, setLoading] = useState(true);
  // applying controls the Apply General Improvements button while Groq rewrites
  // content according to general suggestions.
  const [applying, setApplying] = useState(false);
  // refreshing controls the "Refresh Analysis" button, which regenerates and
  // saves generalAnalysis for resumes that currently show fallback 0 scores.
  const [refreshing, setRefreshing] = useState(false);
  // error stores fetch/apply failures from lib/resumes/api.js fetchJson().
  const [error, setError] = useState("");

  /**
   * Loads parsed resume and stored general analysis.
   *
   * Cross-file call path:
   * - app/resumes/[id]/analysis/page.js useEffect()
   * - lib/resumes/api.js fetchJson(`/api/resumes/${id}`)
   * - covgen-server/routes/resume-routes.js router.get("/:id")
   * - covgen-server/controllers/resume-controller.js getResume()
   */
  useEffect(() => {
    fetchJson(`/api/resumes/${id}`)
      .then((data) => setResume(data.resume))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * Creates a generated resume using the upload-time general analysis.
   *
   * Button wiring:
   * - "Apply General Improvements" calls this function.
   *
   * Backend route:
   * - POST /api/resumes/:id/apply-general
   * - Handled by covgen-server/controllers/resume-controller.js
   *   applyGeneralSuggestions().
   */
  const applyGeneralSuggestions = async () => {
    setApplying(true);
    setError("");
    try {
      const data = await fetchJson(`/api/resumes/${id}/apply-general`, {
        method: "POST",
        body: JSON.stringify({ template: "ats-classic" }),
      });
      router.push(`/resumes/${id}/templates?generated=${data.generatedResume._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  /**
   * Regenerates the general ATS report for this already-uploaded resume.
   *
   * Button wiring:
   * - "Refresh Analysis" calls this function.
   *
   * Backend route:
   * - POST /api/resumes/:id/analyze-general
   * - Handled by covgen-server/controllers/resume-controller.js
   *   refreshGeneralAnalysis().
   */
  const refreshGeneralAnalysis = async () => {
    setRefreshing(true);
    setError("");
    try {
      const data = await fetchJson(`/api/resumes/${id}/analyze-general`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setResume(data.resume);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const info = resume?.structured?.personalInfo || {};
  const analysis = resume?.generalAnalysis || {};
  const looksLikeFallback =
    (analysis.atsScore ?? 0) === 0 &&
    (analysis.clarityScore ?? 0) === 0 &&
    (analysis.impactScore ?? 0) === 0 &&
    (analysis.competitorScore ?? 0) === 0;
  const scores = [
    { label: "ATS Score", value: analysis.atsScore ?? 0, icon: FaChartLine },
    { label: "Clarity", value: analysis.clarityScore ?? 0, icon: FaBolt },
    { label: "Impact", value: analysis.impactScore ?? 0, icon: FaChartLine },
    { label: "Competitor Score", value: analysis.competitorScore ?? 0, icon: FaUsers },
  ];

  return (
    <ResumePageShell
      eyebrow="Upload Analysis"
      title="General ATS Report"
      description="Before tailoring to a job, CovGen checks overall ATS readiness, recruiter clarity, keyword coverage, and how your resume compares with strong applicants."
      action={
        <Link href={`/resumes/${id}/tailor`} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-800">
          Tailor for JD <FaArrowRight />
        </Link>
      }
    >
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="rounded-xl border border-orange-100/80 bg-white/95 p-8 text-slate-500 shadow-[0_20px_70px_rgba(249,115,22,0.06)]">Loading general resume analysis...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)]">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Parsed Resume</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{info.name || "Untitled Resume"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{resume?.structured?.summary || "No summary detected."}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {scores.map((score) => {
                const Icon = score.icon;
                return (
                  <div key={score.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-600">{score.label}</span>
                      <Icon className="text-orange-500" />
                    </div>
                    <div className="mt-3 text-4xl font-black text-slate-950">{score.value}%</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={applyGeneralSuggestions}
                disabled={applying}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {applying ? "Applying suggestions..." : "Apply General Improvements"}
              </button>
              <Link href={`/resumes/${id}/tailor`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-orange-300">
                Tailor According to JD
              </Link>
            </div>
            <button
              onClick={refreshGeneralAnalysis}
              disabled={refreshing}
              className="mt-3 w-full rounded-lg border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-700 hover:border-orange-300 disabled:opacity-60"
            >
              {refreshing ? "Refreshing analysis..." : looksLikeFallback ? "Refresh Analysis to Fill Scores" : "Refresh Analysis"}
            </button>
            {looksLikeFallback && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                These scores are showing fallback values from a failed or incomplete analysis. Refreshing will regenerate and save the report.
              </p>
            )}
          </section>

          <section className="grid gap-4">
            <InsightPanel title="Strengths" items={analysis.strengths} empty="No strengths returned yet." />
            <InsightPanel title="Critical Issues" items={analysis.criticalIssues} tone="red" empty="No critical issues returned." />
            <InsightPanel title="Important Suggestions" items={analysis.importantSuggestions} tone="orange" empty="No suggestions returned." />
            <InsightPanel title="Competitor Insights" items={analysis.competitorInsights} tone="slate" empty="No competitor insights returned." />
            <InsightPanel title="Keyword Gaps" items={analysis.keywordGaps} tone="orange" empty="No keyword gaps returned." />
          </section>
        </div>
      )}
    </ResumePageShell>
  );
}

function InsightPanel({ title, items = [], tone = "slate", empty }) {
  const border = tone === "red" ? "border-red-100" : tone === "orange" ? "border-orange-100" : "border-slate-100";
  const bullet = tone === "red" ? "bg-red-500" : tone === "orange" ? "bg-orange-500" : "bg-slate-500";

  return (
    <section className={`rounded-xl border ${border} bg-white/95 p-5 shadow-[0_14px_44px_rgba(15,23,42,0.04)]`}>
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {(items?.length ? items : [empty]).map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${bullet}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
