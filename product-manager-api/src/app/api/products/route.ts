import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductCreate } from "@/lib/validation";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return withCORS(Response.json({ items }), req);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ProductCreate.safeParse(body);
  if (!parsed.success) {
    return withCORS(
      Response.json({ error: parsed.error.message }, { status: 400 }),
      req
    );
  }
  const created = await prisma.product.create({ data: parsed.data });
  return withCORS(Response.json(created, { status: 201 }), req);
}
