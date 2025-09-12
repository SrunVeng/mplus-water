// src/components/ItemRow.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { currency } from "../utils/money";

export default function ItemRow({
                                    item,
                                    product,
                                    onChangeProduct,
                                    onChangeQty,
                                    onRemove,
                                    disableRemove,
                                }) {
    const { t, i18n } = useTranslation();

    const productName = t(`products.${item.productId}.name`, {
        defaultValue: product?.name || "",
    });

    return (
        <li className="grid grid-cols-12 gap-4 items-start">
            {/* Product */}
            <div className="col-span-12 md:col-span-6">
                <Field
                    label={t("order.product_label", { defaultValue: "Product" })}
                    lang={i18n.language}
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={product?.img}
                            alt={productName}
                            className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200"
                        />
                        <select
                            value={item.productId}
                            onChange={(e) => onChangeProduct(e.target.value)}
                            aria-label={t("order.product_select_aria", {
                                defaultValue: "Choose product",
                            })}
                            className="flex-1 h-11 rounded-2xl border text-sm bg-white px-3 border-slate-300 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 transition"
                        >
                            {item.options /* localized <option>s from parent */}
                        </select>
                    </div>
                </Field>
            </div>

            {/* Qty as dropdown 1–99 */}
            <div className="col-span-6 md:col-span-2">
                <Field label={t("order.qty", { defaultValue: "Qty" })} lang={i18n.language}>
                    <select
                        value={item.quantity}
                        onChange={(e) => onChangeQty(Number(e.target.value))}
                        aria-label={t("order.qty_input_aria", { defaultValue: "Quantity" })}
                        className="w-full h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 transition"
                    >
                        {Array.from({ length: 99 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            {/* Line total */}
            <div className="col-span-6 md:col-span-3">
                <Field
                    label={t("order.line_total", { defaultValue: "Line total" })}
                    lang={i18n.language}
                >
                    <div className="h-11 px-3 flex items-center rounded-2xl border border-slate-200 bg-slate-50">
                        <span className="font-medium">{currency(item.lineTotal || 0)}</span>
                    </div>
                </Field>
            </div>

            {/* Remove */}
            <div className="col-span-12 md:col-span-1 flex md:justify-end pt-7">
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disableRemove}
                    title={
                        disableRemove
                            ? t("order.remove_disabled_hint", {
                                defaultValue: "At least one item required",
                            })
                            : t("order.remove_hint", { defaultValue: "Remove item" })
                    }
                    className="inline-flex items-center gap-1.5 text-sm px-2 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>{t("order.remove", { defaultValue: "Remove" })}</span>
                </button>
            </div>
        </li>
    );
}

function Field({ label, required, children, lang }) {
    return (
        <div className="space-y-1.5" lang={lang}>
            <label className="text-sm leading-6 font-semibold text-slate-900 tracking-wide">
                {label}
                {required ? <span className="text-rose-600"> *</span> : null}
            </label>
            {children}
        </div>
    );
}
