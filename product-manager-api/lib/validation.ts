import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Tuotenimi vaaditaan"),
  ingredients: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  allergens: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  photoUrl: z
    .string()
    .url("Virheellinen URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  size: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)), 
  price: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  EAN: z
    .string() 
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  producer: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  producedIn: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  ECodes: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  preservation: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  energia: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  rasva: z
    .string()
    .optional() 
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  hiilarit: z
    .string()
    .optional() 
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  sokerit_yht: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  sokerit_lis: z  
    .string() 
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  proteiini: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  suola: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
    
});

export type ProductInput = z.infer<typeof ProductSchema>;
export const ProductUpdateSchema = ProductSchema.partial();
