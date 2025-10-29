const API = import.meta.env.VITE_API_URL as string;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : res.json();
}

// -------- Types you edit via the form (only the 4 fields) --------
export type ProductPayload = {
  name: string; // Tuotenimi
  ingredients?: string; // Ainesosat (comma/newline separated)
  allergens?: string; // Allergeenit
  photoUrl?: string; // PhotoURL
};

// -------- CRUD --------
export const listProducts = (opts?: {
  search?: string;
  limit?: number;
  cursor?: string;
}) => {
  const p = new URLSearchParams();
  if (opts?.search) p.set("search", opts.search);
  if (opts?.limit) p.set("limit", String(opts.limit));
  if (opts?.cursor) p.set("cursor", opts.cursor);
  const q = p.toString() ? `?${p.toString()}` : "";
  return http<import("../types").ListResponse<import("../types").Product>>(
    `/products${q}`
  );
};

// Create with only the editable fields
export const createProduct = (data: ProductPayload) =>
  http<import("../types").Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Update allows a subset of those fields
export const updateProduct = (id: string, data: Partial<ProductPayload>) =>
  http<import("../types").Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProduct = (id: string) =>
  http<void>(`/products/${id}`, { method: "DELETE" });
