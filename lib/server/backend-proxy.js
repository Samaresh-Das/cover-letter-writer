import { NextResponse } from "next/server";

const SESSION = "covgen_session";
const REGISTRATION = "covgen_registration";
const allowed = /^(auth\/(google|register)|users\/(profile|usage|onboarding|extract-jd)|generate|pricing|contact|payment\/(create-order|history)|coverletters(?:\/(?:bulk-delete|[a-f\d]{24}))?|jobs\/(?:recommended|[a-f\d]{24}(?:\/(?:save|apply|feedback))?)|resumes(?:\/(?:upload|generated\/[a-f\d]{24}(?:\/pdf)?|[a-f\d]{24}(?:\/(?:analyze|analyze-general|apply-general))?))?)$/i;

async function readBody(req, limit) {
    if (Number(req.headers.get("content-length")) > limit) throw new Error("Request too large");
    const reader = req.body?.getReader();
    if (!reader) return undefined;
    const chunks = []; let length = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.length;
            if (length > limit) throw new Error("Request too large");
            chunks.push(Buffer.from(value));
        }
        return Buffer.concat(chunks);
    } finally { await reader.cancel().catch(() => {}); }
}

function cookieOptions() {
    return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" };
}

export async function proxyBackend(req, segments) {
    const path = segments.join("/");
    const mutation = !["GET", "HEAD"].includes(req.method);
    if (mutation) {
        const expectedOrigin = new URL(process.env.APP_URL || req.url).origin;
        if (req.headers.get("origin") !== expectedOrigin || req.headers.get("sec-fetch-site") === "cross-site") {
            return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
        }
    }
    if (path === "auth/logout" && req.method === "POST") {
        const response = NextResponse.json({ success: true });
        for (const name of [SESSION, REGISTRATION, "token", "registrationToken"]) response.cookies.set(name, "", { ...cookieOptions(), maxAge: 0 });
        return response;
    }
    if (!allowed.test(path)) return NextResponse.json({ message: "Not found." }, { status: 404 });
    const token = req.cookies.get(path === "auth/register" ? REGISTRATION : SESSION)?.value;
    if (!["auth/google", "pricing", "contact"].includes(path) && !token) {
        return NextResponse.json({ message: "Please sign in again.", error: "Please sign in again." }, { status: 401 });
    }
    const base = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return NextResponse.json({ message: "API connection is not configured." }, { status: 503 });
    try {
        const target = new URL(`/api/${segments.map(encodeURIComponent).join("/")}`, base);
        for (const name of ["page", "limit"]) {
            const value = new URL(req.url).searchParams.get(name);
            if (value !== null) target.searchParams.set(name, value);
        }
        const headers = { "Content-Type": req.headers.get("content-type") || "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const body = mutation ? await readBody(req, path === "resumes/upload" ? 6 * 1024 * 1024 : 100 * 1024) : undefined;
        const upstream = await fetch(target, { method: req.method, headers, body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(path.startsWith("resumes/") ? 270000 : 90000) });
        if (["auth/google", "auth/register"].includes(path) && upstream.ok) {
            const data = await upstream.json();
            const credential = data.token;
            if (typeof credential !== "string") throw new Error("Missing session");
            // This is only a UI presence marker; the credential stays HttpOnly.
            data.token = "session";
            const response = NextResponse.json(data, { status: upstream.status });
            response.headers.set("Cache-Control", "no-store");
            const registration = data.requiresRegistration === true;
            response.cookies.set(registration ? REGISTRATION : SESSION, credential, { ...cookieOptions(), maxAge: registration ? 3600 : 604800 });
            response.cookies.set(registration ? SESSION : REGISTRATION, "", { ...cookieOptions(), maxAge: 0 });
            return response;
        }
        const response = new NextResponse(upstream.body, { status: upstream.status });
        for (const name of ["content-type", "content-disposition", "retry-after"]) {
            if (upstream.headers.has(name)) response.headers.set(name, upstream.headers.get(name));
        }
        response.headers.set("Cache-Control", "no-store");
        response.headers.set("X-Content-Type-Options", "nosniff");
        if (upstream.status === 401 || upstream.status === 403 && path === "users/profile") response.cookies.set(SESSION, "", { ...cookieOptions(), maxAge: 0 });
        return response;
    } catch (error) {
        const status = error.message === "Request too large" ? 413 : 502;
        return NextResponse.json({ message: status === 413 ? "Request too large." : "API request failed. Please try again.", error: "Request failed. Please try again." }, { status });
    }
}
