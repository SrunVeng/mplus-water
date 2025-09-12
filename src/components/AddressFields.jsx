// src/components/AddressFields.jsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Check, ChevronDown } from "lucide-react";
import { ADDRESSES } from "../data/address"; // Province -> District -> Commune -> [Villages]

// Code datasets (have name_en + name_km + codes)
import provincesData from "../../scripts/files/provinces.json";
import districtsData from "../../scripts/files/districts.json";
import communesData from "../../scripts/files/communes.json";
import villagesData from "../../scripts/files/villages.json";

// ---------- Reusable Select with search + i18n labels ----------
function AnimatedSelect({
                            id,
                            label,
                            required,
                            value,          // raw value (we keep EN name)
                            onChange,
                            options,        // array of EN names from ADDRESSES
                            placeholder,
                            disabled = false,
                            renderLabel,    // (rawValue) => localized label
                            t,
                            locale,         // i18n.language
                        }) {
    const [query, setQuery] = useState("");

    // Build localized view options (value stays EN, label switches by lang)
    const viewOptions = useMemo(() => {
        const mapped = (options || []).map((v) => ({
            value: v,
            label: renderLabel ? renderLabel(v) : String(v),
        }));
        // Always sort by the visible label so EN/KM order feels natural
        mapped.sort((a, b) => a.label.localeCompare(b.label, locale || "en"));
        return mapped;
    }, [options, renderLabel, locale]);

    const filtered = useMemo(() => {
        if (!query) return viewOptions;
        const q = query.toLowerCase();
        return viewOptions.filter((o) => o.label.toLowerCase().includes(q));
    }, [viewOptions, query]);

    const currentLabel = useMemo(() => {
        const found = viewOptions.find((o) => o.value === value);
        return found ? found.label : value;
    }, [viewOptions, value]);

    // Auto-clear if current value no longer exists after parent change
    useEffect(() => {
        if (value && !viewOptions.some((o) => o.value === value)) onChange("");
    }, [viewOptions, value, onChange]);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-[13px] font-semibold text-slate-900 tracking-wide">
                    {label}
                    {required ? <span className="text-rose-600"> *</span> : null}
                </label>
            </div>

            <Listbox value={value} onChange={onChange} disabled={disabled}>
                {({ open, disabled: isDisabled }) => (
                    <div className="relative">
                        <Listbox.Button
                            id={id}
                            className={
                                "w-full h-12 rounded-2xl border text-sm bg-white pr-11 pl-4 text-left transition-colors " +
                                (isDisabled
                                    ? "border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50"
                                    : "border-slate-300 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60")
                            }
                        >
              <span className={"block truncate " + (!value ? "text-slate-400" : "text-slate-900")}>
                {value ? currentLabel : placeholder}
              </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
              </span>
                        </Listbox.Button>

                        <AnimatePresence>
                            {open && !isDisabled && (
                                <Transition
                                    as={React.Fragment}
                                    enter="transition ease-out duration-150"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options static className="absolute z-50 mt-2 w-full">
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                                        >
                                            {/* Search */}
                                            <div className="p-2 border-b border-slate-200 bg-slate-50/60">
                                                <div className="flex items-center gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-3">
                                                    <ChevronsUpDown className="h-4 w-4 text-slate-400" />
                                                    <input
                                                        value={query}
                                                        onChange={(e) => setQuery(e.target.value)}
                                                        placeholder={t("address.search_placeholder")}
                                                        className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </div>

                                            <ul className="max-h-60 overflow-auto py-1">
                                                {!filtered.length ? (
                                                    <li className="px-3 py-2 text-sm text-slate-500">{t("address.no_results")}</li>
                                                ) : (
                                                    filtered.map((opt) => (
                                                        <Listbox.Option
                                                            key={opt.value}
                                                            value={opt.value}
                                                            className={({ active }) =>
                                                                `group relative cursor-default select-none px-3 py-2 text-sm flex items-center justify-between ${
                                                                    active ? "bg-brand-50 text-brand-700" : "text-slate-700"
                                                                }`
                                                            }
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                  <span className={`truncate ${selected ? "font-semibold" : "font-normal"}`}>
                                    {opt.label}
                                  </span>
                                                                    {selected ? <Check className="h-4 w-4 opacity-90" /> : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))
                                                )}
                                            </ul>
                                        </motion.div>
                                    </Listbox.Options>
                                </Transition>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </Listbox>
        </div>
    );
}

// ---------- Simple text input ----------
function TextField({ id, label, required, value, onChange, placeholder }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-[13px] font-semibold text-slate-900 tracking-wide">
                    {label}
                    {required ? <span className="text-rose-600"> *</span> : null}
                </label>
            </div>
            <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 rounded-2xl border text-sm bg-white px-4 border-slate-300 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 transition"
            />
        </div>
    );
}

// ---------- Main component ----------
export default function AddressFields({ form, onChange }) {
    const { t, i18n } = useTranslation();
    const langKey = i18n.language?.startsWith("km") ? "name_km" : "name_en";

    const uid = useId();
    const ids = {
        province: `province-${uid}`,
        district: `district-${uid}`,
        commune: `commune-${uid}`,
        village: `village-${uid}`,
        street: `street-${uid}`,
    };

    const set = (key) => (val) => onChange(key, val);

    // ---- Build lookups from code datasets (EN/KM available) ----
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
        for (const v of villagesData.villages || []) {
            const code = v.commune_code || v.communeId || v.commune_id || v.COMMUNE_CODE;
            if (!code) continue;
            if (!m.has(code)) m.set(code, []);
            m.get(code).push(v);
        }
        return m;
    }, []);

    // Province options (values = EN names from ADDRESSES)
    const provinces = useMemo(
        () => Object.keys(ADDRESSES || {}),
        []
    );
    const renderProvince = (nameEn) => provByNameEn.get(nameEn)?.[langKey] || nameEn;

    // District options depend on province (values = EN names from ADDRESSES)
    const districts = useMemo(() => {
        if (!form.province) return [];
        return Object.keys(ADDRESSES[form.province] || {});
    }, [form.province]);

    const renderDistrict = (nameEn) => {
        const provCode = provByNameEn.get(form.province)?.code;
        if (!provCode) return nameEn;
        const d = distByProvCodeAndNameEn.get(`${provCode}::${nameEn}`);
        return d?.[langKey] || nameEn;
    };

    // Communes depend on province + district
    const communes = useMemo(() => {
        if (!(form.province && form.district)) return [];
        const node = ADDRESSES[form.province]?.[form.district];
        if (!node) return [];
        return Object.keys(node);
    }, [form.province, form.district]);

    const renderCommune = (nameEn) => {
        const provCode = provByNameEn.get(form.province)?.code;
        const dist = distByProvCodeAndNameEn.get(`${provCode}::${form.district}`);
        if (!dist) return nameEn;
        const c = commByDistCodeAndNameEn.get(`${dist.code}::${nameEn}`);
        return c?.[langKey] || nameEn;
    };

    // Villages depend on province + district + commune
    const villages = useMemo(() => {
        if (!(form.province && form.district && form.commune)) return [];
        const arr = ADDRESSES[form.province]?.[form.district]?.[form.commune];
        return Array.isArray(arr) ? arr : [];
    }, [form.province, form.district, form.commune]);

    const renderVillage = (nameEn) => {
        const provCode = provByNameEn.get(form.province)?.code;
        const dist = distByProvCodeAndNameEn.get(`${provCode}::${form.district}`);
        const comm = dist ? commByDistCodeAndNameEn.get(`${dist.code}::${form.commune}`) : undefined;
        if (!comm) return nameEn;
        const list = villsByCommCode.get(comm.code) || [];
        const v = list.find((x) => x.name_en === nameEn);
        return v?.[langKey] || nameEn;
    };

    // Reset dependents when parent changes
    const setProvince = (p) => {
        set("province")(p);
        set("district")("");
        set("commune")("");
        set("village")("");
    };
    const setDistrict = (d) => {
        set("district")(d);
        set("commune")("");
        set("village")("");
    };
    const setCommune = (c) => {
        set("commune")(c);
        set("village")("");
    };

    // Force remount on language change so placeholders/search reset instantly
    const lang = i18n.language || "en";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatedSelect
                key={`prov-${lang}`}
                id={ids.province}
                label={t("address.province")}
                required
                value={form.province}
                onChange={setProvince}
                options={provinces}
                placeholder={t("address.select_province")}
                disabled={false}
                renderLabel={renderProvince}
                t={t}
                locale={lang}
            />

            <AnimatedSelect
                key={`dist-${lang}`}
                id={ids.district}
                label={t("address.district")}
                required
                value={form.district}
                onChange={setDistrict}
                options={districts}
                placeholder={t("address.select_district")}
                disabled={!form.province}
                renderLabel={renderDistrict}
                t={t}
                locale={lang}
            />

            <AnimatedSelect
                key={`comm-${lang}`}
                id={ids.commune}
                label={t("address.commune")}
                required
                value={form.commune}
                onChange={setCommune}
                options={communes}
                placeholder={t("address.select_commune")}
                disabled={!form.district}
                renderLabel={renderCommune}
                t={t}
                locale={lang}
            />

            <AnimatedSelect
                key={`vill-${lang}`}
                id={ids.village}
                label={t("address.village")}
                required
                value={form.village}
                onChange={set("village")}
                options={villages}
                placeholder={t("address.select_village")}
                disabled={!form.commune}
                renderLabel={renderVillage}
                t={t}
                locale={lang}
            />

            {/* Street as free text */}
            <TextField
                id={ids.street}
                label={t("address.street")}
                value={form.street}
                onChange={set("street")}
                placeholder={t("address.street_placeholder")}
            />
        </div>
    );
}
