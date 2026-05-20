"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaLinkedin, FaMagic, FaPen } from "react-icons/fa";
import ResumePageShell from "../../../components/resumes/ResumePageShell";
import { fetchJson } from "../../../../lib/resumes/api";

/**
 * JD Tailoring route: /resumes/:id/tailor
 *
 * Backend/API routes hit from this page:
 * - LinkedIn tab "Extract LinkedIn JD" calls frontend route POST /api/fetch-jd.
 *   That route already existed for the cover-letter flow and currently works
 *   best for LinkedIn job URLs only.
 * - "Analyze JD and Tailor Resume" calls backend POST /api/resumes/:id/analyze.
 *
 * Navigation emitted:
 * - On successful tailoring, router.push() sends the user to
 *   /resumes/:id/templates?generated=:generatedResumeId.
 */
export default function ResumeTailorPage() {
  // id is the source Resume MongoDB ObjectId.
  const { id } = useParams();
  const router = useRouter();
  // activeTab controls the pill UI: "linkedin" fetch mode or "manual" paste mode.
  const [activeTab, setActiveTab] = useState("linkedin");
  // linkedinUrl is only used by the LinkedIn extraction tab and sent to /api/fetch-jd.
  const [linkedinUrl, setLinkedinUrl] = useState("");
  // form owns the backend JD tailoring payload.
  const [form, setForm] = useState({ title: "", company: "", jobDescription: "" });
  // fetching controls the LinkedIn extraction button state.
  const [fetching, setFetching] = useState(false);
  // generating controls the final backend resume tailoring button state.
  const [generating, setGenerating] = useState(false);
  // error stores LinkedIn extraction and backend tailoring failures.
  const [error, setError] = useState("");

  /**
   * Reuses the existing cover-letter LinkedIn extraction API.
   *
   * Button wiring:
   * - "Extract LinkedIn JD" button calls fetchLinkedInJob().
   *
   * Route:
   * - POST /api/fetch-jd in app/api/fetch-jd/route.ts.
   */
  const fetchLinkedInJob = async () => {
    if (!linkedinUrl.trim()) return;
    if (!/https?:\/\/([^/]+\.)?linkedin\.com\/jobs\//i.test(linkedinUrl.trim())) {
      setError("LinkedIn extraction only supports LinkedIn job URLs, for example https://www.linkedin.com/jobs/view/...");
      return;
    }
    setFetching(true);
    setError("");
    try {
      const res = await fetch("/api/fetch-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkedinUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.jd) throw new Error(data.error || "Could not extract LinkedIn job description.");
      setForm((current) => ({
        ...current,
        title: data.title || current.title,
        company: data.company || current.company,
        jobDescription: data.jd,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  /**
   * Sends the JD to the backend for JD-specific ATS analysis and tailoring.
   *
   * Button wiring:
   * - "Analyze JD and Tailor Resume" button calls tailorResume().
   *
   * Backend route:
   * - POST /api/resumes/:id/analyze handled by
   *   covgen-server/controllers/resume-controller.js analyzeAndTailor().
   */
  const tailorResume = async () => {
    setGenerating(true);
    setError("");
    try {
      const data = await fetchJson(`/api/resumes/${id}/analyze`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push(`/resumes/${id}/templates?generated=${data.generatedResume._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ResumePageShell
      eyebrow="JD Tailoring"
      title="Tailor Resume for a Job"
      description="Use a LinkedIn job URL or paste the JD manually. LinkedIn extraction only works for LinkedIn job posts."
    >
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <section className="mx-auto max-w-5xl rounded-xl border border-orange-100/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(249,115,22,0.07)]">
        <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <TabButton active={activeTab === "linkedin"} onClick={() => setActiveTab("linkedin")} icon={FaLinkedin} label="Fetch LinkedIn Job" />
          <TabButton active={activeTab === "manual"} onClick={() => setActiveTab("manual")} icon={FaPen} label="Paste JD" />
        </div>

        {activeTab === "linkedin" ? (
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">LinkedIn Job URL</span>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(event) => setLinkedinUrl(event.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                />
                <button
                  onClick={fetchLinkedInJob}
                  disabled={fetching}
                  className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {fetching ? "Extracting..." : "Extract LinkedIn JD"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">This extractor is tuned for LinkedIn job pages only. Other job boards may fail or return messy text.</p>
            </label>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Role title"
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
          />
          <input
            value={form.company}
            onChange={(event) => setForm({ ...form, company: event.target.value })}
            placeholder="Company"
            className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-2 flex justify-between text-sm font-bold text-slate-700">
            <span>{activeTab === "manual" ? "Paste Job Description" : "Extracted or editable Job Description"}</span>
            <span className="text-xs font-medium text-slate-400">{form.jobDescription.length}/15000</span>
          </span>
          <textarea
            value={form.jobDescription}
            maxLength={15000}
            onChange={(event) => setForm({ ...form, jobDescription: event.target.value })}
            placeholder="Paste the full job description here..."
            className="min-h-[360px] w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
          />
        </label>

        <button
          onClick={tailorResume}
          disabled={generating || form.jobDescription.trim().length < 80}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaMagic /> {generating ? "Analyzing and tailoring..." : "Analyze JD and Tailor Resume"}
        </button>
      </section>
    </ResumePageShell>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
    >
      <Icon /> {label}
    </button>
  );
}
