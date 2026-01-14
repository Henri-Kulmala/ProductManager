import { withCORS, preflight } from "@/lib/cors";
import { getSession } from "@/lib/session";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  const res = new Response(null, { status: 204 });
  const session = await getSession(req, res);
  session.destroy();
  return withCORS(res, req);
}
