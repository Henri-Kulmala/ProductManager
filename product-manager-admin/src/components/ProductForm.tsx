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
  } = useForm<ProductInput>({ resolver: zodResolver(ProductSchema) });

  useEffect(() => {
    reset({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      price: initial?.price !== undefined ? Number(initial.price) : 0
    });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <label>
        Nimi
        <input {...register("name")} />
        {errors.name && <span className="err">{errors.name.message}</span>}
      </label>
      <label>
        Kuvaus
        <textarea {...register("description")} rows={3} />
      </label>
      <label>
        Hinta 
        <input type="text" {...register("price")} />
        {errors.price && <span className="err">{errors.price.message}</span>}
      </label>
      <div className="row gap">
        <button type="submit" disabled={isSubmitting}>
          {initial ? "Päivitä" : "Luo"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Kumoa
        </button>
      </div>
    </form>
  );
}
