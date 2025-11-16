// lib/mapping.ts
import {
  firstCommaItem,
  looksLikeSize,
  normalizePriceString,
} from "./csv-utils";

export type NormalizedRow = Record<string, string | undefined>;

const get = (r: NormalizedRow, key: string) => (r[key] ?? "").trim();

export function mapWooFiNormalizedToProductInput(r: NormalizedRow) {
  // headers normalized to lowercase:
  // "Nimi" -> "nimi"
  // "Normaali hinta" -> "normaali hinta"
  // "Alennettu hinta" -> "alennettu hinta"
  // "Kuvat" -> "kuvat"
  // "GTIN, UPC, EAN, or ISBN" -> "gtin, upc, ean, or isbn"
  // "Ominaisuus 1 nimi" -> "ominaisuus 1 nimi", etc.

  const name = get(r, "nimi");

  const discounted = get(r, "alennettu hinta");
  const regular = get(r, "normaali hinta");
  const price = normalizePriceString(discounted || regular);

  const images = get(r, "kuvat");
  const photoUrl = firstCommaItem(images);

  const ean = get(r, "gtin, upc, ean, or isbn");

  const a1n = get(r, "ominaisuus 1 nimi");
  const a1v = get(r, "ominaisuus 1 arvo(t)");
  const a2n = get(r, "ominaisuus 2 nimi");
  const a2v = get(r, "ominaisuus 2 arvo(t)");

  let size = "";
  if (looksLikeSize(a2n) && a2v) size = firstCommaItem(a2v);
  else if (looksLikeSize(a1n) && a1v) size = firstCommaItem(a1v);

  return {
    name,
    size,
    ingredients: "", // not present in your CSV
    allergens: "", // not present in your CSV
    photoUrl,
    price,
    EAN: ean,
  };
}
