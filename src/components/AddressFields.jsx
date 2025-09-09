import React from "react";

const PROVINCES = ["Phnom Penh", "Siem Reap", "Battambang", "Kandal", "Preah Sihanouk"]; // mock
const DISTRICTS = ["Chamkar Mon", "Daun Penh", "7 Makara", "Tuol Kouk"]; // mock
const COMMUNES  = ["Boeng Keng Kang 1", "Boeng Keng Kang 2", "Phsar Thmei", "Sangkat Olympic"]; // mock

export default function AddressFields({ form, onChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Province / City" required>
                <select required value={form.province} onChange={(e)=>onChange("province", e.target.value)}
                        className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900">
                    <option value="" disabled>Select Province/City</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </Field>

            <Field label="District" required>
                <select required value={form.district} onChange={(e)=>onChange("district", e.target.value)}
                        className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900">
                    <option value="" disabled>Select District</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </Field>

            <Field label="Commune" required>
                <select required value={form.commune} onChange={(e)=>onChange("commune", e.target.value)}
                        className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900">
                    <option value="" disabled>Select Commune</option>
                    {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </Field>

            <Field label="Street">
                <input value={form.street} onChange={(e)=>onChange("street", e.target.value)}
                       className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900" placeholder="Street name / number"/>
            </Field>

            <Field label="Village">
                <input value={form.village} onChange={(e)=>onChange("village", e.target.value)}
                       className="w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900" placeholder="Village"/>
            </Field>
        </div>
    );
}

function Field({ label, required, hint, children }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-slate-900 tracking-wide">
                    {label}{required ? <span className="text-rose-600"> *</span> : null}
                </label>
                {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
            </div>
            {children}
        </div>
    );
}
