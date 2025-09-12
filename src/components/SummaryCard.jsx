// src/components/SummaryCard.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { currency } from "../utils/money";

export default function SummaryCard({ items, amount, deliveryFee, grandTotal }) {
    const { t, i18n } = useTranslation();

    return (
        <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 lg:sticky lg:top-8">
            <h3 className="text-base font-semibold">
                {t("order.summary_title", { defaultValue: "Order summary" })}
            </h3>

            <ul className="mt-4 space-y-2 mb-4">
                {items.map((it) => {
                    // Prefer productId for localization; fall back gracefully
                    const pid = it.productId ?? it.product?.id;
                    const nameKey = pid ? `products.${pid}.name` : it.product?.name;
                    const displayName =
                        nameKey
                            ? t(nameKey, { defaultValue: it.product?.name || "Unknown product" })
                            : t("unknown_product", { defaultValue: "Unknown product" });

                    const qty = it.quantity ?? it.qty ?? 0;

                    return (
                        <li key={it.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                                <img
                                    src={it.product?.img}
                                    alt={displayName}
                                    className="h-8 w-8 rounded object-cover ring-1 ring-slate-200"
                                />
                                <span>{displayName}</span>
                                <span className="text-slate-400"> × {qty}</span>
                            </div>
                            <div className="font-medium">{currency(it.lineTotal)}</div>
                        </li>
                    );
                })}
            </ul>

            <div className="h-px bg-slate-200 my-4" />

            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
          <span className="text-slate-600">
            {t("order.summary_subtotal", { defaultValue: "Subtotal" })}
          </span>
                    <span className="font-medium">{currency(amount)}</span>
                </div>

                <div className="flex items-center justify-between">
          <span className="text-slate-600">
            {t("order.summary_shipping", { defaultValue: "Shipping" })}
          </span>
                    <span className="font-medium">{currency(deliveryFee)}</span>
                </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between text-sm">
        <span className="font-medium">
          {t("order.summary_total", { defaultValue: "Order total" })}
        </span>
                <span className="font-semibold">{currency(grandTotal)}</span>
            </div>
        </div>
    );
}
