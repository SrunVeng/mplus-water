// src/components/PhoneInputKH.jsx
import React from "react";
import clsx from "clsx";

export default function PhoneInputKH({
                                         value,
                                         onChange,
                                         showPrefix = true,   // <-- new prop
                                         ...rest
                                     }) {
    return (
        <div className="relative">
            {showPrefix && (
                <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-slate-600
                     ring-1 ring-slate-200 bg-slate-50 select-none pointer-events-none"
                >
          +855
        </span>
            )}

            <input
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={showPrefix ? "12 345 678" : "0xx xxx xxx"}
                className={clsx(
                    "w-full h-11 rounded-xl border-slate-300 focus:border-slate-900 focus:ring-slate-900",
                    showPrefix ? "pl-20" : "pl-3"
                )}
                value={value}
                onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
                {...rest}
            />
        </div>
    );
}
