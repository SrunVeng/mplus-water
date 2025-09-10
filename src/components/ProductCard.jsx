// src/components/ProductCard.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProductCard({ product }) {
    const { t } = useTranslation();

    const name = t(product.name);
    const desc = t(product.desc);
    const details =
        t(`products.${product.id}.details`, { returnObjects: true }) ?? [];

    return (
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 shadow-sm">
            <img
                src={product.img}
                alt={name}
                className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h4 className="text-slate-900 font-semibold">{name}</h4>
            <p className="text-slate-600 text-sm mt-1">{desc}</p>

            {details.length > 0 && (
                <ul className="mt-3 text-sm text-slate-600 list-disc list-inside space-y-1">
                    {details.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            )}

            <div className="mt-4 flex items-center justify-between">
        <span className="text-slate-900 font-semibold">
          ${product.price.toFixed(2)}
        </span>
                <button className="rounded-xl px-3 py-2 bg-brand-600 text-white hover:bg-brand-700">
                    {t("cta.order", "Order")}
                </button>
            </div>
        </div>
    );
}
