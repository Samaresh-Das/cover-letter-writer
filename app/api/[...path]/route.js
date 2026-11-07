import { proxyBackend } from "@/lib/server/backend-proxy";
export const runtime = "nodejs";
export const maxDuration = 300;
async function handler(req, context) {
    const { path } = await context.params;
    return proxyBackend(req, path);
}
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
