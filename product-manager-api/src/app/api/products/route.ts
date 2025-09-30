import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() || "";
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || "20", 10),
    100
  );
  const cursor = url.searchParams.get("cursor") || undefined;

  const where: any = {};
  if (search)
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
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
  const body = await req.json().catch(() => null);
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) {
    return withCORS(
      Response.json({ error: parsed.error.message }, { status: 400 }),
      req
    );
  }
  const created = await prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price, // string "12.34" OK for Decimal
    },
  });
  return withCORS(Response.json(created, { status: 201 }), req);
}
