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
      producer: initial?.producer ?? "K-Supermarket Tripla Bölen Hella",
      producedIn: initial?.producedIn ?? "Suomi",
      ECodes: initial?.ECodes ?? "",
      preservation: initial?.preservation ?? "",
      energia: initial?.energia ?? "",
      rasva: initial?.rasva ?? "",
      hiilarit: initial?.hiilarit ?? "",
      sokerit_yht: initial?.sokerit_yht ?? "",
      sokerit_lis: initial?.sokerit_lis ?? "",
      proteiini: initial?.proteiini ?? "",
      suola: initial?.suola ?? "",
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
      <div className="form-group">
        <label>Tuotenimi *</label>
        <input
          {...register("name")}
          placeholder="Esim. Tomaattikeitto"
          required
        />
        {errors.name && <span className="err">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>Koko</label>
        <input {...register("size")} placeholder="Esim. 250 g / 500 ml" />
        {errors.size && <span className="err">{errors.size.message}</span>}
      </div>

      <div className="form-group">
        <label>Valmistaja</label>
        <input
          {...register("producer")}
          placeholder="K-Supermarket Tripla Bölen Hella"
        />
        {errors.producer && (
          <span className="err">{errors.producer.message}</span>
        )}
      </div>
      <div className="form-group">
        <label>Valmistusmaa</label>
        <input {...register("producedIn")} placeholder="Suomi" />
        {errors.producedIn && (
          <span className="err">{errors.producedIn.message}</span>
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
        <label>Hinta *</label>
        <input {...register("price")} placeholder="9,99 €" required />
        {errors.price && <span className="err">{errors.price.message}</span>}
      </div>

      <div className="form-group">
        <label>EAN-Koodi *</label>
        <input {...register("EAN")} placeholder="123456789..." required />
        {errors.EAN && <span className="err">{errors.EAN.message}</span>}
      </div>

      <div className="form-group">
        <label>E-Koodit</label>
        <input {...register("ECodes")} placeholder="E-1234" />
        {errors.ECodes && <span className="err">{errors.ECodes.message}</span>}
      </div>
      <div className="form-group">
        <label>Säilytys</label>
        <input {...register("preservation")} placeholder="Säilytys alle +5C " />
        {errors.preservation && (
          <span className="err">{errors.preservation.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Allergeenit</label>
        <input {...register("allergens")} placeholder="maito, pähkinä" />
        {errors.allergens && (
          <span className="err">{errors.allergens.message}</span>
        )}
      </div>

      <div className="form-group full">
        <label>Ainesosat *</label>
        <textarea
          rows={3}
          placeholder="Kirjoita pilkuilla tai riveittäin: maito, kaakao, sokeri"
          {...register("ingredients")}
          required
        />
        {errors.ingredients && (
          <span className="err">{errors.ingredients.message}</span>
        )}
      </div>
      <div className="form-group">
        <h2>Ravintosisältö /100g</h2>

        <label>Energia</label>
        <input {...register("energia")} placeholder="250kcal" />
        {errors.energia && (
          <span className="err">{errors.energia.message}</span>
        )}

        <label>Rasva</label>
        <input {...register("rasva")} placeholder="10g" />
        {errors.rasva && <span className="err">{errors.rasva.message}</span>}

        <label>Hiilarit</label>
        <input {...register("hiilarit")} placeholder="30g" />
        {errors.hiilarit && (
          <span className="err">{errors.hiilarit.message}</span>
        )}

        <label>Sokerit yhteensä</label>
        <input {...register("sokerit_yht")} placeholder="15g" />
        {errors.sokerit_yht && (
          <span className="err">{errors.sokerit_yht.message}</span>
        )}

        <label>Lisätyt sokerit</label>
        <input {...register("sokerit_lis")} placeholder="10g" />
        {errors.sokerit_lis && (
          <span className="err">{errors.sokerit_lis.message}</span>
        )}

        <label>Suola</label>
        <input {...register("suola")} placeholder="1g" />
        {errors.suola && <span className="err">{errors.suola.message}</span>}

        <label>Proteiini</label>
        <input {...register("proteiini")} placeholder="5g" />
        {errors.proteiini && (
          <span className="err">{errors.proteiini.message}</span>
        )}
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
