// lib/mapping.ts
import {
  firstCommaItem,
  looksLikeSize,
  normalizePriceString,
  looksLikeIngredients,
  looksLikeAllergens,
  looksLikeProducer,
  looksLikeProducedIn,
  looksLikeECodes,
  looksLikePreservation,
  cleanAttributeValue,
} from "./csv-utils";

export type NormalizedRow = Record<string, string | undefined>;

const get = (r: NormalizedRow, key: string) => (r[key] ?? "").trim();

// WooCommerce export has "Ominaisuus 1–6 nimi/arvo(t)"
const ATTRIBUTE_INDICES = [1, 2, 3, 4, 5, 6] as const;

/**
 * Find the first attribute (1–6) whose name matches the predicate.
 * Optionally run a transform on the value (e.g. firstCommaItem).
 */
function pickAttributeValue(
  r: NormalizedRow,
  predicate: (name: string | undefined) => boolean,
  transform?: (value: string) => string
): string {
  for (const idx of ATTRIBUTE_INDICES) {
    const nameKey = `ominaisuus ${idx} nimi`;
    const valueKey = `ominaisuus ${idx} arvo(t)`;

    const attrName = r[nameKey];
    const rawValue = r[valueKey];

    if (!predicate(attrName) || !rawValue) continue;

    const v = String(rawValue).trim();
    if (!v) continue;

    return transform ? transform(v) : v;
  }
  return "";
}

export function mapWooFiNormalizedToProductInput(r: NormalizedRow) {
  // Basic fields from normal Woo columns
  const name = get(r, "nimi");

  const discounted = get(r, "alennettu hinta");
  const regular = get(r, "normaali hinta");
  const price = normalizePriceString(discounted || regular);

  const images = get(r, "kuvat");
  const photoUrl = firstCommaItem(images);

  // Primary EAN from main Woo column
  let ean = get(r, "gtin, upc, ean, or isbn");

  // Fallback: if not present, look for attribute whose name is literally "EAN"
  if (!ean) {
    ean = pickAttributeValue(
      r,
      (attrName) => (attrName ?? "").toLowerCase() === "ean",
      firstCommaItem
    );
  }

  // Size from any attribute where name looks like "koko/annoskoko/tuotekoko"
  const size = pickAttributeValue(r, looksLikeSize, firstCommaItem);

  // Ingredients from any attribute where name looks like "Ainesosat"
  // (in your sample CSV this is "Ominaisuus 1 nimi" = "Ainesosat")
  const ingredients = pickAttributeValue(r, looksLikeIngredients, cleanAttributeValue);

  // Optional: allergens if you later add an attribute like "Allergeenit"
  const allergens = pickAttributeValue(r, looksLikeAllergens, cleanAttributeValue);

  // Producer from any attribute where name looks like producer
  const producer = pickAttributeValue(r, looksLikeProducer, cleanAttributeValue);


  // Produced in from any attribute where name looks like produced in
  const producedIn = pickAttributeValue(r, looksLikeProducedIn, cleanAttributeValue);

  // E-codes from any attribute where name looks like E-codes
  const ECodes = pickAttributeValue(r, looksLikeECodes, cleanAttributeValue);

  // Preservation from any attribute where name looks like preservation
  const preservation = pickAttributeValue(r, looksLikePreservation, cleanAttributeValue);

  return {
    name,
    size,
    ingredients,
    allergens,
    photoUrl,
    price,
    EAN: ean,
    producer: producer,
    producedIn,
    ECodes,
    preservation,
  };
}
