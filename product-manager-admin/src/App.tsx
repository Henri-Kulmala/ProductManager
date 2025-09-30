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
      if (!checked) return new Set(); // clear all
      return new Set(items.map((i) => i.id)); // select all visible items
    });
  }

  return (
    <div className="wrap">
      <header className="row space">
        <h1>Tuotelistan hallinta</h1>
        <div className="row gap">
          <input
            placeholder="Hae tuotteita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="iconButton"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}>
            <IoIosAddCircle size={24} color="#F58320" />
          </button>

          <button
            className="danger"
            disabled={selected.size === 0 || deleteMut.isPending}
            onClick={() => deleteMut.mutate(Array.from(selected))}>
            Poista valitut ({selected.size})
          </button>
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
  onToggle: (id: string) => void; // <-- add
  onToggleAll: (checked: boolean) => void;
}) {
  return (
    <>
      <ProductsTable
        items={props.items}
        selected={props.selected}
        onToggle={props.onToggle} // <-- use props
        onToggleAll={props.onToggleAll} // <-- use props
        onEdit={props.onEdit}
      />
      <div className="row space">
        <span style={{ opacity: 0.6 }}>
          {props.isFetching ? "Lataa..." : `${props.items.length} tuotetta`}
        </span>
        <button disabled={!props.nextCursor} onClick={props.onNext}>
          Seuraava sivu
        </button>
      </div>
    </>
  );
}
