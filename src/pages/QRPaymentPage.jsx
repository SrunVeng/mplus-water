// src/pages/QRPaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";
import QRPayment from "../components/payment/QRPayment/QRPayment.jsx";

export default function QRPaymentPage() {
    const { t, i18n } = useTranslation();
    const nav = useNavigate();
    const location = useLocation();
    const { enriched, amount, deliveryFee, grandTotal } = useOrder();

    // Prefer router state; fallback to context if user refreshed.
    const routerState = location.state || {};
    const initialOrder = useMemo(() => {
        const fromState = routerState.order || {};
        return {
            items: fromState.items ?? enriched ?? [],
            amount: fromState.amount ?? amount ?? 0,
            deliveryFee: fromState.deliveryFee ?? deliveryFee ?? 0,
            grandTotal: fromState.grandTotal ?? grandTotal ?? 0,
        };
    }, [routerState.order, enriched, amount, deliveryFee, grandTotal]);

    const initialQR = routerState.qrPayload || null;

    const [qrPayload] = useState(initialQR);
    const [qrExpired, setQrExpired] = useState(false);

    // Redirect if landing here directly without a payload.
    useEffect(() => {
        if (!qrPayload) nav("/order/payment", { replace: true });
    }, [qrPayload, nav]);

    // Reset the "expired" banner if we ever get a fresh payload.
    useEffect(() => {
        setQrExpired(false);
    }, [qrPayload?.qrString]);

    // Guard render during redirect.
    if (!qrPayload) return null;

    const merchantName =
        qrPayload.merchantName ??
        t("payment_qr.merchant_fallback", { defaultValue: "merchant" });

    const minutesToExpire = Number.isFinite(Number(qrPayload.expiresInMinutes))
        ? Number(qrPayload.expiresInMinutes)
        : 5;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("order.create_title", { defaultValue: "Create Order" })}
                </h1>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            {t("qr_page.step_heading", {
                                defaultValue: "4 · Payment · ABA Pay",
                            })}
                        </h2>

                        <div className="flex items-center gap-3">
                            <ConfirmLeaveLink
                                to="/order/payment"
                                title={t("qr_page.cancel_title", {
                                    defaultValue: "Cancel payment?",
                                })}
                                confirmText={t("qr_page.cancel_confirm_text", {
                                    defaultValue:
                                        "Your KHQR payment is in progress. Are you sure you want to cancel and go back?",
                                })}
                                confirmLabel={t("qr_page.cancel_confirm_label", {
                                    defaultValue: "Cancel Payment",
                                })}
                                cancelLabel={t("qr_page.cancel_stay_label", {
                                    defaultValue: "Stay",
                                })}
                                className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 min-h-[44px]"
                            >
                                {t("qr_page.cancel_button", { defaultValue: "Cancel payment" })}
                            </ConfirmLeaveLink>
                        </div>
                    </div>

                    <div className="mt-6">
                        <QRPayment
                            key={qrPayload?.qrString ?? "qr"}
                            payload={qrPayload}
                            merchantName={merchantName}
                            // Localized title/note (QRPayment also has internal defaults)
                            title={t("payment_qr.title", { defaultValue: "ABA PAY" })}
                            note={t("payment_qr.note", {
                                defaultValue:
                                    "Scan with ABA Mobile or any KHQR-supported banking app",
                            })}
                            minutesToExpire={minutesToExpire}
                            onExpired={() => setQrExpired(true)}
                            locale={i18n.language || "en"}
                        />

                        {qrExpired && (
                            <div
                                className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl"
                                role="status"
                                aria-live="polite"
                            >
                                <Trans
                                    i18nKey="qr_page.expired_banner"
                                    defaults='The KHQR has expired. Go back and click <strong>Pay with ABA Pay</strong> again to generate a fresh code.'
                                    components={{ strong: <strong /> }}
                                />
                            </div>
                        )}
                    </div>
                </section>

                <SummaryCard
                    items={initialOrder.items}
                    amount={initialOrder.amount}
                    deliveryFee={initialOrder.deliveryFee}
                    grandTotal={initialOrder.grandTotal}
                />
            </div>
        </div>
    );
}
