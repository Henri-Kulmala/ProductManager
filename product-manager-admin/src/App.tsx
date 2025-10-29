import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "./lib/api";
import type { Product } from "./types";
import ProductForm from "./components/ProductForm";
import ProductsTable from "./components/ProductsTable";

import { IoIosAddCircle } from "react-icons/io";

export default function App() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());


  const { data, isFetching, refetch } = useQuery({
    queryKey: ["products", { search, cursor }],
    queryFn: () =>
      listProducts({
        search: search || undefined,
        limit: 20,
        cursor: cursor || undefined,
      }),
    keepPreviousData: true,
  });

  const items = data?.items ?? [];
  const nextCursor = data?.nextCursor ?? null;

  useEffect(() => {
    setCursor(null);
  }, [search]);

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      setEditing(null);
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (ids: string[]) => {
      for (const id of ids) {
        await deleteProduct(id);
      }
    },
    onSuccess: () => {
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });


  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected(() => {
      if (!checked) return new Set(); 
      return new Set(items.map((i) => i.id)); 
    });
  }


  return (
    <div className="wrap">
      <header className="admin-header">
        <h1>Tuotelistan hallinta</h1>

        <div className="admin-toolbar">
          <div className="search-box">
            <input
              placeholder="🔍  Hae tuotteita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-accent"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}>
              + Uusi tuote
            </button>

            <button
              className="btn-danger-outline"
              disabled={selected.size === 0 || deleteMut.isPending}
              onClick={() => {
                const confirmDelete = window.confirm(
                  "Haluatko varmasti poistaa valitut tuotteet?"
                );
                if (confirmDelete) {
                  deleteMut.mutate(Array.from(selected));
                }
              }}>
              Poista valitut ({selected.size})
            </button>
          </div>
        </div>
      </header>

      {showForm && (
        <div className="card">
          <h3>{editing ? "Muokkaa tuotetta" : "Luo uusi tuote"}</h3>
          <ProductForm
            initial={editing}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSubmit={async (data) => {
              if (editing)
                await updateMut.mutateAsync({ id: editing.id, data });
              else await createMut.mutateAsync(data);
            }}
          />
        </div>
      )}

      <div className="card">
        <ListArea
          items={items}
          isFetching={isFetching}
          nextCursor={nextCursor}
          onNext={() => setCursor(nextCursor)}
          onEdit={(p) => {
            setEditing(p);
            setShowForm(true);
          }}
          selected={selected}
          onToggle={toggleSelect}
          onToggleAll={toggleAll}
        />
      </div>
    </div>
  );
}

function ListArea(props: {
  items: Product[];
  isFetching: boolean;
  nextCursor: string | null;
  onNext: () => void;
  onEdit: (p: Product) => void;
  selected: Set<string>;
  onToggle: (id: string) => void; 
  onToggleAll: (checked: boolean) => void;
}) {
  return (
    <>
      <ProductsTable
        items={props.items}
        selected={props.selected}
        onToggle={props.onToggle}
        onToggleAll={props.onToggleAll}
        onEdit={props.onEdit}
      />
      <div className="form-actions">
        <span style={{ opacity: 0.6 }}>
          {props.isFetching ? "Lataa..." : `${props.items.length} tuotetta`}
        </span>
        <button
          className="btn-primary-outline"
          disabled={!props.nextCursor}
          onClick={props.onNext}>
          Seuraava sivu
        </button>
      </div>
    </>
  );
}
