import React from "react";
import { cn, statusTone } from "../../utils/uiUtils.js";

export default function StatusPill({ tone = "emerald", className = "", children }) {
    const t = statusTone(tone);
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium ring-1 rounded-full px-2.5 py-1",
                t.text, t.bg, t.ring,
                className
            )}
        >
      {children}
    </span>
    );
}
