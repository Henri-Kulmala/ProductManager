import { useEffect, useMemo, useRef } from "react";

import type { Product } from "../types";

type Props = {
  items: Product[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void; 
  onEdit: (p: Product) => void;
};

export default function ProductsTable({
  items,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
}: Props) {
  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => selected.has(i.id)),
    [items, selected]
  );
  const someChecked = useMemo(
    () => selected.size > 0 && !allChecked,
    [selected.size, allChecked]
  );

 
  const masterRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterRef.current) masterRef.current.indeterminate = someChecked;
  }, [someChecked]);

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>
            <input
              ref={masterRef}
              type="checkbox"
              checked={allChecked}
              onChange={(e) => onToggleAll(e.currentTarget.checked)}
              aria-checked={someChecked ? "mixed" : allChecked}
            />
          </th>
          <th>Nimi</th>
          <th>Hinta</th>
          <th>Muokattu</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => onToggle(p.id)}
              />
            </td>
            <td>{p.name}</td>
            <td>{Number(p.price).toFixed(2)} €</td>
            <td>{new Date(p.updatedAt).toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(p)}>Muokkaa</button>
            </td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
              Ei tuloksia
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
