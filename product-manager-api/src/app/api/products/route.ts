import { db, newId } from "@/lib/db";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";

export function OPTIONS(req: Request) {
  return preflight(req);
}

function likeContains(v: string) {
  return `%${v}%`;
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
    const cursor = url.searchParams.get("cursor") || "";

    let q = db.selectFrom("Product").selectAll();

    if (search) {
      const pat = likeContains(search);
      q = q.where((eb) =>
        eb.or([
          eb("name", "like", pat),
          eb("ingredients", "like", pat),
          eb("allergens", "like", pat),
          eb("EAN", "like", pat),
        ])
      );
    }

    if (ean) {
      const pat = likeContains(ean);
      q = q.where("EAN", "like", pat);
    }

    if (cursor) {
      const cursorRow = await db
        .selectFrom("Product")
        .select(["createdAt", "id"])
        .where("id", "=", cursor)
        .executeTakeFirst();

      if (cursorRow) {
        q = q.where((eb) =>
          eb.or([
            eb("createdAt", "<", cursorRow.createdAt),
            eb.and([
              eb("createdAt", "=", cursorRow.createdAt),
              eb("id", "<", cursorRow.id),
            ]),
          ])
        );
      }
    }

    const items = await q
      .orderBy("createdAt", "desc")
      .orderBy("id", "desc")
      .limit(limit + 1)
      .execute();

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

    const now = new Date();
    const id = newId();

    await db
      .insertInto("Product")
      .values({
        id,
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
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    const created = await db
      .selectFrom("Product")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return withCORS(Response.json(created, { status: 201 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}
