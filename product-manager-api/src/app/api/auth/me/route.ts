import { withCORS, preflight } from "@/lib/cors";
import { getSession } from "@/lib/session";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const res = new Response(null, { status: 200 });
  const session = await getSession(req, res);
  if (!session.user) {
    return withCORS(Response.json({ user: null }, { status: 200 }), req);
  }
  return withCORS(Response.json({ user: session.user }, { status: 200 }), req);
}
