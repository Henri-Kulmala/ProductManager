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

function fmt(v: string | null | undefined) {
  return v?.trim() ? v : "-";
}

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
              <td>
                <div className="nutrition">
                  <div className="nutrition-row">
                    <span>Energia</span>
                    <span>{fmt(p.energia)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Rasva</span>
                    <span>{fmt(p.rasva)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Hiilihydraatit</span>
                    <span>{fmt(p.hiilarit)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Joista sok.</span>
                    <span>{fmt(p.sokerit_yht)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Lisätyt sokerit</span>
                    <span>{fmt(p.sokerit_lis)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Proteiini</span>
                    <span>{fmt(p.proteiini)}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Suola</span>
                    <span>{fmt(p.suola)}</span>
                  </div>
                </div>
              </td>
              <td>{p.producedIn ?? "-"}</td>
              <td>{p.producer ?? "-"}</td>
              <td>{p.ECodes ?? "-"}</td>
              <td>{p.preservation ?? "-"}</td>
              <td>{new Date(p.updatedAt).toLocaleDateString("fi-FI")}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={11} className="empty-state">
                Ei tuloksia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
