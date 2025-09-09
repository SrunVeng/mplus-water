// src/pages/InfoPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";
import ProgressSteps from "../components/ProgressSteps";
import AddressFields from "../components/AddressFields";
import PhoneInputKH from "../components/PhoneInputKH";
import { formatPhoneKH } from "../utils/khPhone";
import {
    validateInfoForm,
    requestUserLocation,
    continueFromInfo,
} from "../utils/validation.js";

export default function InfoPage() {
    const { state, formUpdate, setLocation } = useOrder();
    const { steps, setSteps } = useOrderProgress();
    const nav = useNavigate();

    // For button disabled state / inline hints
    const { isInfoValid } = validateInfoForm(state.form);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>

                {/* Lock clicking ahead in the stepper */}
                <ProgressSteps
                    current={1}
                    maxAllowedStep={steps?.info ? 2 : 1}
                    onBlockedAttempt={() => {
                        /* e.g., toast.error("Finish this step first") */
                    }}
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">
                        1 · Customer & Delivery
                    </h2>

                    {/* FORM */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            continueFromInfo({ form: state.form, setSteps, nav });
                        }}
                        noValidate
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Full name" required>
                                <input
                                    required
                                    value={state.form.name}
                                    onChange={(e) => formUpdate("name", e.target.value)}
                                    placeholder="e.g. Sok Dara"
                                    className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                />
                            </Field>

                            <Field
                                label="Phone (Cambodia)"
                                required
                                hint={
                                    state.form.phoneRaw
                                        ? `Will send as ${formatPhoneKH(state.form.phoneRaw)}`
                                        : undefined
                                }
                            >
                                <PhoneInputKH
                                    value={state.form.phoneRaw}
                                    onChange={(v) => formUpdate("phoneRaw", v)}
                                />
                            </Field>

                            <Field label="Email (optional)">
                                <input
                                    type="email"
                                    value={state.form.email}
                                    onChange={(e) => formUpdate("email", e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                />
                            </Field>
                        </div>

                        <div className="mt-6">
                            <AddressFields form={state.form} onChange={formUpdate} />
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => requestUserLocation(formUpdate, setLocation)}
                                className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-brand-600 text-white hover:bg-brand-700"
                            >
                                {state.form.geoStatus === "requesting"
                                    ? "Detecting your location…"
                                    : state.form.geoSet
                                        ? "Update my location"
                                        : "Use my current location"}
                            </button>

                            {state.form.geoStatus === "success" || state.form.geoSet ? (
                                <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 rounded-full px-2.5 py-1">
                  Location set
                </span>
                            ) : state.form.geoStatus === "error" ? (
                                <span className="inline-flex items-center text-xs font-medium text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-full px-2.5 py-1">
                  Permission denied
                </span>
                            ) : (
                                <span className="text-xs text-slate-500">
                  Optional but helps riders find you faster
                </span>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isInfoValid}
                                className={`rounded-2xl px-5 py-3 font-medium transition ${
                                    isInfoValid
                                        ? "bg-green-600 text-white hover:bg-slate-700"
                                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                }`}
                                aria-disabled={!isInfoValid}
                            >
                                Continue to Products
                            </button>
                        </div>
                    </form>
                </section>

                <AsideTips />
            </div>
        </div>
    );
}

function Field({ label, required, hint, children }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-slate-900 tracking-wide">
                    {label}
                    {required ? <span className="text-rose-600"> *</span> : null}
                </label>
                {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
            </div>
            {children}
        </div>
    );
}

function AsideTips() {
    return (
        <aside className="lg:col-span-1">
            <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold">Tips</h3>
                <ul className="mt-3 list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Delivery fee: $2 Phnom Penh / $5 outside / free over $100</li>
                    <li>Location helps our riders find you faster</li>
                </ul>
            </div>
        </aside>
    );
}
