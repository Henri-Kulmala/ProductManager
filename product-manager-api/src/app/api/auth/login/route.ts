import { withCORS, preflight } from "@/lib/cors";
import { getSession } from "@/lib/session";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = (body?.username ?? "").toString();
  const password = (body?.password ?? "").toString();

  const ok =
    username === (process.env.ADMIN_USER || "") &&
    password === (process.env.ADMIN_PASS || "");

  if (!ok) {
    return withCORS(
      Response.json({ error: "Unauthorized" }, { status: 401 }),
      req
    );
  }

  const res = new Response(null, { status: 204 });
  const session = await getSession(req, res);
  session.user = { id: "admin", role: "admin" };
  await session.save();
  return withCORS(res, req);
}
