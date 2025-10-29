import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductSchema } from "@/lib/validation";

export function OPTIONS(req: Request) {
  return preflight(req);
}

// New Next.js build-compatible context type
type RouteContext = { params: Promise<{ id: string }> };

const ProductUpdateSchema = ProductSchema.partial();

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const item = await prisma.product.findUnique({ where: { id } });
  return item
    ? withCORS(Response.json(item), req)
    : withCORS(Response.json({ error: "Not found" }, { status: 404 }), req);
}

export async function PUT(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const body = await req.json().catch(() => null);
  const parsed = ProductUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return withCORS(
      Response.json({ error: parsed.error.message }, { status: 400 }),
      req
    );
  }

  try {
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
      },
    });
    return withCORS(Response.json(updated), req);
  } catch {
    return withCORS(
      Response.json({ error: "Not found" }, { status: 404 }),
      req
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return withCORS(new Response(null, { status: 204 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Not found" }, { status: 404 }),
      req
    );
  }
}
