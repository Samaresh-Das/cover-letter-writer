"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt } from "react-icons/fa";
import ResumePageShell from "../../components/resumes/ResumePageShell";
import { apiBase, authHeaders } from "../../../lib/resumes/api";

/**
 * Upload Resume route: /resumes/upload
 *
 * Backend route hit from this page:
 * - "Parse Resume" button calls upload(), which POSTs multipart/form-data to
 *   /api/resumes/upload.
 *
 * Backend call path:
 * - app/resumes/upload/page.js upload()
 * - covgen-server/routes/resume-routes.js router.post("/upload")
 * - multer memory upload middleware validates multipart body
 * - covgen-server/controllers/resume-controller.js uploadResume()
 * - covgen-server/services/resume-extraction-service.js extractResumeText()
 * - covgen-server/services/resume-ai-service.js parseResumeText()
 */
export default function UploadResumePage() {
  const router = useRouter();
  // file owns the browser File selected by the hidden input. It is appended as
  // FormData key "resume", matching upload.single("resume") in resume-routes.js.
  const [file, setFile] = useState(null);
  // loading disables the Parse Resume button and swaps the button label while
  // extraction + AI parsing are running on the backend.
  const [loading, setLoading] = useState(false);
  // error stores backend validation/extraction messages, including scanned PDF
  // and malformed file messages.
  const [error, setError] = useState("");

  /**
   * Uploads the selected resume to the backend for validation, text extraction,
   * AI parsing, Zod validation, and MongoDB storage.
   *
   * Button wiring:
   * - The "Parse Resume" button below calls this function through onClick.
   *
   * Route wiring:
   * - POST ${NEXT_PUBLIC_API_BASE_URL}/api/resumes/upload
   * - Headers come from lib/resumes/api.js authHeaders().
   *
   * On success:
   * - Backend returns { resume }.
   * - The page navigates to /resumes/:resumeId/analysis so the user can paste a
   *   JD against the newly stored structured resume JSON.
   */
  const upload = async () => {
    if (!file) {
      setError("Choose a PDF or DOCX resume first.");
      return;
    }
    setLoading(true);
    setError("");
    const body = new FormData();
    body.append("resume", file);

    try {
      const res = await fetch(`${apiBase}/api/resumes/upload`, {
        method: "POST",
        headers: authHeaders(),
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      router.push(`/resumes/${data.resume._id}/analysis`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumePageShell
      eyebrow="Step 1"
      title="Upload Resume"
      description="Upload a selectable PDF or DOCX under 5MB. CovGen will parse it, create structured resume JSON, and show a general ATS report before any JD tailoring."
    >
      <section className="mx-auto max-w-3xl rounded-xl border border-orange-100/80 bg-white/95 p-6 shadow-[0_22px_70px_rgba(249,115,22,0.08)] backdrop-blur">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-white px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(249,115,22,0.10)] hover:border-orange-400">
          <FaCloudUploadAlt className="mb-4 text-4xl text-orange-600" />
          <span className="text-lg font-bold text-slate-900">{file ? file.name : "Select resume file"}</span>
          <span className="mt-2 text-sm text-slate-500">PDF or DOCX, maximum 5MB</span>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          onClick={upload}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Extracting, parsing, and analyzing..." : "Parse and Analyze Resume"}
        </button>
      </section>
    </ResumePageShell>
  );
}
