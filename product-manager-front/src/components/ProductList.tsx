import { useEffect, useState } from "react";
import { listProducts } from "../lib/api";
import type { Product } from "../types";
import ProductItem from "./ProductItem";
import { FaSearch } from "react-icons/fa";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(true);
      listProducts(search)
        .then(setProducts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 400); 

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="product-list">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          placeholder="Hae tuotteita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Ladataan tuotteita...</p>}
      {error && <p style={{ color: "red" }}>Virhe: {error}</p>}
      {!loading && products.length === 0 && <p>Ei tuotteita löytynyt.</p>}

      {!loading && products.map((p) => <ProductItem key={p.id} product={p} />)}
    </div>
  );
}
