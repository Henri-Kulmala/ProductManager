import type { Product } from "../types";

const API = import.meta.env.VITE_API_URL as string; 

export async function listProducts(search?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search.trim());

  const res = await fetch(`${API}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}
