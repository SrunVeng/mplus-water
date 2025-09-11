import React, { useState } from "react";
import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import { useNavigate } from "react-router-dom";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";
import { motion } from "framer-motion";
import AbaPayLogo from "../assets/aba_bank_logo.jpg";

export default function PaymentPage() {
    const { state, enriched, amount, deliveryFee, grandTotal, reset } = useOrder();
    const [method, setMethod] = useState("qr"); // "qr" | "cod"
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    async function handlePay() {
        if (method !== "qr") {
            console.log("Paying order with method:", method, {
                state,
                amount,
                deliveryFee,
                grandTotal,
                items: enriched,
            });
            alert("Payment success (demo).");
            reset();
            nav("/order/confirm");
            return;
        }

        try {
            setLoading(true);

            // Mock payload (normally from your backend)
            const data = {
                qrString:
                    "00020101021230510016abaakhppxxx@abaa01153240906164357420208ABA Bank52044455530384054032.05802KH5915Sandbox Pentest6003BMC622905050127407162025053110g3323199540013F1BF016411FDA6814PWOnlinePW-2-06908purchase70030.06304B8D0",
                amount: Number(grandTotal || 0),
                currency: "USD",
                status: { code: "0", message: "Success." },
                merchantName: "Coming Soon QR",
            };

            nav("/order/payment/qr", {
                state: {
                    qrPayload: data,
                    order: {
                        items: enriched,
                        amount,
                        deliveryFee,
                        grandTotal,
                    },
                },
                replace: false,
            });
        } catch (e) {
            console.error(e);
            alert("Could not start ABA Pay right now. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const payCtaLabel =
        method === "qr" ? (loading ? "Preparing QR…" : "Pay with ABA Pay") : "Pay on Delivery";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">4 · Payment Method</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* ABA Pay */}
                        <button
                            type="button"
                            onClick={() => setMethod("qr")}
                            className={`group relative w-full text-left rounded-2xl border p-4 transition ${
                                method === "qr"
                                    ? "border-indigo-500 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                            aria-pressed={method === "qr"}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-10 w-10 rounded-xl grid place-items-center overflow-hidden transition ${
                                        method === "qr"
                                            ? "bg-indigo-50 ring-2 ring-indigo-300"
                                            : "bg-slate-50 group-hover:ring-1 group-hover:ring-slate-300"
                                    }`}
                                >
                                    <img src={AbaPayLogo} alt="ABA Pay" className="h-7 w-7 object-contain" />
                                </div>
                                <div>
                                    <div className="font-medium">ABA Pay</div>
                                    <p className="text-sm text-slate-500">Pay instantly by scanning with your banking app.</p>
                                </div>
                            </div>
                            {method === "qr" && (
                                <span className="absolute right-4 top-4 inline-flex items-center gap-2 text-xs font-medium text-indigo-700">
                  Selected
                </span>
                            )}
                        </button>

                        {/* COD */}
                        <button
                            type="button"
                            onClick={() => setMethod("cod")}
                            className={`group relative w-full text-left rounded-2xl border p-4 transition ${
                                method === "cod"
                                    ? "border-indigo-500 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                            aria-pressed={method === "cod"}
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
                                    <div className="font-medium">Cash on Delivery</div>
                                    <p className="text-sm text-slate-500">Pay the courier when your order arrives.</p>
                                </div>
                            </div>
                            {method === "cod" && (
                                <span className="absolute right-4 top-4 inline-flex items-center gap-2 text-xs font-medium text-indigo-700">
                  Selected
                </span>
                            )}
                        </button>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            Secure checkout
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            No hidden fees
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            24/7 support
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="mt-8">
                        <motion.button
                            onClick={handlePay}
                            disabled={loading}
                            style={{ touchAction: "manipulation" }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-6 py-3 font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            animate={
                                !loading
                                    ? {
                                        boxShadow: [
                                            "0 10px 20px rgba(79,70,229,0.20)",
                                            "0 14px 28px rgba(79,70,229,0.28)",
                                            "0 10px 20px rgba(79,70,229,0.20)",
                                        ],
                                    }
                                    : {}
                            }
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {payCtaLabel}
                        </motion.button>
                        <p className="mt-3 text-sm text-slate-500">
                            You can review your order details on the next screen before completing payment.
                        </p>
                    </div>

                    {/* Secondary links */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ConfirmLeaveLink
                            to="/"
                            title="Leave this page?"
                            confirmText="You have an in-progress order. If you leave now, your changes may be lost."
                            confirmLabel="Leave"
                            cancelLabel="Stay"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 text-center"
                        >
                            Leave to Home
                        </ConfirmLeaveLink>
                        <ConfirmLeaveLink
                            to="/contact"
                            title="Contact support?"
                            confirmText="You’re about to leave the checkout. Your current order won’t be submitted."
                            confirmLabel="Go to Support"
                            cancelLabel="Stay"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900 text-center"
                        >
                            Contact Support
                        </ConfirmLeaveLink>
                    </div>
                </section>

                {/* Right column */}
                <SummaryCard items={enriched} amount={amount} deliveryFee={deliveryFee} grandTotal={grandTotal} />
            </div>
        </div>
    );
}
