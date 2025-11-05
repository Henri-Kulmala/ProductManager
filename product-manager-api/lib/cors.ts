
const ALLOW_ORIGIN =
  process.env.ADMIN_ORIGIN || "https://tuotehallinta.api.xn--blenhella-07a.fi/";

export function withCORS(init?: ResponseInit) {
  const base = init || {};
  const headers = new Headers(base.headers || {});
  headers.set("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  headers.set("Vary", "Origin");
  return { ...base, headers };
}

export function preflightResponse() {
  return new Response(null, withCORS({ status: 204 }));
}
