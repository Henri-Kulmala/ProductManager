import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return withCORS(
      Response.json({ error: "Unauthorized" }, { status: 401 }),
      req
    );
 

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() || "";
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || "50", 10),
    100
  );
  const cursor = url.searchParams.get("cursor") || undefined;

  const where: any = {};
  if (search)
    where.OR = [
      { name: { contains: search } },
      { ingredients: { contains: search } },
    ];

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const nextCursor = items.length > limit ? items.pop()!.id : null;
  return withCORS(Response.json({ items, nextCursor }), req);
}

export async function POST(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return withCORS(
      Response.json({ error: "Unauthorized" }, { status: 401 }),
      req
    );
 

  const body = await req.json().catch(() => null);
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) {
    return withCORS(
      Response.json({ error: parsed.error.message }, { status: 400 }),
      req
    );
  }

  const created = await prisma.product.create({ data: parsed.data });
  return withCORS(Response.json(created, { status: 201 }), req);
}
