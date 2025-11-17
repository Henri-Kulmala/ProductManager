export type Product = {
  id: string;
  name: string;
  ingredients?: string | null;
  allergens?: string | null;
  photoUrl?: string | null;
  size?: string | null; 
  createdAt: string;
  updatedAt: string;
  price?: string | null;
  EAN?: string | null;
  producer?: string | null;
  producedIn?: string | null;
  ECodes?: string | null;
  preservation?: string | null;
};

export type ListResponse<T> = { items: T[]; nextCursor: string | null };
