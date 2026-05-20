"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ResumePageShell from "../../../components/resumes/ResumePageShell";
import ResumeTemplate from "../../../components/resumes/ResumeTemplate";
import { fetchJson } from "../../../../lib/resumes/api";
import { resumeTemplates } from "../../../../lib/resumes/template-data";

/**
 * Template Selection route: /resumes/:id/templates?generated=:generatedId
 *
 * Backend routes hit from this page:
 * - useEffect() calls GET /api/resumes/generated/:generatedId to load the
 *   tailored resume JSON and current template choice.
 * - "Continue to Preview" button calls PATCH /api/resumes/generated/:generatedId
 *   to save the selected template before navigation.
 *
 * Components called:
 * - ResumePageShell wraps the page.
 * - ResumeTemplate receives local selected template state and generated
 *   optimizedResume content to render the live preview.
 */
export default function TemplateSelectionPage() {
  // id is the source resume ID from [id]. It is used only for navigation back
  // to analysis; the preview data itself is fetched by generatedId.
  const { id } = useParams();
  // generatedId comes from the query string set by analysis/page.js after
  // POST /api/resumes/:id/analyze returns generatedResume._id.
  const params = useSearchParams();
  const router = useRouter();
  const generatedId = params.get("generated");
  // generatedResume stores the full generated resume document returned by
  // GET /api/resumes/generated/:generatedId.
  const [generatedResume, setGeneratedResume] = useState(null);
  // selected owns the local template choice while the user clicks template
  // cards. It is not persisted until saveAndPreview() PATCHes the backend.
  const [selected, setSelected] = useState("ats-classic");
  // error displays failed generated-resume fetches or failed template saves.
  const [error, setError] = useState("");

  /**
   * Loads the generated resume once the generated query parameter is available.
   *
   * Cross-file call path:
   * - app/resumes/[id]/templates/page.js useEffect()
   * - lib/resumes/api.js fetchJson(`/api/resumes/generated/${generatedId}`)
   * - covgen-server/routes/resume-routes.js router.get("/generated/:id")
   * - covgen-server/controllers/resume-controller.js getGeneratedResume()
   *
   * Side effects:
   * - setGeneratedResume() stores optimizedResume for preview.
   * - setSelected() syncs local template state to the template saved in MongoDB.
   */
  useEffect(() => {
    if (!generatedId) return;
    fetchJson(`/api/resumes/generated/${generatedId}`)
      .then((data) => {
        setGeneratedResume(data.generatedResume);
        setSelected(data.generatedResume.template || "ats-classic");
      })
      .catch((err) => setError(err.message));
  }, [generatedId]);

  /**
   * Memoized resume content passed into ResumeTemplate.
   *
   * Props flow:
   * - generatedResume.optimizedResume -> resume -> ResumeTemplate({ resume }).
   *
   * The fallback empty object lets the preview component render safely while the
   * GET request is still pending.
   */
  const resume = useMemo(
    () => generatedResume?.optimizedResume || {},
    [generatedResume],
  );
  const jobTitle = generatedResume?.jobDescription?.title || "";
  const suggestedTemplates = useMemo(() => {
    const normalizedTitle = jobTitle.toLowerCase();
    if (!normalizedTitle) return [];
    return resumeTemplates.filter((template) =>
      (template.roles || []).some((role) =>
        normalizedTitle.includes(role.toLowerCase()),
      ),
    );
  }, [jobTitle]);

  /**
   * Persists the selected controlled template and moves to final preview.
   *
   * Button wiring:
   * - "Continue to Preview" button below calls saveAndPreview().
   *
   * Backend route:
   * - PATCH /api/resumes/generated/:generatedId with { template: selected }.
   * - Handled by covgen-server/controllers/resume-controller.js
   *   updateGeneratedResume().
   */
  const saveAndPreview = async () => {
    try {
      await fetchJson(`/api/resumes/generated/${generatedId}`, {
        method: "PATCH",
        body: JSON.stringify({ template: selected }),
      });
      router.push(`/resumes/preview/${generatedId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ResumePageShell
      eyebrow="Step 3"
      title="Template Selection"
      description="Choose from controlled HTML templates. Layouts are fixed and print-safe; AI only tailors content."
      action={
        <Link
          href={`/resumes/${id}/tailor`}
          className="rounded-lg border border-orange-100 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(249,115,22,0.08)]"
        >
          Tailor for JD
        </Link>
      }
    >
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-3">
          {suggestedTemplates.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Suggested for {jobTitle}
              </p>
              <div className="mt-3 space-y-3">
                {suggestedTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelected(template.id)}
                    className={`w-full rounded-xl border bg-white/95 p-4 text-left transition ${selected === template.id ? "border-orange-500 shadow-[0_18px_50px_rgba(249,115,22,0.13)]" : "border-orange-100 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:border-orange-300 hover:shadow-[0_14px_38px_rgba(249,115,22,0.10)]"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-bold text-slate-950">
                        {template.name}
                      </h2>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">
                        {template.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-100 bg-white/95 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              All templates
            </h3>
            <div className="mt-3 space-y-3">
              {resumeTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelected(template.id)}
                  className={`w-full rounded-xl border bg-white/95 p-4 text-left transition ${selected === template.id ? "border-orange-500 shadow-[0_18px_50px_rgba(249,115,22,0.13)]" : "border-orange-100 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:border-orange-300 hover:shadow-[0_14px_38px_rgba(249,115,22,0.10)]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-bold text-slate-950">
                      {template.name}
                    </h2>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">
                      {template.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveAndPreview}
            disabled={!generatedResume}
            className="w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            Continue to Preview
          </button>
        </aside>
        <div className="overflow-auto rounded-xl border border-orange-100/80 bg-white p-5 shadow-[0_22px_70px_rgba(249,115,22,0.08)]">
          <ResumeTemplate resume={resume} template={selected} />
        </div>
      </div>
    </ResumePageShell>
  );
}
