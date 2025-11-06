// src/lib/api.ts
import { getAccessToken } from "./auth";
import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL!;


async function doFetch(path: string, init: RequestInit, token: string) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
     
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  return res;
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");

  let res = await doFetch(path, init, token);

 
  if (res.status === 401) {
   
    await supabase.auth.refreshSession();
    token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");
    res = await doFetch(path, init, token);
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

 
  if (res.status === 204) return undefined as unknown as T;

 
  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    return (await res.json()) as T;
  }

 
  const text = (await res.text()) as unknown as T;
  return text;
}

export type ListResponse<T> = { items: T[]; nextCursor: string | null };

export async function listProducts(params: {
  search?: string;
  limit?: number;
  cursor?: string;
}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const q = qs.toString();
  return apiFetch<ListResponse<any>>(`/api/products${q ? `?${q}` : ""}`);
}

export async function createProduct(data: any) {
  return apiFetch<any>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: any) {
  return apiFetch<any>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
 
  return apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
}
