import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductInput } from "../lib/validation";
import type { Product } from "../types";

type Props = {
  initial?: Product | null;
  onSubmit: (data: ProductInput) => void | Promise<void>;
  onCancel: () => void;
};

export default function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      size: initial?.size ?? "",
      ingredients: initial?.ingredients ?? "",
      allergens: initial?.allergens ?? "",
      photoUrl: initial?.photoUrl ?? "",
      price: initial?.price ?? "",
      EAN: initial?.EAN ?? "",
      producer: initial?.producer ?? "",
      producedIn: initial?.producedIn ?? "",
      ECodes: initial?.ECodes ?? "",
      preservation: initial?.preservation ?? "",
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
      <div className="form-group">
        <label>Tuotenimi</label>
        <input {...register("name")} placeholder="Esim. Tomaattikeitto" />
        {errors.name && <span className="err">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>Koko</label>
        <input {...register("size")} placeholder="Esim. 250 g / 500 ml" />
        {errors.size && <span className="err">{errors.size.message}</span>}
      </div>

      <div className="form-group full">
        <label>Ainesosat</label>
        <textarea
          rows={3}
          placeholder="Kirjoita pilkuilla tai riveittäin: maito, kaakao, sokeri"
          {...register("ingredients")}
        />
        {errors.ingredients && (
          <span className="err">{errors.ingredients.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Allergeenit</label>
        <input {...register("allergens")} placeholder="maito, pähkinä" />
        {errors.allergens && (
          <span className="err">{errors.allergens.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Valokuvan URL</label>
        <input {...register("photoUrl")} placeholder="https://…" />
        {errors.photoUrl && (
          <span className="err">{errors.photoUrl.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Hinta</label>
        <input {...register("price")} placeholder="9,99 €" />
        {errors.price && <span className="err">{errors.price.message}</span>}
      </div>

      <div className="form-group">
        <label>EAN-Koodi</label>
        <input {...register("EAN")} placeholder="123456789..." />
        {errors.EAN && <span className="err">{errors.EAN.message}</span>}
      </div>

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
