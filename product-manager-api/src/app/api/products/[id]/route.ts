import { prisma } from "@/lib/prisma";
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
    const item = await prisma.product.findUnique({ where: { id } });

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

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...("name" in parsed.data ? { name: parsed.data.name } : {}),
        ...("ingredients" in parsed.data
          ? { ingredients: parsed.data.ingredients ?? null }
          : {}),
        ...("allergens" in parsed.data
          ? { allergens: parsed.data.allergens ?? null }
          : {}),
        ...("photoUrl" in parsed.data
          ? { photoUrl: parsed.data.photoUrl ?? null }
          : {}),
        ...("size" in parsed.data ? { size: parsed.data.size ?? null } : {}),
        ...("price" in parsed.data ? { price: parsed.data.price ?? null } : {}),
        ...("EAN" in parsed.data ? { EAN: parsed.data.EAN ?? null } : {}),
        ...("producer" in parsed.data
          ? { producer: parsed.data.producer ?? null }
          : {}),
        ...("producedIn" in parsed.data
          ? { producedIn: parsed.data.producedIn ?? null }
          : {}),
        ...("ECodes" in parsed.data
          ? { ECodes: parsed.data.ECodes ?? null }
          : {}),
        ...("preservation" in parsed.data
          ? { preservation: parsed.data.preservation ?? null }
          : {}),
        ...("energia" in parsed.data
          ? { energia: parsed.data.energia ?? null }
          : {}),
        ...("rasva" in parsed.data ? { rasva: parsed.data.rasva ?? null } : {}),
        ...("hiilarit" in parsed.data
          ? { hiilarit: parsed.data.hiilarit ?? null }
          : {}),
        ...("sokerit_yht" in parsed.data
          ? { sokerit_yht: parsed.data.sokerit_yht ?? null }
          : {}),
        ...("sokerit_lis" in parsed.data
          ? { sokerit_lis: parsed.data.sokerit_lis ?? null }
          : {}),
        ...("proteiini" in parsed.data
          ? { proteiini: parsed.data.proteiini ?? null }
          : {}),
        ...("suola" in parsed.data ? { suola: parsed.data.suola ?? null } : {}),
      },
    });

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

    await prisma.product.delete({ where: { id } });
    return withCORS(new Response(null, { status: 204 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Not found" }, { status: 404 }),
      req
    );
  }
}
