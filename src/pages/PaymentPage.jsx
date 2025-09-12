// src/pages/PaymentPage.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";
import AbaPayLogo from "../assets/aba_bank_logo.jpg";
import { normalizeQrPayload } from "../utils/khqr";

export default function PaymentPage() {
    const { t } = useTranslation();
    const { state, enriched, amount, deliveryFee, grandTotal, reset } = useOrder();
    const [method, setMethod] = useState/** @type {"qr" | "cod"} */("qr");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const hasItems = Array.isArray(enriched) && enriched.length > 0;
    const total = Number(grandTotal || 0);

    const payCtaLabel = useMemo(() => {
        if (method === "qr") {
            return loading
                ? t("order.pay_cta_qr_preparing", { defaultValue: "Preparing QR…" })
                : t("order.pay_cta_qr", { defaultValue: "Pay with ABA Pay" });
        }
        return t("order.pay_cta_cod", { defaultValue: "Pay on Delivery" });
    }, [method, loading, t]);

    const handleChoose = useCallback((next) => {
        setMethod(next);
    }, []);

    // Optional: keyboard arrows between options
    const onChoiceKeyDown = useCallback((e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        setMethod((m) => (m === "qr" ? "cod" : "qr"));
    }, []);

    async function handlePay() {
        if (!hasItems || total <= 0) {
            alert(t("order.pay_invalid_total", { defaultValue: "Your order total is invalid. Please review your cart." }));
            return;
        }

        if (method !== "qr") {
            try {
                setLoading(true);
                // Demo success path for COD
                alert(t("order.pay_success_demo", { defaultValue: "Payment success (demo)." }));
                reset();
                nav("/order/confirm");
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            setLoading(true);
            // mock payload — normally created server-side
            const raw = {
                qrString:
                    "00020101021230510016abaakhppxxx@abaa01153240906164357420208ABA Bank52044455530384054032.05802KH5915Sandbox Pentest6003BMC622905050127407162025053110g3323199540013F1BF016411FDA6814PWOnlinePW-2-06908purchase70030.06304B8D0",
                amount: total, // keep in sync with grandTotal
                currency: "USD", // consider "KHR" if using KHQR in KHR
                status: { code: "0", message: "Success." },
                merchantName: t("order.pay_aba", { defaultValue: "ABA Pay" }),
            };
            const payload = normalizeQrPayload(raw);

            nav("/order/payment/qr", {
                state: {
                    qrPayload: payload,
                    order: { items: enriched, amount, deliveryFee, grandTotal },
                },
            });
        } catch (e) {
            console.error(e);
            alert(
                t("order.pay_start_error", {
                    defaultValue: "Could not start ABA Pay right now. Please try again.",
                })
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="px-4 sm:px-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-xl md:text-2xl font-semibold tracking-tight">
                        {t("order.create_title", { defaultValue: "Create Order" })}
                    </h1>
                </div>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left */}
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">
                        {t("order.payment_title", { defaultValue: "Payment Method" })}
                    </h2>

                    {/* Radio group for payment methods */}
                    <fieldset
                        role="radiogroup"
                        aria-label={t("order.payment_title", { defaultValue: "Payment Method" })}
                        className="grid sm:grid-cols-2 gap-4"
                        onKeyDown={onChoiceKeyDown}
                    >
                        <legend className="sr-only">
                            {t("order.payment_title", { defaultValue: "Payment Method" })}
                        </legend>

                        {/* ABA Pay */}
                        <button
                            type="button"
                            role="radio"
                            aria-checked={method === "qr"}
                            tabIndex={method === "qr" ? 0 : -1}
                            onClick={() => handleChoose("qr")}
                            className={`group relative w-full text-left rounded-2xl border p-4 transition ${
                                method === "qr"
                                    ? "border-indigo-500 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Logo wrapper */}
                                <div
                                    className={`h-10 w-10 rounded-xl grid place-items-center transition ${
                                        method === "qr"
                                            ? "ring-indigo-300"
                                            : "bg-slate-50"
                                    }`}
                                >
                                    <img
                                        src={AbaPayLogo}
                                        alt={t("order.pay_aba_alt", { defaultValue: "ABA Pay logo" })}
                                        className="h-7 w-7 object-contain"
                                    />
                                </div>

                                {/* Texts */}
                                <div>
                                    <div className="font-medium">
                                        {t("order.pay_aba", { defaultValue: "ABA Pay" })}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {t("order.pay_aba_desc", {
                                            defaultValue: "Pay instantly by scanning with your banking app.",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {method === "qr" && (
                                <span className="absolute right-4 top-4 inline-flex items-center gap-2 text-xs font-medium text-indigo-700">
                  {t("order.selected", { defaultValue: "Selected" })}
                </span>
                            )}
                        </button>

                        {/* COD */}
                        <button
                            type="button"
                            role="radio"
                            aria-checked={method === "cod"}
                            tabIndex={method === "cod" ? 0 : -1}
                            onClick={() => handleChoose("cod")}
                            className={`group relative w-full text-left rounded-2xl border p-4 transition ${
                                method === "cod"
                                    ? "border-indigo-500 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-10 w-10 rounded-xl grid place-items-center ${
                                        method === "cod" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                                        <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm2 2h4v4H7v-4zm10 1h-3v2h3v-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {t("order.pay_cod", { defaultValue: "Cash on Delivery" })}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {t("order.pay_cod_desc", {
                                            defaultValue: "Pay the courier when your order arrives.",
                                        })}
                                    </p>
                                </div>
                            </div>
                            {method === "cod" && (
                                <span className="absolute right-4 top-4 inline-flex items-center gap-2 text-xs font-medium text-indigo-700">
                  {t("order.selected", { defaultValue: "Selected" })}
                </span>
                            )}
                        </button>
                    </fieldset>

                    {/* CTA */}
                    <div className="mt-8">
                        <motion.button
                            onClick={handlePay}
                            disabled={loading}
                            aria-busy={loading}
                            style={{ touchAction: "manipulation" }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-6 py-3 font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 min-h-[44px]"
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            {...(!loading
                                ? {
                                    animate: {
                                        boxShadow: [
                                            "0 10px 20px rgba(79,70,229,0.20)",
                                            "0 14px 28px rgba(79,70,229,0.28)",
                                            "0 10px 20px rgba(79,70,229,0.20)",
                                        ],
                                    },
                                    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                                }
                                : {})}
                        >
                            {payCtaLabel}
                        </motion.button>
                        <p className="mt-3 text-sm text-slate-500">
                            {t("order.payment_hint", {
                                defaultValue:
                                    "You can review your order details on the next screen before completing payment.",
                            })}
                        </p>
                    </div>

                    {/* Secondary links */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ConfirmLeaveLink
                            to="/"
                            title={t("order.leave_title", { defaultValue: "Leave this page?" })}
                            confirmText={t("order.leave_confirm_text", {
                                defaultValue:
                                    "You have an in-progress order. If you leave now, your changes may be lost.",
                            })}
                            confirmLabel={t("order.leave_confirm_leave", { defaultValue: "Leave" })}
                            cancelLabel={t("order.leave_confirm_stay", { defaultValue: "Stay" })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 text-center min-h-[44px]"
                        >
                            {t("order.leave_home", { defaultValue: "Leave to Home" })}
                        </ConfirmLeaveLink>

                        <ConfirmLeaveLink
                            to="/contact"
                            title={t("order.contact_title", { defaultValue: "Contact support?" })}
                            confirmText={t("order.contact_confirm_text", {
                                defaultValue:
                                    "You’re about to leave the checkout. Your current order won’t be submitted.",
                            })}
                            confirmLabel={t("order.contact_confirm_go", { defaultValue: "Go to Support" })}
                            cancelLabel={t("order.contact_confirm_stay", { defaultValue: "Stay" })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 text-center min-h-[44px]"
                        >
                            {t("order.contact_support", { defaultValue: "Contact Support" })}
                        </ConfirmLeaveLink>
                    </div>
                </section>

                {/* Right */}
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
