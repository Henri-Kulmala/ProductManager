import { prisma } from "@/lib/prisma";
import { withCORS, preflight } from "@/lib/cors";
import { ProductCreate } from "@/lib/validation"; // reuse as “update” by partial()

const ProductUpdate = ProductCreate.partial();

type Ctx = { params: { id: string } };

export function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request, { params }: Ctx) {
  const item = await prisma.product.findUnique({ where: { id: params.id } });
  return item
    ? withCORS(Response.json(item), req)
    : withCORS(Response.json({ error: "Not found" }, { status: 404 }), req);
}

export async function PUT(req: Request, { params }: Ctx) {
  const body = await req.json().catch(() => null);
  const parsed = ProductUpdate.safeParse(body);
  if (!parsed.success) {
    return withCORS(
      Response.json({ error: parsed.error.message }, { status: 400 }),
      req
    );
  }
  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return withCORS(Response.json(updated), req);
  } catch {
    return withCORS(
      Response.json({ error: "Not found" }, { status: 404 }),
      req
    );
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return withCORS(new Response(null, { status: 204 }), req);
  } catch {
    return withCORS(
      Response.json({ error: "Not found" }, { status: 404 }),
      req
    );
  }
}
