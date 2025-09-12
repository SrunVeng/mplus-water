// src/pages/QRPaymentPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";
import QRPayment from "../components/payment/QRPayment/QRPayment.jsx";
import FeatureUnavailable from "../components/FeatureUnavailable.jsx";

/**
 * Determines if a payload is a valid QR payload that we can render.
 * We require a non-empty qrString at minimum.
 */
const isValidQR = (p) =>
    !!(p && typeof p === "object" && typeof p.qrString === "string" && p.qrString.trim());

/**
 * Safely coerce expiresInMinutes to a finite positive integer; default 5.
 */
const getMinutesToExpire = (val) => {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 5;
};

export default function QRPaymentPage() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { enriched, amount, deliveryFee, grandTotal } = useOrder();

    // Router state may be absent after a refresh; keep it optional and defensive.
    const routerState = (location && location.state) || {};

    // Build initial order from router state with context fallbacks
    const initialOrder = useMemo(() => {
        const fromState = (routerState && routerState.order) || {};
        return {
            items: fromState.items ?? enriched ?? [],
            amount: fromState.amount ?? amount ?? 0,
            deliveryFee: fromState.deliveryFee ?? deliveryFee ?? 0,
            grandTotal: fromState.grandTotal ?? grandTotal ?? 0,
        };
    }, [routerState, enriched, amount, deliveryFee, grandTotal]);

    // Normalize QR payload: treat as present only if valid
    const initialQR = isValidQR(routerState.qrPayload) ? routerState.qrPayload : null;
    const [qrPayload] = useState(initialQR);
    const [qrExpired, setQrExpired] = useState(false);

    // Reset the "expired" notice whenever a new QR string arrives
    useEffect(() => {
        setQrExpired(false);
    }, [qrPayload?.qrString]);

    const hasValidQR = isValidQR(qrPayload);
    const merchantName =
        qrPayload?.merchantName ?? t("payment_qr.merchant_fallback", { defaultValue: "merchant" });
    const minutesToExpire = getMinutesToExpire(qrPayload?.expiresInMinutes);
    const showUnavailableOverlay = !hasValidQR || qrExpired;

    // No valid QR payload at all: show order summary and an inline unavailable notice.
    if (!hasValidQR) {
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
                        <h2 className="text-base font-semibold text-slate-900">
                            {t("qr_page.step_heading", { defaultValue: "4 · Payment · ABA Pay" })}
                        </h2>

                        <div className="mt-4">
                            <FeatureUnavailable
                                telegramUrl="https://t.me/srunveng"
                                backTo="/order/payment"
                            />
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

    // Valid QR flow (with optional overlay when expired)
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("order.create_title", { defaultValue: "Create Order" })}
                </h1>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6 relative">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            {t("qr_page.step_heading", { defaultValue: "4 · Payment · ABA Pay" })}
                        </h2>

                        <div className="flex items-center gap-3">
                            <ConfirmLeaveLink
                                to="/order/payment"
                                title={t("qr_page.cancel_title", { defaultValue: "Cancel payment?" })}
                                confirmText={t("qr_page.cancel_confirm_text", {
                                    defaultValue:
                                        "Your KHQR payment is in progress. Are you sure you want to cancel and go back?",
                                })}
                                confirmLabel={t("qr_page.cancel_confirm_label", { defaultValue: "Cancel Payment" })}
                                cancelLabel={t("qr_page.cancel_stay_label", { defaultValue: "Stay" })}
                                className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 min-h-[44px]"
                            >
                                {t("qr_page.cancel_button", { defaultValue: "Cancel payment" })}
                            </ConfirmLeaveLink>
                        </div>
                    </div>

                    {/* Section on top of QR (banner/notice area) */}
                    <div className="mt-4">
                        <section className="lg:col-span-2 mb-4">
                            <FeatureUnavailable
                                telegramUrl="https://t.me/srunveng"
                                backTo="/order/payment"
                            />
                        </section>
                    </div>

                    {/* QR Area */}
                    <div className="mt-2">
                        {!qrExpired && (
                            <div className="transition-opacity duration-200">
                                <QRPayment
                                    key={qrPayload.qrString}
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
                            </div>
                        )}

                        {/* Expired inline banner (below QR area) */}
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

                    {/* Darken + centered overlay (shown when unavailable/expired) */}
                    {showUnavailableOverlay && (
                        <>
                            <div
                                className="absolute inset-0 rounded-3xl bg-slate-900/70 backdrop-blur-[2px]"
                                aria-hidden="true"
                            />
                            <div
                                className="absolute inset-0 z-20 flex items-center justify-center p-4"
                                role="dialog"
                                aria-modal="true"
                            >
                                <div className="w-full max-w-md">
                                    <FeatureUnavailable
                                        telegramUrl="https://t.me/srunveng"
                                        backTo="/order/payment"
                                    />
                                </div>
                            </div>
                        </>
                    )}
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
