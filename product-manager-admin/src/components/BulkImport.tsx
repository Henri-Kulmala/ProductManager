// components/BulkImport.tsx
"use client";

import { useMemo, useState } from "react";
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

const BulkPayloadSchema = z.array(
  z.object({
    name: z.string().min(1, "Missing name"),
    size: z.string().optional().default(""),
    ingredients: z.string().optional().default(""),
    allergens: z.string().optional().default(""),
    photoUrl: z.string().optional().default(""),
    price: z.string().min(1, "Missing price"),
    EAN: z.string().optional().default(""),
  })
);

type Props = {
  /** Prefer passing this in from your app config */
  apiBase?: string; // e.g. http://localhost:3000  or  https://api.example.com
  onImported?: () => void;
};

export default function BulkImport({ apiBase, onImported }: Props) {
  const [rows, setRows] = useState<ProductInput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detected, setDetected] = useState<"," | ";" | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);
  
  const validCount = useMemo(() => rows.length, [rows]);

  async function handleFile(file: File) {
    setFileName(file.name);
    setRows([]);
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
          }
        } catch (e: any) {
          setErrors((prev) => [...prev, e?.message ?? "CSV parse error"]);
        }
      },
    });
  }

  async function submit() {
    setSubmitting(true);
    setErrors([]);
    try {
      const individuallyChecked = rows.map((r) => {
        const p = ProductSchema.safeParse(r);
        if (!p.success)
          throw new Error(p.error.issues.map((i) => i.message).join(", "));
        return p.data;
      });

      // ✅ Vite-style env (compile-time replacement)
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
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span>{fileName ?? "Valitse CSV-tiedosto"}</span>
        </label>

        {!!detected && (
          <p className="muted">
            Havaittu erotin:{" "}
            {detected === ";" ? "puolipiste (;)" : "pilkku (,)"}
          </p>
        )}

        {!!headers && (
          <p className="muted">
            
          </p>
        )}

        {!!errors.length && (
          <div className="alert alert-error" role="alert">
            <div className="alert-title">Import errors</div>
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {!!rows.length && (
          <>
            <p className="muted">Parsed {validCount} row(s).</p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nimi</th>
                    <th>Koko</th>
                    <th>Hinta</th>
                    <th>EAN</th>
                    <th>Kuva</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 12).map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.size}</td>
                      <td>{r.price}</td>
                      <td>{r.EAN}</td>
                      <td>{r.photoUrl ? "✓" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 12 && (
              <p className="muted">…and {rows.length - 12} more</p>
            )}

            <div className="actions">
              <button
                className="btn-primary"
                onClick={submit}
                disabled={submitting}>
                {submitting ? "Importing…" : "Import all"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
