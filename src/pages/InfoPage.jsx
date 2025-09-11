import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, User, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";
import ProgressSteps from "../components/ProgressSteps";
import AddressFields from "../components/AddressFields";
import PhoneInputKH from "../components/PhoneInputKH";
import { formatPhoneKH } from "../utils/khPhone";
import { validateInfoForm, requestUserLocation, continueFromInfo } from "../utils/validation.js";

// UI helpers/components
import SectionCard from "../components/ui/SectionCard";
import StatusPill from "../components/ui/StatusPill";
import FloatingInput from "../components/ui/FloatingInput";
import FloatingField from "../components/ui/FloatingField"; // for non-native inputs like PhoneInputKH
import { cn } from "../utils/uiUtils.js";

export default function InfoPage() {
    const { state, formUpdate, setLocation } = useOrder();
    const { steps, setSteps } = useOrderProgress();
    const nav = useNavigate();

    const { isInfoValid } = validateInfoForm(state.form);
    const geoRequesting = state.form.geoStatus === "requesting";
    const geoSuccess = state.form.geoStatus === "success" || state.form.geoSet;
    const geoError = state.form.geoStatus === "error";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Order</h1>
                    <p className="mt-1 text-sm text-slate-600">Step 1 of 3 · Tell us who and where to deliver</p>
                </div>

                <ProgressSteps
                    current={1}
                    maxAllowedStep={steps?.info ? 2 : 1}
                    onBlockedAttempt={() => {}}
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form */}
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-100 px-6 py-4 rounded-t-3xl bg-gradient-to-br from-slate-50 to-white">
                        <div className="flex items-center gap-2 text-slate-900">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                            <h2 className="text-base font-semibold">Customer & Delivery</h2>
                        </div>
                    </div>

                    <form
                        className="p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            continueFromInfo({ form: state.form, setSteps, nav });
                        }}
                        noValidate
                    >
                        {/* Customer */}
                        <SectionCard title="Customer" subtitle="How can the rider reach you?">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FloatingInput
                                    label="Full name"
                                    required
                                    icon={<User className="h-4 w-4" />}
                                    value={state.form.name}
                                    onChange={(e) => formUpdate("name", e.target.value)}
                                    placeholder=" " // needed for floating behavior
                                />

                                <FloatingField
                                    label="Phone (Cambodia)"
                                    required
                                    icon={<Phone className="h-4 w-4" />}
                                    hint={
                                        state.form.phoneRaw
                                            ? `Will send as ${formatPhoneKH(state.form.phoneRaw)}`
                                            : undefined
                                    }
                                    isFilled={Boolean(state.form.phoneRaw)}
                                >
                                    {/* PhoneInputKH might not support placeholder=" " so we use the generic FloatingField */}
                                    <PhoneInputKH
                                        value={state.form.phoneRaw}
                                        onChange={(v) => formUpdate("phoneRaw", v)}
                                        className="w-full h-12 rounded-xl border text-sm border-slate-300 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition px-3"
                                    />
                                </FloatingField>

                                <FloatingInput
                                    label="Email (optional)"
                                    type="email"
                                    icon={<Mail className="h-4 w-4" />}
                                    value={state.form.email}
                                    onChange={(e) => formUpdate("email", e.target.value)}
                                    placeholder=" "
                                />
                            </div>
                        </SectionCard>

                        {/* Address */}
                        <SectionCard className="mt-6" title="Delivery address" subtitle="Where should we deliver your order?">
                            <AddressFields form={state.form} onChange={formUpdate} />

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => requestUserLocation(formUpdate, setLocation)}
                                    className={cn(
                                        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2",
                                        "bg-brand-600 text-white hover:bg-brand-700",
                                        "focus:outline-none focus:ring-2 focus:ring-brand-600/60 focus:ring-offset-2"
                                    )}
                                    aria-live="polite"
                                >
                                    {geoRequesting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Detecting your location…
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4" />
                                            {state.form.geoSet ? "Update my location" : "Use my current location"}
                                        </>
                                    )}
                                </button>

                                {geoSuccess ? (
                                    <StatusPill tone="emerald">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Location set</span>
                                    </StatusPill>
                                ) : geoError ? (
                                    <StatusPill tone="rose">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        <span>Permission denied</span>
                                    </StatusPill>
                                ) : (
                                    <span className="text-xs text-slate-500">Optional but helps riders find you faster</span>
                                )}
                            </div>
                        </SectionCard>

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={!isInfoValid}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition",
                                    isInfoValid
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                )}
                                aria-disabled={!isInfoValid}
                            >
                                Continue to Products
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </motion.section>

                {/* Right: Tips */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl ring-1 ring-slate-200 bg-white p-6">
                        <h3 className="text-base font-semibold">Tips</h3>
                        <ul className="mt-3 list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>Delivery fee: $2 Phnom Penh / $5 outside / free over $100</li>
                            <li>Location helps our riders find you faster</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
