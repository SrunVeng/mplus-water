import React from "react";
import { cn } from "../../utils/uiUtils.js";

export default function SectionCard({ title, subtitle, className = "", children }) {
    return (
        <div className={cn("rounded-2xl ring-1 ring-slate-200 p-6", className)}>
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                {subtitle ? <p className="text-xs text-slate-500 mt-1">{subtitle}</p> : null}
            </div>
            {children}
        </div>
    );
}
