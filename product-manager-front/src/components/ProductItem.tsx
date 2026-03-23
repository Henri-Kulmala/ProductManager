import { useState } from "react";
import type { Product } from "../types";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductItem({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  const hasBasicInfo = product.producer || product.producedIn || product.preservation || product.ECodes;
  const hasIngredients = product.ingredients || product.allergens;
  const hasNutrition = product.energia || product.rasva || product.hiilarit || product.proteiini || product.suola;

  return (
    <div
      className={`product-card ${open ? "open" : ""}`}
      onClick={() => setOpen((v) => !v)}>
      <div className="product-header">
        <div>
          {product.photoUrl && (
            <img src={product.photoUrl ?? ""} alt={product.name} className={open ? "product-image" : "product-image-small"} />
          )}
          <h3 className="label-name">{product.name}</h3>
          {product.EAN && <span className="span-label">{product.EAN}</span>}
          {product.size && <span className="span-label">{product.size}</span>}
          {product.price && <span className="span-label">{product.price}</span>}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="product-details">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}>

              {/* ── Tuotetiedot ─────────────────────────────── */}
              {hasBasicInfo && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Tuotetiedot</h4>
                  <div className="detail-grid">
                    {product.producer && (
                      <><span className="detail-key">Valmistaja</span><span className="detail-val">{product.producer}</span></>
                    )}
                    {product.producedIn && (
                      <><span className="detail-key">Alkuperämaa</span><span className="detail-val">{product.producedIn}</span></>
                    )}
                    {product.preservation && (
                      <><span className="detail-key">Säilytys</span><span className="detail-val">{product.preservation}</span></>
                    )}
                    {product.ECodes && (
                      <><span className="detail-key">E-Koodit</span><span className="detail-val">{product.ECodes}</span></>
                    )}
                  </div>
                </div>
              )}

              {/* ── Ainesosat ───────────────────────────────── */}
              {hasIngredients && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Ainesosat</h4>
                  {product.allergens && (
                    <p className="detail-text">
                      <span className="detail-key-inline">Allergeenit: </span>
                      {product.allergens}
                    </p>
                  )}
                  {product.ingredients && (
                    <p className="detail-text">
                      <span className="detail-key-inline">Ainesosat: </span>
                      {product.ingredients}
                    </p>
                  )}
                </div>
              )}

              {/* ── Ravintosisältö ───────────────────────────── */}
              {hasNutrition && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Ravintosisältö / 100 g</h4>
                  <div className="nutrition-table">
                    {product.energia && (
                      <div className="nutrition-row">
                        <span>Energia</span><span>{product.energia}</span>
                      </div>
                    )}
                    {product.rasva && (
                      <div className="nutrition-row">
                        <span>Rasva</span><span>{product.rasva}</span>
                      </div>
                    )}
                    {product.hiilarit && (
                      <div className="nutrition-row">
                        <span>Hiilihydraatit</span><span>{product.hiilarit}</span>
                      </div>
                    )}
                    {product.sokerit_yht && (
                      <div className="nutrition-row indented">
                        <span>— josta sokerit</span><span>{product.sokerit_yht}</span>
                      </div>
                    )}
                    {product.sokerit_lis && (
                      <div className="nutrition-row indented">
                        <span>— josta lisätyt</span><span>{product.sokerit_lis}</span>
                      </div>
                    )}
                    {product.proteiini && (
                      <div className="nutrition-row">
                        <span>Proteiini</span><span>{product.proteiini}</span>
                      </div>
                    )}
                    {product.suola && (
                      <div className="nutrition-row">
                        <span>Suola</span><span>{product.suola}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}