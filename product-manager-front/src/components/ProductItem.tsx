import { useState } from "react";
import type { Product } from "../types";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductItem({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`product-card ${open ? "open" : ""}`}
      onClick={() => setOpen((v) => !v)}>
      <div className="product-header">
        <div>
          <h3 className="label-name">{product.name}</h3>
          
          {product.size && <span className="span-label">{product.EAN}</span>}
          {product.size && <span className="span-label">{product.size}</span>}
          {product.price && (
            <span className="span-label">{product.price} €</span>
          )}
        </div>
        <button className="toggle-btn" aria-label="Toggle details">
          {open ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{ overflow: "hidden" }}
            className="product-details">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}>
              {product.ingredients && (
                <p className="label">
                  <strong className="secondary-text">Ainesosat:</strong>{" "}
                  {product.ingredients}
                </p>
              )}
              {product.allergens && (
                <p className="label">
                  <strong className="secondary-text">Allergeenit:</strong>{" "}
                  {product.allergens}
                </p>
              )}
              {product.price && (
                <p className="label">
                  <strong className="secondary-text">Hinta:</strong>{" "}
                  {product.price + " €"}
                </p>
              )}
              {product.EAN && (
                <p className="label">
                  <strong className="secondary-text">EAN:</strong> {product.EAN}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
