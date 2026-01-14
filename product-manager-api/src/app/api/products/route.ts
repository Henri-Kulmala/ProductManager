import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireUser(req);
    if (!user) {
      return withCORS(
        Response.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const ean = url.searchParams.get("ean")?.trim() || "";
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "50", 10),
      100
    );
    const cursor = url.searchParams.get("cursor") || undefined;

    const where: any = {};
    const or: any[] = [];

    if (search) {
      or.push(
        { name: { contains: search } },
        { ingredients: { contains: search } },
        { allergens: { contains: search } },
        { EAN: { contains: search } }
      );
    }

    if (ean) {
      or.push({ EAN: { contains: ean } });
    }

    if (or.length) where.OR = or;

    const items = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const nextCursor = items.length > limit ? items.pop()!.id : null;
    return withCORS(Response.json({ items, nextCursor }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser(req);
    if (!user) {
      return withCORS(
        Response.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

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
        ingredients: parsed.data.ingredients ?? null,
        allergens: parsed.data.allergens ?? null,
        photoUrl: parsed.data.photoUrl ?? null,
        size: parsed.data.size ?? null,
        price: parsed.data.price ?? null,
        EAN: parsed.data.EAN ?? null,
        producer: parsed.data.producer ?? null,
        producedIn: parsed.data.producedIn ?? null,
        ECodes: parsed.data.ECodes ?? null,
        preservation: parsed.data.preservation ?? null,
        energia: parsed.data.energia ?? null,
        rasva: parsed.data.rasva ?? null,
        hiilarit: parsed.data.hiilarit ?? null,
        sokerit_yht: parsed.data.sokerit_yht ?? null,
        sokerit_lis: parsed.data.sokerit_lis ?? null,
        proteiini: parsed.data.proteiini ?? null,
        suola: parsed.data.suola ?? null,
      },
    });

    return withCORS(Response.json(created, { status: 201 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}
