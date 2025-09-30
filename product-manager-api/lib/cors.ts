const ALLOWED = (process.env.CORS_ORIGIN ?? "*")
  .split(",")
  .map((s) => s.trim());

export function withCORS(res: Response, req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allow =
    ALLOWED.includes("*") || ALLOWED.includes(origin) ? origin || "*" : "null";
  res.headers.set("Access-Control-Allow-Origin", allow);
  res.headers.set("Vary", "Origin");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}
export function preflight(req: Request) {
  return withCORS(new Response(null, { status: 204 }), req);
}
