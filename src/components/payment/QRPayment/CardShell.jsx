// src/components/payments/QRPayment/CardShell.jsx
import React from "react";

/**
 * Generic rounded card container (pure CSS; iOS-safe).
 */
export default function CardShell({
                                      children,
                                      className = "",
                                      aspectRatio = "218 / 316",
                                      shadow = "shadow-2xl",
                                      ring = "ring-1 ring-slate-200",
                                  }) {
    return (
        <div
            className={`relative w-full rounded-[20px] bg-white ${shadow} ${ring} ${className}`}
            style={{ aspectRatio }}
        >
            <div className="absolute inset-0 rounded-[20px] overflow-hidden flex flex-col">
                {children}
            </div>
        </div>
    );
}
