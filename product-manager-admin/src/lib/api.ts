import type { Product, ListResponse } from "../types";
import type { ProductInput } from "./validation";

const API_URL = import.meta.env.VITE_API_URL!;

type ApiError = Error & { status?: number; body?: string };

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const hasBody = init.body !== undefined && init.body !== null;
  if (hasBody && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch (e) {
    const err: ApiError = new Error(
      "Network/CORS error: API is not reachable from this origin."
    );
    err.status = 0;
    err.body = String(e);
    throw err;
  }

  if (res.status === 401 || res.status === 403) {
    const err: ApiError = new Error("Unauthorized");
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: ApiError = new Error(
      `API ${res.status}: ${text || res.statusText}`
    );
    err.status = res.status;
    err.body = text;
    throw err;
  }

  if (res.status === 204) return undefined as unknown as T;

  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("application/json")) return (await res.json()) as T;

  return (await res.text()) as unknown as T;
}

export async function listProducts(params: {
  search?: string;
  limit?: number;
  cursor?: string;
  ean?: string;
}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.ean) qs.set("ean", params.ean);
  const q = qs.toString();
  return apiFetch<ListResponse<Product>>(`/api/products${q ? `?${q}` : ""}`);
}

export async function createProduct(data: ProductInput) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
  return apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
}
