export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Builds the Authorization header for every browser-side resume API call.
 *
 * Called by:
 * - fetchJson() in this file for JSON APIs.
 * - app/resumes/upload/page.js directly because uploads use FormData and a
 *   manual fetch call.
 *
 * Reads from:
 * - localStorage.token, which is already populated by CovGen's auth flow.
 *
 * Returns:
 * - { Authorization: "Bearer <token>" } when a user is logged in.
 * - {} when no token exists. Protected backend routes then reject the request.
 */
export const authHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Shared JSON fetch helper for the resume frontend.
 *
 * Called by:
 * - app/resumes/page.js -> GET /api/resumes
 * - app/resumes/[id]/analysis/page.js -> GET /api/resumes/:id and
 *   POST /api/resumes/:id/analyze
 * - app/resumes/[id]/templates/page.js -> GET/PATCH /api/resumes/generated/:id
 * - app/resumes/preview/[id]/page.js -> GET/PATCH /api/resumes/generated/:id
 *
 * Why it exists:
 * - Keeps auth header behavior consistent.
 * - Adds Content-Type only for JSON bodies. FormData uploads intentionally skip
 *   this helper so the browser can set the multipart boundary.
 * - Normalizes backend errors into thrown Error objects so pages can put the
 *   message into their local error state.
 */
export const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

/**
 * Downloads a backend-rendered Puppeteer PDF for a generated resume.
 *
 * Called by:
 * - app/resumes/preview/[id]/page.js printResume()
 *
 * Backend route:
 * - POST /api/resumes/generated/:id/pdf
 * - Handled by covgen-server/controllers/resume-pdf-controller.js
 *   generateResumePdfHandler()
 *
 * Why POST instead of GET:
 * - Keeps auth header support simple (GET with auth is fine too, but POST is
 *   consistent with the rest of the resume API pattern).
 *
 * Error handling:
 * - If the server returns a non-OK response, attempts to parse the JSON error
 *   body and throws it so the caller can display it in the UI.
 * - Network failures propagate naturally.
 */
export const downloadResumePdf = async (generatedId) => {
  const res = await fetch(`${apiBase}/api/resumes/generated/${generatedId}/pdf`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    // Attempt to extract a server-side error message from the JSON body
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "PDF generation failed");
  }

  // Extract suggested filename from Content-Disposition header when available
  const disposition = res.headers.get("Content-Disposition") || "";
  const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/);
  const filename = filenameMatch ? filenameMatch[1] : "Resume.pdf";

  // Convert binary response to a Blob and trigger browser download
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up the temporary object URL and DOM anchor
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  }, 100);
};
