import { z } from "zod";
export const ProductSchema = z.object({
  name: z.string().min(1, "Tuotenimi vaaditaan"),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  price: z.string().optional(),
  EAN: z.string().optional(),
  photoUrl: z.string().url("Virheellinen URL").optional().or(z.literal("")),
  size: z.string().optional(),
  producer: z.string().optional(),
  producedIn: z.string().optional(),
  ECodes: z.string().optional(),
  preservation: z.string().optional(),
  energia: z.string().optional(),
  rasva: z.string().optional(),
  hiilarit: z.string().optional(),
  sokerit_yht: z.string().optional(),
  sokerit_lis: z.string().optional(),
  proteiini: z.string().optional(),
  suola: z.string().optional(),
});
export type ProductInput = z.infer<typeof ProductSchema>;
