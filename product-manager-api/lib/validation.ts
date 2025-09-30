import { z } from "zod";
export const ProductCreate = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  isPublished: z.boolean().optional(),
});
export type ProductCreate = z.infer<typeof ProductCreate>;
