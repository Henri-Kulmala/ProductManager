import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductInput } from "../lib/validation";
import type { Product } from "../types";

type SizeUnit = "g" | "ml" | "kpl";

type Props = {
  initial?: Product | null;
  onSubmit: (data: ProductInput) => void | Promise<void>;
  onCancel: () => void;
};

function stripSuffix(val: string | null | undefined, suffix: string): string {
  if (!val) return "";
  return val.replace(new RegExp(`\\s*${suffix.trim()}\\s*$`), "").trim();
}

function parseSizeUnit(val: string | null | undefined): SizeUnit {
  const match = val?.match(/\b(g|ml|kpl)\s*$/);
  return (match?.[1] as SizeUnit) ?? "g";
}

function parseSizeNumber(val: string | null | undefined): string {
  return val?.replace(/\s*(g|ml|kpl)\s*$/, "").trim() ?? "";
}

export default function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>(parseSizeUnit(initial?.size));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    setSizeUnit(parseSizeUnit(initial?.size));
    reset({
      name: initial?.name ?? "",
      size: parseSizeNumber(initial?.size),
      ingredients: initial?.ingredients ?? "",
      allergens: initial?.allergens ?? "",
      photoUrl: initial?.photoUrl ?? "",
      price: stripSuffix(initial?.price, "€"),
      EAN: initial?.EAN ?? "",
      producer: initial?.producer ?? "K-Supermarket Tripla Bölen Hella",
      producedIn: initial?.producedIn ?? "Suomi",
      ECodes: initial?.ECodes ?? "",
      preservation: initial?.preservation ?? "",
      energia: stripSuffix(initial?.energia, "kcal"),
      rasva: stripSuffix(initial?.rasva, "g"),
      hiilarit: stripSuffix(initial?.hiilarit, "g"),
      sokerit_yht: stripSuffix(initial?.sokerit_yht, "g"),
      sokerit_lis: stripSuffix(initial?.sokerit_lis, "g"),
      proteiini: stripSuffix(initial?.proteiini, "g"),
      suola: stripSuffix(initial?.suola, "g"),
    });
  }, [initial, reset]);

  const handleFormSubmit = (data: ProductInput) => {
    const enrich = (val: string | undefined, unit: string) =>
      val?.trim() ? `${val.trim()} ${unit}` : val;

    return onSubmit({
      ...data,
      size: data.size?.trim() ? `${data.size.trim()} ${sizeUnit}` : data.size,
      price: enrich(data.price, "€"),
      energia: enrich(data.energia, "kcal"),
      rasva: enrich(data.rasva, "g"),
      hiilarit: enrich(data.hiilarit, "g"),
      sokerit_yht: enrich(data.sokerit_yht, "g"),
      sokerit_lis: enrich(data.sokerit_lis, "g"),
      proteiini: enrich(data.proteiini, "g"),
      suola: enrich(data.suola, "g"),
    });
  };

  const numericProps = {
    inputMode: "decimal" as const,
    pattern: "[0-9]*[.,]?[0-9]*",
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", ",", "."];
      if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key)) e.preventDefault();
    },
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="product-form">

      {/* ── Perustiedot ───────────────────────────────────────── */}
      <section className="form-section">
        <h3 className="form-section-title">Perustiedot</h3>
        <div className="form-grid">

          <div className="form-group full">
            <label>Tuotenimi *</label>
            <input {...register("name")} placeholder="Esim. Tomaattikeitto" required />
            {errors.name && <span className="err">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>EAN-Koodi *</label>
            <input {...register("EAN")} placeholder="123456789..." required />
            {errors.EAN && <span className="err">{errors.EAN.message}</span>}
          </div>

          <div className="form-group">
            <label>Hinta *</label>
            <div className="input-group">
              <input {...register("price")} {...numericProps} placeholder="9,99" required />
              <span className="input-suffix">€</span>
            </div>
            {errors.price && <span className="err">{errors.price.message}</span>}
          </div>

          <div className="form-group">
            <label>Koko</label>
            <div className="input-group">
              <input {...register("size")} {...numericProps} placeholder="250" />
              <select
                className="input-unit-select"
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="kpl">kpl</option>
              </select>
            </div>
            {errors.size && <span className="err">{errors.size.message}</span>}
          </div>

        </div>
      </section>

      {/* ── Tuotetiedot ───────────────────────────────────────── */}
      <section className="form-section">
        <h3 className="form-section-title">Tuotetiedot</h3>
        <div className="form-grid">

          <div className="form-group">
            <label>Valmistaja</label>
            <input {...register("producer")} placeholder="K-Supermarket Tripla Bölen Hella" />
            {errors.producer && <span className="err">{errors.producer.message}</span>}
          </div>

          <div className="form-group">
            <label>Valmistusmaa</label>
            <input {...register("producedIn")} placeholder="Suomi" />
            {errors.producedIn && <span className="err">{errors.producedIn.message}</span>}
          </div>

          <div className="form-group">
            <label>Säilytys</label>
            <input {...register("preservation")} placeholder="Säilytys alle +5°C" />
            {errors.preservation && <span className="err">{errors.preservation.message}</span>}
          </div>

          <div className="form-group">
            <label>Valokuvan URL</label>
            <input {...register("photoUrl")} placeholder="https://…" />
            {errors.photoUrl && <span className="err">{errors.photoUrl.message}</span>}
          </div>

        </div>
      </section>

      {/* ── Ainesosat ─────────────────────────────────────────── */}
      <section className="form-section">
        <h3 className="form-section-title">Ainesosat</h3>
        <div className="form-grid">

          <div className="form-group">
            <label>Allergeenit</label>
            <input {...register("allergens")} placeholder="maito, pähkinä" />
            {errors.allergens && <span className="err">{errors.allergens.message}</span>}
          </div>

          <div className="form-group">
            <label>E-Koodit</label>
            <input {...register("ECodes")} placeholder="E-1234" />
            {errors.ECodes && <span className="err">{errors.ECodes.message}</span>}
          </div>

          <div className="form-group full">
            <label>Ainesosat *</label>
            <textarea
              rows={3}
              placeholder="Kirjoita pilkuilla tai riveittäin: maito, kaakao, sokeri"
              {...register("ingredients")}
              required
            />
            {errors.ingredients && <span className="err">{errors.ingredients.message}</span>}
          </div>

        </div>
      </section>

      {/* ── Ravintosisältö ────────────────────────────────────── */}
      <section className="form-section">
        <h3 className="form-section-title">Ravintosisältö / 100 g</h3>
        <div className="form-grid nutrition-grid">

          <div className="form-group">
            <label>Energia</label>
            <div className="input-group">
              <input {...register("energia")} {...numericProps} placeholder="250" />
              <span className="input-suffix">kcal</span>
            </div>
            {errors.energia && <span className="err">{errors.energia.message}</span>}
          </div>

          <div className="form-group">
            <label>Rasva</label>
            <div className="input-group">
              <input {...register("rasva")} {...numericProps} placeholder="10" />
              <span className="input-suffix">g</span>
            </div>
            {errors.rasva && <span className="err">{errors.rasva.message}</span>}
          </div>

          <div className="form-group">
            <label>Hiilarit</label>
            <div className="input-group">
              <input {...register("hiilarit")} {...numericProps} placeholder="30" />
              <span className="input-suffix">g</span>
            </div>
            {errors.hiilarit && <span className="err">{errors.hiilarit.message}</span>}
          </div>

          <div className="form-group">
            <label>Sokerit yhteensä</label>
            <div className="input-group">
              <input {...register("sokerit_yht")} {...numericProps} placeholder="15" />
              <span className="input-suffix">g</span>
            </div>
            {errors.sokerit_yht && <span className="err">{errors.sokerit_yht.message}</span>}
          </div>

          <div className="form-group">
            <label>Lisätyt sokerit</label>
            <div className="input-group">
              <input {...register("sokerit_lis")} {...numericProps} placeholder="10" />
              <span className="input-suffix">g</span>
            </div>
            {errors.sokerit_lis && <span className="err">{errors.sokerit_lis.message}</span>}
          </div>

          <div className="form-group">
            <label>Proteiini</label>
            <div className="input-group">
              <input {...register("proteiini")} {...numericProps} placeholder="5" />
              <span className="input-suffix">g</span>
            </div>
            {errors.proteiini && <span className="err">{errors.proteiini.message}</span>}
          </div>

          <div className="form-group">
            <label>Suola</label>
            <div className="input-group">
              <input {...register("suola")} {...numericProps} placeholder="1" />
              <span className="input-suffix">g</span>
            </div>
            {errors.suola && <span className="err">{errors.suola.message}</span>}
          </div>

        </div>
      </section>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {initial ? "Päivitä tuote" : "Luo tuote"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Peruuta
        </button>
      </div>
    </form>
  );
}
