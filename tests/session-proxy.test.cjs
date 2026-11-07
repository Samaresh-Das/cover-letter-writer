const { test } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const { NextRequest, NextResponse } = require("next/server");
const source = fs.readFileSync(require.resolve("../lib/server/backend-proxy.js"), "utf8").replace(/^import .*;$/m, "").replace("export async function proxyBackend", "async function proxyBackend");
function proxy(fetch) {
    const context = { NextResponse, fetch, URL, Buffer, AbortSignal, process: { env: { NODE_ENV: "production", BACKEND_API_URL: "https://api.example.invalid", APP_URL: "https://app.example.invalid" } } };
    vm.createContext(context); vm.runInContext(source + "\nthis.handler = proxyBackend;", context);
    return context.handler;
}
function request(path, options = {}) {
    return new NextRequest(`https://app.example.invalid/api/${path}`, { method: "POST", headers: { origin: "https://app.example.invalid", "content-type": "application/json" }, body: "{}", ...options });
}
test("login stores credentials only in HttpOnly Secure cookies", async () => {
    const handler = proxy(async () => Response.json({ token: "secret-test-jwt", user: { id: "test" }, requiresRegistration: false }));
    const response = await handler(request("auth/google"), ["auth", "google"]);
    assert.equal((await response.json()).token, "session");
    const cookies = response.headers.get("set-cookie");
    assert.match(cookies, /covgen_session=secret-test-jwt/); assert.match(cookies, /HttpOnly/); assert.match(cookies, /Secure/); assert.match(cookies, /SameSite=lax/);
});
test("registration cookie is separate and used only to register", async () => {
    const login = proxy(async () => Response.json({ token: "registration-jwt", requiresRegistration: true }));
    const response = await login(request("auth/google"), ["auth", "google"]);
    assert.match(response.headers.get("set-cookie"), /covgen_registration=registration-jwt/);
    const handler = proxy(async (_url, options) => { assert.equal(options.headers.Authorization, "Bearer registration-jwt"); return Response.json({ token: "new-session" }); });
    const registered = await handler(request("auth/register", { headers: { origin: "https://app.example.invalid", cookie: "covgen_registration=registration-jwt" } }), ["auth", "register"]);
    assert.equal(registered.status, 200); assert.match(registered.headers.get("set-cookie"), /covgen_session=new-session/);
});
test("protected requests require cookies, reject CSRF and ignore caller Authorization", async () => {
    let called = false;
    const handler = proxy(async (_url, options) => { called = true; assert.equal(options.headers.Authorization, "Bearer cookie-token"); return Response.json({ ok: true }); });
    assert.equal((await handler(request("users/onboarding"), ["users", "onboarding"])).status, 401);
    assert.equal((await handler(request("users/onboarding", { headers: { origin: "https://evil.invalid", cookie: "covgen_session=cookie-token" } }), ["users", "onboarding"])).status, 403);
    assert.equal(called, false);
    const response = await handler(request("users/onboarding", { headers: { origin: "https://app.example.invalid", cookie: "covgen_session=cookie-token", authorization: "Bearer attacker-token" } }), ["users", "onboarding"]);
    assert.equal(response.status, 200); assert.equal(called, true);
});
test("proxy rejects traversal and oversized bodies and preserves PDF downloads", async () => {
    const handler = proxy(async () => new Response("%PDF-test", { headers: { "content-type": "application/pdf", "content-disposition": 'attachment; filename="Resume.pdf"' } }));
    assert.equal((await handler(request("users/profile"), ["..", "internal"])).status, 404);
    const headers = { origin: "https://app.example.invalid", cookie: "covgen_session=test", "content-type": "application/json" };
    assert.equal((await handler(request("users/onboarding", { headers, body: "x".repeat(102401) }), ["users", "onboarding"])).status, 413);
    const response = await handler(request("resumes/generated/" + "a".repeat(24) + "/pdf", { headers }), ["resumes", "generated", "a".repeat(24), "pdf"]);
    assert.equal(await response.text(), "%PDF-test"); assert.match(response.headers.get("content-disposition"), /Resume.pdf/);
});
test("logout expires both credential cookies", async () => {
    const response = await proxy(() => { throw new Error("must not fetch"); })(request("auth/logout"), ["auth", "logout"]);
    assert.equal(response.status, 200); assert.match(response.headers.get("set-cookie"), /covgen_session=;.*Max-Age=0/);
});
