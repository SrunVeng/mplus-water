// src/components/AddressFields.jsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Check, ChevronDown } from "lucide-react";
import { ADDRESSES } from "../data/address"; // Province -> District -> Commune -> [Villages]

// ---------- Reusable Select with search ----------
function AnimatedSelect({
                            id,
                            label,
                            required,
                            value,
                            onChange,
                            options,
                            placeholder,
                            disabled = false,
                        }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query) return options;
        const q = query.toLowerCase();
        return options.filter((o) => String(o).toLowerCase().includes(q));
    }, [options, query]);

    useEffect(() => {
        // If current value disappears from options (parent changed), clear it.
        if (value && !options.includes(value)) onChange("");
    }, [options, value, onChange]);

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
                {value || placeholder}
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
                                                        placeholder="Type to filter..."
                                                        className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </div>

                                            <ul className="max-h-60 overflow-auto py-1">
                                                {!filtered.length ? (
                                                    <li className="px-3 py-2 text-sm text-slate-500">No results</li>
                                                ) : (
                                                    filtered.map((opt) => (
                                                        <Listbox.Option
                                                            key={opt}
                                                            value={opt}
                                                            className={({ active }) =>
                                                                `group relative cursor-default select-none px-3 py-2 text-sm flex items-center justify-between ${
                                                                    active ? "bg-brand-50 text-brand-700" : "text-slate-700"
                                                                }`
                                                            }
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`truncate ${selected ? "font-semibold" : "font-normal"}`}>{opt}</span>
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
    const uid = useId();
    const ids = {
        province: `province-${uid}`,
        district: `district-${uid}`,
        commune: `commune-${uid}`,
        village: `village-${uid}`,
        street: `street-${uid}`,
    };

    const set = (key) => (val) => onChange(key, val);

    // Province options
    const provinces = useMemo(() => Object.keys(ADDRESSES).sort((a, b) => a.localeCompare(b, "en")), []);

    // District options depend on province
    const districts = useMemo(() => {
        if (!form.province) return [];
        return Object.keys(ADDRESSES[form.province] || {}).sort((a, b) => a.localeCompare(b, "en"));
    }, [form.province]);

    // Commune options depend on province + district (node is an object keyed by commune)
    const communes = useMemo(() => {
        if (!(form.province && form.district)) return [];
        const node = ADDRESSES[form.province]?.[form.district];
        if (!node) return [];
        return Object.keys(node).sort((a, b) => a.localeCompare(b, "en"));
    }, [form.province, form.district]);

    // Village options depend on province + district + commune (leaf is an array)
    const villages = useMemo(() => {
        if (!(form.province && form.district && form.commune)) return [];
        const arr = ADDRESSES[form.province]?.[form.district]?.[form.commune];
        return Array.isArray(arr) ? [...arr].sort((a, b) => a.localeCompare(b, "en")) : [];
    }, [form.province, form.district, form.commune]);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatedSelect
                id={ids.province}
                label="Province / City"
                required
                value={form.province}
                onChange={setProvince}
                options={provinces}
                placeholder="Select Province/City"
            />

            <AnimatedSelect
                id={ids.district}
                label="District / Khan / City"
                required
                value={form.district}
                onChange={setDistrict}
                options={districts}
                placeholder="Select District"
                disabled={!form.province}
            />

            <AnimatedSelect
                id={ids.commune}
                label="Commune / Sangkat"
                required
                value={form.commune}
                onChange={setCommune}
                options={communes}
                placeholder="Select Commune"
                disabled={!form.district}
            />

            <AnimatedSelect
                id={ids.village}
                label="Village"
                required
                value={form.village}
                onChange={set("village")}
                options={villages}
                placeholder="Select Village"
                disabled={!form.commune}
            />

            {/* Keep Street as free text (optional) */}
            <TextField
                id={ids.street}
                label="Street"
                value={form.street}
                onChange={set("street")}
                placeholder="Street name / number"
            />
        </div>
    );
}
