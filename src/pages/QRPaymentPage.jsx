// src/pages/QRPaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";
import QRPayment from "../components/payment/QRPayment/QRPayment.jsx";

export default function QRPaymentPage() {
    const nav = useNavigate();
    const location = useLocation();
    const { enriched, amount, deliveryFee, grandTotal } = useOrder();

    // Prefer router state; fallback to context if user refreshed.
    const routerState = location.state || {};
    const initialOrder = routerState.order || { items: enriched, amount, deliveryFee, grandTotal };
    const initialQR = routerState.qrPayload || null;

    const [qrPayload, setQrPayload] = useState(initialQR);
    const [qrExpired, setQrExpired] = useState(false);

    // If direct visit without payload, go back to selection.
    useEffect(() => {
        if (!qrPayload) nav("/order/payment", { replace: true });
    }, [qrPayload, nav]);

    if (!qrPayload) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-base font-semibold text-slate-900">4 · Payment · ABA Pay</h2>

                        <div className="flex items-center gap-3">
                            <ConfirmLeaveLink
                                to="/order/payment"
                                title="Cancel payment?"
                                confirmText="Your KHQR payment is in progress. Are you sure you want to cancel and go back?"
                                confirmLabel="Cancel Payment"
                                cancelLabel="Stay"
                                className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 min-h-[44px]"
                            >
                                Cancel payment
                            </ConfirmLeaveLink>
                        </div>
                    </div>

                    <div className="mt-6">
                        <QRPayment
                            key={qrPayload?.qrString ?? "qr"}
                            payload={qrPayload}
                            merchantName={qrPayload.merchantName}
                            title="ABA PAY"
                            minutesToExpire={5}
                            onExpired={() => setQrExpired(true)}
                            note="Scan with ABA Mobile or any KHQR-supported banking app"
                        />

                        {qrExpired && (
                            <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                                The KHQR has expired. Go back and click <strong>Pay with ABA Pay</strong> again to generate a fresh code.
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
