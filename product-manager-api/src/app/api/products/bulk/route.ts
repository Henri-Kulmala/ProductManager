import { NextResponse } from "next/server";
import { z } from "zod";
import { ProductSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { withCORS, preflight } from "@/lib/cors";

const BulkBody = z.object({
  products: z.array(ProductSchema),
});

export async function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BulkBody.parse(json);

    const count = await db.transaction().execute(async (trx) => {
      let n = 0;

      for (const p of parsed.products) {
        const now = new Date();

        let existing: { id: string } | undefined;

        if (p.EAN?.trim()) {
          existing = await trx
            .selectFrom("Product")
            .select(["id"])
            .where("EAN", "=", p.EAN.trim())
            .executeTakeFirst();
        }

        if (!existing) {
          existing = await trx
            .selectFrom("Product")
            .select(["id"])
            .where("name", "=", p.name.trim())
            .executeTakeFirst();
        }

        if (existing) {
          await trx
            .updateTable("Product")
            .set({
              name: p.name,
              size: p.size ?? null,
              ingredients: p.ingredients ?? null,
              allergens: p.allergens ?? null,
              photoUrl: p.photoUrl ?? null,
              price: p.price ?? null,
              EAN: p.EAN?.trim() ? p.EAN.trim() : null,
              producer: p.producer ?? null,
              producedIn: p.producedIn ?? null,
              ECodes: p.ECodes ?? null,
              preservation: p.preservation ?? null,
              energia: p.energia ?? null,
              rasva: p.rasva ?? null,
              hiilarit: p.hiilarit ?? null,
              sokerit_yht: p.sokerit_yht ?? null,
              sokerit_lis: p.sokerit_lis ?? null,
              proteiini: p.proteiini ?? null,
              suola: p.suola ?? null,
              updatedAt: now,
            })
            .where("id", "=", existing.id)
            .execute();
        } else {
          const id = crypto.randomUUID
            ? crypto.randomUUID()
            : p.name + ":" + Date.now();
          await trx
            .insertInto("Product")
            .values({
              id,
              name: p.name,
              size: p.size ?? null,
              ingredients: p.ingredients ?? null,
              allergens: p.allergens ?? null,
              photoUrl: p.photoUrl ?? null,
              price: p.price ?? null,
              EAN: p.EAN?.trim() ? p.EAN.trim() : null,
              producer: p.producer ?? null,
              producedIn: p.producedIn ?? null,
              ECodes: p.ECodes ?? null,
              preservation: p.preservation ?? null,
              energia: p.energia ?? null,
              rasva: p.rasva ?? null,
              hiilarit: p.hiilarit ?? null,
              sokerit_yht: p.sokerit_yht ?? null,
              sokerit_lis: p.sokerit_lis ?? null,
              proteiini: p.proteiini ?? null,
              suola: p.suola ?? null,
              createdAt: now,
              updatedAt: now,
            })
            .execute();
        }

        n += 1;
      }

      return n;
    });

    const base = NextResponse.json({ count });
    return withCORS(base, req);
  } catch (e: any) {
    const base = NextResponse.json(
      { error: e?.message ?? "Bulk import error" },
      { status: 400 }
    );
    return withCORS(base, req);
  }
}
