// src/components/SummaryCard.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { currency } from "../utils/money";

export default function SummaryCard({ items, amount, deliveryFee, grandTotal }) {
    const { t } = useTranslation();

    return (
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 lg:sticky lg:top-8">
            <h3 className="text-base font-semibold">Order summary</h3>

            <ul className="mt-4 space-y-2 mb-4">
                {items.map((it) => {
                    const nameKey = it.product?.name; // e.g. "products.1.name"
                    const displayName = nameKey ? t(nameKey) : t("unknown_product", "Unknown product");
                    return (
                        <li key={it.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                                <img
                                    src={it.product?.img}
                                    alt={displayName}
                                    className="h-8 w-8 rounded object-cover ring-1 ring-slate-200"
                                />
                                <span>{displayName}</span>
                                <span className="text-slate-400"> × {it.qty}</span>
                            </div>
                            <div className="font-medium">{currency(it.lineTotal)}</div>
                        </li>
                    );
                })}
            </ul>

            <div className="h-px bg-slate-200 my-4" />
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{currency(amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium">{currency(deliveryFee)}</span>
                </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between text-sm">
                <span className="font-medium">Order total</span>
                <span className="font-semibold">{currency(grandTotal)}</span>
            </div>
        </div>
    );
}
