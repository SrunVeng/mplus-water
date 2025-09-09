import React, { useState } from "react";
import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import { useNavigate } from "react-router-dom";
import ConfirmLeaveLink from "../components/ConfirmLeaveLink";

export default function PaymentPage() {
    const { state, enriched, amount, deliveryFee, grandTotal, reset } = useOrder();
    const [method, setMethod] = useState("cod"); // "cod" | "bank" | "qr"
    const nav = useNavigate();

    function handlePay() {
        // TODO: integrate your gateway / ABA Pay, etc.
        console.log("Paying order with method:", method, { state, amount, deliveryFee, grandTotal, items: enriched });
        alert("Payment success (demo).");
        reset();
        nav("/order/confirm");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
                <ProgressSteps current={4} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">4 · Payment</h2>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="radio" name="pay" value="cod" checked={method === "cod"} onChange={()=>setMethod("cod")} />
                            <span>Cash on Delivery</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="radio" name="pay" value="qr" checked={method === "qr"} onChange={()=>setMethod("qr")} />
                            <span>ABA Pay</span>
                        </label>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button onClick={handlePay} className="rounded-2xl bg-indigo-600 text-white px-5 py-3 font-medium hover:bg-indigo-700">
                            Pay now
                        </button>
                        {/* Confirm-leave buttons to exit during transaction */}
                        <ConfirmLeaveLink to="/" className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900">
                            Leave to Home
                        </ConfirmLeaveLink>
                        <ConfirmLeaveLink to="/contact" className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900">
                            Contact Support
                        </ConfirmLeaveLink>
                    </div>
                </section>

                <SummaryCard items={enriched} amount={amount} deliveryFee={deliveryFee} grandTotal={grandTotal} />
            </div>
        </div>
    );
}
