// components/BulkImport.tsx
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import { z } from "zod";
import type { ProductInput } from "../lib/validation";
import { ProductSchema } from "../lib/validation";
import {
  detectDelimiter,
  normalizeHeader,
  toNormalizedRecord,
} from "../lib/csv-utils";
import { mapWooFiNormalizedToProductInput } from "../lib/mapping";
import { FaFileDownload } from "react-icons/fa";

const BulkPayloadSchema = z.array(
  z.object({
    name: z.string().min(1, "Missing name"),
    size: z.string().optional().default(""),
    ingredients: z.string().optional().default(""),
    allergens: z.string().optional().default(""),
    photoUrl: z.string().optional().default(""),
    price: z.string().min(1, "Missing price"),
    EAN: z.string().optional().default(""),
    producer: z.string().optional().default(""),
    producedIn: z.string().optional().default(""),
    ECodes: z.string().optional().default(""),
    preservation: z.string().optional().default(""),
  })
);

type Props = {
  apiBase?: string; 
  onImported?: () => void;
};

export default function BulkImport({ apiBase, onImported }: Props) {
  const [rows, setRows] = useState<ProductInput[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detected, setDetected] = useState<"," | ";" | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);

  const validCount = useMemo(() => rows.length, [rows]);
  const selectedCount = useMemo(() => selected.size, [selected]);

  const allChecked = useMemo(
    () => rows.length > 0 && rows.every((_, i) => selected.has(i)),
    [rows, selected]
  );
  const someChecked = useMemo(
    () => selected.size > 0 && !allChecked,
    [selected.size, allChecked]
  );

  const masterRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterRef.current) masterRef.current.indeterminate = someChecked;
  }, [someChecked]);

  async function handleFile(file: File) {
    setFileName(file.name);
    setRows([]);
    setSelected(new Set());
    setErrors([]);
    setHeaders(null);
    setDetected(null);

    const text = await file.text();
    const delimiter = detectDelimiter(text);
    setDetected(delimiter);

    Papa.parse<Record<string, string | undefined>>(text, {
      header: true,
      skipEmptyLines: true,
      delimiter,
      transformHeader: (h) => normalizeHeader(h),
      complete: (res) => {
        if (res.errors?.length) {
          setErrors(res.errors.map((e) => `Row ${e.row}: ${e.message}`));
        }
        try {
          const normalized = (res.data || []).map(toNormalizedRecord);
          if (normalized[0]) setHeaders(Object.keys(normalized[0]));

          const mapped = normalized.map(mapWooFiNormalizedToProductInput);
          const parsed = BulkPayloadSchema.safeParse(mapped);
          if (!parsed.success) {
            const issues = parsed.error.issues.map(
              (i) => `${i.path.join(".")}: ${i.message}`
            );
            setErrors((prev) => [...prev, ...issues]);
          } else {
            setRows(parsed.data);
            setSelected(new Set(parsed.data.map((_, idx) => idx)));
          }
        } catch (e: any) {
          setErrors((prev) => [...prev, e?.message ?? "CSV parse error"]);
        }
      },
    });
  }

  function toggleRow(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    if (!rows.length) return;
    setSelected(() => {
      if (!checked) return new Set();
      return new Set(rows.map((_, idx) => idx));
    });
  }

  async function submit() {
    setSubmitting(true);
    setErrors([]);
    try {

      const selectedRows = rows.filter((_, idx) => selected.has(idx));
      if (selectedRows.length === 0) {
        throw new Error("Valitse vähintään yksi tuotteen rivi tuotavaksi.");
      }

      const individuallyChecked = selectedRows.map((r) => {
        const p = ProductSchema.safeParse(r);
        if (!p.success)
          throw new Error(p.error.issues.map((i) => i.message).join(", "));
        return p.data;
      });

      const viteUrl = (import.meta as any)?.env?.VITE_API_URL as
        | string
        | undefined;

      const base = apiBase?.replace(/\/$/, "") ?? viteUrl?.replace(/\/$/, "");

      if (!base) {
        throw new Error(
          "Missing API base URL. Pass <BulkImport apiBase='http://localhost:3000' /> or set VITE_API_URL in .env"
        );
      }

      const res = await fetch(`${base}/api/products/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: individuallyChecked }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.error ?? `Bulk import failed (${res.status})`);
      }

      onImported?.();
      setRows([]);
      setSelected(new Set());
      setFileName(null);
    } catch (e: any) {
      setErrors((prev) => [...prev, e?.message ?? "Bulk import failed"]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Tuo CSV-tiedostosta</h3>
      </div>

      <div className="card-body">
        <label className="file-input">
          <FaFileDownload className="label-icon"/>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span id="file-view-text">{fileName ?? "Tuo CSV-tiedosto"}</span>
        </label>

        {!!detected && <p className="muted"></p>}

        {!!headers && <p className="muted"></p>}

        {!!errors.length && (
          <div className="alert alert-error" role="alert">
            <div className="alert-title">Tuontivirheet</div>
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {!!rows.length && (
          <>
            <div className="table-wrap">
              <p className="muted">Valittuna: {selectedCount} tuotetta.</p>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>
                      <input
                        ref={masterRef}
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => toggleAll(e.currentTarget.checked)}
                        aria-checked={someChecked ? "mixed" : allChecked}
                      />
                    </th>
                    <th>Nimi</th>
                    <th>Koko</th>
                    <th>Hinta</th>
                    <th>EAN</th>
                    <th>Kuva</th>
                    <th>Valmistaja</th>
                    <th>Valmistusmaa</th>
                    <th>E-Koodit</th>
                    <th>Säilytys</th>
                  </tr>
                </thead>
                <tbody >
                  {rows.slice(0, 50).map((r, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(i)}
                          onChange={() => toggleRow(i)}
                        />
                      </td>
                      <td>{r.name}</td>
                      <td>{r.size}</td>
                      <td>{r.price}</td>
                      <td>{r.EAN}</td>
                      <td>{r.photoUrl ? "✓" : ""}</td>
                      <td>{r.producer ?? ""}</td>
                      <td>{r.producedIn ?? ""}</td>
                      <td>{r.ECodes ?? ""}</td>
                      <td>{r.preservation ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 50 && (
              <p className="muted">…ja {rows.length - 50} riviä lisää</p>
            )}

            <div className="actions">
              <button
                className="btn-primary"
                onClick={submit}
                disabled={submitting || selectedCount === 0}>
                {submitting
                  ? "Tuodaan valitut…"
                  : `Tuo valitut (${selectedCount})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
