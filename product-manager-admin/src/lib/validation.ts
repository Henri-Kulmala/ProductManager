// lib/validation.ts
import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().transform((v) => {
    const n = Number(v.replace(",", ".").trim());
    if (!isFinite(n)) throw new Error("Invalid price");
    return n.toFixed(2); // "57.90" (string) for Decimal
  }),
});
export const ProductUpdateSchema = ProductSchema.partial();
