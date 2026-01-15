import { db } from "@/lib/db";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";
import { requireUser } from "@/lib/auth";

export function OPTIONS(req: Request) {
  return preflight(req);
}

type RouteContext = { params: Promise<{ id: string }> };
const ProductUpdateSchema = ProductSchema.partial();

export async function GET(req: Request, context: RouteContext) {
  try {
    const user = await requireUser(req);
    if (!user) {
      return withCORS(
        Response.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const { id } = await context.params;

    const item = await db
      .selectFrom("Product")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return item
      ? withCORS(Response.json(item), req)
      : withCORS(Response.json({ error: "Not found" }, { status: 404 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const user = await requireUser(req);
    if (!user) {
      return withCORS(
        Response.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const { id } = await context.params;

    const body = await req.json().catch(() => null);
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return withCORS(
        Response.json({ error: parsed.error.message }, { status: 400 }),
        req
      );
    }

    const patch: Record<string, unknown> = {};
    const d = parsed.data;

    if ("name" in d) patch.name = d.name;
    if ("ingredients" in d) patch.ingredients = d.ingredients ?? null;
    if ("allergens" in d) patch.allergens = d.allergens ?? null;
    if ("photoUrl" in d) patch.photoUrl = d.photoUrl ?? null;
    if ("size" in d) patch.size = d.size ?? null;
    if ("price" in d) patch.price = d.price ?? null;
    if ("EAN" in d) patch.EAN = d.EAN ?? null;
    if ("producer" in d) patch.producer = d.producer ?? null;
    if ("producedIn" in d) patch.producedIn = d.producedIn ?? null;
    if ("ECodes" in d) patch.ECodes = d.ECodes ?? null;
    if ("preservation" in d) patch.preservation = d.preservation ?? null;
    if ("energia" in d) patch.energia = d.energia ?? null;
    if ("rasva" in d) patch.rasva = d.rasva ?? null;
    if ("hiilarit" in d) patch.hiilarit = d.hiilarit ?? null;
    if ("sokerit_yht" in d) patch.sokerit_yht = d.sokerit_yht ?? null;
    if ("sokerit_lis" in d) patch.sokerit_lis = d.sokerit_lis ?? null;
    if ("proteiini" in d) patch.proteiini = d.proteiini ?? null;
    if ("suola" in d) patch.suola = d.suola ?? null;

    patch.updatedAt = new Date();

    const res = await db
      .updateTable("Product")
      .set(patch)
      .where("id", "=", id)
      .executeTakeFirst();

    if (!res || Number(res.numUpdatedRows) === 0) {
      return withCORS(
        Response.json({ error: "Not found" }, { status: 404 }),
        req
      );
    }

    const updated = await db
      .selectFrom("Product")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return withCORS(Response.json(updated), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const user = await requireUser(req);
    if (!user) {
      return withCORS(
        Response.json({ error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const { id } = await context.params;

    const res = await db
      .deleteFrom("Product")
      .where("id", "=", id)
      .executeTakeFirst();

    if (!res || Number(res.numDeletedRows) === 0) {
      return withCORS(
        Response.json({ error: "Not found" }, { status: 404 }),
        req
      );
    }

    return withCORS(new Response(null, { status: 204 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Server error" }, { status: 500 }),
      req
    );
  }
}
