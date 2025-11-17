// lib/csv-utils.ts

// Normalize header names coming from Woo export
export function normalizeHeader(h: string): string {
  return (h || "")
    .replace(/^\uFEFF/, "") // strip BOM
    .replace(/\u00A0/g, " ") // NBSP -> space
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    .toLowerCase(); // normalize case
}

// Normalize a CSV row so that keys are normalized headers
// and values are always strings (trimmed)
export function toNormalizedRecord(
  row: Record<string, unknown>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    out[normalizeHeader(k)] = v == null ? "" : String(v).trim();
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

export function cleanAttributeValue(raw: string | undefined): string {
  return (
    (raw ?? "")
      // unescape Woo-style escaped commas
      .replace(/\\,/g, ",")
      // optional: unescape escaped semicolons if they exist
      .replace(/\\;/g, ";")
      // collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

// EU price string -> keep as string but standardize decimal
export function normalizePriceString(input: string): string {
  let s = (input || "").replace(/[€\s]/g, "");
  if (s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
  return s;
}

// Attribute name looks like "size"
export const looksLikeSize = (s: string | undefined) =>
  /(^|\s)(koko|annoskoko|tuotekoko)(\s|$)/i.test(s ?? "");

// Take first comma-separated item from a value
export const firstCommaItem = (s: unknown) =>
  String(s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)[0] ?? "";

// Attribute name looks like ingredients ("Ainesosat")
export const looksLikeIngredients = (s: string | undefined) =>
  /(^|\s)(ainesosat)(\s|$)/i.test(s ?? "");

// Optional: attribute name looks like allergens
export const looksLikeAllergens = (s: string | undefined) =>
  /(allergeenit|allergiat|allergens?)/i.test(s ?? "");

export const looksLikeProducer = (s: string | undefined) =>
  /(^|\s)(valmistaja|tuottaja|producer)(\s|$)/i.test(s ?? "");

export const looksLikeProducedIn = (s: string | undefined) =>
  /(^|\s)(valmistusmaa|alkuperämaa|made in)(\s|$)/i.test(s ?? "");

export const looksLikeECodes = (s: string | undefined) =>
  /(^|\s)(e[-\s]?koodit|e[-\s]?codes)(\s|$)/i.test(s ?? "");

export const looksLikePreservation = (s: string | undefined) =>
  /(^|\s)(säilytys|preservation|storage)(\s|$)/i.test(s ?? "");