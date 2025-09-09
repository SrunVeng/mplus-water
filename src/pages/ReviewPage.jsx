import React from "react";
import { useOrder } from "../context/OrderContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import { useNavigate, Link } from "react-router-dom";
import { currency } from "../utils/money";
import { formatPhoneKH } from "../utils/khPhone";

export default function ReviewPage() {
    const { state, enriched, amount, deliveryFee, grandTotal } = useOrder();
    const nav = useNavigate();

    const addressLine = [state.form.village, state.form.street, state.form.commune, state.form.district, state.form.province]
        .filter(Boolean).join(", ");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
                <ProgressSteps current={3} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">3 · Review your order</h2>

                    <div className="space-y-3 text-sm">
                        <Row label="Name" value={state.form.name} />
                        <Row label="Phone" value={formatPhoneKH(state.form.phoneRaw)} />
                        {state.form.email && <Row label="Email" value={state.form.email} />}
                        <Row label="Ship to" value={addressLine || "—"} />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-semibold">Items</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            {enriched.map(it => (
                                <li key={it.id} className="flex items-center justify-between">
                                    <span>{it.product?.name} × {it.qty}</span>
                                    <span className="font-medium">{currency(it.lineTotal)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <Link
                            to="/order/products"
                            className="rounded-2xl bg-brand-700 text-white px-5 py-3 font-medium hover:bg-slate-700 transition">Edit products
                        </Link>
                        <button onClick={()=>nav("/order/payment")} className="rounded-2xl bg-green-600 text-white px-5 py-3 font-medium hover:bg-slate-700 transition">
                            Go to Payment
                        </button>
                    </div>
                </section>

                <SummaryCard items={enriched} amount={amount} deliveryFee={deliveryFee} grandTotal={grandTotal} />
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-slate-600">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
