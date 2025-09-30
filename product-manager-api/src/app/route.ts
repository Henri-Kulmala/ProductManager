import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? undefined;
  const published = url.searchParams.get("published") === "true";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
  const cursor = url.searchParams.get("cursor") || undefined;

  const where: any = {};
  if (published) where.isPublished = true;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const nextCursor = items.length > limit ? items.pop()!.id : null;
  return withCORS(Response.json({ items, nextCursor }), req);
}

