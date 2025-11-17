export type Product = {
  id: string;
  name: string;
  size?: string | null;
  ingredients?: string | null;
  allergens?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  price?: string | null;
  EAN?: string | null;
  producer?: string | null;
  producedIn?: string | null;
  ECodes?: string | null;
  preservation?: string | null;
};
