// app/api/bulk/route.ts  (or app/api/products/bulk/route.ts – see note below)
import { NextResponse } from "next/server";
import { z } from "zod";
import { ProductSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors"; // <-- use your cors.ts here

const BulkBody = z.object({
  products: z.array(ProductSchema),
});

// CORS preflight for this route
export async function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BulkBody.parse(json);

    const results = [];

    for (const p of parsed.products) {
      let existing: any = null;

      // 1) Try EAN first
      if (p.EAN?.trim()) {
        existing = await prisma.product.findFirst({
          where: { EAN: p.EAN.trim() },
        });
      }

      // 2) Fallback: case-insensitive name
      if (!existing) {
        existing = await prisma.product.findFirst({
          where: { name: { equals: p.name.trim(), mode: "insensitive" } },
        });
      }

      if (existing) {
        const updated = await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: p.name,
            size: p.size,
            ingredients: p.ingredients,
            allergens: p.allergens,
            photoUrl: p.photoUrl,
            price: p.price,
            EAN: p.EAN || existing.EAN,
            producer: p.producer,
            producedIn: p.producedIn,
            ECodes: p.ECodes,
            preservation: p.preservation,
          },
        });
        results.push(updated);
      } else {
        const created = await prisma.product.create({
          data: {
            name: p.name,
            size: p.size,
            ingredients: p.ingredients,
            allergens: p.allergens,
            photoUrl: p.photoUrl,
            price: p.price,
            EAN: p.EAN || null,
            producer: p.producer,
            producedIn: p.producedIn,
            ECodes: p.ECodes,
            preservation: p.preservation,
          },
        });
        results.push(created);
      }
    }

    const base = NextResponse.json({ count: results.length });
    return withCORS(base, req);
  } catch (e: any) {
    const base = NextResponse.json(
      { error: e?.message ?? "Bulk import error" },
      { status: 400 }
    );
    return withCORS(base, req);
  }
}
