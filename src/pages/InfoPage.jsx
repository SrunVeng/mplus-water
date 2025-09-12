// src/pages/InfoPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, User, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";
import ProgressSteps from "../components/ProgressSteps";
import AddressFields from "../components/AddressFields";
import { validateInfoForm, requestUserLocation, continueFromInfo } from "../utils/validation.js";

// UI helpers/components
import SectionCard from "../components/ui/SectionCard";
import StatusPill from "../components/ui/StatusPill";
import FloatingInput from "../components/ui/FloatingInput";
import { cn } from "../utils/uiUtils.js";

export default function InfoPage() {
    const { t } = useTranslation();
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
                <div className="px-4 sm:px-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-xl md:text-2xl font-semibold tracking-tight">
                        {t("order.create_title")}
                    </h1>
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
                            <h2 className="text-base font-semibold">
                                {t("order.customer_delivery_title")}
                            </h2>
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
                        <SectionCard
                            title={t("order.customer_title")}
                            subtitle={t("order.customer_subtitle")}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FloatingInput
                                    label={t("order.full_name")}
                                    required
                                    icon={<User className="h-4 w-4" />}
                                    value={state.form.name}
                                    onChange={(e) => formUpdate("name", e.target.value)}
                                    placeholder=" "
                                />

                                <FloatingInput
                                    label={t("order.phone_number")}
                                    required
                                    icon={<Phone className="h-4 w-4" />}
                                    value={state.form.phoneRaw}
                                    onChange={(e) => formUpdate("phoneRaw", e.target.value)}
                                    placeholder=" "
                                />

                                <FloatingInput
                                    label={t("order.email_optional")}
                                    type="email"
                                    icon={<Mail className="h-4 w-4" />}
                                    value={state.form.email}
                                    onChange={(e) => formUpdate("email", e.target.value)}
                                    placeholder=" "
                                />
                            </div>
                        </SectionCard>

                        {/* Address */}
                        <SectionCard
                            className="mt-6"
                            title={t("order.delivery_address_title")}
                            subtitle={t("order.delivery_address_subtitle")}
                        >
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
                                            {t("order.locating")}
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4" />
                                            {state.form.geoSet ? t("order.update_location") : t("order.use_my_location")}
                                        </>
                                    )}
                                </button>

                                {geoSuccess ? (
                                    <StatusPill tone="emerald">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>{t("order.location_set")}</span>
                                    </StatusPill>
                                ) : geoError ? (
                                    <StatusPill tone="rose">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        <span>{t("order.permission_denied")}</span>
                                    </StatusPill>
                                ) : (
                                    <span className="text-xs text-slate-500">{t("order.location_hint")}</span>
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
                                {t("order.continue_to_products")}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </motion.section>

                {/* Right: Tips */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl ring-1 ring-slate-200 bg-white p-6">
                        <h3 className="text-base font-semibold">{t("order.tips_title")}</h3>
                        <ul className="mt-3 list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>{t("order.tip_delivery_fee")}</li>
                            <li>{t("order.tip_location_help")}</li>
                        </ul>
                    </div>
                </aside>

            </div>
        </div>
    );
}
