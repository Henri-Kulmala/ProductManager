export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  createdAt: string;
  updatedAt: string;
};

export type ListResponse<T> = { items: T[]; nextCursor: string | null };
