// src/pages/ProductsPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- add this

import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";

import ProgressSteps from "../components/ProgressSteps";
import ItemRow from "../components/ItemRow";
import SummaryCard from "../components/SummaryCard";
import { PRODUCT_CATALOG } from "../data/products";

import {
    infoComplete,
    productsComplete,
    continueFromProducts,
} from "../utils/validation";

export default function ProductsPage() {
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

    const { t } = useTranslation(); // <-- use t
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>

                <ProgressSteps
                    current={2}
                    maxAllowedStep={steps?.products ? 3 : 2}
                    onBlockedAttempt={() => {}}
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-900">2 · Products</h2>
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-900 hover:text-slate-900 transition"
                        >
                            <span className="text-lg leading-none">＋</span> Add product
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {enriched.map((it) => (
                            <ItemRow
                                key={it.id}
                                item={{
                                    ...it,
                                    // ✅ Use translated names here instead of the raw key
                                    options: PRODUCT_CATALOG.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {t(p.name)} — ${p.price.toFixed(2)}
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
                            className="rounded-xl bg-brand-700 text-white px-5 py-3 font-medium hover:bg-slate-700 transition"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => continueFromProducts({ items: state.items, setSteps, nav })}
                            disabled={!isProductsValid}
                            className={`rounded-2xl px-5 py-3 font-medium transition ${
                                isProductsValid
                                    ? "bg-green-600 text-white hover:bg-slate-700"
                                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                            aria-disabled={!isProductsValid}
                        >
                            Continue to Review
                        </button>
                    </div>
                </section>

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
