// lib/mapping.ts
import {
  firstCommaItem,
  normalizePriceString,
  cleanAttributeValue,
} from "./csv-utils";

export type NormalizedRow = Record<string, string | undefined>;

const get = (r: NormalizedRow, key: string) => (r[key] ?? "").trim();

// Helper to read ACF meta columns like "Metatieto: ainesosat"
// After normalizeHeader, the key is "metatieto: ainesosat"
const meta = (r: NormalizedRow, field: string) => get(r, `metatieto: ${field}`);

export function mapWooFiNormalizedToProductInput(r: NormalizedRow) {
  // Basic Woo fields
  const name = get(r, "nimi");

  const discounted = get(r, "alennettu hinta");
  const regular = get(r, "normaali hinta");
  const price = normalizePriceString(discounted || regular);

  const images = get(r, "kuvat");
  const photoUrl = firstCommaItem(images);

  // Primary EAN from core Woo column
  let ean = get(r, "gtin, upc, ean, or isbn");

  // Fallback EAN from ACF meta
  if (!ean) {
    const metaEAN = meta(r, "ean");
    if (metaEAN) {
      ean = firstCommaItem(metaEAN);
    }
  }

  // ACF meta fields (names from your CSV header)
  // Metatieto: annoskoko
  const sizeRaw = meta(r, "annoskoko");
  const size = sizeRaw ? firstCommaItem(sizeRaw) : "";

  // Metatieto: ainesosat
  const ingredientsRaw = meta(r, "ainesosat");
  const ingredients = cleanAttributeValue(ingredientsRaw);

  // You don’t currently have a dedicated allergens meta field in the CSV,
  // so we keep this empty for now (or derive from ingredients later if needed)
  const allergens = "";

  // Metatieto: valmistaja
  const producerRaw = meta(r, "valmistaja");
  const producer = cleanAttributeValue(producerRaw);

  // Metatieto: alkuperamaa
  const producedInRaw = meta(r, "alkuperamaa");
  const producedIn = cleanAttributeValue(producedInRaw);

  // Metatieto: e-koodit
  const eCodesRaw = meta(r, "e-koodit");
  const ECodes = cleanAttributeValue(eCodesRaw);

  // Metatieto: sailytys
  const preservationRaw = meta(r, "sailytys");
  const preservation = cleanAttributeValue(preservationRaw);

  return {
    name,
    size,
    ingredients,
    allergens,
    photoUrl,
    price,
    EAN: ean,
    producer,
    producedIn,
    ECodes,
    preservation,
  };
}
