
const ALLOW_ORIGINS = (
  process.env.ADMIN_ORIGINS ??
  process.env.ADMIN_ORIGIN ??
  ""
)
  .split(",")
  .map((s) => s.trim().replace(/\/$/, "")) 
  .filter(Boolean);


function pickAllowedOrigin(req?: Request): string | null {
  const reqOrigin = req?.headers.get("origin");
  if (!reqOrigin) return null;
  if (ALLOW_ORIGINS.length === 0) return null; 
  return ALLOW_ORIGINS.includes(reqOrigin) ? reqOrigin : null;
}


export function withCORS(
  resOrInit: Response | ResponseInit,
  req?: Request
): Response {
  const base =
    resOrInit instanceof Response ? resOrInit : new Response(null, resOrInit);
  const headers = new Headers(base.headers);

  const allowOrigin = pickAllowedOrigin(req) ?? ALLOW_ORIGINS[0] ?? "";
  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
    headers.set("Vary", "Origin");
  }
  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

  return new Response(base.body, {
    status: base.status,
    statusText: base.statusText,
    headers,
  });
}


export function preflight(req: Request): Response {
  return withCORS(new Response(null, { status: 204 }), req);
}
