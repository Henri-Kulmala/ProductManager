import { getSession } from "@/lib/session";

export async function requireUser(req: Request) {
  const res = new Response(null, { status: 200 });
  const session = await getSession(req, res);
  return session.user ?? null;
}

export function isAdmin(user: any) {
  return user?.role === "admin";
}
