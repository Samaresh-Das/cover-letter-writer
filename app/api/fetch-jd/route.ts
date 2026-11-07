import { proxyBackend } from "@/lib/server/backend-proxy";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(req) {
  return proxyBackend(req, ["users", "extract-jd"]);
}
