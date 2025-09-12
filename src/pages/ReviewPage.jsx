// src/pages/ReviewPage.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useOrder } from "../context/OrderContext";
import { useOrderProgress } from "../context/OrderProgressContext";
import ProgressSteps from "../components/ProgressSteps";
import SummaryCard from "../components/SummaryCard";
import { currency } from "../utils/money";
import { formatPhoneKH } from "../utils/khPhone";

// Code datasets (name_en + name_km + codes) — same pattern as AddressFields
import provincesData from "../../scripts/files/provinces.json";
import districtsData from "../../scripts/files/districts.json";
import communesData from "../../scripts/files/communes.json";
import villagesData from "../../scripts/files/villages.json";

export default function ReviewPage() {
    const { state, enriched, amount, deliveryFee, grandTotal } = useOrder();
    const { steps } = useOrderProgress();
    const nav = useNavigate();
    const { t, i18n } = useTranslation();
    const langKey = i18n.language?.startsWith("km") ? "name_km" : "name_en";
    const lang = i18n.language || "en";

    // ---- Phone shown as local 0xx… (backend stays normalized) ----
    const displayPhone = state.form.phoneRaw
        ? formatPhoneKH(state.form.phoneRaw).replace(/^855/, "0")
        : "";

    // ---- Build lookups from code datasets (mirror AddressFields) ----
    const provByNameEn = useMemo(() => {
        const m = new Map();
        for (const p of provincesData.provinces || []) m.set(p.name_en, p);
        return m;
    }, []);

    const distByProvCodeAndNameEn = useMemo(() => {
        const m = new Map(); // `${provCode}::${district.name_en}` -> district
        for (const d of districtsData.districts || []) {
            m.set(`${d.province_code}::${d.name_en}`, d);
        }
        return m;
    }, []);

    const commByDistCodeAndNameEn = useMemo(() => {
        const m = new Map(); // `${distCode}::${commune.name_en}` -> commune
        for (const c of communesData.communes || []) {
            m.set(`${c.district_code}::${c.name_en}`, c);
        }
        return m;
    }, []);

    const villsByCommCode = useMemo(() => {
        const m = new Map(); // comm.code -> [villages]
        for (const v of (villagesData.villages || [])) {
            const code = v.commune_code || v.communeId || v.commune_id || v.COMMUNE_CODE;
            if (!code) continue;
            if (!m.has(code)) m.set(code, []);
            m.get(code).push(v);
        }
        return m;
    }, []);

    // ---- Localized renderers (value stored as EN, label shown as EN/KM) ----
    const renderProvince = (nameEn) => provByNameEn.get(nameEn)?.[langKey] || nameEn;

    const renderDistrict = (nameEn, provEn) => {
        const provCode = provByNameEn.get(provEn)?.code;
        if (!provCode) return nameEn;
        const d = distByProvCodeAndNameEn.get(`${provCode}::${nameEn}`);
        return d?.[langKey] || nameEn;
    };

    const renderCommune = (nameEn, provEn, distEn) => {
        const provCode = provByNameEn.get(provEn)?.code;
        const dist = provCode ? distByProvCodeAndNameEn.get(`${provCode}::${distEn}`) : undefined;
        if (!dist) return nameEn;
        const c = commByDistCodeAndNameEn.get(`${dist.code}::${nameEn}`);
        return c?.[langKey] || nameEn;
    };

    const renderVillage = (nameEn, provEn, distEn, commEn) => {
        const provCode = provByNameEn.get(provEn)?.code;
        const dist = provCode ? distByProvCodeAndNameEn.get(`${provCode}::${distEn}`) : undefined;
        const comm = dist ? commByDistCodeAndNameEn.get(`${dist.code}::${commEn}`) : undefined;
        if (!comm) return nameEn;
        const list = villsByCommCode.get(comm.code) || [];
        const v = list.find((x) => x.name_en === nameEn);
        return v?.[langKey] || nameEn;
    };

    // ---- Address line (localized parts, same order as AddressFields) ----
    const { province, district, commune, village, street } = state.form || {};
    const addrParts = [
        village ? renderVillage(village, province, district, commune) : "",
        street || "",
        commune ? renderCommune(commune, province, district) : "",
        district ? renderDistrict(district, province) : "",
        province ? renderProvince(province) : "",
    ].filter(Boolean);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="px-4 sm:px-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-xl md:text-2xl font-semibold tracking-tight">
                        {t("order.create_title", { defaultValue: "Create Order" })}
                    </h1>
                </div>
                <ProgressSteps current={3} maxAllowedStep={steps?.review ? 4 : 3} onBlockedAttempt={() => {}} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Review card */}
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:col-span-2 rounded-3xl ring-1 ring-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-100 px-6 py-4 rounded-t-3xl bg-gradient-to-br from-slate-50 to-white">
                        <div className="flex items-center gap-2 text-slate-900">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
                            <h2 className="text-base font-semibold">
                                {t("order.review_title", { defaultValue: "Review your order" })}
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Customer + Address */}
                        <div className="space-y-3 text-sm">
                            <Row
                                label={t("order.full_name", { defaultValue: "Full name" })}
                                value={state.form.name || "—"}
                            />
                            <Row
                                label={t("order.phone_number", { defaultValue: "Phone Number" })}
                                value={displayPhone || "—"}
                            />
                            {state.form.email ? (
                                <Row
                                    label={t("order.email_optional", { defaultValue: "Email (optional)" })}
                                    value={state.form.email}
                                />
                            ) : null}
                            <Row
                                label={t("order.ship_to", { defaultValue: "Ship to" })}
                                value={addrParts.join(", ") || "—"}
                            />
                        </div>

                        {/* Items */}
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold">
                                {t("order.items", { defaultValue: "Items" })}
                            </h3>
                            <ul className="mt-2 space-y-2 text-sm">
                                {enriched.map((it) => {
                                    const pid = it.productId ?? it.product?.id;
                                    const name = pid
                                        ? t(`products.${pid}.name`, { defaultValue: it.product?.name || "" })
                                        : t("unknown_product", { defaultValue: "Unknown product" });
                                    const qty = it.quantity ?? it.qty ?? 0;
                                    return (
                                        <li key={it.id} className="flex items-center justify-between">
                                            <span>{name} × {qty}</span>
                                            <span className="font-medium">{currency(it.lineTotal)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-between">
                            <Link
                                to="/order/products"
                                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium border border-slate-300 text-slate-700 hover:border-slate-400 transition"
                            >
                                {t("order.edit_products", { defaultValue: "Edit products" })}
                            </Link>
                            <button
                                onClick={() => nav("/order/payment")}
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white px-5 py-3 font-medium hover:bg-emerald-700 transition"
                            >
                                {t("order.go_to_payment", { defaultValue: "Go to Payment" })}
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Right: Summary */}
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

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-slate-600">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
