// lib/csv-utils.ts
export function normalizeHeader(h: string): string {
  return (h || "")
    .replace(/^\uFEFF/, "") // strip BOM
    .replace(/\u00A0/g, " ") // NBSP -> space
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    .toLowerCase(); // normalize case
}

export function toNormalizedRecord(
  row: Record<string, any>
): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    out[normalizeHeader(k)] = typeof v === "string" ? v.trim() : v;
  }
  return out;
}

// crude delimiter detection (enough for ; vs ,)
export function detectDelimiter(sample: string): "," | ";" {
  const firstLine = sample.split(/\r?\n/)[0] || "";
  const commas = (firstLine.match(/,/g) || []).length;
  const semis = (firstLine.match(/;/g) || []).length;
  return semis > commas ? ";" : ",";
}

// EU price string -> keep as string but standardize decimal
export function normalizePriceString(input: string): string {
  let s = (input || "").replace(/[€\s]/g, "");
  if (s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
  return s;
}

export const looksLikeSize = (s: string) =>
  /(^|\s)(koko|annoskoko|tuotekoko)(\s|$)/i.test(s);

export const firstCommaItem = (s: string) =>
  (s || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)[0] ?? "";
