import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";

import ProgressSteps from "../components/ProgressSteps";
import ItemRow from "../components/ItemRow";
import SummaryCard from "../components/SummaryCard";
import { PRODUCT_CATALOG } from "../data/products";

import { infoComplete, productsComplete, continueFromProducts } from "../utils/validation";
import { cn } from "../utils/uiUtils.js";

export default function ProductsPage() {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language?.startsWith("km") ? "name_km" : "name_en"; // (kept per your request)
    const locale = i18n.language || "en";

    const {
        state,
        catalogById,
        enriched,
        amount,
        deliveryFee,
        grandTotal,
        addItem,
        updateItem,
        removeItem,
    } = useOrder();

    const { steps, setSteps } = useOrderProgress();
    const nav = useNavigate();

    useEffect(() => {
        if (!infoComplete(state.form)) {
            nav("/order/info", { replace: true });
        }
    }, [state.form, nav]);

    const isProductsValid = productsComplete(state.items);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="px-4 sm:px-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-xl md:text-2xl font-semibold tracking-tight">
                        {t("order.create_title", { defaultValue: "Create Order" })}
                    </h1>
                </div>
                <ProgressSteps current={2} maxAllowedStep={steps?.products ? 3 : 2} onBlockedAttempt={() => {}} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Products list */}
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-100 px-6 py-4 rounded-t-3xl bg-gradient-to-br from-slate-50 to-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-900">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
                                <h2 className="text-base font-semibold">
                                    {t("order.products_title", { defaultValue: "Products" })}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-xl px-3 py-2",
                                    "bg-brand-600 text-white hover:bg-brand-700",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-600/60 focus:ring-offset-2"
                                )}
                            >
                                <Plus className="h-4 w-4" />
                                {t("order.add_product", { defaultValue: "Add product" })}
                            </button>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            {t("order.products_subtitle", { defaultValue: "Select items and quantities." })}
                        </p>
                    </div>

                    <div className="p-6">
                        <ul className="space-y-4">
                            {enriched.map((it) => (
                                <ItemRow
                                    key={it.id}
                                    item={{
                                        ...it,
                                        // Localized product options
                                        options: PRODUCT_CATALOG.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {t(`products.${p.id}.name`, { defaultValue: p.name })} —{" "}
                                                {p.price.toLocaleString(locale, { style: "currency", currency: "USD" })}
                                            </option>
                                        )),
                                    }}
                                    product={catalogById[it.productId]}
                                    onChangeProduct={(pid) => updateItem(it.id, { productId: pid })}
                                    onChangeQty={(q) => updateItem(it.id, { quantity: q })}
                                    onRemove={() => removeItem(it.id)}
                                    disableRemove={state.items.length === 1}
                                />
                            ))}
                        </ul>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={() => nav("/order/info")}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-xl px-5 py-3",
                                    "border border-slate-300 text-slate-700 hover:border-slate-400"
                                )}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {t("order.back", { defaultValue: "Back" })}
                            </button>

                            <button
                                type="button"
                                onClick={() => continueFromProducts({ items: state.items, setSteps, nav })}
                                disabled={!isProductsValid}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition",
                                    isProductsValid
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                )}
                                aria-disabled={!isProductsValid}
                            >
                                {t("order.continue_to_review", { defaultValue: "Continue to Review" })}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Right: Summary */}
                <SummaryCard
                    items={enriched}
                    amount={amount}
                    deliveryFee={deliveryFee}
                    grandTotal={grandTotal}
                />
            </div>
        </div>
    );
}
