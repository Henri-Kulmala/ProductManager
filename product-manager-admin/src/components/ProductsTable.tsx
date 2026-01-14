import { useEffect, useMemo, useRef } from "react";
import { MdEdit } from "react-icons/md";

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
    <div className="table-wrapper">
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
            <th></th>
            <th>Tuotenimi</th>
            <th>EAN</th>
            <th>Ainesosat</th>
            <th>Ravintosisältö per/100g</th>
            <th>Valmistusmaa</th>
            <th>Valmistaja</th>
            <th>E-Koodit</th>
            <th>Säilytys</th>
            <th>Päivitetty</th>
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
              <td>
                <button className="btn-edit" onClick={() => onEdit(p)}>
                  <MdEdit />
                </button>
              </td>
              <td className="product-name">{p.name}</td>
              <td>{p.EAN ?? "-"}</td>
              <td className="truncate">
                {p.ingredients ?? <span style={{ opacity: 0.5 }}>–</span>}
              </td>

              <tr className="nutrition-table">
                <td>Energia</td>
                <td>{p.energia ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Rasva</td>
                <td>{p.rasva ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Hiilihydraatit</td>
                <td>{p.hiilarit ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Joista sok.</td>
                <td>{p.sokerit_yht ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Lisättyjä sokereita</td>
                <td>{p.sokerit_lis ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Proteiini</td>
                <td>{p.proteiini ?? "-"}</td>
              </tr>
              <tr className="nutrition-table">
                <td>Suola</td>
                <td>{p.suola ?? "-"}</td>
              </tr>
              <td>{p.producedIn ?? "-"}</td>
              <td>{p.producer ?? "-"}</td>
              <td>{p.ECodes ?? "-"}</td>
              <td>{p.preservation ?? "-"}</td>
              <td>{new Date(p.updatedAt).toLocaleDateString("fi-FI")}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-state">
                Ei tuloksia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

}
