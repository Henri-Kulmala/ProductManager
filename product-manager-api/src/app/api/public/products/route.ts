import { db } from "@/lib/db";
import type { Database } from "@/lib/db";
import { withCORS, preflight } from "@/lib/cors";
import type { ExpressionBuilder } from "kysely";

export function OPTIONS(req: Request) {
  return preflight(req);
}

function likeContains(v: string) {
  return `%${v}%`;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EB = ExpressionBuilder<Database, "Product">;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "50", 10),
      100
    );
    const cursor = url.searchParams.get("cursor") || "";

    let q = db
      .selectFrom("Product")
      .select([
        "id",
        "name",
        "photoUrl",
        "size",
        "price",
        "EAN",
        "producer",
        "producedIn",
        "ingredients",
        "allergens",
        "ECodes",
        "preservation",
        "energia",
        "rasva",
        "hiilarit",
        "sokerit_yht",
        "sokerit_lis",
        "proteiini",
        "suola",
        "updatedAt",
        "createdAt",
      ]);

    if (search) {
      const pat = likeContains(search);
      q = q.where((eb: EB) =>
        eb.or([
          eb("name", "like", pat),
          eb("ingredients", "like", pat),
          eb("allergens", "like", pat),
          eb("EAN", "like", pat),
        ])
      );
    }

    if (cursor) {
      const cursorRow = await db
        .selectFrom("Product")
        .select(["createdAt", "id"])
        .where("id", "=", cursor)
        .executeTakeFirst();

      if (cursorRow) {
        q = q.where((eb: EB) =>
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
