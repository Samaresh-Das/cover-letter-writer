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
